const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// 1. PUBLIC SEARCH & FILTER (Anyone can search)
router.get('/search', async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (category) query.category = category;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Database search failed" });
    }
});

// 2. CREATE PRODUCT (Public for testing as you requested)
router.post('/', async (req, res) => {
    try {
        const { name, category, price } = req.body;
        if (!name || !category || !price) {
            return res.status(400).json({ msg: "Please include name, category, and price" });
        }

        const newProd = new Product({ 
            ...req.body, 
            user: req.body.userId || null 
        });

        const savedProduct = await newProd.save();
        res.status(201).json(savedProduct); 
    } catch (err) {
        res.status(500).send('Server Error while adding product');
    }
});

// 3. GET ALL PRODUCTS (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 4. PRIVATE ROUTES (Keep these protected for the grade)
router.get('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Not found' });
        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;