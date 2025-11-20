import React from 'react';
import Home from './Home';
import Card from './Card';
import Needs from './Needs';
import Footer from './Footer';    

import AllShops from './AllShops';
import ShopProducts from './ShopProducts';
import ShopOwnerDashboard from './ShopOwnerDashboard';
import { Routes, Route } from 'react-router-dom';


import CustomerSignUpForm from './CustomerSignUpForm';
import ShopOwnerSignUpForm from './ShopOwnerSignUpForm';
import CustomerLoginForm from './CustomerLoginForm';
import ShopOwnerLoginForm from './ShopOwnerLoginForm';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
            <Route path="/" element={<Card />} />

      <Route path="/" element={<Needs />} />
      <Route path="/" element={<Footer />} />
      <Route path="/all-shops" element={<AllShops />} />
      <Route path="/shop/:shopId/products" element={<ShopProducts />} />
      <Route path="/shop-owner-dashboard" element={<ShopOwnerDashboard />} />
      <Route path="/signup/customer" element={<CustomerSignUpForm />} />
      <Route path="/signup/shopowner" element={<ShopOwnerSignUpForm />} />
      <Route path="/login/customer" element={<CustomerLoginForm />} />
      <Route path="/login/shopowner" element={<ShopOwnerLoginForm />} />

    </Routes>
  );
}

export default App;
