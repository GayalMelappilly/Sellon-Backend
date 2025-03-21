import express from 'express'
import { authorizeRoles } from '../middlewares/authorizedRole'
import { addProduct, getCategories, getSubcategories, getMyProducts} from '../controllers/product.controller'
import { updateAccessToken } from '../controllers/user.controller'

const productRouter = express.Router()

productRouter.get('/get-categories', authorizeRoles('seller'), getCategories)
productRouter.get('/get-subcategories/:id', authorizeRoles('seller'), getSubcategories)
productRouter.post('/add-product', updateAccessToken, authorizeRoles('seller'), addProduct)
productRouter.get('/get-my-products', updateAccessToken, authorizeRoles('seller'), getMyProducts)
// productRouter.put('/edit-my-products/:productId', updateAccessToken, authorizeRoles('seller'), editMyProducts)

export default productRouter
