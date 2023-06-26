import MiniCreatePost from "@/app/components/MiniCreatePost"
import PostFeed from "@/app/components/PostFeed"
import { getAuthSession } from "@/app/libs/auth"
import { db } from "@/app/libs/db"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import Link from "next/link"
import { notFound } from "next/navigation"


interface PageProps {
    params: {
        slug: string
    }
}

const page = async ({params}: PageProps) => {

const { slug } = params

const session = await getAuthSession()

const subreddit = await db.subreddit.findFirst({
    where: {name: slug},
    include: {
        posts: {
            include: {
                author: true,
                votes: true,
                comments: true,
                subreddit: true
            },

            orderBy: {
              createdAt: 'desc'
            },

            take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        },
    },
})

if(!subreddit) return notFound()

  return (
    <div className="bg-neutral-900 rounded-lg p-4 mx-8 md:mx-0 border border-neutral-800">
    <h1 className="font-bold text-3xl md:text-4xl h-14">
       {subreddit.name}
    </h1>
                  
    <MiniCreatePost session={session}/>
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name}/>
    </div>
  )
}

export default page