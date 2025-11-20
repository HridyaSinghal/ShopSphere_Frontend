import React, { useEffect, useState } from 'react';
import './ShopOwnerDashboard.css';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Utility to decode JWT (base64 decode payload)
function parseJwt(token) {
  if (!token) return {};
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log(e)
  }
}

const ShopOwnerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    price: '',
    quantity: '',
    productImg: '',
    productDetails: '',
    category: '',
  });
  const [copySuccess, setCopySuccess] = useState('');
  const [activeSection, setActiveSection] = useState('view'); // 'add', 'view', or 'analytics'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get JWT and decode shop info
  const token = localStorage.getItem('shopOwnerToken');
  const jwtPayload = parseJwt(token);
  const shopName = jwtPayload.shopName || 'Your Shop';
  const shopLink = jwtPayload.storeLink || jwtPayload.link || '';

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://shopspherebackend.up.railway.app/api/shop/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  // Handle product creation
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shopspherebackend.up.railway.app/api/shop/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error('Failed to create product');
      setNewProduct({ productName: '', price: '', quantity: '', productImg: '', productDetails: '', category: '' });
      // Refresh products
      const productsRes = await fetch('https://shopspherebackend.up.railway.app/api/shop/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(await productsRes.json());
      setActiveSection('view'); // Switch to view after adding
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle product update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shopspherebackend.up.railway.app/api/shop/update-product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateProduct),
      });
      if (!response.ok) throw new Error('Failed to update product');
      setShowUpdateModal(false);
      setUpdateProduct(null);
      // Refresh products
      const productsRes = await fetch('https://shopspherebackend.up.railway.app/api/shop/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(await productsRes.json());
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle product delete
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`https://shopspherebackend.up.railway.app/api/shop/delete-product/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      // Refresh products
      const productsRes = await fetch('https://shopspherebackend.up.railway.app/api/shop/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(await productsRes.json());
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle copy shop link
  const handleCopy = () => {
    navigator.clipboard.writeText(shopLink);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 1500);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('shopOwnerToken');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="shop-info">
          <div className="shop-name">{shopName}</div>
          {shopLink && (
            <div className="shop-link-box">
              <span className="shop-link-label">Shop Link:</span>
              <span className="shop-link-value">{shopLink}</span>
              <button className="copy-btn" onClick={handleCopy}>Copy</button>
              {copySuccess && <span className="copy-success">{copySuccess}</span>}
            </div>
          )}
        </div>
        <div className="dashboard-nav-btns">
          <button
            className={`dashboard-nav-btn${activeSection === 'add' ? ' active' : ''}`}
            onClick={() => setActiveSection('add')}
          >
            Add Product
          </button>
          <button
            className={`dashboard-nav-btn${activeSection === 'view' ? ' active' : ''}`}
            onClick={() => setActiveSection('view')}  
          >
            View All Products
          </button>
          <button
            className={`dashboard-nav-btn${activeSection === 'analytics' ? ' active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            Analytics
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {activeSection === 'add' && (
        <form className="product-create-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.productName}
            onChange={e => setNewProduct({ ...newProduct, productName: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            required
            min={0}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
            required
            min={1}
          />
          <input
            type="text"
            placeholder="Product Image URL"
            value={newProduct.productImg}
            onChange={e => setNewProduct({ ...newProduct, productImg: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Details"
            value={newProduct.productDetails}
            onChange={e => setNewProduct({ ...newProduct, productDetails: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          />
          <button type="submit">Add Product</button>
        </form>
      )}

      {activeSection === 'view' && (
        <section className="product-list-section">
          <h2>Your Products</h2>
          <div className="category-filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {loading && <div className="dashboard-loading">Loading products...</div>}
          {error && <div className="dashboard-error">{error}</div>}
          <div className="product-grid-container">
            {filteredProducts.map(product => (
              <div className="product-grid-card" key={product.id || product.productId}>
                {product.productImg && (
                  <div className="product-img-wrapper">
                    <img src={product.productImg} alt={product.productName} className="product-img" />
                  </div>
                )}
                <div className="product-info">
                  <div className="product-name">{product.productName}</div>
                  <div className="product-category">{product.category || 'Uncategorized'}</div>
                  <div className="product-row">
                    <div className="product-price">₹{product.price}</div>
                    <div className="product-qty">Qty: {product.quantity}</div>
                  </div>
                  <div className="product-details">{product.productDetails}</div>
                </div>
                <div className="product-actions">
                  <button className="update-btn" onClick={() => { setUpdateProduct(product); setShowUpdateModal(true); }}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id || product.productId)}>❌</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeSection === 'analytics' && (
        <section className="dashboard-analytics-section">
          <h2>Shop Analytics</h2>
          <div className="analytics-cards">
            <div className="analytics-card">
              <div className="analytics-label">Total Products</div>
              <div className="analytics-value">{products.length}</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-label">Total Quantity</div>
              <div className="analytics-value">{products.reduce((sum, p) => sum + Number(p.quantity || 0), 0)}</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-label">Total Value</div>
              <div className="analytics-value">₹{products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0)}</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-label">Category Count</div>
              <div className="analytics-value">{Array.from(new Set(products.map(p => p.category).filter(Boolean))).length}</div>
            </div>
          </div>
          {/* Charts Section */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem'}}>
            {/* Bar Chart: Category-wise Stock */}
            <div style={{background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)', padding: '1.5rem', minWidth: 350, maxWidth: 400}}>
              <h3 style={{textAlign: 'center', color: '#4f46e5', fontWeight: 700, marginBottom: 10}}>Category-wise Stock (Bar)</h3>
              <Bar
                data={{
                  labels: Array.from(new Set(products.map(p => p.category).filter(Boolean))),
                  datasets: [{
                    label: 'Stock',
                    data: Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat =>
                      products.filter(p => p.category === cat).reduce((sum, p) => sum + Number(p.quantity || 0), 0)
                    ),
                    backgroundColor: '#6366f1',
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
            {/* Pie Chart: Category-wise Product Count */}
            <div style={{background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)', padding: '1.5rem', minWidth: 350, maxWidth: 400}}>
              <h3 style={{textAlign: 'center', color: '#4f46e5', fontWeight: 700, marginBottom: 10}}>Category-wise Product Count (Pie)</h3>
              <Pie
                data={{
                  labels: Array.from(new Set(products.map(p => p.category).filter(Boolean))),
                  datasets: [{
                    label: 'Product Count',
                    data: Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat =>
                      products.filter(p => p.category === cat).length
                    ),
                    backgroundColor: [
                      '#6366f1', '#818cf8', '#f59e42', '#fb923c', '#22c55e', '#f43f5e', '#0ea5e9', '#a21caf'
                    ],
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
            {/* Line Chart: Category-wise Total Price */}
            <div style={{background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)', padding: '1.5rem', minWidth: 350, maxWidth: 400}}>
              <h3 style={{textAlign: 'center', color: '#4f46e5', fontWeight: 700, marginBottom: 10}}>Category-wise Total Price (Line)</h3>
              <Line
                data={{
                  labels: Array.from(new Set(products.map(p => p.category).filter(Boolean))),
                  datasets: [{
                    label: 'Total Price',
                    data: Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat =>
                      products.filter(p => p.category === cat).reduce((sum, p) => sum + Number(p.price || 0), 0)
                    ),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.2)',
                    tension: 0.4,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </div>
        </section>
      )}

      {showUpdateModal && updateProduct && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdate} className="product-create-form modal-centered-form">
            <input
              type="text"
              placeholder="Product Name"
              value={updateProduct.productName}
              onChange={e => setUpdateProduct({ ...updateProduct, productName: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={updateProduct.price}
              onChange={e => setUpdateProduct({ ...updateProduct, price: e.target.value })}
              required
              min={0}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={updateProduct.quantity}
              onChange={e => setUpdateProduct({ ...updateProduct, quantity: e.target.value })}
              required
              min={1}
            />
            <input
              type="text"
              placeholder="Product Image URL"
              value={updateProduct.productImg}
              onChange={e => setUpdateProduct({ ...updateProduct, productImg: e.target.value })}
            />
            <input
              type="text"
              placeholder="Product Details"
              value={updateProduct.productDetails}
              onChange={e => setUpdateProduct({ ...updateProduct, productDetails: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={updateProduct.category || ''}
              onChange={e => setUpdateProduct({ ...updateProduct, category: e.target.value })}
              required
            />
            <div style={{ display: 'flex', width: '100%', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" style={{ flex: 1 }}>Update</button>
              <button type="button" style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.7rem', fontWeight: 700 }} onClick={() => setShowUpdateModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerDashboard; 