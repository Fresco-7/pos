import { Separator } from '@/components/ui/separator'
import { ProfileForm } from "@/components/settings/_components/profile-form"
import getCurrentUser from '@/actions/users/getCurrentUser';
import getCurrentEmployee from '@/actions/users/getCurrentEmlpoyee';

export default async function SettingsProfilePage() {
  
  const user = await getCurrentUser();
  const employee = await getCurrentEmployee();

  if (!user) {
    return (
      <>
        <div>
          Invalid User
        </div>
      </>
    )
  }
  
  return (
    <div className='lg:py-10 text-justify flex flex-col'>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how you and others, will see you on the dashboard.
          </p>
        </div>
        <Separator />
        <ProfileForm user={user} employee={employee} />
      </div>
    </div>

  )
}
