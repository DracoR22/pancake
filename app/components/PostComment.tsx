'use client'

import { useRef, useState } from "react"
import UserAvatar from "./UserAvatar"
import { Comment, CommentVote, User } from "@prisma/client"
import { formatTimeToNow } from "../libs/utils"
import CommentVotes from "./CommentVotes"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from 'next-auth/react'
import useAuthModal from "../hooks/useAuthModal"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "../libs/validators/comment"
import axios from "axios"
import { toast } from "react-hot-toast"

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment
    votesAmt: number
    currentVote: CommentVote | undefined
    postId: string
}

const PostComment: React.FC<PostCommentProps> = ({comment, votesAmt, currentVote, postId}) => {

const commentRef = useRef<HTMLDivElement>(null)
const router = useRouter()
const {data: session} = useSession()
const authModal = useAuthModal()
const [isReplying, setIsReplying] = useState<boolean>(false)
const [input, setInput] = useState<string>('')

const {mutate: postComment} = useMutation({
  mutationFn: async ({postId, text, replyToId}: CommentRequest) => {
    const payload: CommentRequest = {
      postId, text, replyToId
    }

    const {data} = await axios.patch(`/api/subreddit/post/comment`, payload)
    return data
  },
  onError: () => {
    return toast.error('Something went wrong!')
  },
  onSuccess: () => {
    router.refresh()
    setIsReplying(false)
  }
})

  return (
    <div ref={commentRef} className="flex flex-col">
        <div className="flex items-center">
          <UserAvatar user={{
            name: comment.author.name || null,
            image: comment.author.image || null
          }} className="h-6 w-6"/>
          <div className="ml-2 flex items-center gap-x-2">
            <p className="text-sm font-medium">
              {comment.author.username}
            </p>
            <p className="max-h-40 truncate text-xs text-neutral-400">
              {formatTimeToNow(new Date(comment.createdAt))}
            </p>
          </div>
        </div>

        <p className="text-sm mt-2">
          {comment.text}
        </p>

        <div className="flex gap-2 items-center flex-wrap">
         <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote}/>
         <button className="text-sm flex items-center" onClick={() => {
          if(!session) return authModal.onOpen()
          setIsReplying(true)
         }}>
          <MessageSquare className="h-4 w-4 mr-1.5"/>
          Reply
         </button>

         {isReplying ? (
              <div className='grid w-full gap-1.5'>
              <label htmlFor="comment">Your comment</label>
              <div>
                <textarea id="comment" value={input}
                 onChange={(e) => setInput(e.target.value)}
                 rows={1} placeholder='What are your thoughts?' className='p-4 rounded-md w-full'/>
        
                 <div className='mt-2 flex justify-end'>

                  <button 
                  tabIndex={-1}
                  onClick={() => setIsReplying(false)}
                  className='p-1 w-[100px] bg-white hover:bg-gray-200 transition
                   rounded-full text-black font-semibold'>
                    Cancel
                  </button>

                    <div className="mx-2"/>

                   <button 
                   disabled={input.length === 0}
                   onClick={() => {
                    if(input) return postComment({
                      postId, text: input, replyToId: comment.replyToId ?? comment.id
                    })
                   }}
                   className='p-1 w-[100px] bg-[#ff4500] hover:bg-[#ff4400d0] transition rounded-full'>
                      Post
                   </button>

                 </div>
              </div>
            </div>
         ) : null}
        </div>
    </div>
  )
}

export default PostComment