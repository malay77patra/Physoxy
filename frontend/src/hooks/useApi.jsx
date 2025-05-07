import { ApiContext } from "@/providers/ApiProvider"
import { useContext } from "react"

const useApi = () => useContext(ApiContext)

export { useApi }