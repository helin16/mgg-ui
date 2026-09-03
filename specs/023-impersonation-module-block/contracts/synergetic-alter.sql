-- Feature 023 — impersonation module block
-- Target: SchoolBox Synergetic (SynergyOne) database, table dbo.uMGGSModules
-- Apply via DBA / IT. NOT run by an in-repo migration (the repo's sequelize-cli
-- runner targets the app DB, and uMGGSModules is externally managed).
-- Dialect: Microsoft SQL Server.

-- ---------- forward ----------
ALTER TABLE dbo.uMGGSModules
    ADD blockImpersonatedUser BIT NOT NULL
    CONSTRAINT DF_uMGGSModules_blockImpersonatedUser DEFAULT (0);
-- Existing rows are backfilled to 0 (false) by the DEFAULT.

-- ---------- rollback ----------
-- ALTER TABLE dbo.uMGGSModules DROP CONSTRAINT DF_uMGGSModules_blockImpersonatedUser;
-- ALTER TABLE dbo.uMGGSModules DROP COLUMN blockImpersonatedUser;
