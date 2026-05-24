import OrderSummary from "./OrderSummary";
import PrimaryButton from "../buttons/PrimaryButton.jsx"
import useCartStore from "../../store/useCartStore.js";
import TextButton from "../buttons/TextButton.jsx"


export default function OrderAgain({ recentOrders }) {

    const openCart = useCartStore(state => state.openCart);
    const addItem = useCartStore(state => state.addItem);

    function handleOrder (items) {
        if (!items || items.length <= 0)
            return;
        items.map(item => {
            addItem(item);
        })
        openCart()
        return
    }
    return (

        <div className="db-section-content">
            {(recentOrders && recentOrders.length > 0) ? recentOrders.map(order =>
                <div
                    key={order._id}
                    className="recent-orders"
                >
                    <h3>Order ({order?._id})</h3>
                    <OrderSummary
                        order={order}
                    />
                    <p>£ {order.total.toFixed(2)}</p>
                    <PrimaryButton
                    onClick={() => handleOrder(order.items)}
                    >Re Order</PrimaryButton>
                </div>) : <p>You have no recent order(s) <TextButton
                    onClick={() => nav("/menu")}
                >Go to menu</TextButton></p>}
        </div>
    )
}