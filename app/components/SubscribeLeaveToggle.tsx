'use client'

import { useMutation } from "@tanstack/react-query"
import { SubscribeToSubredditPayload } from "../libs/validators/subreddit"
import axios, { AxiosError } from "axios"
import useAuthModal from "../hooks/useAuthModal"
import { toast } from "react-hot-toast"
import { startTransition } from "react"
import { useRouter } from "next/navigation"

interface SubscribeLeaveToggleProps {
subredditId: string
subredditName: string
isSubscribed: boolean
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps>
 = ({subredditId, subredditName, isSubscribed}) => {

const authModal = useAuthModal()
const router = useRouter()

//Join Community
const {mutate: subscribe} = useMutation({
  mutationFn: async () => {
     const payload: SubscribeToSubredditPayload = {
       subredditId,
     }

     const {data} = await axios.post('/api/subreddit/subscribe',payload)
     return data as string
  },

  onError: (err) => {
    if(err instanceof AxiosError) {
      if(err.response?.status === 401) {
        return authModal.onOpen()
      }
    }

    return toast.error('Something went wrong :(')
  },
  onSuccess: () => {
    startTransition(() => {
     router.refresh()
    })

     return toast.success(`Subscribed to ${subredditName}`)
  }
})


//Leave Community
const {mutate: unsubscribe} = useMutation({
  mutationFn: async () => {
     const payload: SubscribeToSubredditPayload = {
       subredditId,
     }

     const {data} = await axios.post('/api/subreddit/unsubscribe',payload)
     return data as string
  },

  onError: (err) => {
    if(err instanceof AxiosError) {
      if(err.response?.status === 401) {
        return authModal.onOpen()
      }
    }

    return toast.error('Something went wrong :(')
  },
  onSuccess: () => {
    startTransition(() => {
     router.refresh()
    })

     return toast.success(`You leaved ${subredditName}`)
  }
})

  return isSubscribed ? (
    <button 
    onClick={() => unsubscribe()}
    className="w-full mt-1 mb-4 p-2 bg-red-600 hover:bg-red-700 transition 
    rounded-full font-semibold">
     Leave Community
    </button>
  ) : (
    <button
    onClick={() => subscribe()}
     className="w-full mb-4 p-2 bg-[#ff4500] hover:bg-[#ff4400d0] 
     transition font-semibold rounded-full">
     Join community
    </button>
  )
    
  
}

export default SubscribeLeaveToggle