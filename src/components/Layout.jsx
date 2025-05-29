import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function Layout() {
    const checkAuth = useAuthStore((state) => state.checkAuth)
    const initCart = useCartStore((state) => state.initCart)

    useEffect(() => {
        // Check auth status on mount
        checkAuth()
        // Initialize cart
        initCart()
    }, [checkAuth, initCart])

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}