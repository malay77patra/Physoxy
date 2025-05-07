import { AuthContext } from "@/providers/AuthProvider"
import { useContext } from "react"

const useAuth = () => useContext(AuthContext)

export { useAuth }