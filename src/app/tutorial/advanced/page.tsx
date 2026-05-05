import { sharedSeedSql } from "@/lib/tutorial-seed";
import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip, InfoBox } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function AdvancedPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Advanced</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Transactions, window functions, set operations, and views.</p>
      </div>

      <TutorialSection id="setup" title="Setup Demo Data" description="These examples use tables from the Querying Data section. Run this once if they don't exist yet.">
        <SQLRunner
          hint="Creates categories, suppliers, and inventory_items with sample data."
          initialSql={sharedSeedSql}
        />
      </TutorialSection>

      <TutorialSection id="transactions" title="Transactions — BEGIN, COMMIT, ROLLBACK" description="Group multiple statements into an atomic unit that either all succeed or all fail.">
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
  name VARCHAR(100) NOT NULL UNIQUE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0
);

INSERT INTO accounts (name, balance) VALUES
  ('Alice', 1000.00),
  ('Bob', 500.00)
ON CONFLICT (name) DO NOTHING;

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

      <TutorialSection id="window-functions" title="Window Functions" description="Compute values across related rows without collapsing them with GROUP BY. Think: 'GROUP BY, but keep every row'.">
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

      <TutorialSection id="set-operations" title="Set Operations — UNION, INTERSECT, EXCEPT" description="Combine results from multiple queries like mathematical sets.">
        <SubSection title="UNION — Combine Results">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            <code>UNION</code> stacks two result sets, removing duplicates. <code>UNION ALL</code> keeps duplicates (faster):
          </p>
          <SQLRunner
            hint="UNION ALL keeps all rows. UNION removes duplicates (slower, sorts internally)."
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

      <TutorialSection id="views" title="Views — Saved Queries as Virtual Tables" description="Create reusable, named queries that behave like tables — simplify complex queries and control data access.">
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
    </div>
  );
}
