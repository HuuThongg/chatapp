import React,{useState} from 'react'
import Link from 'next/link'
import { AiOutlineHome } from 'react-icons/ai'
import { BsPlusSquare, BsBookmark, BsTwitter } from 'react-icons/bs'
import { MdOutlineExplore } from 'react-icons/md'
import { FiMessageSquare } from 'react-icons/fi'
import { GrNotification } from 'react-icons/gr'
import { HiOutlineDotsCircleHorizontal, HiOutlineDotsHorizontal } from 'react-icons/hi'
import { HiOutlineUser } from 'react-icons/hi2'
import { IconContext } from "react-icons";

import { useSession } from "next-auth/react"
import Image from 'next/image'
import { PLACEHOLDER_IMAGE } from '../../constants'
const SideBar = () => {
  const {data} = useSession();
  let profileSrc;
  if(data?.user){
    profileSrc=data?.user?.image
  }
  else{
    profileSrc = PLACEHOLDER_IMAGE;
  }
  const [isHover, setIsHover] = useState(false)
  return (
    <header className='flex flex-col  select-none z-[3] shrink-0 grow items-end border-none box-border  text-[20px] min-w-0 min-h-0  h-full bg-black relative '> 
      <div className='w-[275px] h-full z-0 flex flex-col shrink-0 pointer-events-auto relative '>
        <div className='relative  w-full'>

          <div className='  w-[275px] fixed h-full flex flex-col  px-3 top-0 '>
            <div className='flex flex-col justify-between h-full'>
              <div className=' flex flex-col  '>
                <div className=' shrink-0 grow-0 basis-0 relative  mb-2 w-full'>
                  <div className=' px-3 pt-3 pb-4 w-full'>
                    {/* opacity: 1 */}
                    <div className='opacity-100'>
                      <Link href="/">
                        <div className='flex justify-start items-center'>
                          <div className=' transition-opacity text-[24px]'>
                            <BsTwitter/>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* menu */}
                <div className='grow basis-0 w-full  '>

                  

                  <div className=''>
                    <Link href="/" className='inline'>
                      
                      <div className={`inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] ${isHover ? "bg-gray-200" : "bg-white"}`}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}

                      >
                        {/* logo */}
                        <div className={`text-[24px] w-6 h-6  ${isHover ? "scale-105" : "scale-100"}  `}>
                          <AiOutlineHome className='' />
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>Home</div>
                        </div>
                      </div>
                    </Link>
                  </div>         
                  <div className=''>
                    <Link href="/" className='inline'>
                      <div className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] hover:bg-gray-300  ' >
                        {/* logo */}
                        <div className='text-[24px] w-6 h-6'>
                          <MdOutlineExplore />
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>Explore</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className=''>
                    <Link href="/" className='inline'>
                      <div className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] hover:bg-gray-300 ' >
                        {/* logo */}
                        <div className='text-[24px] w-6 h-6'>
                          <FiMessageSquare />
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>Messages</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className=''>
                    <Link href="/" className='inline'>
                      <div className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] hover:bg-gray-300 ' >
                        {/* logo */}
                        <div className='text-[24px] w-6 h-6'>
                          <GrNotification />
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>Notifications</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className=''>
                    <Link href="/" className='inline'>
                      <div className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] hover:bg-gray-300 ' >
                        {/* logo */}
                        <div className='text-[24px] w-6 h-6'>
                          <BsBookmark />
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>Bookmarks</div>
                        </div>
                      </div>
                    </Link>
                  </div>  
                  {/* profile */}
                  <div className='   '>
                    <Link href="/" className='inline'>
                      <div className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] hover:bg-gray-300 ' >
                        {/* logo */}
                        <div className='text-[24px] w-6 h-6 rounded-full'>
                          <HiOutlineUser/>
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>Profile</div>
                        </div>
                      </div>
                    </Link>
                  </div>  
                  {/* More */}
                  <div className=''>
                    <Link href="/" className='inline'>
                      <div className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px]  hover:bg-gray-300' >
                        {/* logo */}
                        <div className='text-[24px] w-6 h-6'>
                          <HiOutlineDotsCircleHorizontal />
                        </div>
                        {/* feild */}
                        <div className='flex px-4 items-center w-fit  h-6'>
                          <div className='block overflow-hidden text-ellipsis whitespace-nowrap text-[16px]'>More</div>
                        </div>
                      </div>
                    </Link>
                  </div> 
                  {/* tweet */}
                  <div className='  '>
                    <Link href="/" className='inline-flex w-full px-3 items-center  rounded-3xl cursor-pointer my-2 h-[48px] bg-blue-500  text-white shadow-sm shadow-blue-300'>
                      <div className='flex items-center justify-center w-full h-full'>
                        <span className=' block w-full text-center'>Tweet</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              {/* nickname */}
              <div className='grow-0 min-h-0 min-w-0  basis-auto my-3 shrink-0 w-full flex flex-col'>
                <div className='outline-none px-3 flex w-full '>
                  {/* avatar */}
                  <div className=''>
                    <Image 
                    className=' h-[40px] w-[40px] rounded-full object-cover'
                      src={profileSrc} alt="avatar"
                      width={40}
                      height={40}
                    />
                  </div>
                  {/* handle */}
                  <div className='outline-none grow  shrink text-[15px] cursor-pointer  flex flex-col basis-auto'>
                    <div className='mx-3'>
                      <div className='font-semibold'>Huuthong</div>
                      <div className='w-full font-light text-secondary_text'>@ThngL424</div>
                    </div>
                  </div>
                  <div className='  flex justify-center items-center'>
                    <HiOutlineDotsHorizontal/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SideBar