
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShopProducts.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag'; // Replace with your Razorpay test key
const ShopProducts = () => {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // [{product, quantity}]
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const shopsResponse = await fetch('https://shopspherebackend.up.railway.app/api/public/all-shops');
        if (!shopsResponse.ok) throw new Error('Failed to fetch shop information');
        const shops = await shopsResponse.json();
        const currentShop = shops.find(shop => shop.shopId === parseInt(shopId));
        if (!currentShop) throw new Error('Shop not found');
        setShopInfo(currentShop);
        const productsResponse = await fetch(`https://shopspherebackend.up.railway.app/api/public/shop/${shopId}/products`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (shopId) fetchShopProducts();
  }, [shopId]);

  // Razorpay script loader
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleBackToShops = () => { navigate('/all-shops'); };
  const handleLogout = () => { localStorage.removeItem('userToken'); navigate('/'); };

  // Add to cart logic
  const handleAddToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.product.id === product.id || item.product.pro_id === product.pro_id);
      const availableQty = parseInt(product.quantity) || 0;
      if (found) {
        if (found.quantity >= 5) {
          alert('You cannot purchase more than 5 of this item at a time.');
          return prev;
        }
        if (found.quantity + 1 > availableQty) {
          alert('Not enough stock available.');
          return prev;
        }
        return prev.map(item =>
          (item.product.id === product.id || item.product.pro_id === product.pro_id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (availableQty < 1) {
          alert('Not enough stock available.');
          return prev;
        }
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Razorpay payment handler
  const handlePay = () => {
      const options = {
      key: RAZORPAY_KEY,
      amount: cartTotal * 100, // in paise
        currency: 'INR',
      name: shopInfo?.shopName || 'ShopShere',
      description: 'ShopShere Purchase',
      handler: async function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // For each item in cart, update quantity in backend using public endpoint
        for (const item of cart) {
          const product = item.product;
          const newQuantity = (parseInt(product.quantity) || 0) - item.quantity;
          // Ensure shop field is present for backend update
          const updatedProduct = { ...product, quantity: newQuantity.toString(), shop: { shop_id: shopId } };
          await fetch('https://shopspherebackend.up.railway.app/api/public/purchase-product', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
          });
        }
        setCart([]); // Clear cart on success
        // Optionally, refresh products list
            window.location.reload();
        },
        prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: { color: '#6366f1' }
    };
      const rzp = new window.Razorpay(options);
      rzp.open();
  };

  if (loading) return <div className="p-10 text-center">Loading shop products...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!products || products.length === 0) return <div className="p-10 text-center">No products found for this shop.</div>;

  return (
    <div className="shop-products-container">
      {/* Navbar */}
      <nav className="shop-navbar">
        <div className="navbar-left">
          <span className="navbar-shop-name">{shopInfo?.shopName}</span>
          </div>
        <div className="navbar-right">
          <button className="navbar-btn" onClick={handleBackToShops}>View Shops</button>
          <button className="navbar-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="products-section">
        <h2 className="products-title">Available Products</h2>
        <div className="products-grid-row">
          {products.map((product) => (
            <div className="product-card" key={product.pro_id || product.id}>
              {product.productImg && (
                <div className="product-image">
                  <img 
                    src={product.productImg} 
                    alt={product.productName}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.productName}</h3>
                {product.weight && (
                  <div className="product-weight">{product.weight}</div>
                )}
                <div className="product-swadeshi-price">
                  <span className="swadeshi-label">Price</span>
                  <span className="swadeshi-price">₹{product.price}</span>
                    </div>
                    <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add
                    </button>
                  </div>
                </div>
              ))}
        </div>
          </div>

      {/* Cart summary and Pay button */}
      {cart.length > 0 && (
        <div className="cart-summary">
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.product.id || item.product.pro_id} className="cart-item">
                <span>{item.product.productName} x {item.quantity}</span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="cart-total-row">
            <span className="cart-total-label">Total:</span>
            <span className="cart-total-value">₹{cartTotal}</span>
          </div>
          <button className="pay-bill-btn" onClick={handlePay}>Pay the Bill</button>
        </div>
      )}

      {/* Footer */}
      <footer className="shop-footer">
        <div className="footer-owner">Shop Owner: {shopInfo?.shopOwnerName}</div>
        <div className="footer-copyright">&copy; {new Date().getFullYear()} ShopShere. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default ShopProducts;
