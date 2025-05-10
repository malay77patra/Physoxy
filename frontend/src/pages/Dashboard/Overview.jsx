import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Overview() {
    const [fetching, setFetching] = useState(true)
    const [fetchingStats, setFetchingStats] = useState(false)
    const [stats, setStats] = useState({})
    const [subscribers, setSubscribers] = useState([])
    const api = useApi()

    const fetchSubscribers = async () => {
        setFetching(true)
        try {
            const { data, error } = await api.protected.get("/api/package/subscribers")
            if (error) {
                toast.error(error.message)
            } else {
                setSubscribers(data)
            }
        } catch (err) {
            toast.error(err)
        } finally {
            setFetching(false)
        }
    }

    const fetchStats = async () => {
        setFetchingStats(true)
        try {
            const { data, error } = await api.protected.get("/api/stats")
            if (error) {
                toast.error(error.message)
            } else {
                setStats(data)
            }
        } catch (err) {
            toast.error(err)
        } finally {
            setFetchingStats(false)
        }
    }

    useEffect(() => {
        fetchSubscribers()
        fetchStats()
    }, [])

    if (fetching) return (
        <div className="p-4 flex items-center justify-center">
            <span className="loading loading-spinner"></span>
        </div>
    )

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-bold">Overview</h1>
            {!fetchingStats && (
                <div className="flex items-center justify-center">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 max-w-280">
                        <div className="bg-base-300 p-4 rounded-box flex items-center justify-center flex-col min-w-40">
                            <h2 className="text-lg font-bold text-accent">{stats.subs}</h2>
                            <h3>Subscribers</h3>
                        </div>
                        <div className="bg-base-300 p-4 rounded-box flex items-center justify-center flex-col min-w-40">
                            <h2 className="text-lg font-bold text-accent">{stats.blogs}</h2>
                            <h3>Blogs</h3>
                        </div>
                        <div className="bg-base-300 p-4 rounded-box flex items-center justify-center flex-col min-w-40">
                            <h2 className="text-lg font-bold text-accent">{stats.events}</h2>
                            <h3>Events</h3>
                        </div>
                        <div className="bg-base-300 p-4 rounded-box flex items-center justify-center flex-col min-w-40">
                            <h2 className="text-lg font-bold text-accent">{stats.courses}</h2>
                            <h3>Courses</h3>
                        </div>
                    </div>
                </div>
            )}
            <h1 className="text-md font-semibold">Subscriptions</h1>
            <div className="overflow-x-auto">
                <table className="table table-zebra min-w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Subscription Name</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map(sbs => (
                            <tr key={sbs._id}>
                                <td>{sbs._id}</td>
                                <td>{sbs.email}</td>
                                <td className="text-accent font-semibold">{sbs.subscription.id.name}</td>
                                <td>{sbs.subscription.type}</td>
                                <td>${sbs.subscription.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}