import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Overview() {
    const [fetching, setFetching] = useState(true)
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

    useEffect(() => {
        fetchSubscribers()
    }, [])

    if (fetching) return (
        <div className="p-4 flex items-center justify-center">
            <span className="loading loading-spinner"></span>
        </div>
    )

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-bold">Subscriptions</h1>
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