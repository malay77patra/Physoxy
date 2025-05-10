import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export default function Blog() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [blog, setBlog] = useState({})
    const api = useApi()

    const fetchBlog = async () => {
        setLoading(true)
        try {
            const { data, error } = await api.protected.get(`/api/blog/${id}`)
            if (error) {
                setLoadingError(error.message)
            } else {
                setBlog(data)
                setLoading(false)
            }
        } catch (err) {
            setLoadingError("Something went wrong")
        }
    }

    useEffect(() => {
        fetchBlog()
    }, [])

    if (loadingError) return <div className="p-4 flex items-center justify-center">
        <span className="text-error">{loadingError}</span>
    </div>

    if (loading) return <div className="p-4 flex items-center justify-center">
        <span className="loading loading-spinner"></span>
    </div>

    if (blog.upgrade) {
        return (
            <div className="relative">
                <div>
                    <h1 className="text-2xl font-bold mb-4">This is a sample blog heading used as placeholder.</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, magni repellat sequi dolorem aperiam fugit cupiditate excepturi cum modi accusantium facere a vero aliquid fugiat amet veniam minima ab rem exercitationem in commodi totam? Quibusdam, veniam exercitationem! Alias inventore esse in sunt pariatur iste, recusandae mollitia et soluta, asperiores vel obcaecati architecto, quis doloremque ad! Laborum veniam, corporis et quasi quisquam laudantium fuga molestias at neque illo quae omnis asperiores eligendi numquam pariatur. Velit natus et omnis nemo debitis vel nostrum! Earum officiis, magnam, libero quod nulla minus repellendus explicabo maxime fugiat, nemo iste. Hic tenetur laboriosam id nobis iusto saepe nesciunt, in deserunt corrupti sit veniam optio similique magni necessitatibus quas, magnam nulla aperiam? Sunt qui doloremque obcaecati necessitatibus eligendi veritatis eos eum eaque soluta illo dicta facilis repellat aliquam suscipit molestias saepe amet delectus, repudiandae, perspiciatis temporibus distinctio. Quia aspernatur autem tempora error itaque sequi id deserunt labore laboriosam reiciendis officia nulla dicta, necessitatibus qui dolor exercitationem quae incidunt illum eum. Possimus iusto fugit unde ad cumque iure voluptate quam hic praesentium, nesciunt ab incidunt tempore vel minima non, quod numquam ut quo labore? Recusandae exercitationem eos odit voluptates ex deserunt suscipit rerum cumque, quos voluptatum mollitia dolorem?</p>
                </div>
                <div className="absolute inset-0 z-5 -m-4 backdrop-blur-sm flex justify-center items-start p-4">
                    <div className="card bg-base-200 border p-4 max-w-72 flex-1 flex flex-col gap-2">
                        <h1 className="text-center text-lg font-semibold mb-4">Upgrade plan to unlock.</h1>
                        <p><label className="label">Required plan:</label> <span className="badge badge-accent">{blog.package.name}</span></p>
                        <p><label className="label">Includes:</label></p>
                        <p>{blog.package.description}</p>
                        <Link className="btn btn-accent" to="/pricing">Upgrade</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
            <p>{blog.content}</p>
        </div>
    )
}
