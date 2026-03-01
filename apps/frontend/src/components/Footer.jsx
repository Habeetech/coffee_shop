import "../styles/Footer.css"
import { Address } from "../components/Address.jsx";
function Footer() {
  return (
    <footer className="footer">
      <div className="address-wrapper">
        <Address />
      </div>
      <p>© 2026 Coffee Shop</p>

      <div className="socials">
        <a href="https://facebook.com/coffeeshop">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
        </a>

        <a href="https://instagram.com/coffeeshop">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
        </a>

        <a href="https://tiktok.com/coffeeshop">
          <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" />
        </a>
      </div>
    </footer>

  )
}
export default Footer;