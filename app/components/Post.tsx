import { Post, User, Vote } from "@prisma/client"
import { formatTimeToNow } from "../libs/utils"
import { useRef } from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./post-vote/PostVoteClient"

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
    subredditName: string
    post: Post & {
        author: User,
        votes: Vote[]
    }
    commentAmt: number
    votesAmt: number
    currentVote?: PartialVote
}

const Post: React.FC<PostProps> = ({subredditName, post, commentAmt, votesAmt: votesAmt, currentVote}) => {

const pRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-md bg-neutral-900 border border-neutral-800 shadow">
      <div className="px-6 py-4 flex justify-between">
       <PostVoteClient initialVotesAmt={votesAmt} postId={post.id} initialVote={currentVote?.type}/>

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-neutral-400">
             {subredditName ? (
                <>
                <a className="underline text-sm underline-offset-2" 
                 href={`/r/${subredditName}`}>
                    {subredditName}
                </a>
                <span className="px-2">•</span>
                </>
             ) : null}
             <span>
                Posted by {post.author.username}{' '}
             </span>
             {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6">
              {post.title}
            </h1>
          </a>

          <div className="relative text-sm max-h-40 w-full overflow-clip" ref={pRef}>
            <EditorOutput content={post.content}/>
            {pRef.current?.clientHeight === 160 ? (
                <div className="absolute bottom-0 left-0 h-full w-full "/>
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 text-sm p-4 sm:px-6">
          <a 
          className="w-fit flex items-center gap-2"
          href={`/r/${subredditName}/post/${post.id}`}>
            <MessageSquare className="h-4 w-4"/> {commentAmt} comments
          </a>
      </div>

    </div>
  )
}

export default Post