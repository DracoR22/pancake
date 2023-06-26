'use client'

import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { CommentRequest } from '../libs/validators/comment'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import useAuthModal from '../hooks/useAuthModal'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment: React.FC<CreateCommentProps> = ({postId, replyToId}) => {

const [input, setInput] =  useState<string>('')
const authModal = useAuthModal()
const router = useRouter()

const {mutate: comment} = useMutation({
    mutationFn: async ({postId, text, replyToId}: CommentRequest) => {
        const payload: CommentRequest = {
            postId,
            text,
            replyToId
        }

        const {data} = await axios.patch(`/api/subreddit/post/comment`, payload)
        return data
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
        router.refresh()
        setInput('')
    },
})

  return (
    <div className='grid w-full gap-1.5'>
      <label htmlFor="comment">Your comment</label>
      <div>
        <textarea id="comment" value={input}
         onChange={(e) => setInput(e.target.value)}
         rows={1} placeholder='What are your thoughts?' className='p-4 rounded-md w-full'/>

         <div className='mt-2 flex justify-end'>
           <button 
           disabled={input.length === 0}
           onClick={() => comment({postId, text:input, replyToId})}
           className='p-2 w-full bg-[#ff4500] hover:bg-[#ff4400d0] transition rounded-full'>
              Post
           </button>
         </div>
      </div>
    </div>
  )
}

export default CreateComment