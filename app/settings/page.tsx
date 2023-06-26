import UserNameForm from "../components/UserNameForm"
import { getAuthSession } from "../libs/auth"

export const metadata = {
    title: 'Settings',
    description: 'Manage account settings'
}


const page = async () => {

const session = await getAuthSession()


  return (
    <div className="max-w-4xl mx-auto py-12 bg-neutral-900 p-4 rounded-lg mt-24">
        <div className="grid items-start gap-8 ">
          <h1 className="font-bold text-3xl md:text-4xl">
            Settings
          </h1>
           <div className="grid gap-10">
            {/* @ts-ignore */}
             <UserNameForm user={{id: session?.user.id, username: session?.user.username || ''}}/>
           </div>
        </div>
    </div>
  )
}

export default page