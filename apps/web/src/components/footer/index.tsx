import React from "react";
import { FaSearch, FaYoutube, FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white h-auto flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] flex-grow">
                {/* Left Grid */}
                <div className="flex flex-col mx-12 my-8">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search bar of frugality..."
                            className="w-full md:w-[35vw] p-2 bg-black border-b border-white text-white pl-10"
                        />
                        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xl cursor-pointer hover:text-gray-400" />
                    </div>
                    <p className="font-bold text-4xl">Get Frugal With FRUGMART.</p>
                    <div className="flex items-center space-x-8 mt-4">
                        <FaYoutube className="text-4xl hover:text-red-600 cursor-pointer" />
                        <FaInstagram className="text-4xl hover:text-pink-500 cursor-pointer" />
                        <FaTwitter className="text-4xl hover:text-blue-400 cursor-pointer" />
                        <FaFacebookF className="text-4xl hover:text-blue-600 cursor-pointer" />
                    </div>
                </div>

                {/* Center Grid */}
                <div className="flex flex-col mx-12 my-8">
                    <p className="font-bold text-2xl">Categories</p>
                    <ul className="text-sm mt-2">
                        <li>Fruits and Vegetables</li>
                        <li>Poultry</li>
                        <li>Dairy</li>
                        <li>Baked Goods</li>
                    </ul>
                </div>

                {/* Right Grid */}
                <div className="flex flex-col mx-12 my-8">
                    <p className="font-bold text-2xl">Policies</p>
                    <ul className="text-sm mt-2">
                        <li>Privacy Policy</li>
                        <li>Cookie Policy</li>
                    </ul>
                </div>
            </div>

            {/* Border and Copyright Section */}
            <div className="border-t border-white text-right py-4 mx-12 my-4">
                <p className="text-sm">Copyright © {new Date().getFullYear()} FrugMart Indonesia</p>
            </div>
        </footer>
    );
};

export default Footer;
