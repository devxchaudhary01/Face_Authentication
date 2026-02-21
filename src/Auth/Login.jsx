import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Camera from './Camera'
import {
  loadFaceModels,
  getFaceDescriptor,
  compareFaces,
} from '../services/faceApi.service'

const Login = ({ setisLoggedin }) => {
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [showFaceLogin, setShowFaceLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFaceModels()
  }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required(),
      password: Yup.string().min(6).required(),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch('http://localhost:5000/usersdata')
        const users = await response.json()

        const user = users.find(
          u => u.email === values.email && u.password === values.password
        )

        if (user) {
          toast.success('Login successful 🎉')
          localStorage.setItem('profile', JSON.stringify(user))
          localStorage.setItem('isLogged', 'true')
          setisLoggedin(true)

          resetForm()
          setTimeout(() => navigate('/'), 1000)
        } else {
          toast.error('Invalid email or password ❌')
        }
      } catch (error) {
        toast.error('Server error. Please try again!')
        console.error(error)
      }
    },
  })

  // 🔐 FACE LOGIN HANDLER
  const handleFaceLogin = async () => {
    if (!formik.values.email) {
      toast.error('Enter email first')
      return
    }

    if (!video) {
      toast.error('Camera not ready')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('http://localhost:5000/usersdata')
      const users = await response.json()

      const user = users.find(u => u.email === formik.values.email)

      if (!user || !user.faceDescriptor) {
        toast.error('Face not registered for this email')
        setLoading(false)
        return
      }

      const detection = await getFaceDescriptor(video)
      if (!detection) {
        toast.error('No face detected')
        setLoading(false)
        return
      }

      const match = compareFaces(
        user.faceDescriptor,
        detection.descriptor
      )

      if (match.label !== 'unknown') {
        toast.success('Face login successful 🎉')
        localStorage.setItem('profile', JSON.stringify(user))
        localStorage.setItem('isLogged', 'true')
        setisLoggedin(true)

        setTimeout(() => navigate('/'), 1000)
      } else {
        toast.error('Face not matched ❌')
      }
    } catch (err) {
      console.error(err)
      toast.error('Face login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* Password */}
          {!showFaceLogin && (
            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          )}

          {/* EMAIL/PASSWORD LOGIN */}
          {!showFaceLogin && (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Login
            </button>
          )}

          {/* FACE LOGIN */}
          {showFaceLogin && (
            <>
              <div className="flex justify-center my-4">
                <Camera onVideoReady={setVideo} />
              </div>

              <button
                type="button"
                onClick={handleFaceLogin}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Scanning Face...' : 'Login with Face'}
              </button>
            </>
          )}

          {/* TOGGLE */}
          <p
            onClick={() => setShowFaceLogin(!showFaceLogin)}
            className="text-center text-sm mt-4 text-indigo-600 cursor-pointer hover:underline"
          >
            {showFaceLogin
              ? 'Login with password instead'
              : 'Login with face'}
          </p>

          {/* Signup */}
          <p className="text-center mt-4 text-gray-600">
            Don&apos;t have an account?
            <span
              onClick={() => navigate('/signup')}
              className="text-indigo-600 font-semibold cursor-pointer ml-1"
            >
              Signup
            </span>
          </p>
        </form>
      </div>

      <ToastContainer autoClose={1500} />
    </>
  )
}

export default Login
