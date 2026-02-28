import "../styles/Address.css"
export function Address() {
    return (
        <address className="address">
            <p className="location">
                <strong>Headquarters</strong><br />
                234, River Bank<br />
                Winchmore Hill<br />
                Enfield, North London<br />
                N21 5AB
            </p>
            <hr />
            <p className="location">
                <strong>Branch</strong><br />
                45, Artesian Close<br />
                Hornchurch<br />
                Havering, East London<br />
                RM11 9BC
            </p>
            <hr />
            <p className="contact">
                <strong>Phone</strong><br />
                Tel: +02 345 678 89<br />
                Mobile: +44 75 447 345 67
            </p>
        </address>

    )
}