import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import Spinner from "../components/Spinner.jsx";
import TextButton from "../components/buttons/TextButton";

export default function OrderSuccessPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const clearCart = useCartStore(state => state.clearCart);

    const clientSecret = searchParams.get("payment_intent_client_secret");

    useEffect(() => {
        if (!clientSecret) {
            setStatus("error");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientSecret })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setStatus("success");
                clearCart();
            } else {
                setStatus("error");
            }
        })
        .catch(() => setStatus("error"));
    }, [clientSecret, clearCart]);

    if (status === "loading") return <Spinner />;

    return (
        <main className="success-container">
            {status === "success" ? (
                <>
                    <h1>Order Confirmed! ☕</h1>
                    <p>Your caffeine is on the way.</p>
                    <Link to="/menu"><TextButton>Order More</TextButton></Link>
                </>
            ) : (
                <>
                    <h1>Something went wrong</h1>
                    <p>We couldn't verify your payment. Please contact support.</p>
                </>
            )}
        </main>
    );
}