import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip, InfoBox } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function KeysPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Keys & Constraints</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Primary keys, foreign keys, and managing constraints.</p>
      </div>

      <TutorialSection id="primary-key" title="Primary Keys — Create & Alter" description="A primary key uniquely identifies each row. Every table should ideally have one.">
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

      <TutorialSection id="foreign-key" title="Foreign Keys — Create & Alter" description="A foreign key links one table to another, enforcing referential integrity.">
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

      <TutorialSection id="drop-constraint" title="Drop Constraints" description="Remove constraints by name when they are no longer needed.">
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
    </div>
  );
}
