import { useApi } from "@/hooks/useApi"
import toast from "react-hot-toast"
import { useEffect, useRef, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const pkgSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Package name is required")
        .matches(/^[A-Za-z]+$/, "Package name must contain only letters (no spaces or symbols)"),
    description: yup
        .string()
        .trim()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must be less than 200 characters"),
    pricing: yup.object({
        monthly: yup
            .number()
            .typeError("Monthly price must be a number")
            .required("Monthly price is required")
            .min(0, "Monthly price must be a positive number"),
        yearly: yup
            .number()
            .typeError("Yearly price must be a number")
            .required("Yearly price is required")
            .min(0, "Yearly price must be a positive number")
    }).required("Pricing is required")
}).required()

export default function Packages() {
    const api = useApi()
    const [fetching, setFetching] = useState(false)
    const [packages, setPackages] = useState([])
    const modalRef = useRef(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [adding, setAdding] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(pkgSchema)
    })

    const fetchPackages = async () => {
        setFetching(true)
        try {
            const { data, error } = await api.public.get('/api/package/all')
            if (error) {
                toast.error("Something went wrong!")
            } else {
                setPackages(data)
            }
        } catch {
            toast.error("Something went wrong!")
        } finally {
            setFetching(false)
        }
    }

    const addpackage = async (data) => {
        setAdding(true)
        try {
            const { data: newData, error } = await api.protected.post('/api/package/new', data)
            if (error) {
                toast.error(error.message)
            } else {
                setPackages([...packages, newData])
                setModalOpen(false)
                reset()
            }
        } catch {
            toast.error("Something went wrong!")
        } finally {
            setAdding(false)
        }
    }

    useEffect(() => {
        fetchPackages()
    }, [])

    useEffect(() => {
        const modal = modalRef.current
        if (!modal) return

        if (modalOpen) {
            if (!modal.open) modal.showModal()
        } else {
            if (modal.open) modal.close()
        }
    }, [modalOpen])

    useEffect(() => {
        const modal = modalRef.current
        if (!modal) return

        const handleClose = () => setModalOpen(false)
        modal.addEventListener('close', handleClose)

        return () => {
            modal.removeEventListener('close', handleClose)
        }
    }, [])

    return (
        <>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box max-w-84">
                    <h3 className="font-bold text-lg mb-4">Enter Package Details</h3>
                    <form onSubmit={handleSubmit(addpackage)}>
                        <div className="flex flex-col gap-2">
                            <input {...register("name")} className="input text-accent font-bold text-lg" placeholder="Package Name" />
                            {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}

                            <textarea {...register("description")} className="textarea" placeholder="Description" />
                            {errors.description && <p className="text-error text-xs">{errors.description.message}</p>}

                            <p className="font-semibold text-secondary">Prices</p>
                            <div className="flex gap-2">
                                <label className="label">Monthly: $</label>
                                <input type="number" {...register("pricing.monthly")} className="input" placeholder="Monthly Price" />
                            </div>
                            {errors.pricing?.monthly && <p className="text-error text-xs">{errors.pricing.monthly.message}</p>}

                            <div className="flex gap-2">
                                <label className="label">Yearly: $</label>
                                <input type="number" {...register("pricing.yearly")} className="input" placeholder="Yearly Price" />
                            </div>
                            {errors.pricing?.yearly && <p className="text-error text-xs">{errors.pricing.yearly.message}</p>}
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-success" type="submit" disabled={adding}>Add</button>
                            <button className="btn" type="button" onClick={() => setModalOpen(false)}>Close</button>
                        </div>
                    </form>
                </div>
            </dialog>

            <div>
                <h1 className="text-3xl font-bold">Packages</h1>
                <div className="flex justify-end">
                    <button className="btn btn-success" onClick={() => setModalOpen(true)}>
                        <FaPlus /> Add New
                    </button>
                </div>
                <div className="flex flex-wrap gap-4 items-center justify-center mt-8">
                    {fetching ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <>
                            {adding && (
                                <div className="bg-base-200 border border-base-content/50 shadow-sm size-60 flex items-center justify-center rounded-box">
                                    <span className="loading loading-spinner"></span>
                                </div>
                            )}
                            {packages.map((pkg) => {
                                const handleDelete = (id) => {
                                    setPackages((prev) => prev.filter((pkg) => pkg._id !== id))
                                }

                                return <Package key={pkg._id} handleDelete={handleDelete} {...pkg} />
                            })}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

function Package({ handleDelete, ...pkg }) {
    const [isEditing, setIsEditing] = useState(false)
    const api = useApi()
    const [deleting, setDeleting] = useState(false)
    const [updating, setUpdating] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(pkgSchema),
        defaultValues: {
            name: pkg.name,
            description: pkg.description,
            pricing: {
                monthly: pkg.pricing.monthly,
                yearly: pkg.pricing.yearly
            }
        }
    })

    const deletePackage = async () => {
        setDeleting(true)
        try {
            const { data, error } = await api.protected.delete(`/api/package/delete/${pkg._id}`)
            if (error) {
                toast.error(error.message)
            } else {
                handleDelete(pkg._id)
                toast.success("Deleted!")
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setDeleting(false)
        }
    }

    const updatePackage = async (formData) => {
        setUpdating(true)
        try {
            const { data, error } = await api.protected.put(`/api/package/update/${pkg._id}`, formData)
            if (error) {
                toast.error(error.message)
            } else {
                reset(data)
                setIsEditing(false)
                toast.success("Updated!")
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setUpdating(false)
        }
    }

    const cancelEditing = () => {
        reset()
        setIsEditing(false)
    }

    return (
        <div className="card bg-base-200 w-72 border border-base-content/50 shadow-sm p-4">
            {isEditing ? (
                <form onSubmit={handleSubmit(updatePackage)} className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input card-title text-accent"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}

                    <textarea
                        className="textarea"
                        placeholder="Description"
                        {...register("description")}
                    ></textarea>
                    {errors.description && <p className="text-error text-xs">{errors.description.message}</p>}

                    <p className="font-semibold text-secondary">Prices</p>
                    <div className="flex gap-2">
                        <label className="label">Monthly: $</label>
                        <input
                            type="number"
                            className="input"
                            {...register("pricing.monthly")}
                        />
                    </div>
                    {errors.pricing?.monthly && <p className="text-error text-xs">{errors.pricing.monthly.message}</p>}

                    <div className="flex gap-2">
                        <label className="label">Yearly: $</label>
                        <input
                            type="number"
                            className="input"
                            {...register("pricing.yearly")}
                        />
                    </div>
                    {errors.pricing?.yearly && <p className="text-error text-xs">{errors.pricing.yearly.message}</p>}

                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-success flex-1" disabled={updating} type="submit">
                            {updating ? <span className="loading loading-spinner"></span> : "Save"}
                        </button>
                        <button className="btn btn-error" type="button" onClick={cancelEditing}>Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <h1 className="card-title text-accent">{watch("name")}</h1>
                    <p className="mb-4">{watch("description")}</p>
                    <p className="font-semibold text-secondary">Prices</p>
                    <div className="flex gap-2">
                        <label className="label">Monthly:</label>
                        <span>${watch("pricing.monthly")}</span>
                    </div>
                    <div className="flex gap-2">
                        <label className="label">Yearly:</label>
                        <span>${watch("pricing.yearly")}</span>
                    </div>
                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-primary flex-1" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn btn-error" disabled={deleting} onClick={deletePackage}>
                            {deleting ? <span className="loading loading-spinner"></span> : "Delete"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}