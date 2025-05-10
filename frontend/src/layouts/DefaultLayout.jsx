import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar, SidebarProvider, SidebarHeader, SidebarFooter, SidebarContent, SidebarMenu, SidebarMenuItem, CollapsibleSidebarSubMenu, CollapsibleSidebarSubMenuItem } from '@/components/ui/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { GoHomeFill } from "react-icons/go"
import { TbLayoutDashboardFilled } from "react-icons/tb"

export default function DefaultLayout() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className='font-semibold text-accent'>Physoxy</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem onClick={() => navigate("/")}>
                            <GoHomeFill /> Home
                        </SidebarMenuItem>
                        {isAuthenticated && (user.role === "admin") && (
                            <>
                                <CollapsibleSidebarSubMenu items={
                                    <>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard")}>Overview</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard?tab=packages")}>Packages</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard?tab=blogs")}>Blogs</CollapsibleSidebarSubMenuItem>
                                    </>
                                }>
                                    <TbLayoutDashboardFilled /> Dashboard
                                </CollapsibleSidebarSubMenu>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <span className='text-xs text-base-content/60'>© 2025 Physoxy, Inc.</span>
                </SidebarFooter>
            </Sidebar>
            <div className='w-full'>
                <Navbar />
                <div className='p-2 md:p-4'>
                    <Outlet />
                </div>
            </div>
        </SidebarProvider >
    )
}
