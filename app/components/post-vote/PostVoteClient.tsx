'use client'

import useAuthModal from '@/app/hooks/useAuthModal'
import { cn } from '@/app/libs/utils'
import { PostVoteRequest } from '@/app/libs/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface PostVoteClientProps {
    postId: string
    initialVotesAmt: number
    initialVote?: VoteType | null
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({postId, initialVotesAmt, initialVote}) => {

const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
const [currentVote, setCurrentVote] = useState(initialVote)
const prevVote = usePrevious(currentVote)
const authModal = useAuthModal()

useEffect(() => {
    setCurrentVote(initialVote)
}, [initialVote])

const {mutate:vote} = useMutation({
    mutationFn: async (voteType: VoteType) => {
       const payload: PostVoteRequest = {
          postId,
          voteType,
       }

       await axios.patch('/api/subreddit/post/vote', payload)
    },

    onError: (err, voteType) => {
      if(voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      //reset vote
      setCurrentVote(prevVote)

      if(err instanceof AxiosError) {
         if(err.response?.status === 401) {
            return authModal.onOpen()
         }
      }

      return toast.error('Something went wrong :(')
    },

    onMutate: (type: VoteType) => {
      if(currentVote === type) {
         setCurrentVote(undefined)
         if(type === 'UP') setVotesAmt((prev) => prev - 1)
         else if(type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
         setCurrentVote(type)
         if(type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
         else if(type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    }
})

  return (
    <div className='hidden sm:flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
      <button onClick={() => vote('UP')} aria-label='upvote' className='pl-[16px] p-2'>
         <ArrowBigUp className={cn('h-6 w-6 text-neutral-400', {
            'text-emerald-500 fill-emerald-500' : currentVote === 'UP'
         })}/>
      </button>

      <p className='text-center py-2 font-medium text-sm'>
         {votesAmt}
      </p>

      <button onClick={() => vote('DOWN')} aria-label='downvote' className='pl-[16px] p-2'>
         <ArrowBigDown className={cn('h-6 w-6 text-neutral-400', {
            'text-red-500 fill-red-500' : currentVote === 'DOWN'
         })}/>
      </button>
    </div>
  )
}

export default PostVoteClient