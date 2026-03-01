import "../styles/Footer.css"
import { Address } from "../components/Address.jsx";
import facebookIcon from "../assets/icons/facebook.png";
import instagramIcon from "../assets/icons/instagram.png";
import tiktokIcon from "../assets/icons/tiktok.png";
function Footer() {
  return (
    <footer className="footer">
      <div className="address-wrapper">
        <Address />
      </div>
      <p>© 2026 Coffee Shop</p>

      <div className="socials">
        <a href="https://facebook.com/coffeeshop">
          <img src={facebookIcon} alt="Facebook" />
        </a>

        <a href="https://instagram.com/coffeeshop">
          <img src={instagramIcon} alt="Instagram" />
        </a>

        <a href="https://tiktok.com/coffeeshop">
          <img src={tiktokIcon} alt="TikTok" />
        </a>
      </div>
    </footer>

  )
}
export default Footer;