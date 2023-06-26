'use client'

import { useQuery } from "@tanstack/react-query"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/Command"
import { useCallback, useRef, useState } from "react"
import axios from "axios"
import { Prisma, Subreddit } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import debounce from 'lodash.debounce'


const SearchBar = () => {

const [input, setInput] = useState<string>('')

const {data: queryResults, refetch, isFetched, isFetching} = useQuery({
    queryFn: async () => {
      if(!input) return []
      const {data} = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
})

const request = debounce(async () => {
    refetch()
}, 300)

const debounceRequest = useCallback(() => {
    request()
  }, [])

const router = useRouter()

  return (
    <Command 
    className="relative rounded-full border max-w-lg z-50 overflow-visible bg-neutral-800
    outline-none border-neutral-700 focus:border-none focus:outline-none ring-0 text-white">
      <CommandInput 
      value={input}
      onValueChange={(text) => {setInput(text); debounceRequest()}}
      className="outline-none border-none focus:border-none focus:outline-none ring-0"
      placeholder="Search in Pancake"/>

      {input.length > 0 ? (
        <CommandList className="absolute bg-neutral-800 top-full inset-x-0 rounded-b-lg">
           {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
           {(queryResults?.length ?? 0) > 0 ? (
             <CommandGroup heading='Communities'>
               {queryResults?.map((subreddit) => (
                <CommandItem 
                 onSelect={(e) => {router.push(`/r/${e}`); router.refresh()}}
                  key={subreddit.id} value={subreddit.name}>
                    <Users className="mr-2 h-4 w-4"/>
                    <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
               ))}
             </CommandGroup>
           ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}

export default SearchBar