import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-[#2D2634] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FF00FF] to-[#FF69B4] p-1 animate-spin">
            <div className="w-full h-full rounded-full bg-[#2D2634] flex items-center justify-center">
              <span className="text-[#FF00FF] text-lg font-semibold">Melodies</span>
            </div>
          </div>
          <h1 className="text-[#FF00FF] text-3xl font-bold mt-4">Melodies</h1>
        </div>

        {/* Login Form */}
        <div className="bg-[#2D2634] rounded-3xl p-6">
          <h2 className="text-white text-2xl font-semibold text-center mb-8">Login To Continue</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#3D3544] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF00FF]"
              />
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#3D3544] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF00FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF00FF]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button type="button" className="text-[#FF00FF] text-sm">
                Forgot password
              </button>
              <button
                type="submit"
                className="bg-[#FF00FF] text-white px-8 py-2 rounded-xl hover:bg-[#FF69B4] transition-colors"
              >
                Login
              </button>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-8 space-y-4">
            <button className="w-full flex items-center justify-center space-x-2 bg-white text-black py-2 rounded-full hover:bg-gray-100 transition-colors">
              <FcGoogle className="text-xl" />
              <span>Google Login</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-[#1877F2] text-white py-2 rounded-full hover:bg-blue-600 transition-colors">
              <FaFacebook className="text-xl" />
              <span>Facebook Login</span>
            </button>
          </div>
        </div>

        {/* Sign Up Section */}
        <div className="mt-8 text-center">
          <p className="text-white">Dont Have An Account</p>
          <button className="text-[#00A3FF] font-semibold mt-2">
            Sign Up Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 