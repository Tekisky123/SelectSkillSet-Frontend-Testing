import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Retrieve tokens from localStorage
  const candidateToken = localStorage.getItem("candidateToken");
  const interviewerToken = localStorage.getItem("interviewerToken");
  const corporateToken = localStorage.getItem("corporateToken");

  useEffect(() => {
    // Check if any token is present to determine login status
    setUserLoggedIn(!!(candidateToken || interviewerToken || corporateToken));
  }, [candidateToken, interviewerToken, corporateToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // Handle profile navigation based on the available token
  const handleProfileNavigation = () => {
    if (candidateToken) {
      navigate("/candidate-dashboard");
    } else if (interviewerToken) {
      navigate("/interviewer-dashboard");
    } else if (corporateToken) {
      navigate("/corporate-dashboard");
    }
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("candidateToken");
    localStorage.removeItem("interviewerToken");
    localStorage.removeItem("corporateToken");
    setUserLoggedIn(false);
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 left-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <span className="text-indigo-600 text-3xl font-bold tracking-wider">
                Selectskillset
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-800 hover:text-indigo-600 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-800 hover:text-indigo-600 transition duration-300"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-indigo-600 transition duration-300"
            >
              About Us
            </Link>
            <Link
              to="/become-interviewer"
              className="text-gray-800 hover:text-indigo-600 transition duration-300"
            >
              Become an Interviewer
            </Link>
            {userLoggedIn ? (
              <>
                <button
                  onClick={handleProfileNavigation}
                  className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-800 hover:text-red-600 font-medium transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
              >
                Login
              </Link>
            )}
            <Link
              to="/request-demo"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-500 transition duration-300"
            >
              Request Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 h-screen bg-white shadow-lg z-40 w-3/4 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-4">
          <button onClick={closeMenu} className="text-gray-800 focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col items-center space-y-6 mt-10">
          <Link
            to="/"
            className="text-gray-800 hover:text-indigo-600 text-lg transition duration-300"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-800 hover:text-indigo-600 text-lg transition duration-300"
            onClick={closeMenu}
          >
            Products
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hover:text-indigo-600 text-lg transition duration-300"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            to="/become-interviewer"
            className="text-gray-800 hover:text-indigo-600 text-lg transition duration-300"
            onClick={closeMenu}
          >
            Become an Interviewer
          </Link>
          {userLoggedIn ? (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  handleProfileNavigation();
                }}
                className="text-gray-800 hover:text-indigo-600 text-lg transition duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="text-gray-800 hover:text-red-600 text-lg transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-indigo-600 font-medium text-lg transition duration-300"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
          <Link
            to="/request-demo"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-500 text-lg transition duration-300"
            onClick={closeMenu}
          >
            Request Demo
          </Link>
        </div>
      </div>
    </nav>
  );
};
