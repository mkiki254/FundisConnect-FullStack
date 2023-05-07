import '../Styles/Footer.css'

export default function Footer(){
    return (
        <>
        <footer>
            <div className="logo footer-content">
                <h2>FundisConnect</h2> <p>&copy; 2023</p>
                <p>An artisan just a click away</p>
            </div>
            <div className="footer-content sitemap">
                <p>SITEMAP</p>
                <p>Home</p>
                <p>About</p>
                <p>Artisans</p>
                <p>Contact Us</p>
            </div>
            <div className="contact footer-content">
                <p className="contact-title">Contact us:</p>
                <div className="email-contact">
                    <img src="images/email.png" alt="email icon" />
                    <p className="contact-info">fundisconnect@company.com</p>
                </div>
                <div class="phone-contact">
                    <img src="images/phone.png" alt="phone icon" />
                    <p className="contact-info">0714456992</p>
                </div>
            </div>
        </footer>
        </>
    )
}