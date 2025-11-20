import React from 'react';
import ShopkeeperDashboard from '../public/dashboard.png';
import links from '../public/link.png';
import login from '../public/login.png';
import photo from '../public/photo.png';
import delivery from '../public/delivery.png';
import Analytic from '../public/analytics.png';
import admin from '../public/admin.png';

const features = [
  { icon: <img src={ShopkeeperDashboard} alt="Dashboard" className="w-6 h-6" />, text: "Shopkeeper Dashboard" },
  { icon: <img src={links} alt="Link" className="w-6 h-6" />, text: "Unique Store Link" },
  { icon: <img src={login} alt="Login" className="w-6 h-6" />, text: "Role-based Login" },
  { icon: <img src={photo} alt="Photo" className="w-6 h-6" />, text: "Image Upload from Mobile" },
  { icon: <img src={delivery} alt="Delivery" className="w-6 h-6" />, text: "Order & Delivery Management" },
  { icon: <img src={Analytic} alt="Analytics" className="w-6 h-6" />, text: "Analytics Dashboard" },
  { icon: <img src={admin} alt="Admin" className="w-6 h-6" />, text: "Admin Panel" },
];

function Needs() {
  return (
    
    <div className="bg-[#fdf1e2] flex flex-col justify-center items-center sm:p-3 md:p-3 lg:p-3 xl:p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-[Playfair_Display] font-bold tracking-wide mb-6">
          Everything You Need in One Platform
        </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[25px] justify-center items-center text-center m-3">
        {features.map((ftr, idx) => (
          <div
            className="shadow-xl rounded-2xl min-w-30 min-h-30 max-w-40 flex flex-col justify-center items-center p-3 bg-white"
            key={idx}
          >
            <p className="p-1 m-1">{ftr.icon}</p>
            <p className="text-xl font-semibold text-gray-700 mt-1 text-center">{ftr.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Needs;
