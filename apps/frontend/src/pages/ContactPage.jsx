import ContactForm from "../components/ContactForm.jsx"
import "../styles/ContactPage.css"

export default function ContactPage() {
    return(<main className="contact-page-container">
        <section className="contact-section text">
            <p>We love to hear from our customer.<br />
                Please fill the form below to tell us about your experience<br />
                from general enquries, experience or feedback, custormer service and
                <br/> ease of use of our website.<br />
                We will get back to you as soon as we can. Thank you.
            </p>
        </section>
        <section
        className="contact-section form"
        >
            <ContactForm />
        </section>
    </main>)
} 