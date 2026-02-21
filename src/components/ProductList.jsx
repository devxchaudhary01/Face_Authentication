import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProductList = ({ isLoggedin }) => {
    const [data, setData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(res => setData(res))
    }, [])

    const handleViewDetail = (id) => {
        if (!isLoggedin) {
            navigate('/login')
        } else {
            navigate(`/product/${id}`)
        }
    }

    return (
        <div className='min-h-screen min-w-full flex flex-wrap bg-gray-300 text-2xl text-white cursor-pointer'>
            {data.map(item => (
                <div className='p-5' key={item.id}>
                    <img
                        className='w-44 h-44 m-5 rounded-2xl p-3 object-cover border-b-4 border-white'
                        src={item.thumbnail}
                        alt={item.title}
                    />

                    <button
                        onClick={() => handleViewDetail(item.id)}
                        className='text-white bg-yellow-500 p-3 rounded-2xl cursor-pointer'
                    >
                        View Detail
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ProductList
