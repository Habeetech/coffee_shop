export default function ({ order }) {
    return (
        <div className="order-items-summary">

            {order?.items.map(
                item => <div className="order-item-details"
                    key={item._id + JSON.stringify(item.options || "")}
                >
                    <p>Name: {`${item.name} (${item?.options?.size?.label || ""} x ${item.quantity})`}</p>
                    {item?.options?.milk && <p>Milk: {item.options.milk.label
                        ?
                    item.options.milk.label : "No preferance"}</p>}
                    {item?.options?.syrup && <p>Syrup: {item.options.syrup.label
                        ?
                    item.options.syrup.label : "No syrup"}</p>}
                    {(item?.options?.extras && item?.options?.extras.length) > 0 && <div className="order-item-extras">Extras: {
                        item?.options?.extras.map((e, i) =>
                            <p
                                key={e._id}
                            >{e.label}
                                {i < (item.options.extras.length - 1) ? ", " :
                                    i === (item.options.extras.length - 1) ? "." :

                                        ""}
                            </p>
                        )
                    }</div>}
                    <p>Price: {`£ ${item.price.toFixed(2)}`}</p>
                </div>
            )}

        </div>
    )
}