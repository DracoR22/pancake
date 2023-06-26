'use client'

import { usePathname, useRouter } from "next/navigation"
import { Session } from 'next-auth'
import UserAvatar from "./UserAvatar"
import { Input } from "./ui/Input"
import { ImageIcon, Link2 } from "lucide-react"

interface MiniCreatePostProps {
    session: Session | null
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({session}) => {

const router = useRouter()
const pathName = usePathname()

  return (
    <li className="overflow-hidden rounded-md bg-neutral-900 shadow">
      <div className="full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar user={{
            name: session?.user.name || null,
            image: session?.user.image || null,
          }}/>
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3
           bg-green-500 outline outline-neutral-900"/>
        </div>

        <Input readOnly onClick={() => router.push(pathName + '/submit')} placeholder="Create post"/>

        <button onClick={() => router.push(pathName + '/submit')}>
          <ImageIcon className="text-neutral-500"/>
         </button>

        <button onClick={() => router.push(pathName + '/submit')}>
          <Link2 className="text-neutral-500"/>
        </button>

      </div>
    </li>
  )
}

export default MiniCreatePost