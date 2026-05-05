import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip, Warning, InfoBox } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function AlterTablePage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">ALTER TABLE</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Add, rename, drop, and modify columns in existing tables.</p>
      </div>

      <TutorialSection id="add-column" title="ALTER TABLE — Add Column" description="Add new columns to an existing table without recreating it.">
        <SubSection title="Syntax">
          <CodeBlock>
{`ALTER TABLE table_name
ADD COLUMN column_name datatype constraints;`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Example: Adding Columns to Products">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            First, make sure you have created the products table above. Then run this to add more columns:
          </p>
          <SQLRunner
            hint="Try adding columns one at a time, or all at once in a single transaction!"
            initialSql={`ALTER TABLE products
ADD COLUMN category VARCHAR(50),
ADD COLUMN weight_kg NUMERIC(6, 2),
ADD COLUMN discount_percent INTEGER DEFAULT 0;`}
          />
          <Tip>
            You can add multiple columns in a single <strong>ALTER TABLE</strong> statement by separating
            them with commas. Notice the <strong>DEFAULT</strong> value — existing rows will get that value.
          </Tip>
        </SubSection>
      </TutorialSection>

      <TutorialSection id="rename-column" title="ALTER TABLE — Rename Column" description="Change the name of an existing column.">
        <SubSection title="Syntax">
          <CodeBlock>
{`ALTER TABLE table_name
RENAME COLUMN old_name TO new_name;`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Example: Rename a Column">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Let&apos;s rename <code>product_name</code> to <code>title</code> to make it shorter. Run the SQL below:
          </p>
          <SQLRunner
            hint="After renaming, try: SELECT title FROM products;"
            initialSql={`ALTER TABLE products
RENAME COLUMN product_name TO title;`}
          />
          <Warning>
            Renaming a column will break any queries, views, or application code that reference the old column name.
            Always check dependencies before renaming!
          </Warning>
        </SubSection>
      </TutorialSection>

      <TutorialSection id="drop-column" title="ALTER TABLE — Drop Column" description="Remove a column that is no longer needed.">
        <SubSection title="Syntax">
          <CodeBlock>
{`ALTER TABLE table_name
DROP COLUMN column_name;`}
          </CodeBlock>
          <CodeBlock>
{`-- Drop only if the column exists (PostgreSQL safe)
ALTER TABLE table_name
DROP COLUMN IF EXISTS column_name;`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Example: Remove a Column">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Let&apos;s remove the <code>description</code> column from the products table.
            <strong>Warning: this deletes data permanently!</strong>
          </p>
          <SQLRunner
            hint="You can also use CASCADE to drop dependent objects: DROP COLUMN description CASCADE;"
            initialSql={`ALTER TABLE products
DROP COLUMN IF EXISTS description;`}
          />
          <Warning>
            <strong>Dropping a column is irreversible.</strong> The data in that column is permanently deleted.
            Always back up your data before removing columns in production!
          </Warning>
        </SubSection>
      </TutorialSection>

      <TutorialSection id="alter-type" title="ALTER TABLE — Change Data Type" description="Modify the data type of an existing column.">
        <SubSection title="Syntax">
          <CodeBlock>
{`ALTER TABLE table_name
ALTER COLUMN column_name TYPE new_datatype;`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Example: Change a Column Type">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Let&apos;s say we want to allow longer titles. We will change <code>VARCHAR(150)</code> to <code>TEXT</code>.
            (Note: if you renamed product_name to title earlier, this uses <code>title</code>.)
          </p>
          <SQLRunner
            hint="If your column is still named product_name, change the SQL accordingly."
            initialSql={`ALTER TABLE products
ALTER COLUMN title TYPE TEXT;`}
          />
          <InfoBox>
            PostgreSQL will try to <strong>cast</strong> the existing data to the new type automatically.
            If the cast fails (e.g., changing TEXT to INTEGER with non-numeric text), you will get an error.
            You can use <code>USING expression</code> to customize how values are converted.
          </InfoBox>
        </SubSection>
      </TutorialSection>
    </div>
  );
}
