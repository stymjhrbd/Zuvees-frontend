import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Package, Calendar, DollarSign, ChevronRight, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from '../utils/axios'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Orders() {
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery(
        ['orders', { status: statusFilter, page }],
        async () => {
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)
            params.append('page', page.toString())
            params.append('limit', '10')

            const response = await axios.get(`/orders/my-orders?${params}`)
            return response.data
        },
        {
            keepPreviousData: true,
        }
    )

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-blue-100 text-blue-800',
            processing: 'bg-indigo-100 text-indigo-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            undelivered: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            refunded: 'bg-orange-100 text-orange-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (isLoading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        )
    }

    const orders = data?.orders || []
    const pagination = data?.pagination

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                    <p className="text-secondary-600">Track and manage your orders</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Filter size={20} className="text-secondary-600" />
                            <span className="font-medium">Filter by status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="input input-sm"
                            >
                                <option value="">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="text-sm text-secondary-600">
                            Showing {orders.length} of {pagination?.total || 0} orders
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-lg shadow-sm p-12 text-center"
                    >
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                        <p className="text-secondary-600 mb-6">
                            {statusFilter
                                ? `You don't have any ${statusFilter} orders.`
                                : "You haven't placed any orders yet."}
                        </p>
                        <Link to="/products" className="btn btn-primary btn-md">
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                        <div className="mb-4 lg:mb-0">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <h3 className="font-semibold text-lg">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="mr-1" />
                                                    {formatDate(order.createdAt)}
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign size={16} className="mr-1" />
                                                    ${order.totalAmount.toFixed(2)}
                                                </div>
                                                <div>
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="btn btn-secondary btn-sm flex items-center"
                                        >
                                            View Details
                                            <ChevronRight size={16} className="ml-1" />
                                        </Link>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center space-x-4 overflow-x-auto">
                                            {order.items.slice(0, 4).map((item) => (
                                                <div key={item._id} className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                                        {item.productImage && (
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-secondary-600 text-sm font-medium">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    {order.status === 'shipped' && order.rider && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>In Transit:</strong> Your order is on the way with {order.rider.name}
                                            </p>
                                        </div>
                                    )}

                                    {order.status === 'delivered' && (
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                            <p className="text-sm text-green-800">
                                                <strong>Delivered:</strong> Your order was delivered on {formatDate(order.deliveredAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="btn btn-secondary btn-sm disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <div className="flex items-center space-x-1">
                                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                                    let pageNum
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1
                                    } else if (page <= 3) {
                                        pageNum = i + 1
                                    } else if (page >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i
                                    } else {
                                        pageNum = page - 2 + i
                                    }

                                    if (pageNum < 1 || pageNum > pagination.pages) return null

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-3 py-1 rounded ${pageNum === page
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.pages}
                                className="btn btn-secondary btn-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}