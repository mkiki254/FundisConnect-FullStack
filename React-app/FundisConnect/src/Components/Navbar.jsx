import {Link} from 'react-router-dom'
import '../Styles/Navbar.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function Navbar(){

    const { userDetails } = useContext(AuthContext)
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
    const [username, setUsername] = useState('user')

    useEffect(() => {
        userDetails && setUsername(userDetails.user.username)
    })

    // Capitalizing the first letter of the username
    const usrname = username.charAt(0).toUpperCase() + username.slice(1)

    // Function handling Logout. Registration and Login handled in the Signup.jsx
    function submitLogout(e){
        e.preventDefault()
        client.get(
            "/api/logout",
            {withCredentials: true}
        ).then(function(res){
            setIsLoggedIn(false)
        })
    }

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
                    {isLoggedIn && <li><Link className="links" onClick={submitLogout}>Logout</Link></li>}
                    {!isLoggedIn && <li><Link to="/signup" className="links">Sign Up</Link></li>}
                </ul>      
                </nav>
            </header>
        </div>
        </>
    )
}