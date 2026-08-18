# API Contract: Bulk Skill Update

**Endpoint**: `PUT /syn/communitySkill/:seq`  
**Method**: PUT  
**Status**: Existing (no new endpoint needed)  
**Source**: `src/controllers/Synergetic/Community/SynCommunitySkillController.ts` (via CRUDHelper.updateModel)

## Request

**URL Parameters**:
```
:seq = SkillSeq (primary key from CommunitySkills table)
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

**Error (400 Bad Request)**:
```json
{
  "message": "invalid request(SkillSeq): [invalid value]"
}
```

**Error (401 Unauthorized)**:
```json
{
  "message": "unauthorized"
}
```

## Frontend Usage Pattern (Promise.all)

```typescript
// UI collects selected skill sequences
const selectedSkillSeqs: number[] = [123, 124, 125];
const newExpiryDate = "2027-08-19";

// Loop through all skills and send in parallel
const updatePromises = selectedSkillSeqs.map(seq =>
  axios.put(`/syn/communitySkill/${seq}`, { ExpiryDate: newExpiryDate })
);

// Wait for all to complete
const results = await Promise.all(updatePromises);

// Handle results
const failures = results.filter(r => r.status !== 200);
if (failures.length > 0) {
  // Show error toast: "X of Y skills failed to update"
} else {
  // Show success toast: "All skills updated successfully"
  // Refresh staff list table
}
```

## Notes

- No bulk endpoint created; frontend owns the loop logic
- Each update is independent (transactional safety per skill)
- Errors on individual skills don't block others
- Max suggested batch size: 50 skills (to keep UI responsive)
