import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Gamepad2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'


export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const login = useAuthStore((state) => state.login)
    const syncCart = useCartStore((state) => state.syncCart)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const from = location.state?.from?.pathname || '/'

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true)
        setError('')

        try {
            // The credential response contains the ID token
            const result = await login(credentialResponse.credential)

            if (result.success) {
                // Sync cart after login
                await syncCart()
                navigate(from, { replace: true })
            } else {
                setError(result.error || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('An error occurred during login. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.')
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <Gamepad2 size={48} className="text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome to Gaming Store</h2>
                    <p className="mt-2 text-secondary-600">
                        Sign in to access your account and track orders
                    </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2"
                        >
                            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    <div className="relative">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="rectangular"
                            logo_alignment="left"
                        />
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <div className="text-center text-sm text-secondary-600">
                        <p>Only pre-approved email addresses can sign in.</p>
                        <p className="mt-1">Contact admin for access.</p>
                    </div>
                </div>

                <div className="text-center text-sm text-secondary-600">
                    <p>
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}