import React, { createContext, useMemo, useRef } from 'react'
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const serverURL = import.meta.env.VITE_SERVER_URL
const refreshEndPoint = `${serverURL}/api/refresh`

const ApiContext = createContext()

const apiCallWrapper = async (apiCall) => {
    try {
        const response = await apiCall()
        return { data: response.data, error: null }
    } catch (error) {
        return {
            data: null,
            error: {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
            }
        }
    }
}

const ApiProvider = ({ children }) => {
    const navigate = useNavigate()
    const { logoutUser } = useAuth()

    const refreshTokenPromise = useRef(null)

    const axiosPublic = axios.create({
        baseURL: serverURL,
    })

    const axiosProtected = axios.create({
        baseURL: serverURL,
    })

    axiosPublic.defaults.withCredentials = true
    axiosProtected.defaults.withCredentials = true

    axiosProtected.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('_authtk')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    const refreshAuthLogic = async (failedRequest) => {
        try {
            if (!refreshTokenPromise.current) {
                refreshTokenPromise.current = axios.post(
                    refreshEndPoint,
                    {},
                    {
                        withCredentials: true,
                        skipAuthRefresh: true
                    }
                )
                    .then(response => {
                        const { accessToken } = response.data
                        localStorage.setItem('_authtk', accessToken)
                        return accessToken
                    })
                    .catch(error => {
                        logoutUser()
                        navigate("/login")
                        return Promise.reject(error)
                    })
                    .finally(() => {
                        refreshTokenPromise.current = null
                    })
            }

            const accessToken = await refreshTokenPromise.current

            failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`

            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    }

    createAuthRefreshInterceptor(axiosProtected, refreshAuthLogic, {
        statusCodes: [401],
        shouldRefresh: (error) => {
            return !!error.response?.data?.refresh
        }
    })

    const createApiMethods = (axiosInstance) => {
        return {
            get: (url, config) => apiCallWrapper(() => axiosInstance.get(url, config)),
            post: (url, body, config) => apiCallWrapper(() => axiosInstance.post(url, body, config)),
            put: (url, body, config) => apiCallWrapper(() => axiosInstance.put(url, body, config)),
            patch: (url, body, config) => apiCallWrapper(() => axiosInstance.patch(url, body, config)),
            delete: (url, config) => apiCallWrapper(() => axiosInstance.delete(url, config))
        }
    }

    const api = useMemo(() => ({
        public: createApiMethods(axiosPublic),
        protected: createApiMethods(axiosProtected),

        setAuthToken: (accessToken) => {
            localStorage.setItem('_authtk', accessToken)
        },

        clearAuthToken: () => {
            localStorage.removeItem('_authtk')
        },

        isAuthenticated: () => {
            return !!localStorage.getItem('_authtk')
        }
    }), [])

    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    )
}


export { ApiProvider, ApiContext }