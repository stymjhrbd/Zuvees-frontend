import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from '../utils/axios'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [viewMode, setViewMode] = useState('grid')

    // Get filters from URL
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || '-createdAt'
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const page = parseInt(searchParams.get('page') || '1')

    // Fetch products
    const { data, isLoading } = useQuery(
        ['products', { category, sort, minPrice, maxPrice, page }],
        async () => {
            const params = new URLSearchParams()
            if (category) params.append('category', category)
            if (sort) params.append('sort', sort)
            if (minPrice) params.append('minPrice', minPrice)
            if (maxPrice) params.append('maxPrice', maxPrice)
            params.append('page', page.toString())
            params.append('limit', '12')

            const response = await axios.get(`/products?${params}`)
            return response.data
        },
        {
            keepPreviousData: true,
        }
    )

    // Fetch categories
    const { data: categories } = useQuery(
        'categories',
        async () => {
            const response = await axios.get('/products/meta/categories')
            return response.data
        }
    )

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams)
        if (value) {
            newParams.set(key, value)
        } else {
            newParams.delete(key)
        }
        newParams.set('page', '1') // Reset to page 1 when filters change
        setSearchParams(newParams)
    }

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', newPage.toString())
        setSearchParams(newParams)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const sortOptions = [
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'basePrice', label: 'Price: Low to High' },
        { value: '-basePrice', label: 'Price: High to Low' },
        { value: 'name', label: 'Name: A to Z' },
        { value: '-name', label: 'Name: Z to A' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="container-custom py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
                    </h1>
                    <p className="text-secondary-600 mt-2">
                        {data?.pagination?.total || 0} products found
                    </p>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="lg:hidden"
                                >
                                    <Filter size={20} />
                                </button>
                            </div>

                            <AnimatePresence>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
                                >
                                    {/* Categories */}
                                    <div>
                                        <h3 className="font-medium mb-3">Category</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value=""
                                                    checked={!category}
                                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">All Categories</span>
                                            </label>
                                            {categories?.map((cat) => (
                                                <label key={cat} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={cat}
                                                        checked={category === cat}
                                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm capitalize">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <h3 className="font-medium mb-3">Price Range</h3>
                                        <div className="space-y-2">
                                            <input
                                                type="number"
                                                placeholder="Min price"
                                                value={minPrice}
                                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                className="input input-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max price"
                                                value={maxPrice}
                                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                className="input input-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    {(category || minPrice || maxPrice) && (
                                        <button
                                            onClick={() => {
                                                setSearchParams({ sort })
                                            }}
                                            className="btn btn-secondary btn-sm w-full"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={sort}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="input input-sm pr-8"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="hidden md:flex items-center space-x-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-6 ${viewMode === 'grid'
                                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                        : 'grid-cols-1'
                                    }`}>
                                    {data?.products?.map((product, index) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data?.pagination && data.pagination.pages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 1}
                                                className="btn btn-secondary btn-sm disabled:opacity-50"
                                            >
                                                Previous
                                            </button>

                                            <div className="flex items-center space-x-1">
                                                {[...Array(data.pagination.pages)].map((_, i) => {
                                                    const pageNum = i + 1
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum === data.pagination.pages ||
                                                        (pageNum >= page - 1 && pageNum <= page + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`px-3 py-1 rounded ${pageNum === page
                                                                        ? 'bg-primary-600 text-white'
                                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        )
                                                    } else if (
                                                        pageNum === page - 2 ||
                                                        pageNum === page + 2
                                                    ) {
                                                        return <span key={pageNum}>...</span>
                                                    }
                                                    return null
                                                })}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === data.pagination.pages}
                                                className="btn btn-secondary btn-sm disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}