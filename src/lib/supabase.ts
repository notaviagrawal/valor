import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://orgqaidldmwuxwcjdfdh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ3FhaWRsZG13dXh3Y2pkZmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMjA4MjksImV4cCI6MjA3NDU5NjgyOX0.7iYLriglOfGRhkFHPj6IDd6VX-5EZEcqg2lUzltYyJg'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database schema types
export interface ProductData {
  id?: number
  product_name: string
  price: number
  store_id: string
  country: string
  selected_product: string
  user_id: string
  created_at?: string
}

export interface CountryProducts {
  country: string
  products: string[]
}
