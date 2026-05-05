export const sharedSeedSql = `CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
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
ON CONFLICT (name) DO NOTHING;

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
  ('Headphone Stand', 39.99, 4, 4, 75);`;
