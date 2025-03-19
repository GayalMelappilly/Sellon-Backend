// Get the top-level categories
export const getCategoriesQuery = `
    SELECT * FROM categories WHERE parent_id IS NULL;
`

// Get sub-categories of the product
export const getSubcategoriesQuery = `
    SELECT * FROM categories WHERE parent_id = $1;
`

export const addProductQuery = `
      INSERT INTO products 
      (name, description, price, discount_price, stock_quantity, category_id, brand, sku, weight, dimensions, color, size, material, condition, status, image_urls, rating, total_reviews, sold_count, seller_details)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *;
`