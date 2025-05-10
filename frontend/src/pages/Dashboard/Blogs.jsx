import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useApi } from "@/hooks/useApi"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

const blogSchema = yup.object({
    title: yup.string().trim().required("Title is required").min(3, "Title must be at least 3 characters"),
    content: yup.string().trim().required("Content is required").min(10, "Content must be at least 10 characters"),
}).required()

export default function Blogs() {
    const api = useApi()
    const newBlogRef = useRef(null)
    const [newBlogOpen, setNewBlogOpen] = useState(false)
    const [adding, setAdding] = useState(false)
    const [blogs, setBlogs] = useState([])
    const [packages, setPackages] = useState([])
    const [loadingPkgs, setLoadingPkgs] = useState(true)
    const [loading, setLoading] = useState(true)
    const [deletingBlogId, setDeletingBlogId] = useState(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(blogSchema)
    })

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const { error, data } = await api.public.get("/api/blog/all")
            if (error) {
                toast.error(error.message)
            } else {
                console.log(data)
                setBlogs(data)
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

    const addNewBlog = async (formData) => {
        setAdding(true)
        try {
            formData.type = "blog"
            const { error, data } = await api.protected.post("/api/blog/new", formData)
            if (error) {
                toast.error(error.message)
            } else {
                setBlogs(prev => [...prev, data])
                reset()
                setNewBlogOpen(false)
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setAdding(false)
        }
    }

    const deleteBlog = async (blogId) => {
        setDeletingBlogId(blogId)
        try {
            const { error } = await api.protected.delete(`/api/blog/delete/${blogId}`)
            if (error) {
                toast.error(error.message)
            } else {
                setBlogs(prev => prev.filter(b => b._id !== blogId))
                toast.success("Deleted!")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setDeletingBlogId(null)
        }
    }


    useEffect(() => {
        fetchBlogs()
        fetchPackages()
    }, [])

    useEffect(() => {
        const modal = newBlogRef.current
        if (!modal) return

        if (newBlogOpen) {
            if (!modal.open) modal.showModal()
        } else {
            if (modal.open) modal.close()
        }
    }, [newBlogOpen])

    useEffect(() => {
        const modal = newBlogRef.current
        if (!modal) return

        const handleClose = () => setNewBlogOpen(false)
        modal.addEventListener("close", handleClose)

        return () => {
            modal.removeEventListener("close", handleClose)
        }
    }, [])

    if (loading || loadingPkgs) {
        return <div className="p-4 flex aria-selected: justify-center">
            <span className="loading loading-spinner"></span>
        </div>
    }

    return (
        <div className="flex flex-col gap-4">
            <dialog ref={newBlogRef} className="modal">
                <div className="modal-box max-w-84">
                    <h3 className="font-bold text-lg mb-4">New Blog</h3>
                    <form onSubmit={handleSubmit(addNewBlog)} className="flex flex-col gap-2">
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
                                onClick={() => setNewBlogOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <h1 className="text-lg font-bold">Blogs</h1>
            <div className="flex justify-end">
                <button className="btn btn-success" onClick={() => setNewBlogOpen(true)}>
                    <FaPlus /> Add New
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {blogs.map((blog) => (
                    <div key={blog._id} className="flex items-center justify-center gap-2 hover:bg-base-content/5">
                        <div className="flex-1">
                            <Link to={`/blog/${blog._id}`} className="group">
                                <h2 className="font-semibold text-md group-hover:underline p-2">{blog.title}</h2>
                            </Link>
                        </div>
                        <span className="badge badge-accent mr-4">{blog.plan ? blog.plan.name : "FREE"}</span>
                        <button
                            className="btn btn-error"
                            onClick={() => deleteBlog(blog._id)}
                            disabled={deletingBlogId === blog._id}
                        >
                            {deletingBlogId === blog._id ? (
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
