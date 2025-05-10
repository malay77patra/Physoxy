import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export default function Event() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [event, setEvent] = useState({})
    const api = useApi()

    const fetchEvent = async () => {
        setLoading(true)
        try {
            const { data, error } = await api.protected.get(`/api/event/${id}`)
            if (error) {
                setLoadingError(error.message)
            } else {
                setEvent(data)
                setLoading(false)
            }
        } catch (err) {
            setLoadingError("Something went wrong")
        }
    }

    useEffect(() => {
        fetchEvent()
    }, [])

    if (loadingError) return <div className="p-4 flex items-center justify-center">
        <span className="text-error">{loadingError}</span>
    </div>

    if (loading) return <div className="p-4 flex items-center justify-center">
        <span className="loading loading-spinner"></span>
    </div>

    if (event.upgrade) {
        return (
            <div className="relative">
                <div>
                    <h1 className="text-2xl font-bold mb-4">This is a sample event heading used as placeholder.</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, magni repellat sequi dolorem aperiam fugit cupiditate excepturi cum modi accusantium...</p>
                </div>
                <div className="absolute inset-0 z-5 -m-4 backdrop-blur-sm flex justify-center items-start p-4">
                    <div className="card bg-base-200 border p-4 max-w-72 flex-1 flex flex-col gap-2">
                        <h1 className="text-center text-lg font-semibold mb-4">Upgrade plan to unlock.</h1>
                        <p><label className="label">Required plan:</label> <span className="badge badge-accent">{event.package.name}</span></p>
                        <p><label className="label">Includes:</label></p>
                        <p>{event.package.description}</p>
                        <Link className="btn btn-accent" to="/pricing">Upgrade</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
            <p>{event.content}</p>
        </div>
    )
}
