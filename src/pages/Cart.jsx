import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Cart() {
    const navigate = useNavigate()
    const { items, updateQuantity, removeItem, getCartTotals, validateCart } = useCartStore()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const totals = getCartTotals()

    // Validate cart on mount
    useEffect(() => {
        if (isAuthenticated) {
            validateCart().then((result) => {
                if (!result.valid && result.issues.length > 0) {
                    toast.error('Some items in your cart have been updated')
                }
            })
        }
    }, [isAuthenticated, validateCart])

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error('Please login to checkout')
            navigate('/login', { state: { from: { pathname: '/checkout' } } })
            return
        }
        navigate('/checkout')
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-secondary-600 mb-6">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                        Start Shopping
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            <AnimatePresence>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 border-b last:border-b-0"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Product Image */}
                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="w-full md:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                            >
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className="flex-grow">
                                                <Link
                                                    to={`/products/${item.productId}`}
                                                    className="font-semibold text-lg hover:text-primary-600 transition-colors"
                                                >
                                                    {item.productName}
                                                </Link>
                                                <div className="text-sm text-secondary-600 mt-1">
                                                    <span>{item.color}</span>
                                                    {item.size && <span> • {item.size}</span>}
                                                </div>
                                                <div className="text-lg font-semibold text-primary-600 mt-2">
                                                    ${item.price.toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Quantity and Actions */}
                                            <div className="flex items-center justify-between md:justify-end gap-4">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center border rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right">
                                                    <div className="font-semibold">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="text-red-600 hover:text-red-700 text-sm mt-1 flex items-center gap-1"
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
                        >
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-secondary-700">
                                    <span>Subtotal ({totals.itemCount} items)</span>
                                    <span>${totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-700">
                                    <span>Tax (8%)</span>
                                    <span>${totals.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-700">
                                    <span>Shipping</span>
                                    <span>
                                        {totals.shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `$${totals.shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {totals.shipping > 0 && (
                                    <p className="text-xs text-secondary-500">
                                        Free shipping on orders over $100
                                    </p>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span className="text-primary-600">${totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </button>

                            <div className="mt-4 text-center">
                                <Link
                                    to="/products"
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center justify-center gap-2 text-sm text-secondary-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}