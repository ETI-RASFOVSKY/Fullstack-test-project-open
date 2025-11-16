import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // API base URL
    const API_URL = 'http://localhost:5000/api';

    // Fetch products from the server
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setError('');
            } catch (err) {
                setError('Error loading products: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add a new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        if (!newProduct.name.trim() || !newProduct.category.trim()) {
            setError('Please fill in both name and category');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newProduct.name.trim(),
                    category: newProduct.category.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add product');
            }

            const addedProduct = await response.json();
            setProducts(prev => [...prev, addedProduct]);
            setNewProduct({ name: '', category: '' });
        } catch (err) {
            setError('Error adding product: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Date formatting function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    };

    return (
        <div className="app-container">
            <h1>Product List</h1>

            {/* Display errors */}
            {error && <div className="error">{error}</div>}

            {/* Form to add a product */}
            <form className="product-form" onSubmit={handleAddProduct}>
                <h2>Add New Product</h2>
                <div className="form-group">
                    <label htmlFor="name">Product Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={newProduct.name} 
                        onChange={handleInputChange}
                        placeholder="Enter product name" 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input 
                        type="text" 
                        id="category" 
                        name="category" 
                        value={newProduct.category} 
                        onChange={handleInputChange}
                        placeholder="Enter category" 
                    />
                </div>
                <button type="submit" className="btn-add" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
            </form>

            {/* Products List Display */}
            <div className="products-container">
                <h2>Existing Products</h2>
                {loading && products.length === 0 ? (
                    <p>Loading products...</p>
                ) : products.length === 0 ? (
                    <p>No products yet. Add your first product above.</p>
                ) : (
                    <div className="products-list">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <h3>{product.name}</h3>
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Created:</strong> {formatDate(product.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
