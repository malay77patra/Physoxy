import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Events() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const api = useApi();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { error, data } = await api.public.get("/api/event/all");
            if (error) {
                toast.error(error.message);
            } else {
                setEvents(data);
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                    placeholder="Search events..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <Link
                            to={`/event/${event._id}`}
                            key={event._id}
                            className="flex justify-between items-center p-4 bg-base-100 rounded-2xl shadow hover:bg-base-200 transition"
                        >
                            <span className="text-lg font-semibold">{event.title}</span>
                            <span className="badge badge-accent">
                                {event.plan?.name || "FREE"}
                            </span>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No events found.</p>
                )}
            </div>
        </div>
    );
}
