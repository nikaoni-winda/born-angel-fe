import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const authed = isAuthenticated();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="w-full sticky top-0 z-[999] bg-[#fff0f5] transition-all duration-300 shadow-sm">
            {/* Gradient Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-polar-night/20 to-transparent"></div>

            <div className="container flex items-center justify-between h-[72px]">
                {/* Modern Luxury Logo */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 group no-underline">
                    <span className="font-heading text-[1.8rem] lg:text-[2rem] text-polar-night font-bold tracking-tight leading-none text-nowrap">
                        Born <span className="italic font-light text-frost-byte">Angel</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-8">
                    <Link to={ROUTES.HOME} className="text-[1rem] text-polar-night font-medium relative group">
                        Home
                        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-frost-byte transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to={ROUTES.SERVICES} className="text-[1rem] text-polar-night font-medium relative group">
                        Services
                        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-frost-byte transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to={ROUTES.INSTRUCTORS} className="text-[1rem] text-polar-night font-medium relative group">
                        Instructors
                        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-frost-byte transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link to="/about" className="text-[1rem] text-polar-night font-medium relative group">
                        About Us
                        <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-frost-byte transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="hidden lg:flex items-center gap-6">
                    {authed ? (
                        <Link to="/dashboard" className="px-6 py-1 border-2 border-polar-night rounded-full text-polar-night font-semibold text-[0.9rem] hover:bg-polar-night hover:text-white transition-all duration-300">
                            {user?.role === 'user' ? 'My Classes' : 'Dashboard'}
                        </Link>
                    ) : (
                        <>
                            <Link to={ROUTES.LOGIN} className="px-6 py-1 border-2 border-polar-night rounded-full text-polar-night font-semibold text-[0.9rem] hover:bg-polar-night hover:text-white transition-all duration-300">
                                Login
                            </Link>
                            <Link to={ROUTES.REGISTER} className="px-6 py-1 bg-polar-night border-2 border-polar-night rounded-full text-white font-semibold text-[0.9rem] hover:bg-frost-byte hover:border-frost-byte transition-all duration-300">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className={`block w-[25px] h-[3px] bg-polar-night my-[5px] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                    <span className={`block w-[25px] h-[3px] bg-polar-night my-[5px] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-[25px] h-[3px] bg-polar-night my-[5px] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`lg:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-frozen z-50 flex flex-col items-center pt-10 gap-8 transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Link to={ROUTES.HOME} className="text-xl text-polar-night font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to={ROUTES.SERVICES} className="text-xl text-polar-night font-medium" onClick={() => setIsMenuOpen(false)}>Services</Link>
                <Link to={ROUTES.INSTRUCTORS} className="text-xl text-polar-night font-medium" onClick={() => setIsMenuOpen(false)}>Instructors</Link>
                <Link to="/about" className="text-xl text-polar-night font-medium" onClick={() => setIsMenuOpen(false)}>About Us</Link>

                {authed ? (
                    <>
                        <Link to="/dashboard" className="text-xl text-polar-night font-bold" onClick={() => setIsMenuOpen(false)}>{user?.role === 'user' ? 'My Classes' : 'Dashboard'}</Link>
                    </>
                ) : (
                    <>
                        <Link to={ROUTES.LOGIN} className="text-xl text-polar-night font-bold" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link to={ROUTES.REGISTER} className="text-xl text-frost-byte font-bold" onClick={() => setIsMenuOpen(false)}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
