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
    const [username, setUsername] = useState('no username')
    const { activeUser } = useContext(AuthContext)
    const [permit, setPermit] = useState('no permissions')

    // Getting the permissions from the API
    useEffect(() => {
        client.get("/api/permissions").then(
            res => {
                const perm = res.data
                permit && setPermit(perm.permissions[0])
            }
        ).catch(
            function(error){
                setPermit('no permissions')
            }
        )}, [activeUser])

    // Getting the username
    useEffect(() => {
        userDetails && setUsername(userDetails.user.username)
    }, [activeUser])

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
            setUsername('no username')
            setPermit('no permissions')
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
                    {isLoggedIn && <p>Hello, {username}</p>} 
                    {!isLoggedIn && <li><Link to="/" className="links">Home</Link></li>}
                    {!isLoggedIn && <li><Link to="/about" className="links">About</Link></li>}
                    {!isLoggedIn && <li> <Link to="/artisan" className="links">Artisan</Link></li>}                    
                    {isLoggedIn && <li><Link className="links" onClick={submitLogout}>Logout</Link></li>}
                    {!isLoggedIn && <li><Link to="/signup" className="links">Sign Up</Link></li>}
                    {isLoggedIn && permit.includes('is_artisan') && <li><Link to="/artisan-home" className="links">Artisan Homepage</Link></li>}
                    {isLoggedIn && permit.includes('is_customer') && <li><Link to="/customer-home" className="links">Customer Homepage</Link></li>}
                    {isLoggedIn && permit.includes('is_admin') && <li><Link to="/admin-home" className="links">Admin Homepage</Link></li>}
                </ul>      
                </nav>
            </header>
        </div>
        </>
    )
}