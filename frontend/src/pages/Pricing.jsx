import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

function Package({ pkg }) {
    const navigate = useNavigate()

    return (
        <div className="card bg-base-100 w-64 border shadow-sm">
            <div className="card-body">
                <h2 className="card-title text-accent">{pkg.name}</h2>
                <p>{pkg.description}</p>
                <div>
                    <p className=" text-md font-semibold">Monthly: ${pkg.pricing.monthly}</p>
                    <p className=" text-md font-semibold">Yearly: ${pkg.pricing.yearly}</p>
                </div>
                <div className="card-actions mt-4">
                    <button className="btn btn-primary w-full" onClick={() => navigate(`/checkout/${pkg._id}`)}>Buy Now</button>
                </div>
            </div>
        </div>
    )
}

export default function Pricing() {
    const { isAuthenticated } = useAuth()
    const api = useApi()
    const [pckages, setPackages] = useState([])
    const [myPackage, setMyPackage] = useState({})
    const [loading, setLoading] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const activePackage = pckages.find(item => item._id === myPackage.id)

    const fetchPackages = async () => {
        setLoading(true)
        try {
            const { data, error } = await api.public.get("/api/package/all")
            if (error) {
                toast.error(error.message)
            } else {
                setPackages(data)
            }
        } catch (error) {
            toast.error("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const fetchMyPackage = async () => {
        const { data, error } = await api.protected.get("/api/package/my")
        if (error) {
            toast.error(error.message)
        } else {
            setMyPackage(data)
        }
    }

    const cancelMyPackage = async () => {
        setCancelling(true)
        try {
            const { data, error } = await api.protected.delete("/api/package/cancel")
            if (error) {
                toast.error(error.message)
            } else {
                setMyPackage({})
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setCancelling(false)
        }
    }

    useEffect(() => {
        fetchPackages()
        if (isAuthenticated) fetchMyPackage()
    }, [])

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div>
            {loading ? (
                <div className="flex p-4 justify-center items-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                    <h1 className="text-center text-3xl pb-8 font-bold">Choose Your Plan!</h1>
                    {isAuthenticated && (
                        <div className="w-64 border p-2 rounded-box mb-4">
                            <h2 className="text-md font-semibold">
                                <label className="label">Active Plan:</label> <span className="text-primary">{activePackage ? activePackage.name : "FREE"}</span>
                                {activePackage && (
                                    <>
                                        <p><label className="label">Duration:</label> {myPackage.type}</p>
                                        <p><label className="label">Amount:</label> ${myPackage.amount}</p>
                                        <p><label className="label">Started At:</label> {formatDate(myPackage.startsAt)}</p>
                                        <p><label className="label">Ending At:</label> {formatDate(myPackage.endsAt)}</p>
                                        <div className="flex justify-end mt-2">
                                            <button className="btn btn-error" disabled={cancelling} onClick={cancelMyPackage}>
                                                {cancelling ? <span className="loading loading-spinner"></span> : "Cancel"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </h2>
                        </div>
                    )}
                    <div className="flex gap-3 flex-wrap items-center justify-center">
                        {pckages.map((pkg) => {
                            return <Package key={pkg._id} pkg={pkg} myPackage={myPackage} />
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}