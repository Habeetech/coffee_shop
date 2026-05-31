import "./Address.css"
export default function Address() {
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
                <strong>Contact</strong>
                <p>Tel: <a href="tel:+024567889">+02 345 678 89</a><br />
                Mobile: <a href="tel:+447544734567">+44 75 447 345 67</a></p>
                <p>

                    Email: <a href="mailto:contact-support@coffeeshop.com">
                        contact-support@coffeeshop.com
                    </a></p>
            </div>
        {/*     <div className="location">
                  <a href="https://maps.app.goo.gl/hG4u26j5krzuMyBv5?g_st=aw" target="_blank">View location</a>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19863.233!2d-0.108!3d51.633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ed3933f19c3%3A0x14ebe181ea17c2d!2s234%20River%20Bank%2C%20Winchmore%20Hill%2C%20London%20N21%205AB!5e0!3m2!1sen!2suk!4v1
"
                width="400"
                height="350"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            </div> */}
        </address>
    )
}