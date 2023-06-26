import { getAuthSession } from "@/app/libs/auth";
import { db } from "@/app/libs/db";
import { SubredditSubscriptionValidator } from "@/app/libs/validators/subreddit";
import { z } from 'zod'

export async function POST(req: Request) {
    try {
      const session = await getAuthSession()

      if(!session?.user) {
       return new Response('Unauthorized', {status: 401})
      }

      const body = await req.json()

      const { subredditId } = SubredditSubscriptionValidator.parse(body)

      const subscriptionExists = await db.subscription.findFirst({
        where: {
            subredditId,
            userId: session.user.id
        },
      })

      if(!subscriptionExists) {
        return new Response('You are not subscribed to this community', { status: 400})
      }

      //check if user is the creator of subreddit
      const subreddit = await db.subreddit.findFirst({
        where: {
            id: subredditId,
            creatorId: session.user.id
        }
      })

      if(subreddit) {
        return new Response('you cant leave your own community', {
            status: 400
        })
      }

      await db.subscription.delete({
        where: {
            userId_subredditId: {
                subredditId,
                userId: session.user.id
            }
        }
      })

      return new Response(subredditId)
    } catch (error) {
        if(error instanceof z.ZodError) {
            return new Response('Invalid request', { status: 422 })
          }
    
          return new Response('Could not unsubscribe, please try again later', { status: 500 })
    }
}