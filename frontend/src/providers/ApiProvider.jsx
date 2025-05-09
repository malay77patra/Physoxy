import axios from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import { createContext, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"

const ApiContext = createContext(null)

const ApiProvider = ({ children }) => {
    const navigate = useNavigate()
    const serverURL = import.meta.env.VITE_SERVER_URL
    const refreshEndPoint = `${serverURL}/api/refresh`

    const protectedApi = axios.create({
        baseURL: serverURL,
        headers: { "Content-Type": "application/json" }
    })

    const publicApi = axios.create({
        baseURL: serverURL,
        headers: { "Content-Type": "application/json" }
    })

    protectedApi.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("_authtk")
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    const refreshAccessToken = async (failedRequest) => {
        try {
            const res = await axios.post(refreshEndPoint, {}, { withCredentials: true })
            const newToken = res.data.accessToken

            localStorage.setItem("_authtk", newToken)

            failedRequest.response.config.headers["Authorization"] = `Bearer ${newToken}`
            return Promise.resolve()
        } catch (err) {
            if (err?.response?.data?.redirect) {
                localStorage.removeItem("_authtk")
                localStorage.removeItem("user")
                navigate("/login")
                throw { response: { data: { message: "Please login" } } }
            }
            throw err
        }
    }

    useLayoutEffect(() => {
        createAuthRefreshInterceptor(protectedApi, refreshAccessToken, {
            shouldRefresh: (err) => {
                return err.response?.data?.refresh
            }
        })
    }, [])

    const requestHandler = async (apiInstance, method, url, data = null, config = {}) => {
        try {
            const res = data
                ? await apiInstance[method](url, data, config)
                : await apiInstance[method](url, config)
            return { data: res.data, error: null }
        } catch (err) {
            const message = err?.response?.data?.message || "Something went wrong."
            const status = err?.response?.status
            return {
                data: null,
                error: {
                    message,
                    status,
                    details: err?.response?.data || null
                }
            }
        }
    }

    const protectedApiWrapper = {
        get: (url, config) => requestHandler(protectedApi, "get", url, null, config),
        post: (url, data, config) => requestHandler(protectedApi, "post", url, data, config),
        put: (url, data, config) => requestHandler(protectedApi, "put", url, data, config),
        delete: (url, config) => requestHandler(protectedApi, "delete", url, null, config),
        patch: (url, data, config) => requestHandler(protectedApi, "patch", url, data, config)
    }

    const publicApiWrapper = {
        get: (url, config) => requestHandler(publicApi, "get", url, null, config),
        post: (url, data, config) => requestHandler(publicApi, "post", url, data, config),
        put: (url, data, config) => requestHandler(publicApi, "put", url, data, config),
        delete: (url, config) => requestHandler(publicApi, "delete", url, null, config),
        patch: (url, data, config) => requestHandler(publicApi, "patch", url, data, config)
    }

    const apiServices = {
        protected: protectedApiWrapper,
        public: publicApiWrapper
    }

    return <ApiContext.Provider value={apiServices}>{children}</ApiContext.Provider>
}

export { ApiContext, ApiProvider }