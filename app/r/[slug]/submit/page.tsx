import Editor from "@/app/components/Editor"
import { db } from "@/app/libs/db"
import { notFound } from "next/navigation"


interface PageProps {
    params: {
        slug: string
    }
}

const page = async ({params}: PageProps) => {

const subreddit = await db.subreddit.findFirst({
    where: {
        name: params.slug,
    }
})

if(!subreddit) return notFound()

  return (
    <div className="flex flex-col items-start gap-6 bg-neutral-900 p-4 rounded-lg
     border border-neutral-800 mx-8 md:mx-0">
       <div className="border-b border-neutral-800 pb-5">
         <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
           <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
              Create Post
           </h3>
           <p className="ml-2 mt-1 truncate text-sm text-neutral-400">in {params.slug}</p>
         </div>
       </div> 

       {/* FORM */}
       <Editor subredditId={subreddit.id}/>

       <div className="w-full flex justify-end">
         <button
          className="bg-[#ff4500] rounded-full p-2 w-full font-bold hover:bg-[#ff4400d0] transition"
          type="submit"
          form="subreddit-post-form">
            Post
         </button>
       </div>
    </div>
  )
}

export default page