'use client'

import { User } from 'next-auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/DropdownMenu'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserAccountNavProps{
    user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({user}) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <UserAvatar
            className='h-9 w-9'
             user={{
              name: user.name || null,
              image: user.image || null
            }}/>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='bg-neutral-900 border-neutral-800'
         align='end'>
          <div className='flex items-center justify-start gap-2 p-2'>
            <div className='flex flex-col space-y-1 leading-none'>
               {user.name && <p className='font-medium'> {user.name} </p>}
               {user.email && <p className='w-[200px] truncate text-sm text-neutral-300'> {user.email} </p>}
            </div>
          </div>

          <DropdownMenuSeparator/>

          <DropdownMenuItem asChild>
            <Link href='/' className='cursor-pointer hover:bg-neutral-800'>
              Feed
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href='/r/create' className='cursor-pointer hover:bg-neutral-800'>
              Create a community
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href='/settings' className='cursor-pointer hover:bg-neutral-800'>
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator/>

          <DropdownMenuItem className='cursor-pointer hover:bg-neutral-800' onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`
            })
          }}>
             Sign out
          </DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav