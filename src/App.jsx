import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Product from "./components/Product";
import Register from "./Auth/Reg";
import Login from "./Auth/Login";
import Dashboard from "./Auth/Dashboard";
import Role from "./Auth/Role";




const App = () => {
  const [isLoggedin, setisLoggedin] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLogged')
    if (loggedIn === 'true') {
      setisLoggedin(true)
    }
  }, [])
  return (
    <>
      <Router>
        <Navbar isLoggedin={isLoggedin} setisLoggedin={setisLoggedin} />
        <Routes>
          <Route path="/" element={<ProductList isLoggedin={isLoggedin} />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login setisLoggedin={setisLoggedin} />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard isLoggedin={isLoggedin} setisLoggedin={setisLoggedin} />} />
          <Route path="/seller" element={<Role />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;