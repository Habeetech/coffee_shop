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
import ProfileLayout from './layouts/ProfileLayout.jsx';
import { Routes, Route, useNavigate } from "react-router-dom";
import useIdleTimer from './hooks/useIdleTimer.js';
import ManageMenu from "./components/profile/ManageMenu.jsx"
import ManageOrder from "./components/profile/ManageOrder.jsx"
import UserSettings from "./components/profile/UserSettings.jsx"
import UserOrders from "./components/profile/UserOrders.jsx"
import Dashboard from "./components/profile/Dashboard.jsx"
import EditProfile from "./components/profile/EditProfile.jsx"
import RoleGuard from './guards/RoleGuard.jsx';
import useUserStore from './store/useUserStore.js';
import { useEffect } from 'react';

function App() {
  useIdleTimer();

  const navigate = useNavigate();
  const setNavigateToLogin = useUserStore((s) => s.setNavigateToLogin);
  useEffect(() => {
    setNavigateToLogin(() => navigate("/login"));
  }, [navigate]);

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
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="your-orders" element={<UserOrders />} />
            <Route path="settings" element={<UserSettings />} />

            <Route element={<RoleGuard allowed={["manager", "admin"]} />}>
              <Route path="manage-menu" element={<ManageMenu />} />
              <Route path="manage-order" element={<ManageOrder />} />
            </Route>
          </Route>
        </Route>
      </Route>

    </Routes>
  )
}

export default App
