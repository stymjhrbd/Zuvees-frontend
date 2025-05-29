import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ChevronRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from '../utils/axios'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
    const { data: featuredProducts, isLoading } = useQuery(
        'featured-products',
        async () => {
            const response = await axios.get('/products/meta/featured')
            return response.data
        }
    )

    const features = [
        {
            icon: <Truck className="w-12 h-12 text-primary-600" />,
            title: 'Free Shipping',
            description: 'Free delivery on orders over $100'
        },
        {
            icon: <Shield className="w-12 h-12 text-primary-600" />,
            title: 'Secure Payment',
            description: '100% secure transactions'
        },
        {
            icon: <CreditCard className="w-12 h-12 text-primary-600" />,
            title: 'Easy Returns',
            description: '30-day return policy'
        },
        {
            icon: <Headphones className="w-12 h-12 text-primary-600" />,
            title: '24/7 Support',
            description: 'Dedicated customer service'
        }
    ]

    const categories = [
        {
            name: 'Gaming Consoles',
            image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
            path: '/products?category=consoles'
        },
        {
            name: 'Controllers',
            image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800',
            path: '/products?category=controllers'
        },
        {
            name: 'Gaming Headsets',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
            path: '/products?category=headsets'
        },
        {
            name: 'Accessories',
            image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
            path: '/products?category=accessories'
        }
    ]

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container-custom py-24 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Level Up Your Gaming Experience
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Discover the latest gaming consoles, accessories, and gear from top brands
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/products"
                                className="btn btn-primary btn-lg bg-white text-primary-700 hover:bg-gray-100"
                            >
                                Shop Now
                                <ChevronRight className="ml-2" size={20} />
                            </Link>
                            <Link
                                to="/products?category=consoles"
                                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-700"
                            >
                                Browse Consoles
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-secondary-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link
                                        to={category.path}
                                        className="group relative block h-64 rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                                            <p className="text-primary-200 group-hover:text-primary-100 transition-colors">
                                                Shop now →
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-3xl font-bold">Featured Products</h2>
                            <Link
                                to="/products"
                                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                            >
                                View all
                                <ChevronRight size={20} className="ml-1" />
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts?.slice(0, 4).map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-900 text-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Join the Gaming Revolution
                        </h2>
                        <p className="text-xl mb-8 text-primary-100">
                            Sign up for exclusive deals and early access to new products
                        </p>
                        <Link
                            to="/login"
                            className="btn btn-lg bg-white text-primary-700 hover:bg-gray-100"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}