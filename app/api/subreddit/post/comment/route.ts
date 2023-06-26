import { getAuthSession } from "@/app/libs/auth"
import { db } from "@/app/libs/db"
import { CommentValidator } from "@/app/libs/validators/comment"
import { z } from 'zod'

export async function PATCH(req: Request) {
    try {
       const body = await req.json()
       const {postId, text, replyToId} = CommentValidator.parse(body)
       const session = await getAuthSession()

       if (!session?.user) {
        return new Response('Unauthorized', {status: 401})
       }

       await db.comment.create({
        data: {
            text,
            postId,
            authorId: session.user.id,
            replyToId
        }
       })

       return new Response('Ok')
    } catch (error) {
        if(error instanceof z.ZodError) {
            return new Response('Invalid request', { status: 400 })
          }
    
          return new Response('Could not create a comment, please try again later', { status: 500 })
    }
}