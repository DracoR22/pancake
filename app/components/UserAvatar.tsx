import { User } from 'next-auth'
import { Avatar, AvatarFallback } from './ui/Avatar'
import Image from 'next/image'
import { AvatarProps } from '@radix-ui/react-avatar'


interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'name' | 'image'>
}

const UserAvatar: React.FC<UserAvatarProps> = ({user, ...props}) => {
  return (
    <Avatar {...props}>
      {user.image ? (
       <div className='relative aspect-square h-full w-full'>
         <Image fill src={user.image} alt='avatar' referrerPolicy='no-referrer'/>
       </div>
      ) : (
        <AvatarFallback>
          <span className='relative aspect-square h-full w-full'>
            <Image src='/placeholder.jpg' alt='avatar' fill/>
          </span>
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar