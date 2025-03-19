import { Request, Response } from "express"
import { ProductModel } from "../models/product.model"
import client from "../config/database"
import { addProductQuery, getCategoriesQuery, getSubcategoriesQuery } from "../query/product.query"

export const addProduct = async (req: Request, res: Response) => {
    const productDetails: ProductModel = req.body
    console.log(productDetails)
    try{
        await client.query(addProductQuery, [
            productDetails.name,
            productDetails.description,
            productDetails.price,
            productDetails.discount_price,
            productDetails.stock_quantity,
            productDetails.category_id,
            productDetails.brand,
            productDetails.sku,
            productDetails.weight,
            productDetails.dimensions,
            productDetails.color,
            productDetails.size,
            productDetails.material,
            productDetails.condition,
            productDetails.status,
            productDetails.image_urls,
            productDetails.rating,
            productDetails.total_reviews,
            productDetails.sold_count
        ])
        res.status(201).json({
            success: true,
            message: 'Product added'
        })
        return;
    }catch(err){
        res.status(401).json({
            success: false,
            message: 'Error while adding new product'
        })
    }
    
}

export const getCategories = async (req: Request, res: Response):Promise<void> => {
    try {
        const categories = await client.query(getCategoriesQuery)
        res.status(200).json({
            success: true,
            categories: categories.rows
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Error while fetching categories'
        })
    }
}

export const getSubcategories = async (req: Request, res: Response):Promise<void> => {
    const id = req.params.id

    try{
        const categories = await client.query(getSubcategoriesQuery, [
            id
        ])
        if (categories.rows.length === 0) {
            res.status(200).json({
                success: false,
                message: 'Base category'
            })
            return;
        }
        res.status(200).json({
            success: true,
            categories: categories.rows
        })
        return;
    }catch(err){
        res.status(401).json({
            success: false,
            message: "Error while fetching categories"
        })
        return;
    }

}