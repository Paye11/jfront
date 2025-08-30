import React, { useEffect, useState } from 'react';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Generate floating elements
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 4,
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden flex items-center justify-center px-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 animate-float"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.left}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`
          max-w-2xl mx-auto text-center transform transition-all duration-1000 ease-out
          ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }
        `}>
        {/* 404 Number with animation */}
        <div className="relative mb-8">
          <div
            className={`
              text-8xl md:text-9xl font-black bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 
              bg-clip-text text-transparent transform transition-all duration-1000 ease-out
              ${isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}
            `}
            style={{
              filter: 'drop-shadow(0 4px 20px rgba(139, 69, 19, 0.3))',
            }}>
            404
          </div>

          {/* Glitch effect overlay */}
          <div
            className={`
              absolute inset-0 text-8xl md:text-9xl font-black text-red-500/20 
              transform transition-all duration-300
              ${isVisible ? 'animate-glitch' : ''}
            `}>
            404
          </div>
        </div>

        {/* Alert icon with bounce */}
        <div
          className={`
            inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6
            transform transition-all duration-700 delay-300 ease-out
            ${isVisible ? 'scale-100 animate-bounce-slow' : 'scale-0'}
          `}>
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Main heading with slide-in */}
        <h1
          className={`
            text-3xl md:text-4xl font-bold text-gray-800 mb-4
            transform transition-all duration-800 delay-400 ease-out
            ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-8 opacity-0'
            }
          `}>
          Page Not Found
        </h1>

        {/* Description with fade-in */}
        <p
          className={`
            text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto
            transform transition-all duration-800 delay-500 ease-out
            ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }
          `}>
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action buttons with staggered animation */}
        <div
          className={`
            flex flex-col sm:flex-row gap-4 justify-center items-center
            transform transition-all duration-800 delay-700 ease-out
            ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }
          `}>
          <button
            onClick={() => navigate('/')}
            className="
              group relative inline-flex items-center gap-3 px-8 py-4 
              bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold 
              rounded-2xl shadow-lg shadow-blue-200/50 
              hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-300/50
              transform transition-all duration-300 ease-out
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-blue-500/50
            ">
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Go Home
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              group relative inline-flex items-center gap-3 px-8 py-4 
              bg-white text-gray-700 font-semibold border-2 border-gray-300
              rounded-2xl shadow-lg hover:border-gray-400 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-gray-500/20
            ">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
        </div>

        {/* Search suggestion with delayed fade-in */}
        <div
          className={`
            mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg
            transform transition-all duration-800 delay-1000 ease-out
            ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }
          `}>
          <div className="flex items-center justify-center gap-3 text-gray-600 mb-3">
            <Search className="w-5 h-5" />
            <span className="font-medium">Looking for something specific?</span>
          </div>
          <p className="text-sm text-gray-500">
            Try using the search function or check out our main navigation menu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
