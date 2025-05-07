import { ThemeContext } from "@/providers/ThemeProvider"
import { useContext } from "react"

const useTheme = () => useContext(ThemeContext)

export { useTheme }