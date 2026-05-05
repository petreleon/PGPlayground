import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function GettingStartedPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Getting Started</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Create your first PostgreSQL tables and learn about data types.</p>
      </div>

      <TutorialSection id="create-table" title="CREATE TABLE" description="The CREATE TABLE statement is used to create a new table in a database.">
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

      <TutorialSection id="data-types" title="Common PostgreSQL Data Types" description="Understanding data types helps you store information efficiently and correctly.">
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
    </div>
  );
}
