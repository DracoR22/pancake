import CommentsSection from "@/app/components/CommentsSection"
import EditorOutput from "@/app/components/EditorOutput"
import PostVoteServer from "@/app/components/post-vote/PostVoteServer"
import { db } from "@/app/libs/db"
import { redis } from "@/app/libs/redis"
import { formatTimeToNow } from "@/app/libs/utils"
import { CachedPost } from "@/app/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { classNames } from "uploadthing/client"

interface PageProps {
params: {
    postId: string
}
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({params}: PageProps) => {

const cachedPost = await redis.hgetall(`post:${params.postId}`) as CachedPost

let post: (Post & {votes: Vote[]; author: User}) | null = null

if(!cachedPost) {
    post = await db.post.findFirst({
        where: {
            id: params.postId
        },

        include: {
            votes: true,
            author: true
        }
    })
}

if(!post && !cachedPost) return notFound()

  return (
    <div>
     <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
       <Suspense fallback={<PostVoteShell/>}>
         <PostVoteServer postId={post?.id ?? cachedPost.id} getData={async () => {
            return await db.post.findUnique({
                where: {
                    id: params.postId
                },
                include: {
                    votes: true
                }
            })
         }}/>
       </Suspense>

      <div className="sm:w-0 w-full flex-1 bg-neutral-900 rounded-md p-4 border border-neutral-800">
         <p className="max-h-40 mt-1 truncate text-xs text-neutral-400">
           Posted by {post?.author.username ?? cachedPost.authorUsername}{' '}
           {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
         </p>
         <h1 className="text-xl font-semibold py-2 leading-6 ">
            {post?.title ?? cachedPost.title}
         </h1>

         <EditorOutput content={post?.content ?? cachedPost.content}/>

         <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin text-neutral-400"/>}>
          <CommentsSection postId={post?.id ?? cachedPost.id}/>
         </Suspense>
      </div>

     </div>
    </div>
  )
}

function PostVoteShell() {
    return <div className="flex items-center flex-col pr-6 w-20">
        <div>
            <ArrowBigUp className="h-5 w-5 text-neutral-400"/>
        </div>

        <div className="text-center py-2 font-medium text-sm">
          <Loader2 className="h-3 w-3 animate-spin"/>
        </div>

        <div>
            <ArrowBigDown className="h-5 w-5 text-neutral-400"/>
        </div>
    </div> 
}

export default page