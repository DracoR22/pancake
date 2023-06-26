'use client'

import { useState } from "react"
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-hot-toast'


const UserAuthForm = () => {

const loginWithGoogle = async () => {

    try {
      await signIn('google')

    } catch (error) {
      toast.error('Something went wrong!')
    }
}

  return (
    <div className="hover:bg-neutral-700 bg-neutral-900 transition
     border-neutral-800 rounded-full p-2 w-full flex
      items-center cursor-pointer"
      onClick={loginWithGoogle}>
          <FcGoogle size={25} className="sm:mr-20 mr-10"/>
      <p className="text-neutral-100">Continue with Google</p>
    </div>
  )
}

export default UserAuthForm