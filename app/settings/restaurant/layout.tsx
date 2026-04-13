import { Separator } from "@/components/ui/separator"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='lg:py-10 text-justify flex flex-col'>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Restaurant</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your restaurant settings.
                    </p>
                </div>
                <Separator />
                {children}
            </div>
        </div>
    )
}
