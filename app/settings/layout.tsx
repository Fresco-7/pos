import { SidebarNav } from "@/components/settings/_components/sidebar-nav"
import getCurrentUser from "@/actions/users/getCurrentUser"
import Navbar from "@/components/navbar/Navbar"

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/settings",
        role: "any"
    },
    {
        title: "Security",
        href: "/settings/security",
        role: "any",
    },
    {
        title: "API",
        href: "/settings/api",
        role: "owner"
    },
    {
        title: "Restaurants",
        href: "/settings/restaurant",
        role: "owner"
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <div>
                Invalid User
            </div>
        )
    }
    return (
        <>

            <Navbar navLinks={[]} />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:-mx-4 lg:w-1/5 lg:pl-10 py-10 mx-5">
                    <SidebarNav items={sidebarNavItems} user={user} />
                </aside>
                <div className="flex-1 pl-10 pr-10 lg:pl-0">{children}</div>
            </div>
        </>
    )
}
