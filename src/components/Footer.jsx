import { Link } from 'react-router-dom'
import { Gamepad2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-secondary-900 text-secondary-100 mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Gamepad2 size={32} className="text-primary-400" />
                            <span className="font-bold text-xl text-white">Gaming Store</span>
                        </div>
                        <p className="text-sm mb-4">
                            Your premier destination for gaming consoles, accessories, and the latest gaming gear.
                            Experience the future of gaming with us.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/products" className="text-sm hover:text-primary-400 transition-colors">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=consoles" className="text-sm hover:text-primary-400 transition-colors">
                                    Gaming Consoles
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=accessories" className="text-sm hover:text-primary-400 transition-colors">
                                    Accessories
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-sm hover:text-primary-400 transition-colors">
                                    Track Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                                    Shipping Information
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                                    Warranty
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">
                                    123 Gaming Street<br />
                                    New York, NY 10001
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                                <span className="text-sm">support@gamingstore.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-secondary-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-secondary-400 mb-4 md:mb-0">
                            © {currentYear} Gaming Store. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-sm text-secondary-400 hover:text-primary-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-secondary-400 hover:text-primary-400 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-secondary-400 hover:text-primary-400 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}