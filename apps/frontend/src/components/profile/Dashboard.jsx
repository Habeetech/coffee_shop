import useOrdersStore from "../../store/useOrdersStore.js"
import TextButton from "../buttons/TextButton.jsx"
import { useNavigate } from "react-router-dom"
import { MenuItem } from "../menu/MenuItem.jsx"

export default function Dashboard() {
    const nav = useNavigate()
    const { activeOrders, recentOrders, frequentOrders, orders } = useOrdersStore();
    return (<main>
        <div className="track-order-container">
            <h2 className="track-order-title">Track Order</h2>
            <div className="track-orders">
                {(activeOrders && activeOrders.length > 0) ? activeOrders.map(order => <div
                key={order._id}
                >
                    <h3>Order Id: {order._id}</h3>
                    <p>Status: {order.status}</p>
                </div>) : <p>You have no active order(s) <TextButton
                    onClick={() => nav("/menu")}
                >Go to menu</TextButton></p>}
            </div>
        </div>
        <div className="frequent-orders-container">
            <h2 className="frequent-orders-title">Frequently ordered</h2>
            <div className="frequent-orders">
                {(frequentOrders && frequentOrders.length > 0) ?
                    frequentOrders.map(item => 
                      /*    <MenuItem 
                        imageUrl={item.url}
                        value={item}
                        /> */""
                    ) : <p>You have not placed any order
                        <TextButton
                            onClick={() => nav("/menu")}
                        >Go to menu</TextButton></p>}
            </div>
        </div>
        <div className="recent-order-container">
            <h2 className="recent-order-title">Order again</h2>
            <div className="recent-order">

            </div>
        </div>
        <div className="favorite-products-container">
            <h2 className="favorite-product-title">Favorites</h2>
            <div className="favourite-products">

            </div>
        </div>
        <div className="loyalty-container">
            <h2 className="loyalty-title">Rewards</h2>
            <div className="loyalty-progress">

            </div>
        </div>
    </main>)
}