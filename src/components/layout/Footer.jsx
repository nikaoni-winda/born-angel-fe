import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-glacier-glow text-white py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-white/20 pb-4 mb-4">

                    {/* Brand Section - Left */}
                    <div className="text-center md:text-left space-y-4">
                        <Link to="/" className="inline-block no-underline">
                            <span className="font-heading text-3xl text-white font-bold tracking-tight leading-none">
                                Born <span className="italic font-light text-white/60">Angel</span>
                            </span>
                        </Link>
                        <p className="text-white/80 font-light leading-relaxed max-w-xs mx-auto md:mx-0 text-sm">
                            Elevating beauty through expert education. Join our community and discover your true potential.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start pt-2">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-glacier-glow transition-all duration-300">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-glacier-glow transition-all duration-300">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-glacier-glow transition-all duration-300">
                                <Facebook size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Section - Right */}
                    <div className="text-center md:text-right space-y-4">
                        <h3 className="font-heading text-xl text-white mb-2">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 justify-center md:justify-end text-white/80 font-light text-sm">
                                <span>123 Beauty Lane, Creative District<br />Jakarta, Indonesia 12345</span>
                                <MapPin size={16} className="shrink-0 mt-1" />
                            </li>
                            <li className="flex items-center gap-2 justify-center md:justify-end text-white/80 font-light text-sm">
                                <span>+62 812 3456 7890</span>
                                <Phone size={16} className="shrink-0" />
                            </li>
                            <li className="flex items-center gap-2 justify-center md:justify-end text-white/80 font-light text-sm">
                                <span>hello@bornangel.com</span>
                                <Mail size={16} className="shrink-0" />
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60 font-light">
                    <p>&copy; {new Date().getFullYear()} Born Angel. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
