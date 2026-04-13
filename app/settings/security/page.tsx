import { Separator } from '@/components/ui/separator'
import { SecurityForm } from "@/components/settings/_components/security-form"
import getCurrentUser from '@/actions/users/getCurrentUser';

export default async function SettingsProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div>
        No user
      </div>
    )
  }

  return (
    <div className='lg:py-10 text-justify flex flex-col'>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Security</h3>
          <p className="text-sm text-muted-foreground">
            Change your password.
          </p>
        </div>
        <Separator />
        <SecurityForm user={user} />
        <div className="flex-1 mt-10 text-justify text-muted-foreground text-sm">
          <p>Created at : {user.createdAt.toLocaleDateString()}</p>
          <p>Last update : {user.updatedAt.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
