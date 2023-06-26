import Link from "next/link"

const CreateCommunity = async () => {


  return (
         <Link href='/r/create' className="bg-[#ff4500] hover:bg-[#ff4400d0] transition
          rounded-full p-2 px-4 w-full font-bold">
            Create a community
         </Link>
  )
}

export default CreateCommunity