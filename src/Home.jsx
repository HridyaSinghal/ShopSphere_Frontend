import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Card from './card';
import Needs from './Needs';
import Footer from './Footer';

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    if (token && userName) {
      setIsLoggedIn(true);
      setUserInitial(userName.charAt(0).toUpperCase());
    } else {
      setUserInitial('U');
    }
  }, []);

  const handleOpenShopClick = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      if (role === 'shopkeeper') {
        navigate('/dashboard/home');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shopsearch');
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserInitial('');
    navigate('/');
  };

  return (
    <div className="font-[Poppins] relative w-full h-screen overflow-visible">
  {/* Background Image */}
  <div
    className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center z-0"
    style={{
      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHw1J1xUxxbLDOoOh3KK2CVD9nLwyn3ImcUxKVDe7gPXbmbEVl3PcBrmIe92vYLoy_Vpe5A2Z0Tm8gPCqK-SDAsNF4oX1PiVs21kPQlptkRtC3coNp79xCL5cR_sG0nDMvYztALIOQJRyP8zBNQ6PQUoGvyv_pEb05-b4wIfMMNNPa_BM7pNjYuYzuiqXeElhsseFWUZR7bodPWBlwjhrCckSQjK_GjuQ5WIfoO0DqsJJ3eoRdd0nmDbafCo-O3ZCAeZD67_gmyhyT')`,
    }}
  />


      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center h-screen bg-orange-600 bg-opacity-90 p-10 md:w-1/2 rounded-r-lg shadow-xl">
        <h1 className="text-white font-[Playfair_Display] text-6xl md:text-7xl font-extrabold mb-2 leading-tight">Welcome to</h1>
        <h2 className="text-white font-[Playfair_Display] text-6xl md:text-7xl font-extrabold mb-6 leading-tight">EASY BAZAAR</h2>
        <p className="text-white text-lg md:text-xl text-justify w-3/4 max-w-lg mb-8">
          A simple SaaS platform to launch your online shop in minutes – no technical skills required.
        </p>
        <div className="flex gap-6 mt-5">
          <button
            onClick={handleOpenShopClick}
            className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 text-lg md:py-4 md:px-8"
          >
            Open Shop
          </button>
          <Link
            to="/all-shops"
            className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 text-lg md:py-4 md:px-8"
          >
            Buy Now
          </Link>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="absolute top-4 right-6 z-20 hidden md:flex gap-4 text-sm font-[Lato]">
        <Link to="/" className="text-white hover:text-orange-500 px-4 py-2">Home</Link>
        <Link to="/contact" className="text-white hover:text-orange-500 px-4 py-2">Contact</Link>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="text-orange-500 bg-white px-4 py-2 rounded-full font-semibold hover:bg-orange-100">Logout</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">{userInitial}</div>
              <span className="text-white">{localStorage.getItem('fullName')}</span>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setShowLoginModal(true)} className="text-orange-500 bg-white px-4 py-2 rounded-full font-semibold hover:bg-orange-100">Login</button>
            <button onClick={() => setShowSignupModal(true)} className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">Sign Up</button>
          </>
        )}
      </nav>

      {/* Mobile Nav Toggle */}
      <div className="absolute top-4 right-6 z-20 md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex justify-start">
          <div className="w-3/4 h-full bg-white text-orange-500 shadow-lg flex flex-col p-6">
            <button className="self-end mb-6 text-gray-600" onClick={() => setMenuOpen(false)}><X size={28} /></button>
            <nav className="flex flex-col gap-4 text-lg font-medium">
              <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 hover:text-orange-700">Home</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="py-2 hover:text-orange-700">Contact</Link>
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">{userInitial}</div>
                    <span>{localStorage.getItem('fullName')}</span>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-2 text-left hover:text-orange-700">Logout</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLoginModal(true); setMenuOpen(false); }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setShowSignupModal(true); setMenuOpen(false); }}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowSignupModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">Select Sign Up Type</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  navigate('/signup/customer');
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold shadow"
              >
                Customer Sign Up
              </button>
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  navigate('/signup/shopowner');
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold shadow"
              >
                Shop Owner Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">Select Login Type</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login/customer');
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold shadow"
              >
                Customer Login
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login/shopowner');
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold shadow"
              >
                Shop Owner Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Components */}
      <div className="mt-0 relative z-10">
        <Card />
        <Needs />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
