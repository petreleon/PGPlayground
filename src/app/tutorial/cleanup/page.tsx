import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Warning } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function CleanupPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Cleanup</h1>
        <p className="text-zinc-600 dark:text-zinc-400">DROP TABLE and resetting the database.</p>
      </div>

      <TutorialSection id="drop-table" title="DROP TABLE" description="Completely remove a table and all its data from the database.">
        <SubSection title="Syntax">
          <CodeBlock>
{`-- Basic drop
DROP TABLE table_name;

-- Drop if exists (safe, won't error if table doesn't exist)
DROP TABLE IF EXISTS table_name;

-- Drop and everything that depends on it
DROP TABLE IF EXISTS table_name CASCADE;`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Example: Drop a Table">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Let&apos;s clean up by dropping the data_demo table we created earlier.
            <strong>This permanently deletes the table and all its data!</strong>
          </p>
          <SQLRunner
            hint="Try listing all tables first: SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
            initialSql={`DROP TABLE IF EXISTS data_demo CASCADE;`}
          />
        </SubSection>

        <SubSection title="Exercise: Clean Up">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Try dropping multiple tables at once. Or, use the <strong>Reset DB</strong> button above
            to clear the entire database and start fresh.
          </p>
          <SQLRunner
            hint="Dropping tables with CASCADE will also drop dependent objects like foreign keys."
            initialSql={`-- Drop multiple tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;`}
          />
          <Warning>
            <strong>DROP TABLE is permanent and cannot be undone.</strong> In production, always back up
            your database before dropping tables. Here in the tutorial, you can always use <strong>Reset DB</strong> to start over.
          </Warning>
        </SubSection>
      </TutorialSection>
    </div>
  );
}
