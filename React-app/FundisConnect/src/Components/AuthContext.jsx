import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '@/api'


// Creating the authentication context
export const AuthContext = createContext({ 
    userDetails: null, setUserDetails: () => {},
    isLoggedIn: null, setIsLoggedIn: () => {}, 
    activeUser: null, setActiveUser: () => {}, 
    userPermit: 'no permissions', setUserPermit: () => {}, 
    submitLogout: () => {}, 
    username: 'no username', setUsername: () => {},
    getHomeRoute: () => {},
    artisanId:null, setArtisanId: () => {},
    jobRequestId:null, setJobRequestId: () => {},
})

// Creating a provider component to wrap the app and provide the context
export const AuthProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState()
    const [userPermit, setUserPermit] = useState('no permissions')
    const [activeUser, setActiveUser] = useState()
    const [username, setUsername] = useState('no username')
    const [artisanId, setArtisanId] = useState()
    const [jobRequestId, setJobRequestId] = useState()
    const navigate = useNavigate();


    // Checking whether user is logged in or not.
    useEffect(() => {
        client.get("/api/user/").then(
            function (res) {
                setActiveUser(true)
                setIsLoggedIn(true)
                const usr = res.data
                setUserDetails(usr)
            }
        ).then(
            !(isLoggedIn) && setActiveUser(false) && setActiveUser(activeUser)
        ).catch(function (error) {
            setActiveUser(false)
            setIsLoggedIn(false)
            setUserDetails(null)            
        })
    }, [activeUser])

    // Getting the permissions from the API
    useEffect(() => {
        client.get("/api/permissions").then(res => {
                const perm = res.data;
                setUserPermit(perm.permissions[0]);
        }).catch((error) => setUserPermit('no permissions'));
    }, [activeUser])

    // The session can end outside this tab, for example by logging out of the Django admin.
    // Ask the server again whenever the user comes back to this tab.
    useEffect(() => {
        function recheckSession() {
            if (document.visibilityState !== 'visible') return
            client.get('/api/user/')
                .then(res => {
                    setIsLoggedIn(true)
                    setUserDetails(res.data)
                    client.get('/api/permissions')
                        .then(r => setUserPermit(r.data.permissions[0]))
                        .catch(() => {})
                })
                .catch(() => {
                    setIsLoggedIn(false)
                    setUserDetails(null)
                    setUserPermit('no permissions')
                    setUsername('no username')
                })
        }
        document.addEventListener('visibilitychange', recheckSession)
        window.addEventListener('focus', recheckSession)
        return () => {
            document.removeEventListener('visibilitychange', recheckSession)
            window.removeEventListener('focus', recheckSession)
        }
    }, [])

    // Function handling Logout. Registration and Login handled in the Signup.jsx
    function submitLogout(e){
        e.preventDefault()
        client.get(
            "/api/logout",
            {withCredentials: true}
        ).then(function(res){
            setIsLoggedIn(false)
            setUsername('no username')
            setUserPermit('no permissions')
        })
    }

    // determine the initial route after successful authentication
    function getHomeRoute() {
        if (isLoggedIn && (userPermit == "is_artisan")) {
            return "/artisan-home"
        } else if (isLoggedIn && (userPermit == "is_customer")) {
            return "/customer-home"
        } else if (isLoggedIn && (userPermit == "is_admin")) {
            return "/admin-home"
        } else if (!isLoggedIn) {
            return "/signup"
        }
    }
    
    return (
        <AuthContext.Provider value={{ userDetails, setUserDetails, isLoggedIn, setIsLoggedIn, activeUser, setActiveUser, userPermit, setUserPermit, submitLogout, username, setUsername, getHomeRoute, artisanId, setArtisanId, jobRequestId, setJobRequestId }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext);
}