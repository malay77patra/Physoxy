import { Link } from "react-router-dom"
import { FaBookBookmark } from "react-icons/fa6"
import { MdEvent } from "react-icons/md"
import { FaReadme } from "react-icons/fa"

export default function Home() {
    return (
        <>
            <div className="mt-12 md:mt-24 flex flex-col items-center justify-center gap-4 text-center px-4">
                <h1 className="text-xl md:text-4xl font-bold">
                    Live <span className="text-secondary">10x</span> Healthier with <span className="text-accent">Physoxy</span>
                </h1>
                <p className="text-base-content/80 max-w-md">Physoxy helps you breathe deeper, feel better, and live a more energized life.</p>
                <Link to="/pricing" className="btn btn-accent mt-4">JOIN NOW</Link>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-16">
                <div className="card border border-base-content/20 shadow-xl bg-base-100">
                    <div className="card-body items-start">
                        <div className="border border-base-content/20 text-accent p-2 rounded-box">
                            <FaBookBookmark size="32" />
                        </div>
                        <h2 className="card-title text-accent">Courses</h2>
                        <p>Dive into expertly designed programs that teach you breathing techniques, mindfulness, and holistic wellness.</p>
                    </div>
                </div>

                <div className="card border border-base-content/20 shadow-xl bg-base-100">
                    <div className="card-body items-start">
                        <div className="border border-base-content/20 text-secondary p-2 rounded-box">
                            <MdEvent size="32" />
                        </div>
                        <h2 className="card-title text-secondary">Events</h2>
                        <p>Participate in interactive events and challenges that keep you motivated and connected with the community.</p>
                    </div>
                </div>

                <div className="card border border-base-content/20 shadow-xl bg-base-100">
                    <div className="card-body items-start">
                        <div className="border border-base-content/20 text-primary p-2 rounded-box">
                            <FaReadme size="32" />
                        </div>
                        <h2 className="card-title text-primary">Blogs</h2>
                        <p>Stay informed and inspired with blogs on respiratory health, lifestyle tips, nutrition, and personal growth stories.</p>
                    </div>
                </div>
            </div>

            <footer className="mt-24 bg-base-200 p-10 text-base-content">
                <div className="footer flex flex-col md:flex-row justify-between">
                    <div>
                        <span className="footer-title">Physoxy</span>
                        <p>Breathe better. Live better.</p>
                    </div>
                    <div>
                        <span className="footer-title">Quick Links</span>
                        <Link to="/" className="link link-hover">Home</Link>
                        <Link to="/pricing" className="link link-hover">Pricing</Link>
                        <Link to="/contact" className="link link-hover">Contact</Link>
                    </div>
                    <div>
                        <span className="footer-title">Follow Us</span>
                        <a className="link link-hover">Instagram</a>
                        <a className="link link-hover">Twitter</a>
                        <a className="link link-hover">Facebook</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
