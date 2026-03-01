import "../styles/Address.css"
export function Address() {
    return (
        <address className="address" id="contact">
            <div className="location">
                <strong>Headquarters</strong>
                <p>234, River Bank<br />Winchmore Hill<br />Enfield, North London<br />N21 5AB</p>
            </div>

            <div className="location">
                <strong>Branch</strong>
                <p>45, Artesian Close<br />Hornchurch<br />Havering, East London<br />RM11 9BC</p>
            </div>

            <div className="phone">
                <strong>Phone</strong>
                <p>Tel: +02 345 678 89<br />Mobile: +44 75 447 345 67</p>
            </div>
        </address>
    )
}