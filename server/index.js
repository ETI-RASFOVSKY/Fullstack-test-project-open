const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
app.get('/api/products', (req, res) => {
    try {
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// POST /api/products - add a new product
app.post('/api/products', (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: 'Name and category are required' });
        }

        const newProduct = {
            id: String(products.length + 1),
            name: name.trim(),
            category: category.trim(),
            createdAt: new Date()
        };

        products.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
