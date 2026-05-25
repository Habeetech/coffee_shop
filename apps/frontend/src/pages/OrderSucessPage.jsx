import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import SpinnerWrapper from "../components/SpinnerWrapper.jsx";
import Spinner from "../components/Spinner.jsx";
import TextButton from "../components/buttons/TextButton";
import api from "../api/api.js";
import "../styles/OrderSuccessPage.css"
import useUserStore from "../store/useUserStore.js";

export default function OrderSuccessPage() {
    const [orderDetails, setOrderDetails] = useState(null);
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading"); 
    const [isRefreshing, setIsRefreshing] = useState(false);
    const clearCart = useCartStore(state => state.clearCart);
    const timeoutIdRef = useRef(null);
   const refreshUser = useUserStore((state) => state.refreshUser);

    const orderId = searchParams.get("orderId");

    const fetchOrder = useCallback(async (isManual = false) => {
        if (!orderId) {
            setStatus("error");
            return;
        }

        if (isManual) setIsRefreshing(true);

        try {
          
            const res = await api.get(`/api/orders/${orderId}`);
            const data = res.data;

            if (data?.success) {
                const order = data.order;
                setOrderDetails(order);


                if (order.paymentMethod === "collection" || order.status === "paid") {
                    setStatus("complete");
                    clearCart();
                     refreshUser()
                    return "complete";
                }

           
                if (isManual) {
                    setStatus("failed");
                } else {
                    setStatus("pending");
                }
                return "pending";
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Fetch error:", err.response?.data?.message || err.message);
            setStatus("error");
        } finally {
            if (isManual) setIsRefreshing(false);
        }
        return null;
    }, [orderId, clearCart]);

    useEffect(() => {
        let pollCount = 0;
        const maxPolls = 5;
        const pollInterval = 2000;

        const startPolling = async () => {
            const currentStatus = await fetchOrder();

            if (currentStatus === "pending" && pollCount < maxPolls) {
                pollCount++;
                timeoutIdRef.current = setTimeout(startPolling, pollInterval);
            } else if (currentStatus === "pending" && pollCount >= maxPolls) {
                setStatus("failed");
            }
        };

        startPolling();

        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        };
    }, [fetchOrder]);

    if (status === "loading") return <SpinnerWrapper
    spinner={<Spinner />}
    />;

    return (
        <main className="success-container">
            {status === "complete" && (
                <div className="order-status-card success-view">
                    <h2 className="status-title">Order Confirmed!</h2>
                    <p className="customer-greeting">Thank you, {orderDetails?.customer?.firstName || "Customer"}!</p>

                    <div className={`status-badge status-badge--${orderDetails?.paymentMethod}`}>
                        {orderDetails?.paymentMethod === "collection"
                            ? "Pay on Collection"
                            : "Payment Verified"}
                    </div>

                    <p className="order-reference">
                        <strong>Order ID:</strong> <span className="id-number">{orderDetails?._id}</span>
                    </p>
                    
                    <div className="navigation-actions">
                        <Link to="/menu"><TextButton>Order More</TextButton></Link>
                    </div>
                </div>
            )}

            {status === "pending" && (
                <div className="order-status-card pending-view">
                    <h2 className="status-title">Confirming Payment...</h2>
                    <div className="spinner-wrapper">
                        <SpinnerWrapper
                        spinner={<Spinner />}
                        />
                    </div>
                    <p className="status-message">
                        Hang tight, we're verifying your transaction with Stripe.
                    </p>
                </div>
            )}

            {status === "failed" && (
                <div className="order-status-card failed-view">
                    <h2 className="status-title">Verification Delayed</h2>
                    <p className="status-message">We haven't received confirmation from Stripe yet.</p>

                    <div className="manual-refresh-section">
                        <p className="refresh-status">
                            <strong>Status:</strong> {isRefreshing ? "Checking..." : "Still Pending"}
                        </p>
                        <button 
                            className="text-button"
                            disabled={isRefreshing}
                            onClick={() => fetchOrder(true)}
                        >
                            {isRefreshing ? "Verifying..." : "Check Status Again"}
                        </button>
                    </div>

                    <div className="support-info">
                        <p>
                            If your card was charged but this hasn't updated, please contact support with your Order ID:
                        </p>
                        <span className="order-id-highlight">{orderDetails?._id || orderId}</span>
                    </div>

                    <div className="navigation-actions">
                        <Link to="/menu"><TextButton>Back to Menu</TextButton></Link>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="order-status-card error-view">
                    <h2 className="status-title">Oops!</h2>
                    <p className="status-message">We're having trouble retrieving your order details.</p>
                    <div className="navigation-actions">
                        <TextButton onClick={() => fetchOrder(true)}>Try Again</TextButton>
                        <Link to="/menu"><TextButton>Back to Menu</TextButton></Link>
                    </div>
                </div>
            )}
        </main>
    );
}