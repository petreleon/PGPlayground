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
            SECTION 10: INSERT INTO
            =================================================== */}

        <TutorialSection
          id="insert"
          title="INSERT INTO"
          description="Add new rows to your tables."
        >
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

        {/* ===================================================
            SECTION 11: SELECT
            =================================================== */}

        <TutorialSection
          id="select"
          title="SELECT — Retrieving Data"
          description="The most used SQL statement. SELECT retrieves data from your tables."
        >
          <SubSection title="Basic Syntax">
            <CodeBlock>
{`SELECT column1, column2 FROM table_name;`}
            </CodeBlock>
            <CodeBlock>
{`SELECT * FROM table_name;  -- Selects all columns`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Selecting All Data">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Run this to see all products. Each row appears as a table result below the editor.
            </p>
            <SQLRunner
              hint="SELECT * returns every column and every row. For large tables, use LIMIT to restrict rows."
              initialSql={`SELECT * FROM products;`}
            />
          </SubSection>

          <SubSection title="Selecting Specific Columns">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Only retrieve the columns you need — this is faster and clearer:
            </p>
            <SQLRunner
              hint="Selecting only needed columns reduces data transfer and makes queries more readable."
              initialSql={`SELECT product_name, price FROM products;`}
            />
          </SubSection>

          <SubSection title="Aliases with AS">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Use <code>AS</code> to rename columns in the result set:
            </p>
            <SQLRunner
              hint="Aliases are especially useful when using expressions or joining tables."
              initialSql={`SELECT 
  product_name AS name,
  price AS unit_price,
  category
FROM products;`}
            />
            <Tip>
              Column aliases are temporary and only exist in the query result. They do not rename the actual column
              in the table — use <strong>ALTER TABLE RENAME COLUMN</strong> for that.
            </Tip>
          </SubSection>

          <SubSection title="SELECT Expressions">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              SELECT can compute expressions, not just raw columns:
            </p>
            <SQLRunner
              hint="Try different expressions like price * 1.2 for a 20% markup."
              initialSql={`SELECT 
  product_name,
  price,
  price * 0.9 AS discounted_price,
  'USD' AS currency
FROM products;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 12: WHERE
            =================================================== */}

        <TutorialSection
          id="where"
          title="WHERE — Filtering Data"
          description="Narrow down your results to only the rows you care about."
        >
          <SubSection title="Basic Syntax">
            <CodeBlock>
{`SELECT columns FROM table_name
WHERE condition;`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Comparison Operators">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Use <code>=</code>, <code>{`!=`}</code> (or <code>{`<>`}</code>), <code>{`>`}</code>, <code>{`<`}</code>, <code>{`>=`}</code>, <code>{`<=`}</code> to compare values:
            </p>
            <SQLRunner
              hint="PostgreSQL accepts both != and <> for not-equal."
              initialSql={`SELECT product_name, price, category
FROM products
WHERE price > 50;`}
            />
          </SubSection>

          <SubSection title="String Filtering with LIKE">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>LIKE</code> matches patterns. <code>%</code> matches any characters, <code>_</code> matches exactly one character:
            </p>
            <SQLRunner
              hint="ILIKE does case-insensitive matching (PostgreSQL-specific)."
              initialSql={`SELECT product_name, price
FROM products
WHERE product_name LIKE '%Desk%';`}
            />
          </SubSection>

          <SubSection title="IN and BETWEEN">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>IN</code> checks if a value matches any in a list. <code>BETWEEN</code> checks a range (inclusive):
            </p>
            <SQLRunner
              hint="NOT IN and NOT BETWEEN do the opposite."
              initialSql={`SELECT product_name, price, category
FROM products
WHERE category IN ('Electronics', 'Office')
  AND price BETWEEN 30 AND 200;`}
            />
          </SubSection>

          <SubSection title="AND, OR, NOT Logic">
            <CodeBlock>
{`SELECT * FROM products
WHERE category = 'Electronics'
  AND price < 200
  AND in_stock = true;`}
            </CodeBlock>
            <SQLRunner
              hint="Use parentheses () to group conditions: WHERE (cat = 'A' OR cat = 'B') AND price > 50;"
              initialSql={`SELECT product_name, price, category, in_stock
FROM products
WHERE (category = 'Electronics' OR category = 'Office')
  AND price < 100;`}
            />
            <Warning>
              When mixing <strong>AND</strong> and <strong>OR</strong>, always use parentheses to make your logic clear.
              PostgreSQL evaluates AND before OR, which can lead to unexpected results without parentheses.
            </Warning>
          </SubSection>

          <SubSection title="NULL Handling">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>IS NULL</code> and <code>IS NOT NULL</code> — never use <code>= NULL</code> (it always returns false!):
            </p>
            <SQLRunner
              hint="NULL means 'unknown', not 'empty' or 'zero'. Every comparison with NULL returns NULL (not true/false)."
              initialSql={`SELECT product_name, category
FROM products
WHERE category IS NOT NULL;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 13: ORDER BY & LIMIT
            =================================================== */}

        <TutorialSection
          id="order-by"
          title="ORDER BY & LIMIT"
          description="Sort your results and restrict how many rows you get back."
        >
          <SubSection title="Sorting with ORDER BY">
            <CodeBlock>
{`SELECT columns FROM table_name
ORDER BY column1 ASC, column2 DESC;`}
            </CodeBlock>
            <SQLRunner
              hint="ASC (ascending) is the default. Try ORDER BY price DESC to see most expensive first."
              initialSql={`SELECT product_name, price, category
FROM products
ORDER BY price DESC
LIMIT 3;`}
            />
          </SubSection>

          <SubSection title="LIMIT & OFFSET">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>LIMIT</code> caps the number of rows. <code>OFFSET</code> skips rows — useful for pagination:
            </p>
            <SQLRunner
              hint="This pattern is used everywhere for 'page 2 of results': LIMIT 10 OFFSET 10."
              initialSql={`SELECT product_name, price
FROM products
ORDER BY price ASC
LIMIT 3 OFFSET 2;`}
            />
          </SubSection>

          <SubSection title="Combining with WHERE">
            <SQLRunner
              hint="The execution order matters: FROM -> WHERE -> SELECT -> ORDER BY -> LIMIT."
              initialSql={`SELECT product_name, price, category
FROM products
WHERE price > 40
ORDER BY price DESC
LIMIT 5;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 14: UPDATE
            =================================================== */}

        <TutorialSection
          id="update"
          title="UPDATE — Modify Existing Data"
          description="Change values in rows that already exist in your tables."
        >
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

        {/* ===================================================
            SECTION 15: DELETE
            =================================================== */}

        <TutorialSection
          id="delete"
          title="DELETE — Remove Rows"
          description="Permanently remove rows from a table."
        >
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
              initialSql={`SELECT product_name, price FROM products
WHERE price < 30;`}
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

        {/* ===================================================
            SECTION 16: JOINs
            =================================================== */}

        <TutorialSection
          id="joins"
          title="JOINs — Combining Tables"
          description="JOINs are the heart of relational databases. They let you query data from multiple tables together."
        >
          <SubSection title="Seed Data: Create Related Tables">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Before we explore JOINs, let&apos;s create some properly related tables. Run all of the SQL below:
            </p>
            <SQLRunner
              hint="Run this block first, then the exercises below will work. These tables will be used throughout the JOIN, GROUP BY, and Subquery sections."
              initialSql={`CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS inventory_items (
  item_id SERIAL PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(category_id),
  supplier_id INTEGER REFERENCES suppliers(supplier_id),
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES
  ('Electronics'), ('Office'), ('Furniture'), ('Accessories')
ON CONFLICT (name) DO NOTHING;

INSERT INTO suppliers (name, country) VALUES
  ('TechSupply Co', 'USA'),
  ('OfficePro GmbH', 'Germany'),
  ('FurniMax Inc', 'Canada'),
  ('GlobalParts Ltd', 'Japan')
ON CONFLICT DO NOTHING;

INSERT INTO inventory_items (product_name, price, category_id, supplier_id, stock) VALUES
  ('Mechanical Keyboard', 129.99, 1, 1, 45),
  ('Wireless Mouse', 49.99, 1, 1, 120),
  ('USB-C Hub', 34.99, 1, 4, 200),
  ('Standing Desk', 549.99, 3, 3, 5),
  ('Notebook', 12.99, 2, 2, 500),
  ('Desk Lamp', 89.99, 3, 3, 30),
  ('Monitor Stand', 79.99, 2, 2, 60),
  ('Phone Stand', 19.99, 4, 4, 150),
  ('Cable Organizer', 15.99, 4, 1, 300),
  ('Headphone Stand', 39.99, 4, 4, 75);`}
            />
          </SubSection>

          <SubSection title="INNER JOIN">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              An <code>INNER JOIN</code> returns only rows where there is a match in both tables:
            </p>
            <CodeBlock>
{`SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;`}
            </CodeBlock>
            <SQLRunner
              hint="INNER JOIN is the most common join type. Only matching rows are returned."
              initialSql={`SELECT i.product_name, i.price, c.name AS category
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id;`}
            />
          </SubSection>

          <SubSection title="LEFT JOIN">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A <code>LEFT JOIN</code> returns all rows from the left table, plus matching rows from the right table.
              Unmatched right-side columns will be NULL:
            </p>
            <SQLRunner
              hint="LEFT JOIN keeps every row from the left table, even if there is no match on the right."
              initialSql={`SELECT i.product_name, i.price, s.name AS supplier, s.country
FROM inventory_items i
LEFT JOIN suppliers s ON i.supplier_id = s.supplier_id;`}
            />
          </SubSection>

          <SubSection title="Joining Multiple Tables">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              You can chain JOINs to pull data from many tables at once:
            </p>
            <SQLRunner
              hint="Use short aliases (i, c, s) to keep the query readable when joining many tables."
              initialSql={`SELECT 
  i.product_name,
  i.price,
  c.name AS category,
  s.name AS supplier,
  s.country
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
INNER JOIN suppliers s ON i.supplier_id = s.supplier_id
ORDER BY i.price DESC;`}
            />
          </SubSection>

          <SubSection title="RIGHT JOIN & FULL OUTER JOIN">
            <CodeBlock>
{`-- RIGHT JOIN: all rows from the right table
SELECT * FROM table1 RIGHT JOIN table2 ON condition;

-- FULL OUTER JOIN: all rows from both tables
SELECT * FROM table1 FULL OUTER JOIN table2 ON condition;`}
            </CodeBlock>
            <SQLRunner
              hint="RIGHT JOIN is rarely used — you can usually swap table order and use LEFT JOIN instead."
              initialSql={`SELECT c.name AS category, COUNT(i.item_id) AS item_count
FROM categories c
LEFT JOIN inventory_items i ON c.category_id = i.category_id
GROUP BY c.name
ORDER BY item_count DESC;`}
            />
          </SubSection>

          <SubSection title="SELF JOIN">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A table can join to itself — useful for hierarchical data like employees and managers:
            </p>
            <SQLRunner
              hint="Self-joins always need aliases to distinguish the two 'copies' of the same table."
              initialSql={`SELECT 
  a.product_name AS product_a,
  b.product_name AS product_b,
  a.category_id
FROM inventory_items a
INNER JOIN inventory_items b 
  ON a.category_id = b.category_id 
  AND a.item_id < b.item_id;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 17: GROUP BY & Aggregation
            =================================================== */}

        <TutorialSection
          id="group-by"
          title="GROUP BY — Aggregation"
          description="Summarize data by grouping rows and applying aggregate functions."
        >
          <SubSection title="Aggregate Functions">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              PostgreSQL provides powerful aggregate functions. Here are the most common:
            </p>
            <CodeBlock>
{`COUNT(*)    -- Number of rows
SUM(column) -- Total of all values
AVG(column) -- Average value
MIN(column) -- Smallest value
MAX(column) -- Largest value
STRING_AGG(column, ',') -- Concatenate strings (PostgreSQL)`}
            </CodeBlock>
          </SubSection>

          <SubSection title="GROUP BY Basics">
            <SQLRunner
              hint="Every column in SELECT that is not an aggregate function must appear in GROUP BY."
              initialSql={`SELECT 
  c.name AS category,
  COUNT(*) AS item_count,
  ROUND(AVG(i.price), 2) AS avg_price,
  MIN(i.price) AS cheapest,
  MAX(i.price) AS most_expensive
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
GROUP BY c.name
ORDER BY avg_price DESC;`}
            />
          </SubSection>

          <SubSection title="GROUP BY with SUM and Stock">
            <SQLRunner
              hint="SUM(stock) gives total inventory per group. Try adding AVG(stock) to find best-stocked categories."
              initialSql={`SELECT 
  s.name AS supplier,
  COUNT(*) AS products_supplied,
  SUM(i.stock) AS total_stock,
  ROUND(AVG(i.price), 2) AS avg_price
FROM inventory_items i
INNER JOIN suppliers s ON i.supplier_id = s.supplier_id
GROUP BY s.name
ORDER BY total_stock DESC;`}
            />
          </SubSection>

          <SubSection title="HAVING — Filtering Groups">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>WHERE</code> filters rows before grouping. <code>HAVING</code> filters after grouping:
            </p>
            <SQLRunner
              hint="WHERE filters individual rows; HAVING filters the grouped results. Think: WHERE = before GROUP BY, HAVING = after GROUP BY."
              initialSql={`SELECT 
  c.name AS category,
  COUNT(*) AS item_count,
  SUM(i.stock) AS total_stock
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
GROUP BY c.name
HAVING SUM(i.stock) > 100
ORDER BY total_stock DESC;`}
            />
          </SubSection>

          <SubSection title="DISTINCT">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>DISTINCT</code> removes duplicate rows from the result. It is not an aggregate, but often used with queries:
            </p>
            <SQLRunner
              hint="COUNT(DISTINCT column) counts unique values — very common for analytics."
              initialSql={`SELECT 
  COUNT(DISTINCT category_id) AS unique_categories,
  COUNT(DISTINCT supplier_id) AS unique_suppliers,
  COUNT(*) AS total_items
FROM inventory_items;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 18: Subqueries & CTEs
            =================================================== */}

        <TutorialSection
          id="subqueries"
          title="Subqueries & CTEs"
          description="Write queries inside queries and use Common Table Expressions (WITH) for complex data retrieval."
        >
          <SubSection title="Subqueries in WHERE">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A subquery is a <code>SELECT</code> inside another SQL statement. Use them to filter based on computed values:
            </p>
            <SQLRunner
              hint="The inner query runs first, then its result is used by the outer query."
              initialSql={`SELECT product_name, price, stock
FROM inventory_items
WHERE price > (SELECT AVG(price) FROM inventory_items)
ORDER BY price DESC;`}
            />
          </SubSection>

          <SubSection title="Subqueries with IN / NOT IN">
            <SQLRunner
              hint="NOT IN is useful for finding 'orphan' data or items that do not match."
              initialSql={`SELECT item_id, product_name, price
FROM inventory_items
WHERE supplier_id IN (
  SELECT supplier_id FROM suppliers WHERE country = 'USA'
);`}
            />
          </SubSection>

          <SubSection title="Correlated Subqueries">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A correlated subquery references columns from the outer query. It runs once per outer row:
            </p>
            <SQLRunner
              hint="Correlated subqueries can be slow on large tables. Often a JOIN or CTE is faster."
              initialSql={`SELECT i.product_name, i.price, i.stock
FROM inventory_items i
WHERE i.price > (
  SELECT AVG(i2.price)
  FROM inventory_items i2
  WHERE i2.category_id = i.category_id
)
ORDER BY i.category_id, i.price DESC;`}
            />
          </SubSection>

          <SubSection title="EXISTS / NOT EXISTS">
            <SQLRunner
              hint="EXISTS checks whether a subquery returns any rows. It stops scanning as soon as it finds one match."
              initialSql={`SELECT s.name, s.country
FROM suppliers s
WHERE EXISTS (
  SELECT 1 FROM inventory_items i
  WHERE i.supplier_id = s.supplier_id AND i.stock > 100
);`}
            />
          </SubSection>

          <SubSection title="Common Table Expressions (CTEs) — WITH">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A <code>WITH</code> clause (CTE) defines a named temporary result set. It makes complex queries readable and reusable:
            </p>
            <SQLRunner
              hint="You can define multiple CTEs separated by commas: WITH cte1 AS (...), cte2 AS (...) SELECT ...;"
              initialSql={`WITH category_stats AS (
  SELECT 
    category_id,
    AVG(price) AS avg_price,
    SUM(stock) AS total_stock
  FROM inventory_items
  GROUP BY category_id
)
SELECT 
  i.product_name,
  i.price,
  c.name AS category,
  ROUND(cs.avg_price, 2) AS category_avg,
  CASE WHEN i.price > cs.avg_price THEN 'Above avg' ELSE 'Below avg' END AS price_vs_avg
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
INNER JOIN category_stats cs ON i.category_id = cs.category_id
ORDER BY i.price DESC;`}
            />
            <Tip>
              CTEs are often clearer than subqueries, especially when you need to reference the same derived result
              multiple times. They can also be used recursively for tree/graph traversal (<code>WITH RECURSIVE</code>).
            </Tip>
          </SubSection>

          <SubSection title="Scalar Subqueries in SELECT">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Subqueries that return a single value can be used directly in the SELECT clause:
            </p>
            <SQLRunner
              hint="This adds a column showing how each item's price compares to the global average."
              initialSql={`SELECT 
  product_name,
  price,
  (SELECT ROUND(AVG(price), 2) FROM inventory_items) AS global_avg,
  ROUND(price - (SELECT AVG(price) FROM inventory_items), 2) AS diff_from_avg
FROM inventory_items
ORDER BY diff_from_avg DESC;`}
            />
          </SubSection>

          <SubSection title="CTE with Window Functions — RANK">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Combine CTEs with window functions like <code>RANK()</code>, <code>ROW_NUMBER()</code>, and <code>DENSE_RANK()</code>:
            </p>
            <SQLRunner
              hint="Window functions use OVER (PARTITION BY ... ORDER BY ...). They don't collapse rows like GROUP BY does."
              initialSql={`WITH ranked AS (
  SELECT 
    product_name,
    price,
    category_id,
    RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS rank
  FROM inventory_items
)
SELECT i.product_name, i.price, c.name AS category, r.rank
FROM ranked r
INNER JOIN inventory_items i ON r.product_name = i.product_name
  AND r.category_id = i.category_id
INNER JOIN categories c ON r.category_id = c.category_id
WHERE r.rank <= 2
ORDER BY c.name, r.rank;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 19: UPSERT (ON CONFLICT)
            =================================================== */}

        <TutorialSection
          id="upsert"
          title="UPSERT — INSERT ON CONFLICT"
          description="PostgreSQL's powerful upsert: insert a row, or update it if a conflict occurs on a unique constraint."
        >
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

        {/* ===================================================
            SECTION 20: Transactions
            =================================================== */}

        <TutorialSection
          id="transactions"
          title="Transactions — BEGIN, COMMIT, ROLLBACK"
          description="Group multiple statements into an atomic unit that either all succeed or all fail."
        >
          <SubSection title="What is a Transaction?">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A <strong>transaction</strong> bundles multiple SQL statements into a single, indivisible unit of work.
              It follows the <strong>ACID</strong> principles: Atomicity, Consistency, Isolation, Durability.
              If any statement fails, <strong>all</strong> changes are rolled back.
            </p>
            <CodeBlock>
{`BEGIN;
  -- All your statements here...
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Or, if something goes wrong:
BEGIN;
  -- ...
ROLLBACK;  -- Undo everything in the transaction`}
            </CodeBlock>
          </SubSection>

          <SubSection title="COMMIT — Save Everything">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Let&apos;s create a bank-style ledger. Two updates must both succeed — if one fails, neither happens:
            </p>
            <SQLRunner
              hint="This simulates a money transfer. Both account balances are updated atomically."
              initialSql={`CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0
);

INSERT INTO accounts (name, balance) VALUES
  ('Alice', 1000.00),
  ('Bob', 500.00)
ON CONFLICT DO NOTHING;

BEGIN;
  UPDATE accounts SET balance = balance - 200 WHERE name = 'Alice';
  UPDATE accounts SET balance = balance + 200 WHERE name = 'Bob';
COMMIT;

SELECT * FROM accounts;`}
            />
          </SubSection>

          <SubSection title="ROLLBACK — Undo Everything">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              If a transaction is rolled back, <strong>none</strong> of the changes persist:
            </p>
            <SQLRunner
              hint="Notice Alice's balance is unchanged after ROLLBACK — the UPDATE never committed."
              initialSql={`BEGIN;
  UPDATE accounts SET balance = balance - 900 WHERE name = 'Alice';
  -- Whoops, Alice would have only 100 left! Let's undo.
ROLLBACK;

SELECT * FROM accounts;`}
            />
          </SubSection>

          <SubSection title="Savepoints">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>SAVEPOINT</code> creates a checkpoint inside a transaction. You can roll back to it without discarding the entire transaction:
            </p>
            <SQLRunner
              hint="Savepoints let you partially undo within a transaction — very useful in complex operations."
              initialSql={`BEGIN;
  UPDATE accounts SET balance = balance - 50 WHERE name = 'Alice';

  SAVEPOINT after_alice;
  
  UPDATE accounts SET balance = balance + 50 WHERE name = 'Nobody';
  -- That failed (or was intentional). Roll back to the savepoint.
  ROLLBACK TO SAVEPOINT after_alice;

  -- Continue with Bob's update
  UPDATE accounts SET balance = balance + 50 WHERE name = 'Bob';
COMMIT;

SELECT * FROM accounts;`}
            />
          </SubSection>

          <SubSection title="Auto-Commit & Implicit Transactions">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              In PGlite (and most PostgreSQL clients), every statement outside an explicit <code>BEGIN...COMMIT</code> runs
              in an <strong>auto-commit</strong> mode — each statement is its own tiny transaction. Run a manual transaction:
            </p>
            <SQLRunner
              hint="Try: BEGIN; INSERT INTO accounts (name, balance) VALUES ('Charlie', 99999); ROLLBACK; SELECT * FROM accounts;"
              initialSql={`BEGIN;
  INSERT INTO accounts (name, balance) VALUES ('ErrorTest', -99999);
  -- Pretend this is an error — we roll back:
ROLLBACK;

-- The insert was undone
SELECT * FROM accounts;`}
            />
            <InfoBox>
              <strong>Transaction isolation levels</strong> in PostgreSQL:
              <ul className="list-disc ml-5 mt-1">
                <li><strong>READ COMMITTED</strong> (default) — Each query sees only committed data</li>
                <li><strong>REPEATABLE READ</strong> — All queries in the transaction see the same snapshot</li>
                <li><strong>SERIALIZABLE</strong> — Strictest; transactions cannot overlap in time</li>
              </ul>
              PGlite runs with <strong>READ COMMITTED</strong> isolation.
            </InfoBox>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 21: CASE Expressions
            =================================================== */}

        <TutorialSection
          id="case"
          title="CASE — Conditional Logic"
          description="Add if/then/else logic directly in your SQL queries."
        >
          <SubSection title="Basic Syntax">
            <CodeBlock>
{`SELECT column,
  CASE 
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE default_result
  END AS label
FROM table_name;`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Categorizing Data">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Use CASE to categorize rows into buckets based on their values:
            </p>
            <SQLRunner
              hint="CASE evaluates conditions in order — the first matching WHEN wins. Always include an ELSE."
              initialSql={`SELECT 
  product_name,
  price,
  CASE
    WHEN price < 50 THEN 'Budget'
    WHEN price > 200 THEN 'Premium'
    ELSE 'Mid-Range'
  END AS price_tier
FROM inventory_items
ORDER BY price DESC;`}
            />
          </SubSection>

          <SubSection title="CASE in Aggregates">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Combine CASE with aggregate functions to do conditional counting and summing:
            </p>
            <SQLRunner
              hint="This pattern — COUNT(CASE WHEN ...) — is extremely common in reporting and dashboards."
              initialSql={`SELECT 
  c.name AS category,
  COUNT(*) AS total_items,
  COUNT(CASE WHEN i.stock < 50 THEN 1 END) AS low_stock_items,
  SUM(CASE WHEN i.stock >= 100 THEN 1 ELSE 0 END) AS well_stocked_items,
  ROUND(AVG(i.price), 2) AS avg_price,
  SUM(CASE WHEN i.price > 100 THEN i.stock ELSE 0 END) AS premium_stock
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
GROUP BY c.name
ORDER BY total_items DESC;`}
            />
          </SubSection>

          <SubSection title="CASE vs Simple CASE">
            <CodeBlock>
{`-- Searched CASE (conditions, most flexible)
CASE
  WHEN price > 100 THEN 'Expensive'
  ELSE 'Cheap'
END

-- Simple CASE (single expression comparison)
CASE category_id
  WHEN 1 THEN 'Electronics'
  WHEN 2 THEN 'Office'
  ELSE 'Other'
END`}
            </CodeBlock>
            <Tip>
              <strong>Searched CASE</strong> (with <code>WHEN condition</code>) is more common and flexible.
              <strong>Simple CASE</strong> (with <code>CASE expression</code>) is shorter when you are just comparing equality
              against a single column.
            </Tip>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 22: COALESCE & NULLIF
            =================================================== */}

        <TutorialSection
          id="coalesce"
          title="COALESCE & NULLIF — NULL Handling"
          description="PostgreSQL functions for gracefully handling NULL values and avoiding division-by-zero."
        >
          <SubSection title="COALESCE — Pick the First Non-NULL Value">
            <CodeBlock>
{`COALESCE(value1, value2, ..., valueN);`}
            </CodeBlock>
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>COALESCE</code> returns the first non-NULL argument. It is the safe way to provide default values:
            </p>
            <SQLRunner
              hint="Without COALESCE, any arithmetic with NULL returns NULL — silently losing rows."
              initialSql={`SELECT 
  product_name,
  price,
  stock,
  COALESCE(stock, 0) AS safe_stock,
  price * COALESCE(stock, 0) AS inventory_value
FROM (
  SELECT 'Discontinued Item'::TEXT AS product_name, 29.99 AS price, NULL::INTEGER AS stock
  UNION ALL
  SELECT 'Active Item', 49.99, 150
)
ORDER BY price;`}
            />
          </SubSection>

          <SubSection title="NULLIF — Return NULL if Values Match">
            <CodeBlock>
{`NULLIF(expression1, expression2);`}
            </CodeBlock>
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>NULLIF</code> returns NULL if the two values are equal — most commonly used to avoid division by zero:
            </p>
            <SQLRunner
              hint="NULLIF(divisor, 0) prevents division-by-zero errors by converting 0 to NULL, which results in NULL instead of an error."
              initialSql={`SELECT 
  product_name,
  price,
  stock,
  price / NULLIF(stock, 0) AS price_per_unit,
  CASE 
    WHEN stock <= 0 THEN 0
    ELSE ROUND(price * stock, 2) 
  END AS total_value
FROM (
  VALUES 
    ('Mechanical Keyboard'::TEXT, 129.99::NUMERIC, 45::INTEGER),
    ('Zero Stock Item', 59.99, 0),
    ('Wireless Mouse', 49.99, 120)
) AS t(product_name, price, stock);`}
            />
          </SubSection>

          <SubSection title="Practical NULL Handling Patterns">
            <SQLRunner
              hint="Combine COALESCE with NULLIF for robust data cleanup: COALESCE(NULLIF(trim(value), ''), 'N/A')."
              initialSql={`WITH cleaned_suppliers AS (
  SELECT 
    supplier_id,
    name,
    COALESCE(country, 'Unknown') AS country,
    -- If the country is an empty string, treat it as NULL
    COALESCE(NULLIF(COALESCE(country, ''), ''), 'Unknown') AS safe_country
  FROM suppliers
)
SELECT 
  cs.name,
  cs.country AS raw_country,
  cs.safe_country,
  COUNT(i.item_id) AS items_provided,
  COALESCE(SUM(i.stock), 0) AS total_stock_provided
FROM cleaned_suppliers cs
LEFT JOIN inventory_items i ON cs.supplier_id = i.supplier_id
GROUP BY cs.name, cs.country, cs.safe_country
ORDER BY total_stock_provided DESC;`}
            />
            <Tip>
              Common pattern: <code>COALESCE(NULLIF(column, ''), 'N/A')</code> treats empty strings as NULL, then provides a default.
              This handles both <code>NULL</code> and empty strings in one expression.
            </Tip>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 23: String Functions
            =================================================== */}

        <TutorialSection
          id="string-functions"
          title="String Functions"
          description="PostgreSQL provides rich functions for manipulating text right in your queries."
        >
          <SubSection title="Concatenation & Case">
            <CodeBlock>
{`-- Concatenation with ||
SELECT 'Hello ' || 'World';        --> 'Hello World'

-- Case conversion
UPPER(text)      -- UPPERCASE
LOWER(text)      -- lowercase
INITCAP(text)    -- Capitalize First Letter Of Each Word`}
            </CodeBlock>
          </SubSection>

          <SubSection title="String Length & Trimming">
            <SQLRunner
              hint="TRIM() removes whitespace from both ends by default. Use LTRIM() or RTRIM() for one side."
              initialSql={`SELECT
  product_name,
  LENGTH(product_name) AS char_length,
  UPPER(product_name) AS uppercase,
  LOWER(product_name) AS lowercase,
  LEFT(product_name, 5) AS first_5_chars,
  RIGHT(product_name, 3) AS last_3_chars,
  REVERSE(product_name) AS reversed
FROM inventory_items
WHERE LENGTH(product_name) > 10
LIMIT 5;`}
            />
          </SubSection>

          <SubSection title="Substring & Position">
            <SQLRunner
              hint="POSITION() returns the 1-based index of a substring. SUBSTRING() extracts a slice. Both are very fast."
              initialSql={`SELECT
  product_name,
  POSITION(' ' IN product_name) AS first_space_pos,
  SUBSTRING(product_name FROM 1 FOR POSITION(' ' IN product_name) - 1) AS first_word,
  SUBSTRING(product_name FROM POSITION(' ' IN product_name) + 1) AS rest_of_name,
  REPLACE(product_name, ' ', '-') AS slug
FROM inventory_items
ORDER BY product_name;`}
            />
          </SubSection>

          <SubSection title="REGEXP_REPLACE & REGEXP_MATCHES">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              PostgreSQL supports full <strong>POSIX regular expressions</strong> — extremely powerful for data cleaning:
            </p>
            <SQLRunner
              hint="\\d matches digits, \\D matches non-digits. These regex functions are PostgreSQL-specific."
              initialSql={`SELECT
  product_name,
  REGEXP_REPLACE(product_name, '[aeiouAEIOU]', '*', 'g') AS no_vowels,
  REGEXP_REPLACE(product_name, '\\s+', '_', 'g') AS snake_case,
  REGEXP_MATCHES(product_name, '\\d+') AS numbers_found
FROM inventory_items
LIMIT 5;`}
            />
          </SubSection>

          <SubSection title="STRING_AGG — String Aggregation">
            <SQLRunner
              hint="STRING_AGG is PostgreSQL's equivalent of GROUP_CONCAT in MySQL. Very useful for building comma-separated lists."
              initialSql={`SELECT 
  s.name AS supplier,
  STRING_AGG(i.product_name, ', ' ORDER BY i.product_name) AS products_list,
  COUNT(*) AS product_count
FROM inventory_items i
INNER JOIN suppliers s ON i.supplier_id = s.supplier_id
GROUP BY s.name
ORDER BY product_count DESC;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 24: JSON / JSONB Querying
            =================================================== */}

        <TutorialSection
          id="json"
          title="JSON / JSONB — Working with JSON"
          description="PostgreSQL has first-class JSON support. Use JSONB for indexing, querying, and manipulating JSON data."
        >
          <SubSection title="JSON vs JSONB">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <strong>JSON</strong> stores exact text (slower, preserves whitespace). <strong>JSONB</strong> stores
              a parsed binary format (faster, supports indexing). <strong>Always prefer JSONB</strong> for real use cases.
            </p>
          </SubSection>

          <SubSection title="Create & Insert JSONB Data">
            <SQLRunner
              hint="JSONB literals use single quotes. The ::jsonb cast tells PostgreSQL the type explicitly."
              initialSql={`CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events (event_type, payload) VALUES
  ('page_view',  '{"page": "/home", "user_id": 42, "duration_ms": 3200, "metadata": {"browser": "Chrome", "os": "macOS"}}'),
  ('page_view',  '{"page": "/products", "user_id": 42, "duration_ms": 8400, "metadata": {"browser": "Chrome", "os": "macOS"}}'),
  ('click',      '{"element": "buy-button", "user_id": 7, "product_id": 101, "metadata": {"source": "email"}}'),
  ('purchase',   '{"user_id": 7, "product_id": 101, "amount": 129.99, "currency": "USD"}'),
  ('page_view',  '{"page": "/about", "user_id": 99, "duration_ms": 1200, "metadata": {"browser": "Firefox", "os": "Linux"}}'),
  ('page_view',  '{"page": "/home", "user_id": 7, "duration_ms": 2100, "metadata": {"browser": "Safari", "os": "macOS"}}'),
  ('signup',     '{"user_id": 99, "source": "organic", "metadata": {"referrer": "google.com", "campaign": "spring2024"}}'),
  ('purchase',   '{"user_id": 42, "product_id": 205, "amount": 79.99, "currency": "USD", "metadata": {"coupon": "SAVE10"}}');`}
            />
          </SubSection>

          <SubSection title="Extracting JSON Fields — -> and ->>">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>{`->`}</code> extracts a field as JSONB. <code>{`->>`}</code> extracts as text. Use <code>{`->>`}</code> 99% of the time:
            </p>
            <CodeBlock>
{`-- Extract as text (most common)
payload->>'field_name'

-- Nested access with #>>
payload#>'{metadata,browser}'::text[]`}
            </CodeBlock>
            <SQLRunner
              hint="The ->> operator returns text, which you can then cast (::numeric, ::integer, ::timestamp) if needed."
              initialSql={`SELECT 
  event_id,
  event_type,
  payload->>'page' AS page,
  payload->>'user_id' AS user_id,
  payload->>'duration_ms' AS duration,
  payload#>'{metadata,browser}' AS browser
FROM events
WHERE payload ? 'page'
ORDER BY event_id;`}
            />
          </SubSection>

          <SubSection title="Filtering with JSONB">
            <SQLRunner
              hint="PostgreSQL supports GIN indexes on JSONB columns for fast querying. Use: CREATE INDEX idx_events_payload ON events USING GIN (payload);"
              initialSql={`SELECT 
  event_id,
  event_type,
  payload->>'page' AS page,
  payload->>'duration_ms' AS duration
FROM events
WHERE event_type = 'page_view'
  AND (payload->>'page') = '/home'
  AND (payload->>'duration_ms')::INTEGER > 1000;`}
            />
          </SubSection>

          <SubSection title="JSONB Aggregation">
            <SQLRunner
              hint="jsonb_agg() and jsonb_build_object() are PostgreSQL-specific JSON aggregation functions, extremely useful for API responses."
              initialSql={`SELECT 
  event_type,
  COUNT(*) AS event_count,
  jsonb_agg(
    jsonb_build_object(
      'event_id', event_id,
      'payload', payload,
      'created_at', created_at
    )
  ) AS all_events
FROM events
GROUP BY event_type
ORDER BY event_count DESC;`}
            />
          </SubSection>

          <SubSection title="Modifying JSONB — jsonb_set">
            <SQLRunner
              hint="jsonb_set(payload, '{path}', new_value) updates a nested JSONB value immutably — it returns a new object."
              initialSql={`UPDATE events
SET payload = jsonb_set(
  payload,
  '{processed}',
  'true'::jsonb
)
WHERE event_type = 'click'
RETURNING event_id, payload;`}
            />
            <Tip>
              JSONB is one of PostgreSQL&apos;s biggest advantages over other databases. You can combine
              relational queries with JSON document queries in the same statement. Use <strong>GIN indexes</strong> 
              with <code>jsonb_path_ops</code> for production JSONB querying performance.
            </Tip>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 25: Window Functions
            =================================================== */}

        <TutorialSection
          id="window-functions"
          title="Window Functions"
          description="Compute values across related rows without collapsing them with GROUP BY. Think: 'GROUP BY, but keep every row'."
        >
          <SubSection title="Window Function Anatomy">
            <CodeBlock>
{`SELECT 
  column,
  SUM(column) OVER (PARTITION BY category ORDER BY date) AS running_total
FROM table_name;`}
            </CodeBlock>
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>PARTITION BY</code> divides rows into groups (like GROUP BY but does not collapse).
              <code>ORDER BY</code> defines the sequence within each partition.
            </p>
          </SubSection>

          <SubSection title="ROW_NUMBER, RANK, DENSE_RANK">
            <SQLRunner
              hint="ROW_NUMBER always produces unique numbers. RANK skips on ties (1,2,2,4). DENSE_RANK doesn't skip (1,2,2,3)."
              initialSql={`SELECT 
  product_name,
  price,
  c.name AS category,
  ROW_NUMBER() OVER (PARTITION BY i.category_id ORDER BY price DESC) AS row_num,
  RANK() OVER (PARTITION BY i.category_id ORDER BY price DESC) AS rank,
  DENSE_RANK() OVER (PARTITION BY i.category_id ORDER BY price DESC) AS dense_rank
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
ORDER BY c.name, price DESC;`}
            />
          </SubSection>

          <SubSection title="Running Totals & Moving Averages">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              Cumulative and sliding window calculations — essential for financial and time-series data:
            </p>
            <SQLRunner
              hint="ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW gives a running total. Change the frame for different windows."
              initialSql={`CREATE TABLE IF NOT EXISTS orders_log (
  order_id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL,
  order_date DATE NOT NULL
);

INSERT INTO orders_log (amount, order_date) VALUES
  (150.00, '2024-01-15'), (220.00, '2024-01-20'),
  (340.00, '2024-02-05'), (180.00, '2024-02-18'),
  (420.00, '2024-03-01'), (290.00, '2024-03-15'),
  (510.00, '2024-04-02'), (380.00, '2024-04-22');

SELECT 
  order_id,
  amount,
  order_date,
  SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
  ROUND(AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3
FROM orders_log
ORDER BY order_date;`}
            />
          </SubSection>

          <SubSection title="LAG & LEAD — Look Behind and Ahead">
            <SQLRunner
              hint="LAG(col, 1, 0) means: look 1 row back, default 0 if no previous row. LEAD looks forward. Both optionally take a PARTITION BY."
              initialSql={`SELECT 
  order_id,
  amount,
  order_date,
  LAG(amount, 1, 0) OVER (ORDER BY order_date) AS prev_amount,
  amount - LAG(amount, 1, 0) OVER (ORDER BY order_date) AS change_from_prev,
  LEAD(amount, 1, 0) OVER (ORDER BY order_date) AS next_amount,
  CASE 
    WHEN amount > LAG(amount, 1) OVER (ORDER BY order_date) THEN 'Up '
    WHEN amount = LAG(amount, 1) OVER (ORDER BY order_date) THEN 'Flat'
    ELSE 'Down'
  END AS trend
FROM orders_log
ORDER BY order_date;`}
            />
          </SubSection>

          <SubSection title="FIRST_VALUE, LAST_VALUE, NTH_VALUE">
            <SQLRunner
              hint="These functions let you see the first/last/nth value in a window without joins or subqueries."
              initialSql={`SELECT 
  i.product_name,
  i.price,
  c.name AS category,
  FIRST_VALUE(i.product_name) OVER (PARTITION BY i.category_id ORDER BY i.price) AS cheapest_product,
  LAST_VALUE(i.product_name) OVER (
    PARTITION BY i.category_id ORDER BY i.price
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS most_expensive_product
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
ORDER BY c.name, i.price;`}
            />
          </SubSection>

          <SubSection title="PERCENT_RANK, NTILE">
            <SQLRunner
              hint="PERCENT_RANK = (rank - 1) / (rows - 1). NTILE(n) divides rows into n roughly equal buckets. 1 = best/top."
              initialSql={`SELECT 
  product_name,
  price,
  stock,
  ROUND(PERCENT_RANK() OVER (ORDER BY price) * 100, 1) AS price_percentile,
  NTILE(4) OVER (ORDER BY stock DESC) AS stock_quartile
FROM inventory_items
ORDER BY price;`}
            />
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 26: Set Operations
            =================================================== */}

        <TutorialSection
          id="set-operations"
          title="Set Operations — UNION, INTERSECT, EXCEPT"
          description="Combine results from multiple queries like mathematical sets."
        >
          <SubSection title="UNION — Combine Results">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>UNION</code> stacks two result sets, removing duplicates. <code>UNION ALL</code> keeps duplicates (faster):
            </p>
            <SQLRunner
              hint="UNION ALL keeps all rows. UNION removes duplicates (slower, sorts internally). UNION ALL is almost always what you want unless dedup is needed."
              initialSql={`SELECT product_name, price, 'Products' AS source
FROM products
WHERE price > 100

UNION ALL

SELECT product_name, price, 'Inventory' AS source
FROM inventory_items
WHERE price > 100

ORDER BY price DESC;`}
            />
          </SubSection>

          <SubSection title="INTERSECT — Common to Both">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>INTERSECT</code> returns rows that appear in <strong>both</strong> queries:
            </p>
            <SQLRunner
              hint="The two queries must have the same number of columns with compatible types."
              initialSql={`SELECT supplier_id FROM inventory_items WHERE stock > 100
INTERSECT
SELECT supplier_id FROM inventory_items WHERE price > 50;`}
            />
          </SubSection>

          <SubSection title="EXCEPT — In First Query but Not Second">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              <code>EXCEPT</code> returns rows from the first query that do <strong>not</strong> appear in the second:
            </p>
            <SQLRunner
              hint="EXCEPT is like a set subtraction. Very useful for 'which rows in A are NOT in B' type questions."
              initialSql={`-- Suppliers that have high-priced items, but not low-stock items
(SELECT s.name AS supplier_name
 FROM inventory_items i
 INNER JOIN suppliers s ON i.supplier_id = s.supplier_id
 WHERE i.price > 50)

EXCEPT

(SELECT s.name
 FROM inventory_items i
 INNER JOIN suppliers s ON i.supplier_id = s.supplier_id
 WHERE i.stock < 50)

ORDER BY supplier_name;`}
            />
          </SubSection>

          <SubSection title="Set Operations with Aggregation">
            <SQLRunner
              hint="Combine set operations with CTEs and aggregation for powerful data analysis pipelines."
              initialSql={`WITH high_value AS (
  SELECT supplier_id, '$$$' AS tag
  FROM inventory_items WHERE price > 100
),
low_stock AS (
  SELECT supplier_id, 'LOW' AS tag
  FROM inventory_items WHERE stock < 50
)
SELECT supplier_id FROM high_value
UNION
SELECT supplier_id FROM low_stock
ORDER BY supplier_id;`}
            />
            <InfoBox>
              Rules for set operations:
              <ul className="list-disc ml-5 mt-1">
                <li>All queries must have the same number of columns</li>
                <li>Column data types must be compatible across queries</li>
                <li>ORDER BY can only appear at the end of the entire statement</li>
                <li>UNION/INTERSECT/EXCEPT binds weaker than parenthesized CTEs — use parentheses for clarity</li>
              </ul>
            </InfoBox>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 27: Views
            =================================================== */}

        <TutorialSection
          id="views"
          title="Views — Saved Queries as Virtual Tables"
          description="Create reusable, named queries that behave like tables — simplify complex queries and control data access."
        >
          <SubSection title="What is a View?">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A <strong>view</strong> is a saved SQL query that you can reference by name — like a virtual table.
              The view does not store data; it runs the underlying query every time you access it.
            </p>
            <CodeBlock>
{`CREATE VIEW view_name AS
  SELECT columns FROM tables
  WHERE conditions;`}
            </CodeBlock>
          </SubSection>

          <SubSection title="Creating a Simple View">
            <SQLRunner
              hint="After creating the view, you can SELECT from it like a regular table. The view's data is always live."
              initialSql={`CREATE OR REPLACE VIEW v_inventory_summary AS
SELECT 
  i.product_name,
  i.price,
  i.stock,
  c.name AS category,
  s.name AS supplier,
  s.country,
  CASE 
    WHEN i.stock < 50 THEN 'Reorder!' 
    WHEN i.stock > 200 THEN 'Overstocked'
    ELSE 'OK'
  END AS stock_status
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
INNER JOIN suppliers s ON i.supplier_id = s.supplier_id;

SELECT * FROM v_inventory_summary
WHERE stock_status = 'Reorder!'
ORDER BY stock ASC;`}
            />
          </SubSection>

          <SubSection title="Materialized Views">
            <p className="text-zinc-700 dark:text-zinc-300 mb-3">
              A <strong>materialized view</strong> <em>does</em> store data — like a snapshot of the query result.
              You must <strong>refresh</strong> it manually. Great for expensive queries that do not need real-time data:
            </p>
            <SQLRunner
              hint="REFRESH MATERIALIZED VIEW recomputes the data. Use this pattern for dashboards and reports."
              initialSql={`CREATE MATERIALIZED VIEW IF NOT EXISTS mv_category_stats AS
SELECT 
  c.name AS category,
  COUNT(*) AS item_count,
  ROUND(AVG(i.price), 2) AS avg_price,
  SUM(i.stock) AS total_stock,
  MAX(i.price) AS max_price,
  MIN(i.price) AS min_price
FROM inventory_items i
INNER JOIN categories c ON i.category_id = c.category_id
GROUP BY c.name
ORDER BY avg_price DESC;

SELECT * FROM mv_category_stats;`}
            />
            <Tip>
              Use <strong>views</strong> for simplified access (security, readability). Use <strong>materialized views</strong>
              for precomputed aggregations (performance). Materialized views can have indexes — regular views cannot.
              Refresh: <code>REFRESH MATERIALIZED VIEW CONCURRENTLY mv_name;</code> (requires a unique index).
            </Tip>
          </SubSection>
        </TutorialSection>

        {/* ===================================================
            SECTION 28: DROP TABLE
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
