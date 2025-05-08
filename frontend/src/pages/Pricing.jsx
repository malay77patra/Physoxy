import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


export default function Pricing() {
    const { authToken } = useAuth()
    const api = useApi()
    const [pckages, setPackages] = useState([])

    const fetchPackages = async () => {
        const { error, data } = await api.get("/api/package/all");
        if (error) {
            toast.error(error.message)
        } else {
            setPackages(data)
        }
    }

    useEffect(() => {
        fetchPackages()
    }, [])

    return (
        <div>
            <h1 className="text-center text-3xl pb-8 font-bold">Choose your plan!</h1>
            <div className="flex gap-3 flex-wrap items-center justify-center">
                {pckages.map((pkg, idx) => {
                    return (
                        <div key={idx} className="card bg-base-100 w-64 border shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-accent">{pkg.name}</h2>
                                <p>This is the package description</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary w-full">Buy Now</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}