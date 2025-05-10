import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useApi } from "@/hooks/useApi"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

const eventSchema = yup.object({
    title: yup.string().trim().required("Title is required").min(3, "Title must be at least 3 characters"),
    content: yup.string().trim().required("Content is required").min(10, "Content must be at least 10 characters"),
}).required()

export default function Events() {
    const api = useApi()
    const newEventRef = useRef(null)
    const [newEventOpen, setNewEventOpen] = useState(false)
    const [adding, setAdding] = useState(false)
    const [events, setEvents] = useState([])
    const [packages, setPackages] = useState([])
    const [loadingPkgs, setLoadingPkgs] = useState(true)
    const [loading, setLoading] = useState(true)
    const [deletingEventId, setDeletingEventId] = useState(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(eventSchema)
    })

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const { error, data } = await api.public.get("/api/event/all")
            if (error) {
                toast.error(error.message)
            } else {
                setEvents(data)
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const fetchPackages = async () => {
        setLoadingPkgs(true)
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
            setLoadingPkgs(false)
        }
    }

    const addNewEvent = async (formData) => {
        setAdding(true)
        try {
            formData.type = "event"
            const { error, data } = await api.protected.post("/api/event/new", formData)
            const eventPkg = packages.find(pkg => pkg._id === formData.plan)
            if (error) {
                toast.error(error.message)
            } else {
                setEvents(prev => [...prev, { ...data, plan: eventPkg }])
                reset()
                setNewEventOpen(false)
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setAdding(false)
        }
    }

    const deleteEvent = async (eventId) => {
        setDeletingEventId(eventId)
        try {
            const { error } = await api.protected.delete(`/api/event/delete/${eventId}`)
            if (error) {
                toast.error(error.message)
            } else {
                setEvents(prev => prev.filter(e => e._id !== eventId))
                toast.success("Deleted!")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setDeletingEventId(null)
        }
    }

    useEffect(() => {
        fetchEvents()
        fetchPackages()
    }, [])

    useEffect(() => {
        const modal = newEventRef.current
        if (!modal) return

        if (newEventOpen) {
            if (!modal.open) modal.showModal()
        } else {
            if (modal.open) modal.close()
        }
    }, [newEventOpen])

    useEffect(() => {
        const modal = newEventRef.current
        if (!modal) return

        const handleClose = () => setNewEventOpen(false)
        modal.addEventListener("close", handleClose)

        return () => {
            modal.removeEventListener("close", handleClose)
        }
    }, [])

    if (loading || loadingPkgs) {
        return <div className="p-4 flex justify-center">
            <span className="loading loading-spinner"></span>
        </div>
    }

    return (
        <div className="flex flex-col gap-4">
            <dialog ref={newEventRef} className="modal">
                <div className="modal-box max-w-84">
                    <h3 className="font-bold text-lg mb-4">New Event</h3>
                    <form onSubmit={handleSubmit(addNewEvent)} className="flex flex-col gap-2">
                        <input
                            type="text"
                            className="input"
                            placeholder="Title"
                            {...register("title")}
                        />
                        {errors.title && <p className="text-error text-xs">{errors.title.message}</p>}

                        <textarea
                            className="textarea"
                            placeholder="Content"
                            {...register("content")}
                        />
                        {errors.content && <p className="text-error text-xs">{errors.content.message}</p>}

                        <select className="select" {...register("plan")}>
                            <option value="">Free</option>
                            {packages.map((pkg) => (
                                <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
                            ))}
                        </select>
                        {errors.plan && <p className="text-error text-xs">{errors.plan.message}</p>}

                        <div className="modal-action">
                            <button
                                className="btn btn-success"
                                type="submit"
                                disabled={adding}
                            >
                                {adding ? <span className="loading loading-spinner" /> : "Add"}
                            </button>
                            <button
                                className="btn"
                                type="button"
                                onClick={() => setNewEventOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <h1 className="text-lg font-bold">Events</h1>
            <div className="flex justify-end">
                <button className="btn btn-success" onClick={() => setNewEventOpen(true)}>
                    <FaPlus /> Add New
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {events.map((event) => (
                    <div key={event._id} className="flex items-center justify-center gap-2 hover:bg-base-content/5">
                        <div className="flex-1">
                            <Link to={`/event/${event._id}`} className="group">
                                <h2 className="font-semibold text-md group-hover:underline p-2">{event.title}</h2>
                            </Link>
                        </div>
                        <span className="badge badge-accent mr-4">{event.plan ? event.plan.name : "FREE"}</span>
                        <button
                            className="btn btn-error"
                            onClick={() => deleteEvent(event._id)}
                            disabled={deletingEventId === event._id}
                        >
                            {deletingEventId === event._id ? (
                                <span className="loading loading-spinner" />
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
