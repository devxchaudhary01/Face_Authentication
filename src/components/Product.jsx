import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const Product = () => {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [editData, seteditData] = useState({
        title: "",
        price: "",
        thumbnail: ""
    })

    const { id } = useParams()

    useEffect(() => {
        fetch(`http://localhost:5000/products/${id}`)
            .then(res => res.json())
            .then(res => {
                setData(res);
                seteditData({
                    title: res.title,
                    price: res.price,
                    thumbnail: res.thumbnail
                })
            })
    }, [id])


    const handlechange = (e) => {
        seteditData({
            ...editData,
            [e.target.name]: e.target.value
        })
    }

    //update api
    const handleupdate = () => {
        fetch(`http://localhost:5000/products/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                ...editData
            })
        })
            .then(res => res.json())
            .then(updated => {
                setData(updated)
                toast.success('Product Updated 🎉')
            })

        seteditData({
            title: '',
            thumbnail: '',
            price: ''
        })

    }

    //delete function
    const handleDelete = () => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");

        if (!confirmDelete) return;

        fetch(`http://localhost:5000/products/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {

                    window.history.back(); // go to previous page
                    navigate('/')

                }
            })
            .catch(err => console.error(err));
    };


    if (!data) return <h2>Loading... data</h2>
    return (
        <>
            <div className="bg-gray-600 flex flex-wrap  text-white min-w-full min-h-screen text-2xl">
                <img src={data.thumbnail} alt={data.title}
                    className="w-96 m-20 h-96 hover:scale-110 border-2 border-white shadow-xl shadow-pink-300 rounded-2xl"
                />
                <div className="m-32 text-3xl font-bold">
                    <h2>{data.title}</h2>
                    <h2>₹{data.price}</h2>
                    <button className="shadow-md shadow-pink-600 m-3 p-5 rounded-2xl hover hover:text-green-400 hover:scale-110">ADD TO CART</button>
                    <br />
                    <button className="shadow-md shadow-pink-600 m-3 p-5 rounded-2xl hover hover:text-green-400 hover:scale-110">PLACE ORDER</button>
                </div>
            </div>

            <div className="absolute top-6 right-6">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-4xl text-white  font-bold hover:text-pink-400"
                >
                    ⋮
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 bg-white text-black rounded-xl shadow-lg w-40">
                        <button
                            onClick={() => {
                                setShowModal(true);
                                setShowMenu(false);
                            }}
                            className="block w-full px-4 py-3 hover:bg-gray-100 text-left"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            className="block w-full px-4 py-3 hover:bg-red-100 text-red-600 text-left"
                        >
                            🗑 Delete
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-[400px] shadow-xl animate-scale">

                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Edit Product
                        </h2>

                        <input
                            type="text"
                            name="title"
                            value={editData.title}
                            onChange={handlechange}
                            className="border p-2 w-full mb-3"
                            placeholder="Title"
                        />

                        <input
                            type="number"
                            name="price"
                            value={editData.price}
                            onChange={handlechange}
                            className="border p-2 w-full mb-3"
                            placeholder="Price"
                        />

                        <input
                            type="url"
                            name="thumbnail"
                            value={editData.thumbnail}
                            onChange={handlechange}
                            className="border p-2 w-full mb-3"
                            placeholder="Image URL"
                        />

                        <img
                            src={editData.thumbnail}
                            alt="preview"
                            className="w-full h-32 object-contain mb-4"
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    handleupdate();
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <ToastContainer autoClose={2000} />
        </>
    )
}

export default Product