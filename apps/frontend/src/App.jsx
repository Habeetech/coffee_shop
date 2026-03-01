import { useState } from 'react'

import './App.css'
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import MainLayout from "../src/layouts/MainLayout.jsx"
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Route>
    </Routes>
  )
}

export default App
