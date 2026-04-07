import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import Spinner from "../components/Spinner.jsx";
import TextButton from "../components/buttons/TextButton";

export default function OrderSuccessPage() {
    const [orderDetails, setOrderDetails] = useState(null);
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const clearCart = useCartStore(state => state.clearCart);

    const orderId = searchParams.get("orderId");
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        let pollCount = 0;
        const maxPolls = 5; 
        const pollInterval = 2000; 

        const fetchOrder = async () => {
            if (!orderId) {
                setStatus("error");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/orders/${orderId}`);
                const data = await res.json();

                if (data?.success) {
                    setOrderDetails(data.order);
                    console.log(data.order);

                    if (data.order.status !== "paid" && pollCount < maxPolls) {
                        pollCount++;
                        setTimeout(fetchOrder, pollInterval);
                    } else {
                        setStatus("success");
                        clearCart();
                    }
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setStatus("error");
            }
        };

        fetchOrder();
    }, [orderId, clearCart, API_URL]);

    if (status === "loading") return <Spinner />;

    return (
        <main className="success-container">
            {status === "success" ? (
                <div className="text-center">
                    <h2>Order Confirmed! ☕</h2>
                    <p>Thank you, {orderDetails?.customer.firstName || "Customer"}!</p>
                    
                    <div className={`status-badge ${orderDetails?.status}`}>
                        {orderDetails?.status === "paid" 
                            ? "Payment Verified ✅" 
                            : "Processing Payment... ⏳"}
                    </div>

                    <p className="mt-4"><strong>Order ID:</strong> {orderDetails?._id}</p>
                    <Link to="/menu"><TextButton>Order More</TextButton></Link>
                </div>
            ) : (
                <div className="text-center">
                    <h2>Oops!</h2>
                    <p>We're having trouble verifying your order status.</p>
                    <Link to="/menu"><TextButton>Back to Menu</TextButton></Link>
                </div>
            )}
        </main>
    );
}