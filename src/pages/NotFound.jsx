import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl"
            >
                {/* 404 Animation */}
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2,
                        ease: "easeInOut"
                    }}
                    className="text-9xl font-bold text-primary-600 mb-8"
                >
                    404
                </motion.div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Oops! Page Not Found
                </h1>

                <p className="text-xl text-secondary-600 mb-8">
                    The page you're looking for seems to have gone on a gaming adventure without us.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary btn-lg flex items-center"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="btn btn-primary btn-lg flex items-center"
                    >
                        <Home size={20} className="mr-2" />
                        Go to Homepage
                    </Link>
                </div>

                <div className="mt-12 p-6 bg-gray-100 rounded-lg">
                    <h2 className="font-semibold mb-3">Here are some helpful links:</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-primary-600">
                        <Link to="/products" className="hover:text-primary-700 flex items-center">
                            <Search size={16} className="mr-1" />
                            Browse Products
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link to="/cart" className="hover:text-primary-700">
                            View Cart
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link to="/orders" className="hover:text-primary-700">
                            Track Orders
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link to="/profile" className="hover:text-primary-700">
                            My Account
                        </Link>
                    </div>
                </div>

                {/* Gaming Easter Egg */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-secondary-500 text-sm"
                >
                    <p>🎮 Achievement Unlocked: "Lost Explorer" - Found the 404 page!</p>
                </motion.div>
            </motion.div>
        </div>
    )
}