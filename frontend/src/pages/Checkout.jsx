import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

export default function Checkout() {
    const { id } = useParams()
    const [packages, setPackages] = useState([])
    const [myPackage, setMyPackage] = useState({})
    const [loadingAll, setLoadingAll] = useState(true)
    const [loadingMy, setLoadingMy] = useState(true)
    const [isMonthly, setIsMonthly] = useState(true)
    const api = useApi()
    const { authToken } = useAuth()
    const [upgrading, setUpgrading] = useState(false)

    const fetchPackages = async () => {
        setLoadingAll(true)
        try {
            const { data, error } = await api.get("/api/package/all")
            if (error) {
                toast.error(error.message)
            } else {
                setPackages(data)
            }
        } catch (error) {
            toast.error("Something went wrong!")
        } finally {
            setLoadingAll(false)
        }
    }

    const fetchMyPackage = async () => {
        setLoadingMy(true)
        try {
            const { data, error } = await api.get("/api/package/my", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (error) {
                toast.error(error.message)
            } else {
                setMyPackage(data)
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setLoadingMy(false)
        }
    }

    const upgradeMyPackage = async () => {
        setUpgrading(true)
        try {
            const { data, error } = await api.post(`/api/package/upgrade/${id}`, {
                type: isMonthly ? "monthly" : "yearly"
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (error) {
                toast.error(error.message)
            } else {
                setMyPackage(data)
                toast.success("Subscribed!")
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setUpgrading(false)
        }
    }

    useEffect(() => {
        fetchPackages()
        fetchMyPackage()
    }, [])

    if (loadingAll || loadingMy) {
        return (
            <div className="p-4 flex justify-center">
                <span className="loading loading-spinner"></span>
            </div>
        )
    }

    const foundPackage = packages.find(pkg => pkg._id === id)
    if (foundPackage) {
        const isActivePkg = (myPackage.id === foundPackage._id) && ((myPackage.type === "monthly" && isMonthly) || (myPackage.type === "yearly" && !isMonthly))

        return (
            <div className="flex p-4 items-center justify-center">
                <div className="card w-96 bg-base-100 shadow-sm border">
                    <div className="card-body flex flex-col gap-2">
                        <div className="flex justify-between">
                            <h2 className="text-3xl font-bold">{foundPackage.name}</h2>
                        </div>
                        <p>{foundPackage.description}</p>
                        <div className="flex gap-2 mt-2">
                            <span>Monthly</span>
                            <input
                                type="checkbox"
                                checked={!isMonthly}
                                onChange={(e) => {
                                    setIsMonthly(!e.target.checked)
                                }}
                                className="toggle border-primary bg-primary checked:border-accent checked:bg-accent text-base-100"
                            />
                            <span>Yearly</span> <span className="badge badge-accent">Save ${foundPackage.pricing.monthly * 12 - foundPackage.pricing.yearly}</span>
                        </div>
                        <div className="text-lg font-semibold">${isMonthly ? `${foundPackage.pricing.monthly} / Month` : `${foundPackage.pricing.yearly} / Year`}</div>
                        <div className="flex flex-col gap-2 mt-4">
                            <input className="input w-full" placeholder="Email" />
                            <input className="input w-full" placeholder="Card Number" />
                            <div className="flex gap-2">
                                <input className="input" placeholder="Expiry" />
                                <input className="input" placeholder="CVV" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="btn btn-success btn-block" disabled={upgrading || isActivePkg} onClick={upgradeMyPackage}>
                                {upgrading ? <span className="loading loading-spinner"></span> : (isActivePkg) ? "Subscribed" : "Buy Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 flex justify-center text-error">
            <h1>404 | Package Not Found.</h1>
        </div>
    )
}
