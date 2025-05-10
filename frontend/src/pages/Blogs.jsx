import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Blogs() {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const api = useApi();

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { error, data } = await api.public.get("/api/blog/all");
            if (error) {
                toast.error(error.message);
            } else {
                setBlogs(data);
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-4 flex items-center justify-center">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div>
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <Link
                            to={`/blog/${blog._id}`}
                            key={blog._id}
                            className="flex justify-between items-center p-4 bg-base-100 rounded-2xl shadow hover:bg-base-200 transition"
                        >
                            <span className="text-lg font-semibold">{blog.title}</span>
                            <span className="badge badge-accent">
                                {blog.plan?.name || "FREE"}
                            </span>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No blogs found.</p>
                )}
            </div>
        </div>
    );
}
