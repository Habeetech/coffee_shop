import { useState } from 'react'

import './App.css'
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from './pages/CheckoutPage.jsx';
import MainLayout from "../src/layouts/MainLayout.jsx"
import OrderSuccessPage from './pages/OrderSucessPage.jsx';
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Route>
    </Routes>
  )
}

export default App
