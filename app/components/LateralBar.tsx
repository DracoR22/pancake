'use client'

import Link from "next/link"
import useRoutes from "../hooks/useRoutes"
import LateralBarItem from "./LateralBarItem"
import CreateCommunity from "./CreateCommunity"




const LateralBar = () => {

    const routes = useRoutes()

  return (
    <div className='overflow-hidden fixed h-screen border border-neutral-800 left-0'>
        <div className='bg-neutral-900 h-full w-[270px] px-6 py-6'>
        <p className="text-xs text-gray-500 py-2 px-4">FEEDS</p>
          {routes.map ((item) => (
            <div key={item.label}>
                <LateralBarItem href={item.href} icon={item.icon} active={item.active} 
                label={item.label}/>
            </div>
          ))}

         <p className="text-xs text-gray-500 py-6 px-4">COMMUNITIES</p>
           
           <CreateCommunity/>

        </div>

    </div>
  )
}

export default LateralBar