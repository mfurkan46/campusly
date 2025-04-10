import React from 'react'
import Image from 'next/image'

const Topbar = () => {
  return (
   <div className='bg-white/1 backdrop-blur-md flex items-center justify-center rounded-b-sm z-10 '>
     <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="ksü media logo"
         className='pt-1' 
        />
   </div>
  )
}

export default Topbar