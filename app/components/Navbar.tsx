

import Image from "next/image"
import Link from "next/link"
import { getAuthSession } from "../libs/auth"
import UserAccountNav from "./UserAccountNav"
import NavbarButton from "./NavbarButton"
import SearchBar from "./SearchBar"


const Navbar = async () => {

const session = await getAuthSession()


  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-neutral-900 border-b border-neutral-800 z-[10] py-1 px-8">
      <div className=" max-w-7xl h-full flex items-center justify-between gap-2">
        <Link href='/' className="flex gap-2 items-center">
            <Image src='/pancake1.png' alt="Logo" height={50} width={50}/>
          <p className="hidden pl-1 text-lg font-medium md:block">
             Pancake
          </p>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center justify-center flex-grow w-full">
        <SearchBar/>
        </div>

         {session?.user ? (
          <div className='absolute right-6 top-3'>
         <UserAccountNav user={session.user}/> 
         </div>  
         ) : (
          <NavbarButton/>
         )}
        
      </div> 
    </div>
  )
}

export default Navbar