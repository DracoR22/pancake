'use client'

import type EditorJS from '@editorjs/editorjs'
import { useCallback, useRef, useState, useEffect } from 'react'
import TextAreaAutoSize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '../libs/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadFiles } from '@/app/libs/uploadthing'
import { toast } from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'

interface EditorProps {
    subredditId: string
}

const Editor: React.FC<EditorProps> = ({subredditId}) => {

const { register, handleSubmit, formState: { errors }} = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
        subredditId,
        title: '',
        content: null
    }
})

const ref = useRef<EditorJS>()
const [isMounted, setIsMounted] = useState<boolean>(false)
const _titleRef = useRef<HTMLTextAreaElement>(null)
const pathname = usePathname()
const router = useRouter()

const initializeEditor = useCallback(async () => {
   const EditorJS = (await import('@editorjs/editorjs')).default
   const Header = (await import('@editorjs/header')).default
   const Embed = (await import('@editorjs/embed')).default
   const Table = (await import('@editorjs/table')).default
   const List = (await import('@editorjs/list')).default
   const Code = (await import('@editorjs/code')).default
   const LinkTool = (await import('@editorjs/link')).default
   const InlineCode = (await import('@editorjs/inline-code')).default
   const ImageTool = (await import('@editorjs/image')).default

  if(!ref.current) {
    const editor = new EditorJS({
      holder: 'editor',
      onReady() {
        ref.current = editor
      },
      placeholder: 'Type here to write your post...',
      inlineToolbar: true,
      data: {blocks: []},
      tools: {
        header: Header,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/link',
          }
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                  // @ts-ignore
                const [res] = await uploadFiles([file], 'imageUploader')

                return {
                  success: 1,
                  file: {
                    url: res.fileUrl,
                  }
                }
              },
            }
          }
        },
        list: List,
        code: Code,
        inlineCode: InlineCode,
        table: Table,
        embed: Embed,
      }
    })
  }
}, [])

useEffect(() => {
  if(typeof window !== 'undefined') {
    setIsMounted(true)
  }
}, [])

useEffect(() => {
  if(Object.keys(errors).length) {
    for(const [key, value] of Object.entries(errors)) {
      toast.error('Something went wrong :(')
    }
  }
}, [errors])

useEffect(() => {
  const init = async () => {
    await initializeEditor()

    setTimeout(() => {
      _titleRef.current?.focus()
    }, 0)
  }

  if(isMounted) {
    init()

    return () => {
      ref.current?.destroy()
      ref.current = undefined
    }
  }
}, [isMounted, initializeEditor])

const {mutate: createPost} = useMutation({
  mutationFn: async ({title, content, subredditId}: PostCreationRequest) => {
  const payload: PostCreationRequest = {subredditId, title, content}
  const {data} = await axios.post('/api/subreddit/post/create', payload)
  return data
  },
  onError: () => {
    return toast.error('Something went wrong :(')
  },
  onSuccess: () => {
    const newPathname = pathname.split('/').slice(0, -1).join('/')
    router.push(newPathname)

    router.refresh()

    return toast.success('Post created!')
  }
})

async function onSubmit(data: PostCreationRequest) {
  const blocks = await ref.current?.save() 
  const payload: PostCreationRequest = {
    title: data.title,
    content: blocks,
    subredditId
  }

  createPost(payload)
}

if (!isMounted) {
  return null
}

const {ref: titleRef, ...rest} = register('title')

  return (
    <div className="w-full p-4 bg-neutral-900">
     <form 
      id="subreddit-post-form"
      className="f-fit"
      onSubmit={handleSubmit(onSubmit)}>
       <div>
         <TextAreaAutoSize
          ref={(e) => {
            titleRef(e)
              //@ts-ignore
            _titleRef.current = e
          }}
          {...rest}
          placeholder='Title'
          className='w-full resize-none appearance-none overflow-hidden
          font-bold focus:outline-none bg-transparent text-4xl'/>

          <div id='editor' className='min-h-[500px] text-white'/>
       </div>
     </form>
    </div>
  )
}

export default Editor