'use client'

import dynamic from "next/dynamic"
import Image from "next/image"

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, {
    ssr: false
})

interface EditorOutputProps {
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
    }
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

const EditorOutput: React.FC<EditorOutputProps> = ({content}) => {
  return (
    <Output style={style} data={content} className='text-sm' renderer={renderers}/>
  )
}

function CustomCodeRenderer({data}: any) {
    return (
        <pre className="bg-neutral-700 rounded-md p-4">
          <code className="text-sm">
            {data.code}
          </code>
        </pre>
    )
}

function CustomImageRenderer({data}: any) {
    const src = data.file.url

    return (
        <div className="relative w-full min-h-[15rem]">
          <Image alt="Image" className="object-contain" fill src={src}/>
        </div>
    )
}

export default EditorOutput