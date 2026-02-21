import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Role = () => {
    const formik = useFormik({
        initialValues: {
            userId: '',
            name: '',
            email: '',
        },

        validationSchema: Yup.object({
            userId: Yup.number()
                .required('User ID is required')
                .positive('Must be positive'),

            name: Yup.string()
                .min(3, 'Minimum 3 characters')
                .required('Name is required'),

            email: Yup.string()
                .email('Invalid email')
                .required('Email is required'),
        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await fetch('http://localhost:5000/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                })

                if (res.ok) {
                    alert('User added successfully ✅')
                    resetForm()
                } else {
                    alert('Something went wrong ❌')
                }
            } catch (error) {
                console.error(error)
            }
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-[380px]"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Create User
                </h2>

                {/* User ID */}
                <div className="mb-4">
                    <input
                        type="number"
                        name="userId"
                        placeholder="User ID"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.userId}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {formik.touched.userId && formik.errors.userId && (
                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.userId}
                        </p>
                    )}
                </div>

                {/* Name */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-6">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {formik.errors.email}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                >
                    Send Request 🚀
                </button>
            </form>
        </div>
    )
}

export default Role
