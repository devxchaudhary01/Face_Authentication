import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import Camera from './Camera'
import { loadFaceModels, getFaceDescriptor } from '../services/faceApi.service'

const Register = () => {
    const navigate = useNavigate()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadFaceModels()
    }, [])

    const user = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
        },

        validationSchema: Yup.object({
            userName: Yup.string().min(2).max(30).required(),
            email: Yup.string().email().required(),
            password: Yup.string()
                .min(6)
                .matches(/[A-Z]/)
                .matches(/[a-z]/)
                .matches(/[0-9]/)
                .matches(/[@$!%*?&#]/)
                .required(),
        }),

        onSubmit: async (values, { resetForm, setFieldError }) => {
            try {
                if (!video) {
                    alert('Camera not ready')
                    return
                }

                setLoading(true)

                // 1️⃣ Check existing email
                const res = await fetch(
                    `http://localhost:5000/usersdata?email=${values.email}`
                )
                const data = await res.json()

                if (data.length > 0) {
                    setFieldError('email', 'Email already registered')
                    setLoading(false)
                    return
                }

                // 2️⃣ Capture face
                const detection = await getFaceDescriptor(video)
                if (!detection) {
                    alert('Face not detected')
                    setLoading(false)
                    return
                }

                // 3️⃣ Capture image from video
                const canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                const ctx = canvas.getContext('2d')
                ctx.drawImage(video, 0, 0)
                const faceImage = canvas.toDataURL('image/jpeg')

                // 4️⃣ Final payload
                const payload = {
                    ...values,
                    faceDescriptor: Array.from(detection.descriptor),
                    faceImage,
                }

                // 5️⃣ Save user
                await fetch('http://localhost:5000/usersdata', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })

                resetForm()
                navigate('/login')
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
            <motion.form
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={user.handleSubmit}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-3">
                        <UserPlus size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Face-secured registration
                    </p>
                </div>

                {/* Username */}
                <input
                    name="userName"
                    placeholder="Username"
                    value={user.values.userName}
                    onChange={user.handleChange}
                    className="w-full px-4 py-3 mb-3 border rounded-xl"
                />

                {/* Email */}
                <input
                    name="email"
                    placeholder="Email"
                    value={user.values.email}
                    onChange={user.handleChange}
                    className="w-full px-4 py-3 mb-3 border rounded-xl"
                />

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.values.password}
                    onChange={user.handleChange}
                    className="w-full px-4 py-3 mb-4 border rounded-xl"
                />

                {/* Camera */}
                <div className="mb-4 flex justify-center">
                    <Camera onVideoReady={setVideo} />
                </div>

                {/* Submit */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                >
                    {loading ? 'Registering...' : 'Sign Up with Face'}
                </motion.button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-indigo-600 font-semibold cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </motion.form>
        </div>
    )
}

export default Register
