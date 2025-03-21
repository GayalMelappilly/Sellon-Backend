import { Request, Response } from "express"
import { ProductModel } from "../models/product.model"
import client from "../config/database"
import { addProductQuery, getCategoriesQuery, getMyProductsQuery, getSubcategoriesQuery } from "../query/product.query"
import { getUserCache } from "../utils/redis"

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

export const addProduct = async (req: Request, res: Response) => {
    
    const productDetails = req.body as ProductModel
    const user = await getUserCache(req.cookies.access_token)
    const sellerDetails = {
        id: user.id,
        name: user.first_name.concat(" "+user.last_name),
        avatar: user.avatar
    }
    // console.log(productDetails, sellerDetails)
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
            productDetails.sold_count,
            sellerDetails
        ])
        res.status(201).json({
            success: true,
            message: 'Product added'
        })
        return;
    }catch(err){
        console.log("ERROR : ",err)
        res.status(401).json({
            success: false,
            message: 'Error while adding new product'
        })
    }
    
}

export const getMyProducts = async(req: Request, res: Response) => {
    const user = await getUserCache(req.cookies.access_token)
    const userId = user.id

    try {
        const products = await client.query(getMyProductsQuery, [
            userId
        ])
        res.status(200).json({
            success: true,
            products: products.rows,
            message: 'Fetched my products'
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            message: 'Error while fetching my products'
        })
    }
}

// export const editMyProducts = async (req: Request, res: Response) => {
//     const user = await getUserCache(req.cookies.access_token)
//     const userId = user.id

// }