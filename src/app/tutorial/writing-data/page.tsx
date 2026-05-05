import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip, Warning, InfoBox } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function WritingDataPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Writing Data</h1>
        <p className="text-zinc-600 dark:text-zinc-400">INSERT, UPDATE, UPSERT, and DELETE — the core DML operations.</p>
      </div>

      <TutorialSection id="insert" title="INSERT INTO" description="Add new rows to your tables.">
        <SubSection title="Basic Syntax">
          <CodeBlock>
{`INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Inserting a Single Row">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Let&apos;s recreate the products table and insert a row:
          </p>
          <SQLRunner
            hint="After inserting, run SELECT * FROM products; to see your data."
            initialSql={`CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50),
  in_stock BOOLEAN DEFAULT true
);

INSERT INTO products (product_name, price, category)
VALUES ('Mechanical Keyboard', 129.99, 'Electronics');`}
          />
        </SubSection>

        <SubSection title="Inserting Multiple Rows">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            You can insert several rows in a single statement — much faster than running separate INSERTs:
          </p>
          <SQLRunner
            hint="Try inserting more rows with different categories and prices."
            initialSql={`INSERT INTO products (product_name, price, category) VALUES
  ('Wireless Mouse', 49.99, 'Electronics'),
  ('USB-C Hub', 34.99, 'Electronics'),
  ('Desk Lamp', 89.99, 'Office'),
  ('Standing Desk', 549.99, 'Furniture'),
  ('Notebook', 12.99, 'Office'),
  ('Monitor Stand', 79.99, 'Office');`}
          />
        </SubSection>

        <SubSection title="INSERT with RETURNING">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            PostgreSQL&apos;s <code>RETURNING</code> clause lets you see the inserted values immediately, including auto-generated IDs:
          </p>
          <SQLRunner
            hint="RETURNING * shows all columns of the inserted row. You can also list specific columns: RETURNING product_id, product_name;"
            initialSql={`INSERT INTO products (product_name, price, category)
VALUES ('Ergonomic Chair', 699.99, 'Furniture')
RETURNING *;`}
          />
        </SubSection>
      </TutorialSection>

      <TutorialSection id="update" title="UPDATE — Modify Existing Data" description="Change values in rows that already exist in your tables.">
        <SubSection title="Basic Syntax">
          <CodeBlock>
{`UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;`}
          </CodeBlock>
          <Warning>
            <strong>Always include a WHERE clause!</strong> Without it, every single row in the table will be updated.
            If you mean to update all rows, be explicit: <code>WHERE true</code>.
          </Warning>
        </SubSection>

        <SubSection title="Updating a Single Row">
          <SQLRunner
            hint="After updating, query the table to verify the change: SELECT * FROM products WHERE product_name ILIKE '%chair%';"
            initialSql={`UPDATE products
SET price = 649.99, category = 'Furniture'
WHERE product_name = 'Ergonomic Chair';`}
          />
        </SubSection>

        <SubSection title="Updating Multiple Rows">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Apply a 10% discount to all Office products:
          </p>
          <SQLRunner
            hint="Use RETURNING to see which rows were updated: UPDATE ... SET price = price * 0.9 WHERE ... RETURNING *;"
            initialSql={`UPDATE products
SET price = ROUND(price * 0.9, 2)
WHERE category = 'Office';`}
          />
        </SubSection>

        <SubSection title="UPDATE with RETURNING">
          <SQLRunner
            hint="RETURNING is great for confirming exactly what changed without a separate SELECT."
            initialSql={`UPDATE products
SET in_stock = false
WHERE price > 500
RETURNING product_id, product_name, in_stock;`}
          />
        </SubSection>
      </TutorialSection>

      <TutorialSection id="upsert" title="UPSERT — INSERT ON CONFLICT" description="PostgreSQL's powerful upsert: insert a row, or update it if a conflict occurs on a unique constraint.">
        <SubSection title="What is UPSERT?">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            <strong>UPSERT</strong> (UPDATE + INSERT) tries to insert a row. If a <strong>unique constraint</strong> or <strong>primary key</strong> is violated,
            it <strong>updates</strong> the existing row instead. This is a PostgreSQL extension to standard SQL.
          </p>
          <CodeBlock>
{`INSERT INTO table_name (col1, col2, col3)
VALUES (val1, val2, val3)
ON CONFLICT (conflict_column)
DO UPDATE SET col2 = excluded.col2, col3 = excluded.col3;`}
          </CodeBlock>
        </SubSection>

        <SubSection title="Basic UPSERT">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Let&apos;s create a table for tracking page visit counts. The same page should only have one row, incrementing on each &quot;visit&quot;:
          </p>
          <SQLRunner
            hint="Run this multiple times! The count increments because the page_url already exists (unique constraint)."
            initialSql={`CREATE TABLE IF NOT EXISTS page_visits (
  page_url VARCHAR(500) PRIMARY KEY,
  visit_count INTEGER NOT NULL DEFAULT 1,
  last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO page_visits (page_url, visit_count)
VALUES ('/home', 1)
ON CONFLICT (page_url)
DO UPDATE SET 
  visit_count = page_visits.visit_count + 1,
  last_visited = CURRENT_TIMESTAMP
RETURNING *;`}
          />
        </SubSection>

        <SubSection title="excluded — Accessing the Proposed Row">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            The special table <code>excluded</code> holds the row that <strong>would have been inserted</strong>.
            Use it to reference the new values in the UPDATE clause:
          </p>
          <SQLRunner
            hint="Run this twice — the second time it updates instead of inserting. Notice how excluded.price provides the new value."
            initialSql={`CREATE TABLE IF NOT EXISTS product_prices (
  product_name VARCHAR(150) PRIMARY KEY,
  price NUMERIC(10, 2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product_prices (product_name, price)
VALUES ('Wireless Mouse', 54.99)
ON CONFLICT (product_name)
DO UPDATE SET 
  price = excluded.price,
  updated_at = CURRENT_TIMESTAMP
RETURNING *;`}
          />
        </SubSection>

        <SubSection title="DO NOTHING">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            If you just want to skip the row on conflict without updating anything, use <code>DO NOTHING</code>:
          </p>
          <SQLRunner
            hint="Great for batch inserts where you only want to add new records and ignore existing ones."
            initialSql={`INSERT INTO product_prices (product_name, price) VALUES
  ('Mechanical Keyboard', 134.99),
  ('Wireless Mouse', 54.99),    -- already exists, will be skipped
  ('USB-C Hub', 39.99)
ON CONFLICT (product_name) DO NOTHING
RETURNING *;`}
          />
        </SubSection>

        <SubSection title="Partial Index Conflict Target">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            You can use a <strong>WHERE</strong> clause on the conflict target for conditional upserts — only conflict on active records:
          </p>
          <SQLRunner
            hint="This pattern is called 'insert if not exists, update if exists and active'. Very powerful for soft-delete patterns."
            initialSql={`CREATE TABLE IF NOT EXISTS subscriptions (
  user_id INTEGER,
  plan VARCHAR(50),
  active BOOLEAN DEFAULT true,
  UNIQUE (user_id, plan)
);

INSERT INTO subscriptions (user_id, plan) VALUES (1, 'pro')
ON CONFLICT (user_id, plan) DO NOTHING;

INSERT INTO subscriptions (user_id, plan) VALUES (1, 'pro')
ON CONFLICT (user_id, plan) DO NOTHING;

SELECT * FROM subscriptions;`}
          />
          <Tip>
            <strong>UPSERT is PostgreSQL-specific.</strong> In MySQL it&apos;s <code>ON DUPLICATE KEY UPDATE</code>.
            In standard SQL use <code>MERGE</code> (also supported by PostgreSQL 15+).
            The <code>excluded</code> keyword is unique to PostgreSQL&apos;s INSERT ON CONFLICT syntax.
          </Tip>
        </SubSection>
      </TutorialSection>

      <TutorialSection id="delete" title="DELETE — Remove Rows" description="Permanently remove rows from a table.">
        <SubSection title="Basic Syntax">
          <CodeBlock>
{`DELETE FROM table_name
WHERE condition;`}
          </CodeBlock>
          <Warning>
            <strong>DELETE without WHERE deletes every row!</strong> Always double-check your WHERE clause.
            Unlike DROP TABLE, the table structure remains — only the rows are removed.
          </Warning>
        </SubSection>

        <SubSection title="Deleting Specific Rows">
          <SQLRunner
            hint="Use RETURNING to see what was deleted: DELETE FROM products WHERE ... RETURNING *;"
            initialSql={`DELETE FROM products
WHERE product_name = 'USB-C Hub';`}
          />
        </SubSection>

        <SubSection title="DELETE vs TRUNCATE">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            <code>TRUNCATE</code> removes all rows faster than <code>DELETE</code> (it does not scan each row).
            But TRUNCATE cannot have a WHERE clause and resets SERIAL counters.
          </p>
          <SQLRunner
            hint="TRUNCATE is much faster for clearing a table entirely. DELETE logs each row removal."
            initialSql={`-- Try DELETE first (removes all rows, returns count):
DELETE FROM products;

-- Now TRUNCATE (faster, resets SERIAL):
TRUNCATE TABLE products;`}
          />
          <InfoBox>
            <strong>TRUNCATE TABLE table_name;</strong> vs <strong>DELETE FROM table_name;</strong>
            <ul className="list-disc ml-5 mt-1">
              <li>TRUNCATE is faster — it does not scan rows</li>
              <li>TRUNCATE resets auto-increment counters (SERIAL)</li>
              <li>TRUNCATE cannot have a WHERE clause</li>
              <li>DELETE returns the number of rows removed; TRUNCATE does not</li>
            </ul>
          </InfoBox>
        </SubSection>
      </TutorialSection>
    </div>
  );
}
