import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, MapPin, Save, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, updateProfile } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            address: {
                street: user?.address?.street || '',
                city: user?.address?.city || '',
                state: user?.address?.state || '',
                zipCode: user?.address?.zipCode || '',
                country: user?.address?.country || 'USA'
            }
        }
    })

    const onSubmit = async (data) => {
        setIsUpdating(true)
        const result = await updateProfile(data)
        setIsUpdating(false)

        if (result.success) {
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        reset({
            name: user?.name || '',
            phone: user?.phone || '',
            address: {
                street: user?.address?.street || '',
                city: user?.address?.city || '',
                state: user?.address?.state || '',
                zipCode: user?.address?.zipCode || '',
                country: user?.address?.country || 'USA'
            }
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-1"
                    >
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full mx-auto mb-4"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                    <User size={48} className="text-primary-600" />
                                </div>
                            )}
                            <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
                            <p className="text-secondary-600 text-sm mb-1">{user?.email}</p>
                            <p className="text-xs text-secondary-500 capitalize">
                                {user?.role} Account
                            </p>

                            <div className="mt-6 pt-6 border-t">
                                <p className="text-sm text-secondary-600">
                                    Member since {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2"
                    >
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Account Information</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-secondary btn-sm flex items-center"
                                    >
                                        <Edit2 size={16} className="mr-2" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="font-medium text-secondary-700 mb-4 flex items-center">
                                            <User size={18} className="mr-2" />
                                            Personal Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Full Name</label>
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            {...register('name', { required: 'Name is required' })}
                                                            className="input"
                                                        />
                                                        {errors.name && (
                                                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="py-2">{user?.name || 'Not set'}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="label">Email</label>
                                                <div className="flex items-center py-2">
                                                    <Mail size={16} className="mr-2 text-secondary-400" />
                                                    <p>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="label">Phone Number</label>
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="tel"
                                                        {...register('phone')}
                                                        className="input"
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                </>
                                            ) : (
                                                <div className="flex items-center py-2">
                                                    <Phone size={16} className="mr-2 text-secondary-400" />
                                                    <p>{user?.phone || 'Not set'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div>
                                        <h3 className="font-medium text-secondary-700 mb-4 flex items-center">
                                            <MapPin size={18} className="mr-2" />
                                            Shipping Address
                                        </h3>
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="label">Street Address</label>
                                                    <input
                                                        type="text"
                                                        {...register('address.street')}
                                                        className="input"
                                                        placeholder="123 Main St"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="label">City</label>
                                                        <input
                                                            type="text"
                                                            {...register('address.city')}
                                                            className="input"
                                                            placeholder="New York"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label">State</label>
                                                        <input
                                                            type="text"
                                                            {...register('address.state')}
                                                            className="input"
                                                            placeholder="NY"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label">ZIP Code</label>
                                                        <input
                                                            type="text"
                                                            {...register('address.zipCode')}
                                                            className="input"
                                                            placeholder="10001"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {user?.address?.street ? (
                                                    <div className="space-y-1">
                                                        <p>{user.address.street}</p>
                                                        <p>
                                                            {user.address.city}, {user.address.state} {user.address.zipCode}
                                                        </p>
                                                        <p>{user.address.country}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-secondary-500">No address saved</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Account Settings */}
                                    <div>
                                        <h3 className="font-medium text-secondary-700 mb-4">Account Settings</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2">
                                                <div>
                                                    <p className="font-medium">Google Account</p>
                                                    <p className="text-sm text-secondary-600">
                                                        Your account is linked with Google
                                                    </p>
                                                </div>
                                                <span className="text-green-600 text-sm font-medium">Connected</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div>
                                                    <p className="font-medium">Account Type</p>
                                                    <p className="text-sm text-secondary-600">
                                                        Your current account privileges
                                                    </p>
                                                </div>
                                                <span className="text-primary-600 text-sm font-medium capitalize">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {isEditing && (
                                        <div className="flex justify-end space-x-4 pt-6 border-t">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="btn btn-secondary btn-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="btn btn-primary btn-md flex items-center"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} className="mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}