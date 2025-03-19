import express from 'express'
import { authorizeRoles } from '../middlewares/authorizedRole'
import { addProduct, getCategories, getSubcategories } from '../controllers/product.controller'

const productRouter = express.Router()

productRouter.get('/get-categories', authorizeRoles('seller'), getCategories)
productRouter.get('/get-subcategories/:id', authorizeRoles('seller'), getSubcategories)
productRouter.post('/add-product', authorizeRoles('seller'), addProduct)

export default productRouter
