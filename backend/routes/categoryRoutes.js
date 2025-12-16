const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategoryId,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../models/categoryModel');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const subcategories = await getSubcategoriesByCategoryId(category.id);
    
    res.json({
      category,
      subcategories
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    const category = await createCategory({ name, description, icon });
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Category with this name already exists' });
    }
    next(error);
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, is_active } = req.body;
    
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const category = await updateCategory(id, { name, description, icon, is_active });
    
    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Category with this name already exists' });
    }
    next(error);
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await deleteCategory(id);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/subcategories', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { category_id, name, description } = req.body;
    
    if (!category_id || !name) {
      return res.status(400).json({ message: 'Category ID and name are required' });
    }
    
    const category = await getCategoryById(category_id);
    if (!category) {
      return res.status(404).json({ message: 'Parent category not found' });
    }
    
    const subcategory = await createSubcategory({ category_id, name, description });
    
    res.status(201).json({
      message: 'Subcategory created successfully',
      subcategory
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Subcategory with this name already exists' });
    }
    next(error);
  }
});

router.put('/subcategories/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, is_active } = req.body;
    
    const existingSubcategory = await getSubcategoryById(id);
    if (!existingSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    if (category_id) {
      const category = await getCategoryById(category_id);
      if (!category) {
        return res.status(404).json({ message: 'Parent category not found' });
      }
    }
    
    const subcategory = await updateSubcategory(id, { name, description, category_id, is_active });
    
    res.json({
      message: 'Subcategory updated successfully',
      subcategory
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Subcategory with this name already exists' });
    }
    next(error);
  }
});

router.delete('/subcategories/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingSubcategory = await getSubcategoryById(id);
    if (!existingSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    await deleteSubcategory(id);
    
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
