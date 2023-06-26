

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { HiHome } from 'react-icons/hi'
import { BsArrowUpRightCircle } from 'react-icons/bs'

const useRoutes = () => {
    const pathname = usePathname()

    const routes = useMemo(() => [
        {
            label: 'Home',
            href: '/',
            icon: HiHome,
            active: pathname === '/'
        },
        {
            label: 'Popular',
            href: '/popular',
            icon: BsArrowUpRightCircle,
            active: pathname === '/popular'
        }
    ], [pathname])

    return routes
}

export default useRoutes