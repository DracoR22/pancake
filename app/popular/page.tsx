import GeneralFeed from "../components/GeneralFeed"
import LateralBar from "../components/LateralBar"
import { getAuthSession } from "../libs/auth"


export default async function Home() {

 const session = await getAuthSession()

  return (
   <div>
     {/* subreddit info */}
     <div className='hidden lg:flex'>
     <LateralBar/>
     </div>
    <h1 className='font-bold pt-10 mx-10 xl:pl-[190px]  lg:pl-[260px]'>
      Popular posts
    </h1>
    <div className='mx-10 xl:pl-[190px] lg:pl-[260px]  gap-y-4 md:gap-x-4 py-6'>
     {/* Feed */}
      <GeneralFeed/>
    </div>
   </div>
  )
}
