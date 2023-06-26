'use client'

import Box from './components/Box'
import { PulseLoader } from 'react-spinners'

const Loading = () => {
  return (
   <Box className="h-full flex items-center justify-center">
      <PulseLoader color="#ff4500" size={25}/>
   </Box>
  )
}

export default Loading