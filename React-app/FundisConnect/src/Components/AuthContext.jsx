import React, { createContext, useState } from 'react'

// Creating the authentication context
export const AuthContext = createContext()

// Creating a provider component to wrap the app and provide the context
export const AuthProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState()
    const [userPermissions, setUserPermissions] = useState()
    const [activeUser, setActiveUser] = useState()

    return (
        <AuthContext.Provider 
        value={{ userDetails, setUserDetails, isLoggedIn, setIsLoggedIn, activeUser, setActiveUser }}>
            {children}
        </AuthContext.Provider>
    )
}