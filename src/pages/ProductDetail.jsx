import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from '../utils/axios'
import { useCartStore } from '../store/cartStore'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const addItem = useCartStore((state) => state.addItem)

    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    // Fetch product details
    const { data: product, isLoading, error } = useQuery(
        ['product', id],
        async () => {
            const response = await axios.get(`/products/${id}`)
            return response.data
        },
        {
            onSuccess: (data) => {
                // Select first variant by default
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0])
                }
            }
        }
    )

    // Check variant availability
    const { data: availability } = useQuery(
        ['availability', id, selectedVariant?._id],
        async () => {
            if (!selectedVariant) return null
            const response = await axios.post(`/products/${id}/check-availability`, {
                variantId: selectedVariant._id,
                quantity
            })
            return response.data
        },
        {
            enabled: !!selectedVariant,
        }
    )

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error('Please select a variant')
            return
        }

        setIsAddingToCart(true)
        try {
            await addItem(product, selectedVariant, quantity)
            // Navigate to cart or show success message
            toast.success('Added to cart successfully!')
        } catch (error) {
            toast.error('Failed to add to cart')
        } finally {
            setIsAddingToCart(false)
        }
    }

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 1)) {
            setQuantity(newQuantity)
        }
    }

    const handleImageChange = (direction) => {
        if (direction === 'prev') {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
            )
        } else {
            setCurrentImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
            )
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                    <p className="text-secondary-600 mb-4">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-primary btn-md"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-custom py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm mb-8">
                    <button
                        onClick={() => navigate('/products')}
                        className="text-secondary-600 hover:text-primary-600"
                    >
                        Products
                    </button>
                    <span className="text-secondary-400">/</span>
                    <span className="text-secondary-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={product.images[currentImageIndex]}
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Image Navigation */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => handleImageChange('prev')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => handleImageChange('next')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="flex space-x-4 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index
                                                ? 'border-primary-600'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center space-x-4 text-sm text-secondary-600">
                                <span>Brand: {product.brand}</span>
                                <span>•</span>
                                <span>Category: {product.category}</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-primary-600">
                            ${selectedVariant?.price?.toFixed(2) || product.basePrice.toFixed(2)}
                        </div>

                        {/* Variants */}
                        <div className="space-y-4">
                            {/* Color Selection */}
                            {product.variants.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-3">Select Variant</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant._id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`p-3 rounded-lg border-2 transition-all ${selectedVariant?._id === variant._id
                                                        ? 'border-primary-600 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="text-left">
                                                    <div className="font-medium">{variant.color}</div>
                                                    <div className="text-sm text-secondary-600">{variant.size}</div>
                                                    <div className="text-sm font-medium mt-1">
                                                        ${variant.price.toFixed(2)}
                                                    </div>
                                                    {variant.stock === 0 && (
                                                        <div className="text-xs text-red-600 mt-1">Out of stock</div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div>
                                <h3 className="font-medium mb-3">Quantity</h3>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= (selectedVariant?.stock || 1)}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        +
                                    </button>
                                    {selectedVariant && (
                                        <span className="text-sm text-secondary-600">
                                            {selectedVariant.stock} available
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            {availability && (
                                <div className={`flex items-center space-x-2 text-sm ${availability.available ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {availability.available ? (
                                        <>
                                            <Check size={16} />
                                            <span>In stock</span>
                                        </>
                                    ) : (
                                        <>
                                            <X size={16} />
                                            <span>{availability.message}</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock === 0 || isAddingToCart}
                                className="btn btn-primary btn-lg flex-1 flex items-center justify-center space-x-2"
                            >
                                {isAddingToCart ? (
                                    <LoadingSpinner size="small" />
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                            <button className="btn btn-secondary btn-lg p-3">
                                <Heart size={20} />
                            </button>
                            <button className="btn btn-secondary btn-lg p-3">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold text-lg mb-3">Description</h3>
                            <p className="text-secondary-700 whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-lg mb-3">Features</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-secondary-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                                <dl className="space-y-2">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex">
                                            <dt className="font-medium text-secondary-900 w-1/3">{key}:</dt>
                                            <dd className="text-secondary-700 w-2/3">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}