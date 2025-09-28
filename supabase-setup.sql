-- Supabase SQL script to create the product_data table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS product_data (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    store_id TEXT NOT NULL,
    country TEXT NOT NULL,
    selected_product TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on store_id for faster queries
CREATE INDEX IF NOT EXISTS idx_product_data_store_id ON product_data(store_id);

-- Create an index on country for faster queries
CREATE INDEX IF NOT EXISTS idx_product_data_country ON product_data(country);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_product_data_user_id ON product_data(user_id);

-- Create an index on created_at for faster time-based queries
CREATE INDEX IF NOT EXISTS idx_product_data_created_at ON product_data(created_at);
