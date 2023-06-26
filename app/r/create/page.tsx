'use client'

import CreateCommunity from "@/app/components/CreateCommunity"
import { Input } from "@/app/components/ui/Input"
import useAuthModal from "@/app/hooks/useAuthModal"
import { CreateSubredditPayload } from "@/app/libs/validators/subreddit"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"

const Page = () => {

const [input, setInput] = useState<string>('')
const router = useRouter()
const authModal = useAuthModal()

const {mutate: CreateCommunity} = useMutation({
    mutationFn: async () => {
    const payload: CreateSubredditPayload  = {
     name: input
    }

    const {data} = await axios.post('/api/subreddit', payload)
    return data as string
    } ,
    onError: (err)=> {
      if(err instanceof AxiosError) {
        if(err.response?.status === 409) {
          return toast.error('Subreddit already exists')
        }

        if(err.response?.status === 422) {
          return toast.error('Invalid community name')
        }

        if(err.response?.status === 401) {
          return authModal.onOpen()
        }
      }

      toast.error('Something went wrong :(')
    },

    onSuccess: (data) => {
      router.push(`/r/${data}`)
    }
})

  return (
    <div className="container flex items-start mt-16 justify-center h-full mx-w-3xl mx-auto">
      <div className="relative bg-neutral-900 h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="bg-neutral-500 h-px"/>

        <div>
            <p className="text-lg font-medium">Name</p>
            <p className="text-xs pb-2">Community names including capitalization cannot be changed.</p>

            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center
               text-neutral-500">
                r
              </p>

              <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6"/>
            </div>
        </div>

        <div className="flex jusyify-end gap-4">
          <button 
           onClick={() => router.push('/')}
           className="bg-red-500 p-2 px-4 font-semibold rounded-full">
            Cancel
          </button>

          <button 
          disabled={input.length === 0}
          onClick={() => CreateCommunity()}
           className="bg-white text-black p-2 px-4 font-semibold rounded-full">
            Create 
          </button>
        </div>
      </div> 
    </div>
  )
}

export default Page