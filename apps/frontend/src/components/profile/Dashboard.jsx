import useOrdersStore from "../../store/useOrdersStore.js"
import TextButton from "../buttons/TextButton.jsx"
import { useNavigate } from "react-router-dom"
import { MenuItem } from "../menu/MenuItem.jsx"
import useUserStore from "../../store/useUserStore.js"
import { Heart, Coffee, CupSoda } from "lucide-react";
import TakeAwayCup from "../icons/TakeAwayCup.jsx"
import { useState } from "react"
import ActiveOrder from "./ActiveOrder.jsx"
import OrderAgain from "./OrderAgain.jsx"
import useOptionsStore from "../../store/useOptionsStore.js"
export default function Dashboard() {
    const nav = useNavigate()
    const user = useUserStore(state => state.user);
    const { activeOrders, recentOrders, frequentOrders, orders } = useOrdersStore();
    const favorites = user.favorites;
    const points = user.loyaltyPoints;
    const freeDrink = Math.floor(points / 10);
    const beans = points % 10;
    const rewards = Array.from({ length: 10 })
    const options = useOptionsStore(state => state.options)
    console.log("recent", recentOrders)
    return (<main className="dashboard-wrapper">
        <h1 className="dashboard-title">Dashboard</h1>
        <section className="db-section-container">
            <h2 className="db-section-title">Track Order</h2>
            <ActiveOrder 
            activeOrders={activeOrders}
            />
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Frequently Ordered</h2>
            <div className="db-section-content">
                {(frequentOrders && frequentOrders.length > 0) ?
                    frequentOrders.map(item =>
                        <MenuItem
                            key={item._id}
                            imageUrl={item.url}
                            value={item}
                        />
                    ) : <p>You have not placed any order <TextButton
                            onClick={() => nav("/menu")}
                        >Go to menu</TextButton></p>}
            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Order Again</h2>
            <div className="db-section-content">
                {(recentOrders && recentOrders.length > 0) ?
                   <OrderAgain
                   recentOrders={recentOrders}
                   />
                   :
                    <p>You have not placed any order <TextButton
                            onClick={() => nav("/menu")}
                        >Go to menu</TextButton></p>}
            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Favorites</h2>
            <div className="db-section-content">
                {(favorites && favorites.length > 0) ?
                    favorites.map(item =>
                        <MenuItem
                            key={item._id}
                            imageUrl={item.url}
                            value={item}
                        />
                    ) :
                    <p>You have not favorited any item <TextButton
                            onClick={() => nav("/menu")}
                        >Go to menu</TextButton></p>
                }
            </div>
        </section>
        <section className="db-section-container">
            <h2 className="db-section-title">Rewards</h2>
            <div className="db-section-content">
                <div className="rewards">
                    <div className="beans">
                        {rewards.map((point, index) =>
                            beans > index ?

                                <TakeAwayCup
                                    key={index}
                                    color="var(--coffee-light)"
                                />
                                :
                                <TakeAwayCup
                                    key={index}
                                />
                        )}
                    </div>
                    <div className="free-drink-wrapper">
                        {freeDrink > 0 ?
                            <div className="free-drink">
                                <TakeAwayCup
                                    key="free-drink"
                                    color="var(--coffee-medium)"
                                    size="6rem"
                                />
                            </div>
                            :
                            <div className="no-free-drink">
                                <TakeAwayCup
                                    key="no-free-drink"
                                    size="6rem"
                                />
                            </div>}
                        {freeDrink >= 1 ? <span className="no-of-drinks">You've got {freeDrink} free drinks.</span> :
                            <span className="no-of-drinks">You've got no free drink</span>
                        }
                    </div>
                </div>
            </div>
        </section>
    </main>
    )}