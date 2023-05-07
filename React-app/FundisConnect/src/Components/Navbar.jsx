import {Link} from 'react-router-dom'
import '../Styles/Navbar.css'

export default function Navbar(){

    return (
        <>
        <div>
            <header>
                <Link to="/" className="links"> 
                    <div className="logo">
                        <h2>FundisConnect</h2>
                        <p>An artisan just a click away</p>
                    </div>
                </Link>
                <nav>
                <ul>
                    <li><Link to="/" className="links">Home</Link></li>
                    <li><Link to="/about" className="links">About</Link></li>
                    <li> <Link to="/artisan" className="links">Artisan</Link></li>
                    <li><Link to="/signup" className="links">Sign Up</Link></li>
                </ul>      
                </nav>
            </header>
        </div>
        </>
    )
}