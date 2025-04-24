import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import authService from '../services/authService';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    // Lắng nghe sự kiện khi user đăng nhập/đăng xuất
    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    // Thêm event listener
    window.addEventListener('authChange', handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <nav className="bg-[#5B4959] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Melodies
        </Link>
        <div className="flex items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button type="text" className="text-white hover:text-gray-300">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button type="text" className="text-white hover:text-gray-300">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
