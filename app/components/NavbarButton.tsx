'use client'

import useAuthModal from "../hooks/useAuthModal"

const NavbarButton = () => {

const authModal = useAuthModal()

  return (
    <button className="bg-white rounded-full p-2 px-5 absolute right-6" onClick={authModal.onOpen}> 
    <p className="text-black font-bold">Log In</p>
    </button>
  )
}

export default NavbarButton