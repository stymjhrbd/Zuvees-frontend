import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, User, Menu, X, Package, LogOut, Gamepad2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const { user, isAuthenticated, logout } = useAuthStore()
    const cartItems = useCartStore((state) => state.items)
    const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const handleLogout = () => {
        logout()
        navigate('/')
        setIsUserMenuOpen(false)
    }

    const categories = [
        { name: 'Consoles', path: '/products?category=consoles' },
        { name: 'Controllers', path: '/products?category=controllers' },
        { name: 'Headsets', path: '/products?category=headsets' },
        { name: 'Accessories', path: '/products?category=accessories' },
    ]

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        <Gamepad2 size={32} />
                        <span className="font-bold text-xl">Gaming Store</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/products"
                            className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            All Products
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={category.path}
                                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {cartItemsCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium"
                                >
                                    {cartItemsCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-2 text-secondary-700 hover:text-primary-600 transition-colors"
                                >
                                    {user?.picture ? (
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <img
                                            src="https://api.dicebear.com/9.x/initials/svg"
                                            alt="avatar"
                                        />
                                    )}
                                    <span className="hidden md:block font-medium">{user?.name}</span>
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                                        >
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-secondary-700 hover:bg-secondary-50 transition-colors"
                                            >
                                                <User size={18} />
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-secondary-700 hover:bg-secondary-50 transition-colors"
                                            >
                                                <Package size={18} />
                                                <span>My Orders</span>
                                            </Link>
                                            <hr className="my-2" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="btn btn-primary btn-md"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-secondary-700"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                <Link
                                    to="/products"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 text-secondary-700 hover:text-primary-600 font-medium"
                                >
                                    All Products
                                </Link>
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        to={category.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block py-2 text-secondary-700 hover:text-primary-600 font-medium"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}