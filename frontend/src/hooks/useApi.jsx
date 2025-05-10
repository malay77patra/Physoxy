import { ApiContext } from "@/providers/ApiProvider"
import { useContext } from "react"

const useApi = () => {
    const context = useContext(ApiContext)

    if (!context) {
        throw new Error('useApi must be used within an ApiProvider')
    }

    return context
}

export { useApi }