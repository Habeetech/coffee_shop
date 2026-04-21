import useOrdersStore from "../../store/useOrdersStore.js"
import TextButton from "../buttons/TextButton.jsx"
import { useNavigate } from "react-router-dom"
import { MenuItem } from "../menu/MenuItem.jsx"

export default function Dashboard() {
    const nav = useNavigate()
   
    const { activeOrders, recentOrders, frequentOrders, orders } = useOrdersStore();
     console.log("orders", orders)
    return (<main className="dashboard-wrapper">
        <h1 className="dashboard-title">Dashboard</h1>
        <section className="db-section-container">
            <h2 className="db-section-title">Track Order</h2>
            <div className="db-section-content">
                {(activeOrders && activeOrders.length > 0) ? activeOrders.map(order => <div
                key={order._id}
                >
                    <h3>Order Id: {order._id}</h3>
                    <p>Status: {order.status}</p>
                </div>) : <p>You have no active order(s) <TextButton
                    onClick={() => nav("/menu")}
                >Go to menu</TextButton></p>}
            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Frequently ordered</h2>
            <div className="db-section-content">
                {(frequentOrders && frequentOrders.length > 0) ?
                    frequentOrders.map(item => 
                        <MenuItem 
                        key={item._id}
                        imageUrl={item.url}
                        value={item}
                        />
                    ) : <p>You have not placed any order
                        <TextButton
                            onClick={() => nav("/menu")}
                        >Go to menu</TextButton></p>}
            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Order again</h2>
            <div className="db-section-content">

            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Favorites</h2>
            <div className="db-section-content">

            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Rewards</h2>
            <div className="db-section-content">

            </div>
        </section>
    </main>)
}