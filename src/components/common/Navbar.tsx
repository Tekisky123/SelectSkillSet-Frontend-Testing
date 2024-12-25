import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Retrieve tokens from sessionStorage
  const candidateToken = sessionStorage.getItem("candidateToken");
  const interviewerToken = sessionStorage.getItem("interviewerToken");
  const corporateToken = sessionStorage.getItem("corporateToken");

  const userLoggedIn = !!(candidateToken || interviewerToken || corporateToken);

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
    sessionStorage.removeItem("candidateToken");
    sessionStorage.removeItem("interviewerToken");
    sessionStorage.removeItem("corporateToken");
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 left-0 w-full z-50 ">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the left */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-linkedin text-3xl font-extrabold uppercase">
              Selectskillset
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {!userLoggedIn ? (
              <>
                <Link
                  to="/"
                  className="text-gray-800 hover:text-linkedin text-lg font-medium transition duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-gray-800 hover:text-linkedin text-lg font-medium transition duration-300"
                >
                  Products
                </Link>
                <Link
                  to="/about"
                  className="text-gray-800 hover:text-linkedin text-lg font-medium transition duration-300"
                >
                  About Us
                </Link>
                <Link
                  to="/become-interviewer"
                  className="text-gray-800 hover:text-linkedin text-lg font-medium transition duration-300"
                >
                  Become an Interviewer
                </Link>
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-linkedin font-medium text-lg transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/request-demo"
                  className="bg-linkedin text-white text-lg font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
                >
                  Request Demo
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleProfileNavigation}
                  className="bg-linkedin text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-red-500 transition duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 h-screen bg-white shadow-xl z-50 w-3/4 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-5">
          <button
            onClick={closeMenu}
            className="text-gray-800 focus:outline-none"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        <div className="flex flex-col items-center space-y-8 mt-12">
          {!userLoggedIn ? (
            <>
              <Link
                to="/"
                className="text-gray-800 hover:text-linkedin text-2xl font-medium transition duration-300"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-800 hover:text-linkedin text-2xl font-medium transition duration-300"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-gray-800 hover:text-linkedin text-2xl font-medium transition duration-300"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link
                to="/become-interviewer"
                className="text-gray-800 hover:text-linkedin text-2xl font-medium transition duration-300"
                onClick={closeMenu}
              >
                Become an Interviewer
              </Link>
              <Link
                to="/login"
                className="text-yellow-600 font-medium text-2xl transition duration-300"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/request-demo"
                className="bg-linkedin text-white text-2xl font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
                onClick={closeMenu}
              >
                Request Demo
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  handleProfileNavigation();
                }}
                className="bg-linkedin text-white text-2xl font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="bg-red-600 text-white text-2xl font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-red-500 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
