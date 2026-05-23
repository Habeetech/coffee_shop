import { useState } from "react"
import { SquareArrowRightEnter, Coffee, MapPinCheck, SquareCheckBig } from "lucide-react"

export default function OrderTimeline({status}) {
    if (status === "out for delivery" || status === "ready for collection") {
        status = "ready";
    }
    const order = ["paid", "preparing", "ready", "completed"];
    const currentIndex = order.indexOf(status);
    return (
    <div className="order-timeline">
        <div 
        className={`order-progress-wrapper ${currentIndex === 0 ?
             "active" : currentIndex > 0 ? "completed" : ""}`}
        >
            <span className="order-progress">
                <span className="order-progress-icon">
                   <SquareArrowRightEnter
                size="1.5em"
            />
                </span>
            <p className="order-progress-text">Received</p></span>
        </div>
        <div 
        className={`order-progress-wrapper ${currentIndex === 1 ?
             "active" : currentIndex > 1 ? "completed" : ""}`}
        >
             <span className="order-progress-track" >
                <span className="order-progress-fill"></span>
             </span>
            <span className="order-progress">
              <span className="order-progress-icon">
                   <Coffee
                size="1.5em"
            />
                </span>
             <p className="order-progress-text">Preparing</p></span>
        </div>
        <div 
        className={`order-progress-wrapper ${currentIndex === 2 ?
             "active" : currentIndex > 2 ? "completed" : ""}`}
        >
            <span className="order-progress-track" >
                <span className="order-progress-fill"></span>
             </span>
            <span className="order-progress">
             <span className="order-progress-icon">
                   <MapPinCheck
                size="1.5em"
            />
                </span>
            <p className="order-progress-text">Ready</p></span>
            
        </div>
        <div 
        className={`order-progress-wrapper ${currentIndex >= 3 ?
            "completed" : ""
        }`}
        >
             <span className="order-progress-track" >
                <span className="order-progress-fill"></span>
             </span>
            <span className="order-progress">
              <span className="order-progress-icon">
                   <SquareCheckBig
                size="1.5em"
            />
                </span>
            <p className="order-progress-text">Completed</p>
            </span>
            
        </div>
    </div>)
}