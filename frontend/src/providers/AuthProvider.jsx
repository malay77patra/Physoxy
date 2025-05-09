import { createContext, useEffect, useState } from "react"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })

    const isAuthenticated = !!user

    const logoutUser = () => {
        setUser(null)
        localStorage.removeItem("user")
    }

    const setAuthToken = (token) => {
        localStorage.setItem("_authtk", token)
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
        } else {
            localStorage.removeItem("user")
        }
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser, logoutUser, isAuthenticated, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
