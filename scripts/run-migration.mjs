import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Supabase Management API — requires a Personal Access Token (PAT)
// Create one at: https://supabase.com/dashboard/account/tokens
const PAT = process.env.SUPABASE_PAT;
const PROJECT_REF = "ysclmdtxthgzkljtzxud";

if (!PAT) {
  console.error("Error: SUPABASE_PAT env var is required.\nRun: SUPABASE_PAT=your_pat node scripts/run-migration.mjs [file]");
  process.exit(1);
}

const migrationFile = process.argv[2] ?? join(__dirname, "../supabase/migrations/001_initial_schema.sql");
const sql = readFileSync(migrationFile, "utf8");

console.log(`Running migration: ${migrationFile}`);

const r = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${PAT}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

const body = await r.text();
if (!r.ok) {
  console.error("Migration failed:", body);
  process.exit(1);
}

console.log("Migration completed successfully!");
