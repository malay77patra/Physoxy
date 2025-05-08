import { useSearchParams } from "react-router-dom"
import Overview from "./Overview"
import Packages from "./Packages"

export default function Dashboard() {
    const [searchParams] = useSearchParams()
    const tab = searchParams.get('tab')

    const tabsMap = {
        "packages": Packages
    }
    
    const TabComponent = tabsMap[tab] || Overview

    return <TabComponent />
}
