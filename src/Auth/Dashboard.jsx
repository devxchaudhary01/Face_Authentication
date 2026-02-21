import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ isLoggedin, setisLoggedin }) => {
  const [user, setUser] = useState(null)
  const [load, setLoad] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const navigate = useNavigate()
  // editable fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [photo, setPhoto] = useState('')

  const stats = [
    { title: 'Total Orders', value: 12 },
    { title: 'Wishlist Items', value: 5 },
    { title: 'Cart Items', value: 3 },
  ]

  //logout button 
  const handlelogout = () => {
    localStorage.removeItem('isLogged')
    setisLoggedin(false)
    navigate('/')
  }

  useEffect(() => {
    const logindata = JSON.parse(localStorage.getItem('profile'))

    if (!logindata?.email) {
      setLoad(false)
      return
    }

    const apidata = async () => {
      try {
        const res = await fetch('http://localhost:5000/usersdata')
        const data = await res.json()

        const matchedUser = data.find(u => u.email === logindata.email)

        if (matchedUser) {
          setUser(matchedUser)
          setName(matchedUser.userName)
          setEmail(matchedUser.email)
          toast.success(`Welcome back ${matchedUser.userName} 🎉`)
        } else {
          toast.error('User not found')
        }
      } catch {
        toast.error('Something went wrong ❌')
      } finally {
        setLoad(false)
      }
    }

    apidata()
  }, [])

  // image upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  // save profile
  const saveProfile = async () => {
    if (!name || !email) {
      toast.error('Name & Email are required')
      return
    }

    try {
      const updatedUser = {
        ...user,
        userName: name,
        email: email,
        profilePhoto: photo || user.profilePhoto,
        ...(password && { password }) // update only if changed
      }

      await fetch(`http://localhost:5000/usersdata/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })

      setUser(updatedUser)
      localStorage.setItem('profile', JSON.stringify({ email }))
      setEditMode(false)
      setPassword('')
      setPhoto('')
      toast.success('Profile updated successfully ✅')
    } catch {
      toast.error('Update failed ❌')
    }
  }

  if (load) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">User not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePhoto || 'https://via.placeholder.com/80'}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome 🎉 {user.userName}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <span className={`px-4 py-1 rounded-full text-sm font-semibold
            ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {user.role === 'admin' ? 'Admin 👑' : 'User 👤'}
          </span> <span>{user.id}</span>
          <button onClick={handlelogout}>Logout</button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-5 rounded-xl">
              <p className="text-sm opacity-80">{s.title}</p>
              <h2 className="text-3xl font-bold">{s.value}</h2>
            </div>
          ))}
        </div>

        {/* EDIT PROFILE */}
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button onClick={() => setEditMode(!editMode)} className="text-indigo-600">
              {editMode ? 'Close' : 'Edit'}
            </button>
          </div>

          {editMode && (
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Username"
                className="w-full p-2 border rounded"
              />

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />

              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="New Password (optional)"
                className="w-full p-2 border rounded"
              />

              <input type="file" accept="image/*" onChange={handlePhotoUpload} />

              {photo && (
                <img src={photo} alt="preview" className="w-24 h-24 rounded-full object-cover" />
              )}

              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default Dashboard
