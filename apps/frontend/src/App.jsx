import './App.css'
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from './pages/CheckoutPage.jsx';
import MainLayout from "../src/layouts/MainLayout.jsx"
import OrderSuccessPage from './pages/OrderSucessPage.jsx';
import UnAuthenticatedLayout from './layouts/UnauthenticatedLayout.jsx';
import ProtectedGuard from './guards/ProtectedGuard.jsx';
import GuestGuard from './guards/GuestGuard.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from './pages/RegisterPage.jsx';
import { Routes, Route } from "react-router-dom";
import useIdleTimer from './hooks/useIdleTimer.js';


function App() {
  useIdleTimer();
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
      </Route>
      <Route element={<GuestGuard />} >
        <Route element={<UnAuthenticatedLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedGuard />}>
      </Route>
    </Routes>
  )
}

export default App
