import axios from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { createContext } from "react"

const ApiContext = createContext(null)

const ApiProvider = ({ children }) => {
    const navigate = useNavigate()
    const serverURL = import.meta.env.VITE_SERVER_URL
    const refreshEndPoint = `${serverURL}/api/refresh`
    const { setAuthToken, setUser } = useAuth()

    const api = axios.create({
        baseURL: serverURL,
        headers: { "Content-Type": "application/json" }
    })

    const refreshAccessToken = async (failedRequest) => {
        try {
            const res = await axios.post(refreshEndPoint, {}, { withCredentials: true })
            const newToken = res.data.accessToken
            setAuthToken(newToken)
            failedRequest.response.config.headers["Authorization"] = `Bearer ${newToken}`
            return Promise.resolve()
        } catch (err) {
            if (err?.response?.data?.redirect) {
                setUser({})
                setAuthToken("")
                navigate("/login")
                throw { response: { data: { message: "Please login" } } }
            }

            throw err
        }
    }

    createAuthRefreshInterceptor(api, refreshAccessToken, {
        shouldRefresh: (err) => err.response?.data?.refresh
    })

    const requestHandler = async (method, url, data = null, config = {}) => {
        try {
            const res = data
                ? await api[method](url, data, config)
                : await api[method](url, config)
            return { data: res.data, error: null }
        } catch (err) {
            const message = err?.response?.data?.message || "Something went wrong."
            return { data: null, error: { message } }
        }
    }

    const apiWrapper = {
        get: (url, config) => requestHandler("get", url, null, config),
        post: (url, data, config) => requestHandler("post", url, data, config),
        put: (url, data, config) => requestHandler("put", url, data, config),
        delete: (url, config) => requestHandler("delete", url, null, config),
        patch: (url, data, config) => requestHandler("patch", url, data, config)
    }

    return <ApiContext.Provider value={apiWrapper}>{children}</ApiContext.Provider>
}

export { ApiContext, ApiProvider }
