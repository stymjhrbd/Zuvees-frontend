import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, CreditCard, MapPin, Phone, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from '../utils/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function OrderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: order, isLoading, refetch } = useQuery(
        ['order', id],
        async () => {
            const response = await axios.get(`/orders/${id}`)
            return response.data
        }
    )

    const cancelOrderMutation = useMutation(
        async () => {
            const response = await axios.post(`/orders/${id}/cancel`)
            return response.data
        },
        {
            onSuccess: () => {
                toast.success('Order cancelled successfully')
                refetch()
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to cancel order')
            }
        }
    )

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="text-yellow-600" size={24} />
            case 'paid':
            case 'processing':
                return <CreditCard className="text-blue-600" size={24} />
            case 'shipped':
                return <Truck className="text-purple-600" size={24} />
            case 'delivered':
                return <CheckCircle className="text-green-600" size={24} />
            case 'undelivered':
            case 'cancelled':
                return <XCircle className="text-red-600" size={24} />
            default:
                return <Package className="text-gray-600" size={24} />
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            paid: 'bg-blue-100 text-blue-800 border-blue-200',
            processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            undelivered: 'bg-red-100 text-red-800 border-red-200',
            cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
            refunded: 'bg-orange-100 text-orange-800 border-orange-200'
        }
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const canCancelOrder = order && ['pending', 'paid'].includes(order.status)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
                    <p className="text-secondary-600 mb-4">The order you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="btn btn-primary btn-md"
                    >
                        View All Orders
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center text-secondary-600 hover:text-primary-600 mb-4"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Orders
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Order #{order.orderNumber}</h1>
                            <p className="text-secondary-600">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-2">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="text-green-600 mt-1" size={20} />
                                    <div>
                                        <p className="font-medium">Order Placed</p>
                                        <p className="text-sm text-secondary-600">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>

                                {order.paymentInfo?.paidAt && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="text-green-600 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium">Payment Confirmed</p>
                                            <p className="text-sm text-secondary-600">{formatDate(order.paymentInfo.paidAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {order.shippedAt && (
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="text-green-600 mt-1" size={20} />
                                        <div>
                                            <p className="font-medium">Order Shipped</p>
                                            <p className="text-sm text-secondary-600">{formatDate(order.shippedAt)}</p>
                                            {order.trackingNumber && (
                                                <p className="text-sm text-primary-600 mt-1">
                                                    Tracking: {order.trackingNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {order.deliveredAt && (
                                    <div className="flex items-start space-x-3">
                                        {order.status === 'delivered' ? (
                                            <CheckCircle className="text-green-600 mt-1" size={20} />
                                        ) : (
                                            <XCircle className="text-red-600 mt-1" size={20} />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {order.status === 'delivered' ? 'Order Delivered' : 'Delivery Attempted'}
                                            </p>
                                            <p className="text-sm text-secondary-600">{formatDate(order.deliveredAt)}</p>
                                            {order.undeliveredReason && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    Reason: {order.undeliveredReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item._id} className="flex items-start space-x-4 py-4 border-b last:border-b-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            {item.productImage && (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <Link
                                                to={`/products/${item.product}`}
                                                className="font-medium hover:text-primary-600"
                                            >
                                                {item.productName}
                                            </Link>
                                            <p className="text-sm text-secondary-600 mt-1">
                                                {item.variant.color} • {item.variant.size}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-sm">Qty: {item.quantity}</span>
                                                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-secondary-700">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-700">
                                    <span>Tax</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-700">
                                    <span>Shipping</span>
                                    <span>
                                        {order.shippingCost === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `$${order.shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary-600">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        {canCancelOrder && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-lg shadow-sm p-6"
                            >
                                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this order?')) {
                                            cancelOrderMutation.mutate()
                                        }
                                    }}
                                    disabled={cancelOrderMutation.isLoading}
                                    className="btn btn-secondary btn-md border-red-300 text-red-600 hover:bg-red-50"
                                >
                                    {cancelOrderMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Delivery Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>

                            {/* Customer Info */}
                            <div className="mb-6">
                                <h3 className="font-medium text-secondary-700 mb-2">Customer</h3>
                                <p className="font-medium">{order.customerInfo.name}</p>
                                <div className="text-sm text-secondary-600 space-y-1 mt-2">
                                    <div className="flex items-center">
                                        <Mail size={14} className="mr-2" />
                                        {order.customerInfo.email}
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={14} className="mr-2" />
                                        {order.customerInfo.phone}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                                <h3 className="font-medium text-secondary-700 mb-2">Shipping Address</h3>
                                <div className="text-sm space-y-1">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                    </p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>

                            {/* Rider Info */}
                            {order.rider && (
                                <div>
                                    <h3 className="font-medium text-secondary-700 mb-2">Delivery Partner</h3>
                                    <p className="font-medium">{order.rider.name}</p>
                                    {order.rider.phone && (
                                        <div className="text-sm text-secondary-600 mt-1">
                                            <div className="flex items-center">
                                                <Phone size={14} className="mr-2" />
                                                {order.rider.phone}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Method</span>
                                    <span className="font-medium capitalize">{order.paymentInfo.method}</span>
                                </div>
                                {order.paymentInfo.transactionId && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary-600">Transaction ID</span>
                                        <span className="font-medium text-xs">{order.paymentInfo.transactionId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Status</span>
                                    <span className={`font-medium ${order.status === 'paid' || order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.status === 'paid' || order.status === 'delivered' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}