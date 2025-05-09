import { useState, useEffect, createContext } from "react"

const ThemeContext = createContext(null)

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            return localStorage.getItem("theme") || (mediaQuery.matches ? "darknew" : "lightnew")
        }

        // fallback
        return "lightnew"
    })

    useEffect(() => {
        localStorage.setItem("theme", theme)
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])


    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeContext, ThemeProvider }