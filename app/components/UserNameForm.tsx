'use client'

import { useForm } from "react-hook-form"
import { UsernameRequest, UsernameValidator } from "../libs/validators/username"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { Input } from "./ui/Input"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import useAuthModal from "../hooks/useAuthModal"

interface UserNameFormProps {
    user: Pick<User, 'id' | 'username'>
}

const UserNameForm: React.FC<UserNameFormProps> = ({user}) => {


const {handleSubmit, register, formState: { errors }} = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
        name: user?.username || ''
    }
})

const router = useRouter()
const authModal = useAuthModal()

const {mutate: updateUsername} = useMutation({
    mutationFn: async ({name}: UsernameRequest) => {
      const payload: UsernameRequest = {name}

      const {data} = await axios.patch(`/api/username`, payload)
      return data
    },
    onError: (err)=> {
        if(err instanceof AxiosError) {
          if(err.response?.status === 409) {
            return toast.error('Name already exists')
          }

          if(err.response?.status === 401) {
            return authModal.onOpen()
          }
      }
      
      return toast.error('Something went wrong :(')
    },
    onSuccess: () => {
        toast.success('Username updated!')
        router.refresh()
    }
     
})

  return (
    <form onSubmit={handleSubmit((e) => updateUsername(e))}>
      <header>
        <h1 className="font-semibold text-lg">Your username</h1>
        <p className="mt-4 mb-1 font-medium">
        Change your current username
       </p>
      </header>
      <div>
       <div className="relative grid gap-1">
        <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
          <span className="text-sm text-neutral-400">
             /u
          </span>
        </div>
        <label className="sr-only" htmlFor="name">Name</label>
        <Input id="name" className="w-full pl-6" size={32} {...register('name')}/>

        {errors?.name && (
            <p className="px-1 text-xs text-red-600">
                {errors.name.message}
            </p>
        )}
       </div>
       <footer>
        <button className="w-full mt-3 p-2 bg-[#ff4500] hover:bg-[#ff4400d0] 
         transition font-semibold rounded-full">
            Change name
        </button>
       </footer>
      </div>
    </form>
  )
}

export default UserNameForm