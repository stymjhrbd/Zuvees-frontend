import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem)

    // Get price range
    const prices = product.variants.map(v => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceDisplay = minPrice === maxPrice
        ? `$${minPrice.toFixed(2)}`
        : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`

    const handleQuickAdd = (e) => {
        e.preventDefault()
        // Add the first variant as default
        if (product.variants.length > 0) {
            addItem(product, product.variants[0])
        } else {
            toast.error('Product not available')
        }
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="card group h-full flex flex-col"
        >
            <Link to={`/products/${product._id}`} className="block">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.isFeatured && (
                        <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
                            Featured
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-4 flex-grow flex flex-col">
                <Link to={`/products/${product._id}`} className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-secondary-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                    </p>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-3">
                    <div>
                        <p className="text-xl font-bold text-primary-600">{priceDisplay}</p>
                        {product.variants.length > 1 && (
                            <p className="text-xs text-secondary-500">{product.variants.length} variants</p>
                        )}
                    </div>

                    <button
                        onClick={handleQuickAdd}
                        className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                        title="Quick add to cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}