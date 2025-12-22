CREATE TABLE products (
    id SERIAL PRIMARY KEY,           
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0 CHECK (quantity >= 0), 
    img VARCHAR(255)
);