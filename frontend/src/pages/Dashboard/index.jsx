import { useSearchParams } from "react-router-dom"
import Overview from "./Overview"
import Packages from "./Packages"
import Blogs from "./Blogs"
import Events from "./Events"
import Courses from "./Courses"

export default function Dashboard() {
    const [searchParams] = useSearchParams()
    const tab = searchParams.get('tab')

    const tabsMap = {
        "packages": Packages,
        "blogs": Blogs,
        "events": Events,
        "courses": Courses,
    }

    const TabComponent = tabsMap[tab] || Overview

    return <TabComponent />
}
