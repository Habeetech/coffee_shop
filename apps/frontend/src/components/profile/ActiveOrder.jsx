import OrderTimeline from "./OrderTimeline"
import TextButton from "../buttons/TextButton.jsx"

export default function ActiveOrder({activeOrders}) {
    return (
        <div className="db-section-content">
            {(activeOrders && activeOrders.length > 0) ? activeOrders.map(order => <div
                key={order._id}
                className="active-orders"
            >
                <OrderTimeline
                    status={order?.status}
                />
                 <h3>Order ({order?._id})</h3>
                <div className="order-items-summary">
                   
                    {order?.items.map(
                        item => <div className="order-item-details"
                            key={item?._id}
                        >
                            <p>Name: {`${item.name} (${item?.options?.size?.label} x ${item.quantity})`}</p>
                            <div className="order-item-extras">Extras: {
                                (item?.options.extras) ?
                                    item?.options?.extras.map((e, i) =>
                                        <p
                                            key={e._id}
                                        >{e.label}
                                            {i < (item.options.extras.length - 1) ? ", " :
                                            i === (item.options.extras.length - 1) ? "." :

                                             ""}
                                        </p>
                                    ) : "None"
                            }</div>
                            <p>Price: {`£ ${item.price.toFixed(2)}`}</p>
                        </div>
                    )}
                    
                </div>
                <p>£ {order.total.toFixed(2)}</p>
            </div>) : <p>You have no active order(s) <TextButton
                onClick={() => nav("/menu")}
            >Go to menu</TextButton></p>}
        </div>
    )
}