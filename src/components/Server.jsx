import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Server = () => {
    const [data, setData] = useState([])
    const Navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:5000/products')
        .then(res => res.json())
        .then(res => setData(res))
    }, [])

  return (
   <>
   <h1>Hii i am server jsx page</h1>
   <div className='min-h-screen min-w-full flex flex-wrap bg-gray-600 text-2xl text-white cursor-pointer'>
    {data.map(item => (
        <div className=
        ' p-5' key={item.id}>
            <img
            className='w-44 h-44  border border-black m-5 rounded-2xl p-3 content-center object-cover'
            src={item.thumbnail} alt={item.title} />
            <button
            onClick={() => Navigate(`/product/${item.id}`)}
            className='text-white text-center bg-gray-500 p-3 rounded-2xl cursor-pointer'>View Detail</button>
        </div>
    ))}
   </div>
   </>
  )
}

export default Server
