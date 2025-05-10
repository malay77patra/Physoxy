import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Courses() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const api = useApi();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const { error, data } = await api.public.get("/api/course/all");
            if (error) {
                toast.error(error.message);
            } else {
                setCourses(data);
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                    placeholder="Search courses..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <Link
                            to={`/course/${course._id}`}
                            key={course._id}
                            className="flex justify-between items-center p-4 bg-base-100 rounded-2xl shadow hover:bg-base-200 transition"
                        >
                            <span className="text-lg font-semibold">{course.title}</span>
                            <span className="badge badge-accent">
                                {course.plan?.name || "FREE"}
                            </span>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No courses found.</p>
                )}
            </div>
        </div>
    );
}
