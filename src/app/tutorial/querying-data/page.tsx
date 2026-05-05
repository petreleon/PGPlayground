import { sharedSeedSql } from "@/lib/tutorial-seed";
import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip, Warning, InfoBox } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

const seedSql = sharedSeedSql;

export default function QueryingDataPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Querying Data</h1>
        <p className="text-zinc-600 dark:text-zinc-400">SELECT, WHERE, JOINs, aggregation, subqueries, and CTEs.</p>
      </div>

      <TutorialSection id="select" title="SELECT — Retrieving Data" description="The most used SQL statement. SELECT retrieves data from your tables.">
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

      <TutorialSection id="where" title="WHERE — Filtering Data" description="Narrow down your results to only the rows you care about.">
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

      <TutorialSection id="order-by" title="ORDER BY & LIMIT" description="Sort your results and restrict how many rows you get back.">
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

      <TutorialSection id="joins" title="JOINs — Combining Tables" description="JOINs are the heart of relational databases. They let you query data from multiple tables together.">
        <SubSection title="Seed Data: Create Related Tables">
          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Before we explore JOINs, let&apos;s create some properly related tables. Run all of the SQL below:
          </p>
          <SQLRunner
            hint="Run this block first, then the exercises below will work."
            initialSql={seedSql}
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

      <TutorialSection id="group-by" title="GROUP BY — Aggregation" description="Summarize data by grouping rows and applying aggregate functions.">
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

      <TutorialSection id="subqueries" title="Subqueries & CTEs" description="Write queries inside queries and use Common Table Expressions (WITH) for complex data retrieval.">
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
    </div>
  );
}
