import { SQLRunner } from "@/components/sql-runner";
import { Sidebar } from "@/components/sidebar";
import { TutorialSection, CodeBlock, Tip, Warning, InfoBox, SubSection } from "@/components/tutorial-section";

export default function TutorialPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">SQL Basics Tutorial</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            Learn PostgreSQL table operations right in your browser.
            Type SQL, press <strong>Run SQL</strong>, and watch your database change in real-time.
          </p>
          <InfoBox>
            This tutorial uses <a href="https://pglite.dev/" className="underline" target="_blank" rel="noopener noreferrer">PGlite</a> — a real PostgreSQL database
            that runs entirely in your browser. The database persists between refreshes using IndexedDB.
            Use the <strong>Reset DB</strong> button anytime to start fresh.
          </InfoBox>
        </div>

        {/* ===================================================
            SECTION 1: CREATE TABLE
            =================================================== */}
        <TutorialSection
          id="create-table"
          title="CREATE TABLE"
          description="The CREATE TABLE statement is used to create a new table in a database."
        >
          <SubSection title="Basic Syntax">
            <p className="text-zinc-700 dark:text-zinc-300">
              A table is structured with <strong>columns</strong> (fields) and <strong>rows</strong> (records).
              Each column must be given a name and a data type.
            </p>
            <CodeBlock>
{`CREATE TABLE table_name (
  column1 datatype constraints,
  column2 datatype constraints,
  column3 datatype constraints
);`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Example: Create a Users Table">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Let&apos;s create our first table — a simple <strong>users</strong> table with an auto-incrementing ID,
              name, email, and signup date. Click <strong>Run SQL</strong> to execute the code below.
            </p>
            <SQLRunner
              hint="Click Run SQL to create the users table. Then try: SELECT * FROM users;"
              initialSql={`CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
            />
            <Tip>
              <strong>SERIAL</strong> is PostgreSQL&apos;s auto-increment type. It automatically generates
              a new number for each row. <strong>PRIMARY KEY</strong> uniquely identifies each record and creates an index.
            </Tip>
          </SubSection>

          <SubSection title="Exercise: Create a Products Table">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Try creating a table on your own! The code below is pre-loaded with a <strong>products</strong> table setup.
              Run it, then try inserting some data.
            </p>
            <SQLRunner
              hint="Run this to create the products table. Then try: INSERT INTO products (product_name, price) VALUES ('Laptop', 999.99);"
              initialSql={`CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 2: DATA TYPES
            =================================================== */}

        <TutorialSection
          id="data-types"
          title="Common PostgreSQL Data Types"
          description="Understanding data types helps you store information efficiently and correctly."
        >
          <SubSection title="Numeric Types">
            <CodeBlock>
{`-- Integers
INTEGER    -- Whole numbers: -2147483648 to 2147483647
BIGINT     -- Large integers: up to ~9 quintillion
SERIAL     -- Auto-incrementing integer

-- Decimal numbers
NUMERIC(10, 2)  -- Up to 10 digits, 2 after decimal: 99999999.99
REAL       -- Single precision floating point
DOUBLE PRECISION  -- Double precision floating point`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Text Types">
            <CodeBlock>
{`VARCHAR(n) -- Variable-length string (up to n characters)
CHAR(n)    -- Fixed-length string (padded with spaces)
TEXT       -- Unlimited length string`}
            </CodeBlock>
            <Tip>
              Use <strong>TEXT</strong> when you do not know the max length. Use <strong>VARCHAR(n)</strong> when you
              want to enforce a maximum length.
            </Tip>
          </SubSection>

          <SubSection title="Date & Time Types">
            <CodeBlock>
{`DATE              -- Date only: 2024-01-15
TIME              -- Time only: 14:30:00
TIMESTAMP         -- Date and time: 2024-01-15 14:30:00
TIMESTAMPTZ       -- Date/time with timezone info
INTERVAL          -- Time span: 2 days, 3 hours`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Other Important Types">
            <CodeBlock>
{`BOOLEAN        -- true or false
UUID           -- Universally unique identifier
JSON / JSONB   -- Store JSON data (JSONB is faster!)
ARRAY          -- Array of values: INTEGER[]
BYTEA          -- Binary data (images, files, etc.)`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Hands On: Data Types Demo">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Let&apos;s create a table showcasing various data types. Run it, then insert a row to see how each type works.
            </p>
            <SQLRunner
              hint="Run this, then try: INSERT INTO data_demo (sample_text, sample_number, sample_bool) VALUES ('Hello', 42, true);"
              initialSql={`CREATE TABLE data_demo (
  id SERIAL PRIMARY KEY,
  sample_text VARCHAR(50),
  sample_number INTEGER,
  sample_decimal NUMERIC(8, 2),
  sample_bool BOOLEAN,
  sample_date DATE,
  sample_json JSONB
);`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 3: ALTER TABLE - Add Column
            =================================================== */}

        <TutorialSection
          id="add-column"
          title="ALTER TABLE — Add Column"
          description="Add new columns to an existing table without recreating it."
        >
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

        {/* ===================================================
            SECTION 4: RENAME COLUMN
            =================================================== */}

        <TutorialSection
          id="rename-column"
          title="ALTER TABLE — Rename Column"
          description="Change the name of an existing column."
        >
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

        {/* ===================================================
            SECTION 5: DROP COLUMN
            =================================================== */}

        <TutorialSection
          id="drop-column"
          title="ALTER TABLE — Drop Column"
          description="Remove a column that is no longer needed."
        >
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

        {/* ===================================================
            SECTION 6: CHANGE DATA TYPE
            =================================================== */}

        <TutorialSection
          id="alter-type"
          title="ALTER TABLE — Change Data Type"
          description="Modify the data type of an existing column."
        >
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

        {/* ===================================================
            SECTION 7: PRIMARY KEYS
            =================================================== */}

        <TutorialSection
          id="primary-key"
          title="Primary Keys — Create & Alter"
          description="A primary key uniquely identifies each row. Every table should ideally have one."
        >
          <SubSection title="Creating a Primary Key on Table Creation">
            <CodeBlock>
{`-- Inline definition (most common)
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Or at the end using CONSTRAINT
CREATE TABLE orders (
  order_id SERIAL,
  customer_id INTEGER NOT NULL,
  CONSTRAINT pk_orders PRIMARY KEY (order_id)
);`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Adding a Primary Key to an Existing Table">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              You might create a table without a primary key, then realize you need one. Here&apos;s how to add it later:
            </p>
            <SQLRunner
              hint="First run the CREATE TABLE, then the ALTER TABLE to add the PK."
              initialSql={`-- First create a table without a primary key
CREATE TABLE inventory (
  item_code VARCHAR(20),
  warehouse VARCHAR(20),
  quantity INTEGER NOT NULL
);

-- Add a primary key
ALTER TABLE inventory
ADD CONSTRAINT pk_inventory PRIMARY KEY (item_code, warehouse);`}
            />
            <Tip>
              Notice we used a <strong>composite primary key</strong> — two columns together form the unique identifier.
              This is useful when a single column is not enough to uniquely identify a row.
            </Tip>
          </SubSection>

          <SubSection title="Dropping a Primary Key">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              To remove a primary key constraint, you need to reference it by its constraint name:
            </p>
            <SQLRunner
              hint="After dropping the PK, you can add a new one, or leave the table without a primary key."
              initialSql={`-- Drop the primary key we just created
ALTER TABLE inventory
DROP CONSTRAINT IF EXISTS pk_inventory CASCADE;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 8: FOREIGN KEYS
            =================================================== */}

        <TutorialSection
          id="foreign-key"
          title="Foreign Keys — Create & Alter"
          description="A foreign key links one table to another, enforcing referential integrity."
        >
          <SubSection title="What is a Foreign Key?">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A <strong>foreign key</strong> creates a relationship between two tables. It ensures that a value in one table
              matches a value in another table. For example, every <strong>order</strong> must belong to a valid <strong>customer</strong>.
            </p>
            <CodeBlock>
{`-- Referenced (parent) table
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

-- Referencing (child) table with foreign key
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(customer_id),
  total NUMERIC(10, 2)
);`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Adding a Foreign Key to an Existing Table">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Let&apos;s create a reviews table and link it to our products table with a foreign key:
            </p>
            <SQLRunner
              hint="Make sure the products table exists and has a primary key. The reviews table can reference it."
              initialSql={`-- Create a customers table first
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Now create orders with a FK to customers
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  CONSTRAINT fk_orders_customers
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);`}
            />
            <Tip>
              The <strong>ON DELETE CASCADE</strong> option automatically deletes child rows when a parent row is deleted.
              Without it, deleting a parent row that has children will throw an error.
            </Tip>
          </SubSection>

          <SubSection title="Hands On: Foreign Key with CASCADE">
            <SQLRunner
              hint="Insert a customer first (INSERT INTO customers (name) VALUES ('Alice');), then an order. Try deleting the customer!"
              initialSql={`-- Add CASCADE delete behavior to the FK
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS fk_orders_customers;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_customers
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;`}
            />
            <InfoBox>
              <strong>ON DELETE CASCADE</strong> means: when the referenced customer is deleted,
              all of their orders are automatically deleted too.
              <br /><br />
              Other options include:
              <ul className="list-disc ml-5 mt-1">
                <li><strong>ON DELETE SET NULL</strong> — Set the FK to NULL instead</li>
                <li><strong>ON DELETE RESTRICT</strong> — Prevent deletion of the parent</li>
                <li><strong>ON DELETE NO ACTION</strong> — Throw an error (default)</li>
              </ul>
            </InfoBox>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 9: DROP CONSTRAINTS
            =================================================== */}

        <TutorialSection
          id="drop-constraint"
          title="Drop Constraints"
          description="Remove constraints by name when they are no longer needed."
        >
          <SubSection title="Syntax">
            <CodeBlock>
{`ALTER TABLE table_name
DROP CONSTRAINT constraint_name;`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Finding Constraint Names">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              PostgreSQL auto-generates constraint names if you do not specify one. You can find them with this query:
            </p>
            <SQLRunner
              hint="Change 'orders' to any table name to see its constraints."
              initialSql={`SELECT conname AS constraint_name,
       contype AS type,
       pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'orders'::regclass;`}
            />
            <Tip>
              Constraint type codes: <code>p</code> = primary key, <code>f</code> = foreign key, <code>u</code> = unique,
              <code>c</code> = check, <code>x</code> = exclusion.
            </Tip>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 10: DROP TABLE
            =================================================== */}

        <TutorialSection
          id="drop-table"
          title="DROP TABLE"
          description="Completely remove a table and all its data from the database."
        >
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

        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
          Built with <a href="https://nextjs.org/" className="underline" target="_blank" rel="noopener noreferrer">Next.js</a> & <a href="https://pglite.dev/" className="underline" target="_blank" rel="noopener noreferrer">PGlite</a>.
          <div className="mt-2">Press <strong>Reset DB</strong> anytime to start fresh. Your database persists in your browser using IndexedDB.</div>
        </footer>
      </main>
    </div>
  );
}
