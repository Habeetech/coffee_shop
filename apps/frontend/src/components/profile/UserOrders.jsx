import ActiveOrder from "./ActiveOrder.jsx";
import OrderAgain from "./OrderAgain.jsx";
import useOrderStore from "../../store/useOrdersStore.js";

export default function UserOrders () {
const {recentOrders, activeOrders } = useOrderStore();

    return(<main className="user-orders-container">
        <section className="orders-active-container">
            <h3>Active Orders</h3>
        <ActiveOrder 
        activeOrders={activeOrders}
        />
        </section>
        <section className="orders-completed-container">
            <h3>Completed Orders</h3>
         <OrderAgain
        recentOrders={recentOrders}
        />
        </section>
       
    </main>)
}