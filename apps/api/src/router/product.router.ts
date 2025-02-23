import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateCreateProduct, validateUpdateProduct, validateUpdateStock } from '../validators/product.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

// Public routes
router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProduct.bind(productController));

// Protected routes
router.use(authenticate);

// Admin only routes
router.post(
  '/',
  requireRole([UserRole.admin]),
  validateCreateProduct,
  productController.createProduct.bind(productController)
);

router.put(
  '/:id',
  requireRole([UserRole.admin]),
  validateUpdateProduct,
  productController.updateProduct.bind(productController)
);

router.delete(
  '/:id',
  requireRole([UserRole.admin]),
  productController.deleteProduct.bind(productController)
);

router.patch(
  '/:id/stock',
  requireRole([UserRole.admin]),
  validateUpdateStock,
  productController.updateStock.bind(productController)
);

export default router;