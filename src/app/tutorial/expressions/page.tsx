import { SQLRunner } from "@/components/sql-runner";
import { TutorialSection, CodeBlock, Tip } from "@/components/tutorial-section";
import { SubSection } from "@/components/tutorial-section";

export default function ExpressionsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">SQL Expressions</h1>
        <p className="text-zinc-600 dark:text-zinc-400">CASE, COALESCE, NULLIF, string functions, and JSON/JSONB.</p>
      </div>

      <TutorialSection id="case" title="CASE — Conditional Logic" description="Add if/then/else logic directly in your SQL queries.">
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

      <TutorialSection id="coalesce" title="COALESCE & NULLIF — NULL Handling" description="PostgreSQL functions for gracefully handling NULL values and avoiding division-by-zero.">
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

      <TutorialSection id="string-functions" title="String Functions" description="PostgreSQL provides rich functions for manipulating text right in your queries.">
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

      <TutorialSection id="json" title="JSON / JSONB — Working with JSON" description="PostgreSQL has first-class JSON support. Use JSONB for indexing, querying, and manipulating JSON data.">
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
            hint="PostgreSQL supports GIN indexes on JSONB columns for fast querying."
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
            hint="jsonb_agg() and jsonb_build_object() are PostgreSQL-specific JSON aggregation functions."
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
            hint="jsonb_set(payload, '{path}', new_value) updates a nested JSONB value immutably."
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
    </div>
  );
}
