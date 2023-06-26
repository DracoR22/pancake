
import SubscribeLeaveToggle from "@/app/components/SubscribeLeaveToggle"
import { getAuthSession } from "@/app/libs/auth"
import { db } from "@/app/libs/db"
import { format } from "date-fns"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { ReactNode } from "react"

const Layout = async({
    children, params: {slug},
}:
     {children: ReactNode
    params: { slug: string }}) => {

const session = await getAuthSession()

const subreddit = await db.subreddit.findFirst({
    where: {name: slug},
    include: {
        posts: {
            include: {
                author: true,
                votes: true
            }
        }
    }
})

const subscription = !session?.user ? undefined :  await db.subscription.findFirst({
    where: {
        subreddit: {
            name: slug,
        },
        user: {
            id: session.user.id
        }
    }
})

const isSubscribed = !!subscription

if(!subreddit) return notFound()

const memberCount = await db.subscription.count({
    where: {
        subreddit: {
            name: slug
        }
    }
})

   return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
        <div>
            {/* TODO BUTTON TO TAKE US BACK */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
              <div className="flex flex-col col-span-2 space-y-6">
                {children}
              </div>

              {/* INFO */}
              <div className="hidden md:block overflow-hidden h-fit
               rounded-lg border border-neutral-800 order-first md:order-last bg-neutral-900
               border-b">
                <div className="px-6 py-4">
                  <p className="font-semibold py-3">About {subreddit.name}</p>
                </div>

                <dl className="divide-y divide-neutral-800 px-6 py-4 text-sm leading-6 bg-neutral-900">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-neutral-400">
                        Created
                      </dt>
                      <dd className="text-neutral-200">
                        <time dateTime={subreddit.createdAt.toDateString()}>
                           {format(subreddit.createdAt, 'MMMM d, yyyy')}
                        </time>
                      </dd>
                    </div>

                    <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-neutral-400">
                        Members
                      </dt>
                      <dd className="text-neutral-200">
                        <div className="text-neutral-100">
                          {memberCount}
                        </div>
                      </dd>
                    </div>

                    {subreddit.creatorId === session?.user.id ? (
                      <div className="flex justify-between gap-x-4 py-3">
                         <p className="text-neutral-400">You created this community</p>
                      </div>
                    ) : null}

                    {subreddit.creatorId !== session?.user.id ? (
                      <SubscribeLeaveToggle
                       subredditId={subreddit.id}
                       subredditName={subreddit.name}
                       isSubscribed={isSubscribed}/>
                    ) : null}
                
                     
                </dl>
              </div>
            </div>

        </div>
    </div>
   )
}

export default Layout