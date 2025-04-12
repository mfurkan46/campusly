import React from 'react'
import Image from 'next/image'
import  Link  from 'next/link';

const Header = () => {
  return (
    <div>
        <header className="h-16 container    hidden md:flex fixed top-0 left-[10%] z-50 shadow-md items-center">
         <Link href="/" className="text-2xl font-bold text-gray-900">
         <Image
      src="/logo2.png"
      width={60}
      height={60}
      alt="ksü media logo"
     className='hover:bg-gray-900 rounded-sm hover:rounded-4xl  transition-all   duration-300  cursor-pointer' 
    /></Link> 

 </header>
    </div>
  )
}

export default Header