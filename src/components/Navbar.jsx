import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const Navbar = ({ isLoggedin, setisLoggedin }) => {
  const navigate = useNavigate()
  const [img, setimg] = useState(null)

  const handlelogout = () => {
    localStorage.removeItem('isLogged')
    localStorage.removeItem('profile')
    setisLoggedin(false)
    navigate('/')
  }

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'))
    if (!profile) return

    fetch('http://localhost:5000/usersdata')
      .then(res => res.json())
      .then(data => {
        const user = data.find(u => u.email === profile.email)
        setimg(user)
      })
  }, [])

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-indigo-600 tracking-wide"
        >
          चौdhary<span className="text-pink-500">🛍️</span>
        </Link>

        {/* MENU */}
        <ul className="flex items-center gap-8 text-lg font-semibold">
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Products
            </Link>
          </li>

          <li>
            <Link
              to="/seller"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Become a Seller
            </Link>
          </li>

          {/* PROFILE / LOGIN */}
          <li>
            {isLoggedin ? (
              <div className="flex items-center gap-4">
                
                {/* PROFILE IMAGE */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 hover:scale-105 transition"
                >
                  {img?.faceImage ? (
                    <img
                      src={img.faceImage}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  )}
                </button>

                {/* LOGOUT */}
                <button
                  onClick={handlelogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>

      {/* PAGE CONTENT */}
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default Navbar
