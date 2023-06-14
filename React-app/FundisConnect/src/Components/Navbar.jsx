import {Link} from 'react-router-dom'
import '../Styles/Navbar.css'
import { useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'


export default function Navbar(){
    const { userDetails, isLoggedIn, activeUser, submitLogout, userPermit, username, setUsername } = useAuthContext();
    // Getting the username
    useEffect(() => {
        userDetails && setUsername(userDetails.user.username)
    }, [activeUser])

    // Capitalizing the first letter of the username
    const usrname = username.charAt(0).toUpperCase() + username.slice(1)
    // console.log(userPermit)
    return (
        <>
        <div>
            <header>
                <div className="logo">
                    <h2>FundisConnect</h2>
                    <p>An artisan just a click away</p>
                </div>                
                <nav>
                <ul>
                    {isLoggedIn && <p>Hello, {usrname}</p>}
                    {!isLoggedIn && <li><Link to="/" className="links">Home</Link></li>}
                    {!isLoggedIn && <li><Link to="/about" className="links">About</Link></li>}
                    {!isLoggedIn && <li> <Link to="/artisan" className="links">Artisan</Link></li>}
                    {!isLoggedIn && <li><Link to="/signup" className="links">Login</Link></li>}
                    {isLoggedIn && userPermit.includes('is_artisan') && <li><Link to="/artisan-home" className="links">Artisan Home</Link></li>}
                    {isLoggedIn && userPermit.includes('is_customer') && <li><Link to="/customer-home" className="links">Customer Home</Link></li>}
                    {isLoggedIn && userPermit.includes('is_admin') && <li><Link to="/admin-home" className="links">Admin Home</Link></li>}
                    {isLoggedIn && <li><Link className="links" onClick={submitLogout}>Logout</Link></li>}
                </ul>      
                </nav>
            </header>
        </div>
        </>
    )
}