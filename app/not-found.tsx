import getCurrentSession from "@/actions/users/getCurrentSession"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function NotFound() {
  const user = getCurrentSession();

  return (
    <main className="min-h-screen bg-white dark:bg-card flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-9xl font-extrabold text-blue-500 dark:text-blue-500">404</h1>
        <p className="mt-4 text-lg leading-6 text-gray-900 dark:text-white">
          Oops! The page you're looking for could not be found.
        </p>
        <div className="mt-8">
          {!user ? (
            <Link href={'/'}>
              <Button className="text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700">
                Go back home
              </Button>
            </Link>
          ) : (
            <Link href={'/dashboard'}>
              <Button className="text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </Link>
          )
          }
        </div>
      </div>
    </main>
  )
}

