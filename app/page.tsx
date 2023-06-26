import LateralBar from './components/LateralBar'
import { getAuthSession } from './libs/auth'
import GeneralFeed from './components/GeneralFeed'
import CustomFeed from './components/CustomFeed'

export default async function Home() {

 const session = await getAuthSession()

  return (
   <div>
     {/* subreddit info */}
     <div className='hidden lg:flex'>
     <LateralBar/>
     </div>
    <h1 className='font-bold pt-10 mx-10 xl:pl-[190px] lg:pl-[260px] 2xl:pl-[80px]'>
      Recommended for you
    </h1>
    <div className='mx-10 xl:pl-[190px] lg:pl-[260px] 2xl:pl-[80px] gap-y-4 md:gap-x-4 py-6'>
     {/* Feed */}
      {session ? <CustomFeed/> : <GeneralFeed/>}
    </div>
   </div>
  )
}
