-- Feature 023 — impersonation module block
-- Target: SchoolBox Synergetic (SynergyOne) database, table dbo.uMGGSModules
-- Apply via DBA / IT. NOT run by an in-repo migration (the repo's sequelize-cli
-- runner targets the app DB, and uMGGSModules is externally managed).
-- Dialect: Microsoft SQL Server.
--
-- ⚠️ RELEASE ORDER — APPLY THIS FIRST.
-- The mggs-api build that adds `blockImpersonatedUser` to the SynMggsModule model makes
-- Sequelize SELECT that column by name on EVERY GET /syn/mggsModule/:id (CRUDHelper.getModel
-- lists no explicit attributes). Deploying that API build before this column exists throws
-- "Invalid column name 'blockImpersonatedUser'" on every module-metadata read — breaking
-- ParentTeacherInterview, HOY Chat, Student Absences, Online Donation, Synergetic User
-- Permissions and any other page that calls MggsModuleService.getModule.
-- Correct order: (1) run this script, (2) then deploy mggs-api, (3) then mgg-ui.
-- The column has a default, so an older API build ignoring it is safe (expand pattern).

-- ---------- forward ----------
ALTER TABLE dbo.uMGGSModules
    ADD blockImpersonatedUser BIT NOT NULL
    CONSTRAINT DF_uMGGSModules_blockImpersonatedUser DEFAULT (0);
-- Existing rows are backfilled to 0 (false) by the DEFAULT.

-- ---------- rollback ----------
-- ALTER TABLE dbo.uMGGSModules DROP CONSTRAINT DF_uMGGSModules_blockImpersonatedUser;
-- ALTER TABLE dbo.uMGGSModules DROP COLUMN blockImpersonatedUser;
