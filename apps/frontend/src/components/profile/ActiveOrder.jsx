import OrderTimeline from "./OrderTimeline"
import TextButton from "../buttons/TextButton.jsx"
import OrderSummary from "./OrderSummary.jsx"

export default function ActiveOrder({activeOrders}) {
    return (
        <div className="db-section-content">
            {(activeOrders && activeOrders.length > 0) ? activeOrders.map(order => 
            <div
                key={order._id}
                className="active-orders"
            >
                <OrderTimeline
                    status={order?.status}
                />
                 <h3>Order ({order?._id})</h3>
                <OrderSummary 
                order={order} 
                />                
                                <p>£ {order.total.toFixed(2)}</p>
            </div>) : <p>You have no active order(s) <TextButton
                onClick={() => nav("/menu")}
            >Go to menu</TextButton></p>}
        </div>
    )
}