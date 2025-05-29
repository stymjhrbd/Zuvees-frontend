import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CreditCard, Shield, ArrowLeft, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMutation } from 'react-query'
import axios from '../utils/axios'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Checkout() {
    const navigate = useNavigate()
    const { items, getCartTotals, clearCart, validateCart } = useCartStore()
    const { user } = useAuthStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review

    const totals = getCartTotals()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        defaultValues: {
            customerInfo: {
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || ''
            },
            shippingAddress: {
                street: user?.address?.street || '',
                city: user?.address?.city || '',
                state: user?.address?.state || '',
                zipCode: user?.address?.zipCode || '',
                country: 'USA'
            },
            paymentMethod: 'card'
        }
    })

    // Validate cart on mount
    useEffect(() => {
        validateCart().then((result) => {
            if (!result.valid) {
                if (result.issues.some(issue => issue.type === 'removed')) {
                    toast.error('Some items are no longer available')
                    navigate('/cart')
                }
            }
        })
    }, [validateCart, navigate])

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart')
        }
    }, [items, navigate])

    // Create order mutation
    const createOrderMutation = useMutation(
        async (data) => {
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity
                })),
                customerInfo: data.customerInfo,
                shippingAddress: data.shippingAddress,
                paymentMethod: data.paymentMethod
            }

            const response = await axios.post('/orders', orderData)
            return response.data
        },
        {
            onSuccess: async (data) => {
                // Simulate payment
                const paymentResponse = await axios.post(`/orders/${data.order._id}/pay`, {
                    transactionId: 'MOCK-' + Date.now()
                })

                clearCart()
                toast.success('Order placed successfully!')
                navigate(`/orders/${data.order._id}`)
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to create order')
                setIsProcessing(false)
            }
        }
    )

    const onSubmit = (data) => {
        setIsProcessing(true)
        createOrderMutation.mutate(data)
    }

    const goToStep = (newStep) => {
        if (newStep < step || validateStep(step)) {
            setStep(newStep)
        }
    }

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                const info = watch('customerInfo')
                const address = watch('shippingAddress')
                return info.name && info.email && info.phone &&
                    address.street && address.city && address.state && address.zipCode
            case 2:
                return watch('paymentMethod')
            default:
                return true
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center text-secondary-600 hover:text-primary-600 mb-4"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Cart
                    </button>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-2xl">
                        {[
                            { num: 1, label: 'Shipping' },
                            { num: 2, label: 'Payment' },
                            { num: 3, label: 'Review' }
                        ].map((s, index) => (
                            <div key={s.num} className="flex items-center">
                                <button
                                    onClick={() => goToStep(s.num)}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${step >= s.num
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {step > s.num ? <Check size={20} /> : s.num}
                                </button>
                                <span className={`ml-2 text-sm font-medium ${step >= s.num ? 'text-primary-600' : 'text-gray-500'
                                    }`}>
                                    {s.label}
                                </span>
                                {index < 2 && (
                                    <div className={`w-24 h-0.5 mx-4 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Step 1: Shipping Information */}
                                {step === 1 && (
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                                        {/* Customer Info */}
                                        <div className="space-y-4 mb-6">
                                            <h3 className="font-medium text-secondary-700">Contact Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="label">Full Name</label>
                                                    <input
                                                        type="text"
                                                        {...register('customerInfo.name', { required: 'Name is required' })}
                                                        className="input"
                                                    />
                                                    {errors.customerInfo?.name && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.customerInfo.name.message}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="label">Email</label>
                                                    <input
                                                        type="email"
                                                        {...register('customerInfo.email', {
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: 'Invalid email address'
                                                            }
                                                        })}
                                                        className="input"
                                                    />
                                                    {errors.customerInfo?.email && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.customerInfo.email.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    {...register('customerInfo.phone', { required: 'Phone is required' })}
                                                    className="input"
                                                />
                                                {errors.customerInfo?.phone && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.customerInfo.phone.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-secondary-700">Shipping Address</h3>
                                            <div>
                                                <label className="label">Street Address</label>
                                                <input
                                                    type="text"
                                                    {...register('shippingAddress.street', { required: 'Street address is required' })}
                                                    className="input"
                                                />
                                                {errors.shippingAddress?.street && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.street.message}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="label">City</label>
                                                    <input
                                                        type="text"
                                                        {...register('shippingAddress.city', { required: 'City is required' })}
                                                        className="input"
                                                    />
                                                    {errors.shippingAddress?.city && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.city.message}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="label">State</label>
                                                    <input
                                                        type="text"
                                                        {...register('shippingAddress.state', { required: 'State is required' })}
                                                        className="input"
                                                    />
                                                    {errors.shippingAddress?.state && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.state.message}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="label">ZIP Code</label>
                                                    <input
                                                        type="text"
                                                        {...register('shippingAddress.zipCode', { required: 'ZIP code is required' })}
                                                        className="input"
                                                    />
                                                    {errors.shippingAddress?.zipCode && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.zipCode.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                disabled={!validateStep(1)}
                                                className="btn btn-primary btn-lg"
                                            >
                                                Continue to Payment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Payment */}
                                {step === 2 && (
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                                        <div className="space-y-4">
                                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    value="card"
                                                    {...register('paymentMethod')}
                                                    className="mr-3"
                                                />
                                                <CreditCard size={24} className="mr-3 text-secondary-600" />
                                                <div>
                                                    <p className="font-medium">Credit/Debit Card</p>
                                                    <p className="text-sm text-secondary-600">Pay securely with your card</p>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    value="paypal"
                                                    {...register('paymentMethod')}
                                                    className="mr-3"
                                                />
                                                <div className="w-6 h-6 mr-3 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                                    P
                                                </div>
                                                <div>
                                                    <p className="font-medium">PayPal</p>
                                                    <p className="text-sm text-secondary-600">Pay with your PayPal account</p>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    value="cod"
                                                    {...register('paymentMethod')}
                                                    className="mr-3"
                                                />
                                                <div className="w-6 h-6 mr-3 bg-green-600 rounded flex items-center justify-center text-white">
                                                    $
                                                </div>
                                                <div>
                                                    <p className="font-medium">Cash on Delivery</p>
                                                    <p className="text-sm text-secondary-600">Pay when you receive your order</p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-start space-x-3">
                                                <Shield className="text-blue-600 mt-1" size={20} />
                                                <div className="text-sm">
                                                    <p className="font-medium text-blue-900">Secure Payment</p>
                                                    <p className="text-blue-700">
                                                        Your payment information is encrypted and secure. This is a demo checkout - no real payment will be processed.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="btn btn-secondary btn-lg"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStep(3)}
                                                disabled={!validateStep(2)}
                                                className="btn btn-primary btn-lg"
                                            >
                                                Review Order
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        {/* Order Items */}
                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <div key={item._id} className="flex items-center space-x-4 py-2">
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-grow">
                                                            <p className="font-medium">{item.productName}</p>
                                                            <p className="text-sm text-secondary-600">
                                                                {item.color} • {item.size} • Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        <div className="bg-white rounded-lg shadow-sm p-6">
                                            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="font-medium text-secondary-700 mb-2">Contact</h3>
                                                    <p>{watch('customerInfo.name')}</p>
                                                    <p className="text-secondary-600">{watch('customerInfo.email')}</p>
                                                    <p className="text-secondary-600">{watch('customerInfo.phone')}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-secondary-700 mb-2">Shipping Address</h3>
                                                    <p>{watch('shippingAddress.street')}</p>
                                                    <p>{watch('shippingAddress.city')}, {watch('shippingAddress.state')} {watch('shippingAddress.zipCode')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="btn btn-secondary btn-lg"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="btn btn-primary btn-lg flex items-center space-x-2"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <LoadingSpinner size="small" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <span>Place Order • ${totals.total.toFixed(2)}</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-secondary-700">
                                        <span>Subtotal ({totals.itemCount} items)</span>
                                        <span>${totals.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary-700">
                                        <span>Tax</span>
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
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span className="text-primary-600">${totals.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Features */}
                                <div className="space-y-3 text-sm text-secondary-600">
                                    <div className="flex items-center space-x-2">
                                        <Shield size={16} className="text-green-600" />
                                        <span>Secure SSL Encryption</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Check size={16} className="text-green-600" />
                                        <span>30-Day Return Policy</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Check size={16} className="text-green-600" />
                                        <span>100% Secure Checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}