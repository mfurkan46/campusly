import Link from 'next/link';
import React from 'react'
import { CiBellOn, CiBookmark, CiHome, CiInboxIn, CiSearch, CiSettings, CiUser  } from "react-icons/ci";

const list =[
    {
        icon:<CiHome size={25} />,
        name:'Ana Sayfa',
        href:'/'   
    }
    ,
    {
        icon:<CiSearch size={25} />,
        name:'Keşfet',  
        href:'/explore'  
    },
    {
        icon:<CiInboxIn size={25} />,
        name:'Mesajlar',
        href:'/messages'   
    },
    {
        icon:<CiUser size={25} />,
        name:'Profil',
        href:'/profile'    
    },
    {
        icon:<CiBookmark size={25} />,
        name:'Yer İşaretleri',
        href:'/bookmarks'
    },
]


const LeftBar = () => {
  return (
    <div className=' w-full  relative  p-4 h-full'>
        
        <div className="hidden md:flex md:flex-col gap-2 items-center justify-center  ">
            {list.map((item,index)=>(
                <div key={index} className="w-3/4 h-14 cursor-pointer hover:bg-gray-900 transition-colors duration-300 rounded-full  flex justify-center">
                    <Link href={item.href} className=" gap-2 flex items-center font-bold text-lg ">{item.icon} {item.name}</Link>
                    
                </div>
            ))}

        <Link href='https://github.com/mfurkan46/campusly' target='_blank' className='absolute bottom-20 underline cursor-pointer hover:text-gray-300 transition-colors duration-300'>
            Proje Hakkında</Link>    
        </div>
    </div>
  )
}

export default LeftBar
