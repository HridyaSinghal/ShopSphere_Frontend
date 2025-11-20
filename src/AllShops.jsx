import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper function to decode JWT
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
    console.log(e);
  }
}

// ShopCard Component
const ShopCard = ({ shop }) => {
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const shopId = shop.shopId; // use backend DTO field
    const link = `${window.location.origin}/shop/${shopId}/products`;
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link.');
    }
  };

  return (
    <div className="flex flex-1 gap-4 rounded-xl border bg-white p-4 items-center shop-card transition-all duration-200 ease-in-out">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-12 h-12 shrink-0"
        style={{ backgroundImage: `url(${shop.image || 'https://via.placeholder.com/50'})` }}
      ></div>
      <div className="flex flex-col justify-center flex-grow">
        <h3>{shop.shopName}</h3>
        <div className="flex items-center mt-1">
          <Link
            to={`/shop/${shop.shopId}/products`}
            className="text-blue-600 text-xs break-all mr-2 hover:underline"
          >
            {`${window.location.origin}/shop/${shop.shopId}/products`}
          </Link>
          <button
            onClick={handleCopyLink}
            className="bg-blue-500 text-white py-0.5 px-2 rounded text-xs hover:bg-blue-600 transition-colors duration-200"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const AllShops = () => {
  const [shops, setShops] = useState([]);
  const [query, setQuery] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [fullName, setFullName] = useState('');
  const [userArea, setUserArea] = useState('');
  const [filteredShops, setFilteredShops] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  // Fetch shops from API
  const fetchShops = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/public/all-shops`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allShops = response.data;

      setShops(allShops);

      const jwt = parseJwt(token);
      const customerAddress = jwt.address ? jwt.address.trim().toLowerCase() : '';

      const filtered = allShops.filter((shop) => {
        const shopAddr = (shop.shopOwnerAddress || '').trim().toLowerCase();
        if (!customerAddress || !shopAddr) return false;
        return shopAddr.includes(customerAddress) || customerAddress.includes(shopAddr);
      });

      setFilteredShops(filtered);
    } catch (err) {
      console.error('Failed to load shops:', err);
    }
  };

  // Load user info and fetch shops
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');

    if (storedName && storedName.length > 0) {
      setFullName(storedName);
      setUserInitial(storedName.charAt(0).toUpperCase());
    } else {
      setUserInitial('U');
    }

    if (role === 'customer') {
      const area = localStorage.getItem('userarea');
      if (area) setUserArea(area);
    }

    fetchShops();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserInitial('');
    setFullName('');
    setUserArea('');
    navigate('/');
  };

  const shopsToShow = showAll ? shops : filteredShops;

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <nav className="px-4 py-3 flex items-center bg-white text-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex-none">
          <Link to="/" className="text-xl font-bold">
            ShopSphere
          </Link>
        </div>

        <div className="flex-1 flex justify-center mx-4">
          <label className="h-10 max-w-xl w-full">
            <div className="flex w-full items-stretch h-full bg-white rounded-full border border-gray-300">
              <div className="text-gray-500 flex items-center justify-center pl-3 rounded-l-full">
                <svg fill="currentColor" height="20px" width="20px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for shops"
                className="form-input flex w-full rounded-r-full px-4 pl-2 text-sm font-medium leading-normal"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="flex-none flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-orange-500 bg-white px-4 py-2 rounded-full font-semibold hover:bg-orange-100"
          >
            Logout
          </button>
          <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-full shadow">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
              {userInitial || 'U'}
            </div>
            <span className="text-sm font-semibold text-orange-600">{fullName}</span>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <div className="px-4 py-2 pt-20 flex-1 overflow-y-auto h-full">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
          >
            {showAll ? 'Show My Location Shops' : 'Show All Shops'}
          </button>
        </div>

        <h2 className="text-gray-800 text-lg font-semibold mb-3">
          {showAll
            ? 'All Shops'
            : userArea
            ? `Nearby Shops Shown (${userArea})`
            : 'Nearby Shops'}
        </h2>

        {shopsToShow.length > 0 ? (
          <div className="flex flex-col w-full gap-4">
            {shopsToShow
              .filter((shop) =>
                shop.shopName.toLowerCase().includes(query.toLowerCase())
              )
              .map((shop, index) => (
                <ShopCard shop={shop} key={index} />
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No shops found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShops;
