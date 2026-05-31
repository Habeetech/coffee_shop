import { useEffect, useState } from "react";
import api from "../../api/api.js";
import Spinner from "../Spinner.jsx";
import { Link } from "react-router-dom";
import OrderSummary from "../profile/OrderSummary.jsx";
import CloseModal from "../buttons/CloseModal.jsx";
import TextButton from "../buttons/TextButton.jsx";
import SpinnerWrapper from "../SpinnerWrapper.jsx";
import useOrderStore from "../../store/useOrdersStore.js";

export default function OrderDetailsModal({ orderId, onClose }) {
    const orders = useOrderStore(s => s.orders);
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const foundLocalOrder = orders.find((o) => String(o._id) === String(orderId));

        if (foundLocalOrder) {
            setOrder(foundLocalOrder);
            setLoading(false);
            return;
        }

        async function fetchFallbackOrder() {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/api/orders/${orderId}`);
                const orderData = response.data.order || response.data;
                setOrder(orderData);
            } catch (err) {
                console.error("Error fetching fallback order metadata:", err);
                setError("Could not retrieve order details from server.");
            } finally {
                setLoading(false);
            }
        }

        if (orderId) {
            fetchFallbackOrder();
        }
    }, [orderId, orders]); 
    return (
        <div className="order-notification-container">
            <CloseModal onClose={onClose} className="close-msg" />
            <div className="modal-content">
                
                {loading && (
                    <SpinnerWrapper 
                    spinner={<Spinner/>}
                    />
                )}

                {error && <div className="error">{error}</div>}

                {!loading && !error && order && (
                    <div className="order-notification-msg">
                        <div>
                            <p>
                                Hi {order?.customer?.firstName || "Customer"},
                            </p>
                            <p>
                                Thank you for your order!<br/> We have received your payment and our team is preparing your items.<br/> Here is a summary of your transaction details:
                            </p>
                        </div>

                        <div>
                                <p className="">Order Id: {order?._id}</p>
                                   <p>Payment Method {order?.paymentMethod}</p>
                                <span className={`status-badge status-badge--${order?.paymentMethod}`}>
                                    {order?.status}
                                </span>
                        </div>

                        <div>
                            <h3>Delivery Details</h3>
                            <div>
                                <p>
                                    {order?.customer?.firstName} {order?.customer?.lastName}
                                </p>
                                <p>{order?.customer?.email}</p>
                                <p>
                                    {order?.customer?.address?.street}, {order?.customer?.address?.city}, {order?.customer?.address?.postal}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3>Items Ordered</h3>
                            <OrderSummary order={order} />
                        </div>

                        <div>
                            <span className="order-total">
                                Total {`£ ${order?.total?.toFixed(2)}`}
                            </span>
                        </div>

                        <div>
                            <p>If you have any questions about this order, <Link to="/contact-support"><TextButton>please contact our support team.</TextButton></Link></p>
                            <p className="signature">Cheers</p>
                            <p className="brand-name">CoffeeShop</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}