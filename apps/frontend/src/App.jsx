import { useState } from 'react'

import './App.css'
import Home from "./pages/Home.jsx";
import MainLayout from "../src/layouts/MainLayout.jsx"
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
