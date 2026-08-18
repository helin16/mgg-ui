# API Contract: Bulk Skill Update (REVISED)

**Endpoint**: `PUT /syn/communitySkill/:staffID/:skillCode`  
**Method**: PUT  
**Status**: NEW endpoint required (supersedes earlier `PUT /syn/communitySkill/:seq` approach)  
**Source**: New method on `src/controllers/Synergetic/Community/SynCommunitySkillController.ts`

## ⚠️ Revision Note

Earlier planning assumed `CRUDHelper.updateModel` could update `CommunitySkills` directly via Sequelize. This is **incorrect**:

- `SynCommunitySkill.ts` calls `SynergeticDB.blockUpsert(SynCommunitySkill)`, which attaches a `beforeSave` hook that unconditionally rejects any create/update (`Any upsert to 'CommunitySkills' is blocked!`) for any non-sqlite dialect.
- The Synergetic database only accepts writes through its own stored procedures, called via raw `EXEC` (see `StudentAbsenceHelper.syncToSynergetic()` for the established pattern using `[dbo].[spiAbsenceEvents]`).

**Verified stored procedures exist** (confirmed via live query against `Synergetic_AUVIC_MENTONEGG_PRD.INFORMATION_SCHEMA`):

| Procedure | Purpose | Parameters |
|-----------|---------|------------|
| `spiCommunitySkills` | Insert new skill record | `@ID, @SkillCode, @SkillLevel, @Comment, @AttainedDate, @ExpiryDate, @SkillSeq (INOUT, returns new SkillSeq)` |
| `spuCommunitySkills` | Update existing skill record | `@SkillSeq, @SkillCode, @SkillLevel, @Comment, @AttainedDate, @ExpiryDate` (all fields required, not partial) |
| `spdCommunitySkills` | Delete skill record | `@Skillseq` |

**Key implication**: `spuCommunitySkills` requires **all fields**, not just `ExpiryDate`. The controller must first read the existing record (to preserve `SkillCode`, `SkillLevel`, `Comment`, `AttainedDate`) before calling the update proc with the new `ExpiryDate`.

## Request

**URL Parameters**:
```
:staffID   = Staff/Community ID (CommunitySkills.ID)
:skillCode = Skill code (CommunitySkills.SkillCode), e.g. "CPR"
```

**Headers**:
```
Authorization: Bearer {token}
X-MGGS-TOKEN: {appToken}
Content-Type: application/json
```

**Body**:
```json
{
  "ExpiryDate": "2027-08-19"
}
```

## Response

**Status Code**: 200 OK

**Body**:
```json
{
  "SkillSeq": 123,
  "ID": 45,
  "SkillCode": "CPR",
  "SkillLevel": "Advanced",
  "Comment": "Valid until 2027-08-19",
  "AttainedDate": "2024-01-15",
  "ExpiryDate": "2027-08-19"
}
```

**Error (401 Unauthorized)**:
```json
{
  "message": "unauthorized"
}
```

## Server-Side Implementation

```typescript
// src/controllers/Synergetic/Community/SynCommunitySkillController.ts

const updateSkillExpiryByStaffAndCode = async (req: Request, res: Response) => {
  const { staffID, skillCode } = req.params;
  const { ExpiryDate } = req.body;

  // Step 1: Find existing record to preserve other fields (proc requires all fields)
  const existing = await SynCommunitySkill.findOne({
    where: { ID: staffID, SkillCode: skillCode }
  });

  if (!existing) {
    // Upsert semantics: create new record via spiCommunitySkills (see Open Decision below)
    return await insertNewSkillRecord(req, res, staffID, skillCode, ExpiryDate);
  }

  // Step 2: Call spuCommunitySkills stored procedure with all fields
  const query = `
    DECLARE @error nvarchar(MAX)
    BEGIN TRY
      BEGIN TRANSACTION;
      EXEC [dbo].[spuCommunitySkills]
           @SkillSeq = :SkillSeq,
           @SkillCode = :SkillCode,
           @SkillLevel = :SkillLevel,
           @Comment = :Comment,
           @AttainedDate = :AttainedDate,
           @ExpiryDate = :ExpiryDate
      COMMIT;
    END TRY
    BEGIN CATCH
      ROLLBACK;
      SET @error = ERROR_MESSAGE();
    END CATCH
    SELECT @error as N'@error'
  `;

  const result = await SynergeticDB.getDB().query(query, {
    replacements: {
      SkillSeq: existing.SkillSeq,
      SkillCode: existing.SkillCode,
      SkillLevel: existing.SkillLevel,
      Comment: existing.Comment,
      AttainedDate: existing.AttainedDate,
      ExpiryDate
    },
    type: QueryTypes.RAW
  });

  // Handle @error output, throw if present, otherwise re-fetch and return updated record
  const updated = await SynCommunitySkill.findOne({ where: { SkillSeq: existing.SkillSeq } });
  return res.json(updated);
};
```

## Decision: Auto-Create on Missing Skill Record (Confirmed)

**What happens when a selected staff member doesn't already have a record for the chosen skill code?**

Confirmed: auto-create via `spiCommunitySkills` (upsert semantics) — bulk update behaves as "set or create". This matches natural admin intent ("ensure these staff have this skill valid until X") and doesn't require the admin to know in advance which staff already have the skill recorded.

## Frontend Usage Pattern (Promise.all, staffID/skillCode keyed)

```typescript
// UI collects selected staff IDs + chosen skill code + date
const selectedStaffIds: number[] = [45, 67, 89];
const skillCode = "CPR";
const newExpiryDate = "2027-08-19";

const updatePromises = selectedStaffIds.map(staffId =>
  axios.put(`/syn/communitySkill/${staffId}/${skillCode}`, { ExpiryDate: newExpiryDate })
);

const results = await Promise.allSettled(updatePromises);
const failures = results.filter(r => r.status === 'rejected');
// Show partial-failure toast if any staff failed; success toast + refresh otherwise
```

## Access Control (Confirmed)

This endpoint MUST be gated as an **admin-only write action**, not just general module view access. Follow the existing pattern used by BudgetTracker and Parent Teacher Interview pages:

- **Frontend**: `AuthService.isModuleRole(MGGS_MODULE_ID_STAFF_LIST, ROLE_ID_ADMIN)` gates visibility of the "Bulk Update" button (see `src/pages/BudgetTracker/components/BTGLDetailsPanel.tsx` for reference usage)
- **Backend**: Controller must validate the equivalent admin role check server-side before executing the stored procedure (mirroring how `SynMggsModuleController`'s settings PUT already validates module admin role)

## Notes

- Max suggested batch size: 50 staff (frontend concurrency; each is an independent EXEC call)
- Each update is transactional at the stored-procedure level (`BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK`)
- No bulk/batched stored procedure exists — frontend still owns the Promise.all loop, just keyed by (staffID, skillCode) instead of raw SkillSeq

