const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// helper to handle async route handlers and forward errors to the error middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Temporary data store
let products = [
    {
        id: '1',
        name: 'Laptop',
        category: 'Electronics',
        createdAt: new Date(),
    },
    {
        id: '2',
        name: 'Writing Desk',
        category: 'Furniture',
        createdAt: new Date(),
    },
];

// GET /api/products - retrieve all products
app.get('/api/products', asyncHandler(async (req, res) => {
    res.json(products);
}));

// POST /api/products - add a new product
app.post('/api/products', asyncHandler(async (req, res) => {
    const { name, category } = req.body;

    const nameTrim = typeof name === 'string' ? name.trim() : '';
    const categoryTrim = typeof category === 'string' ? category.trim() : '';

    if (!nameTrim || !categoryTrim) {
        return res.status(400).json({ error: 'שם וקטגוריה נדרשים' });
    }

    // allow only letters: English A-Z a-z and Hebrew א-ת (no spaces, numbers or punctuation)
    const lettersOnly = /^[A-Za-z\u05D0-\u05EA]+$/;
    if (!lettersOnly.test(nameTrim) || !lettersOnly.test(categoryTrim)) {
        return res.status(400).json({ error: 'Name and category must contain only letters (no spaces/numbers/characters)' });
    }

    const newProduct = {
        id: String(products.length + 1),
        name: nameTrim,
        category: categoryTrim,
        createdAt: new Date()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
}));

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error handler caught:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Process-level handlers for unhandled errors/rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // In many cases it's safer to exit after an uncaught exception and restart
    process.exit(1);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
