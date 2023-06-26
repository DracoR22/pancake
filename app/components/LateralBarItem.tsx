import clsx from "clsx"
import Link from "next/link"

interface LateralBarItemProps {
    label: string
    icon: any
    href: string
    active?: boolean
}

const LateralBarItem: React.FC<LateralBarItemProps> = ({label, icon: Icon, href, active}) => {
  return (
    <div>
         <Link href={href} className={clsx(`group flex gap-x-3 rounded-md p-3 text-md leading-6
         font-semibold text-neutral-500 hover:text-white`, active && 'text-white')}>
          <Icon className={clsx(`h-6 w-6 shrink-0`, active && 'text-white')}/>
          <span className="">
            {label}
          </span> 
        </Link>
    </div>
  )
}

export default LateralBarItem