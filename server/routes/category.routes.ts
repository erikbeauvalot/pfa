// FILE: server/routes/category.routes.ts
import express from 'express';
import { categoryController } from '../controllers/category.controller';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.delete('/:categoryId', categoryController.deleteCategory);
router.put('/:categoryId', categoryController.updateCategory);

export default router;