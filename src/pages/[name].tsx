import React, {useState} from 'react'
import { useRouter } from 'next/router';
import { SideBar } from '../components/sidebar';
import { FiArrowLeft } from 'react-icons/fi'
import { HiOutlineEllipsisHorizontal, HiOutlineEnvelope, HiOutlineBellAlert, HiOutlineCalendarDays } from "react-icons/hi2"
import Image from 'next/image'

import { TweetLine } from '../components/twpost';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { api } from '../utils/api';

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});



const PersonalPage = () => {
  const {data: userInfo}= api.user.getUserInfo.useQuery();
  const router = useRouter();
  // handle is like @Thngle#3215
  const handle= router.query.name as string;

  const [isHover, setIsHover] = useState(false)

  return (
    <div className="z-0 box-border w-full h-full relative" >
      <div className="flex flex-col relative z-0 min-h-screen bg-bgcl">
        <div className="h-full flex shrink-0 items-stretch grow-0 relative ">
          <SideBar />
          <main className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto text-black'>
            <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
              {/* content */}
              <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl  min-h-screen h-full pointer-events-auto'>
                {/* Header */}
                <div
                  className='sticky  top-0 z-[3] pointer-events-auto text-[15px] bg-homeCl border-b  '>
                  <div className='h-[53px] max-w-[1000px] cursor-pointer flex  w-full items-center justify-between   px-4 mx-auto'>
                    {/* back */}
                    <div className=' min-w-[56px] min-h-[32px] flex '>
                      <div className='-ml-2 min-w-[36px] min-h-[36px] flex justify-center rounded-full items-center hover:bg-hoverIconBgCl'
                        onClick={() => router.back()}
                      >
                        <FiArrowLeft className='text-[20px]'/>
                      </div>
                    </div>
                    <div className='flex flex-shrink flex-grow justify-center h-full pl-2 '>
                      <div className='flex flex-col  w-full'>

                        <h2 className='py-[2px] font-bold  text-xl leading-6 text-normaltext break-words overflow-hidden text-ellipsis'>{handle}</h2>
                        <div className='text-lighttext leading-4 text-[13px] font-normal text-normaltext break-words overflow-hidden text-ellipsis'>23.2k Tweets</div>
                      </div>
                    </div>
                    <div>
                      
                    </div>
                  </div>
                </div>
                {/* content */}
                <div className='flex flex-col flex-grow max-w-[600px] w-full mx-auto'>
                  {/* Profile and INfo */}
                  <div className='flex flex-col w-full'>
                    {/* background image */}
                    <div className='outline-none cursor-pointer relative'>
                      <div className='pb-[33.3333%] w-full'>
                      </div>
                      <div className='w-full bg-red-400 h-full absolute inset-0'>
                        <div className='overflow-hidden'>
                          <Image src="https://pbs.twimg.com/profile_banners/70713547/1567639847/600x200" alt="" 
                          width={600} height={200}/>
                        </div>

                      </div>
                    
                    </div>

                    <div className='flex flex-col mb-4 px-4 pt-3 pointer-events-auto'>
                      {/* avatar, follow, email */}
                      <div className='flex flex-wrap justify-between items-start'>
                        {/* avatar */}
                        <div className='w-1/4 min-w-[48px]  -mt-[15%] h-auto mb-3 overflow-visible z-[1] relative flex justify-center items-center rounded-full'>
                          <div className='pb-[100%] w-full  rouneded-full'>
                          </div>

                            <Image src="https://pbs.twimg.com/profile_images/1445059468081778694/WlufQTvC_200x200.png" alt=""
                              width={600} height={200} 
                              className='w-full h-full rounded-full border-4' 
                              />
                        </div>
                        {/* follow */}
                        <div className='flex justify-start flex-wrap items-end max-w-full  '>
                          {/* more */}
                          <div className='flex min-w-[36px] min-h-[36px] outline-none bg-bgicon mb-3 mr-2  rounded-full border cursor-pointer border-bordercl h-full hover:bg-hoverIconBgCl'>
                            <div className='flex flex-col justify-center items-center  flex-grow'>
                              <HiOutlineEllipsisHorizontal className='block text-normaltext text-[20px] font-bold'/>
                            </div>
                          </div>
                          {/* mail */}
                          <div className='flex min-w-[36px] min-h-[36px] outline-none bg-bgicon mb-3 mr-2  rounded-full border cursor-pointer border-bordercl h-full hover:bg-hoverIconBgCl'>
                            <div className='flex flex-col justify-center items-center  flex-grow'>
                              <HiOutlineEnvelope className='block text-normaltext text-[20px] font-bold' />
                            </div>
                          </div>

                          {/* notificatons */}
                          <div className='flex min-w-[36px] min-h-[36px] outline-none bg-bgicon mb-3 mr-2  rounded-full border cursor-pointer border-bordercl h-full hover:bg-hoverIconBgCl'>
                            <div className='flex flex-col justify-center items-center  flex-grow'>
                              <HiOutlineBellAlert className='block text-normaltext text-[20px] font-bold' />
                            </div>
                          </div>
                          {/* following */}
                          <div className='min-w-[102px]  mb-3'>
                            <div className={`min-w-[36px] min-h-[36px] outline-none bg-bgicon select-none px-4 rounded-full border border-bordercl hover:bg-hoverIconBgCl flex items-center ${isHover ? "hover:bg-bgClWarning" :""} `} onMouseEnter={() => setIsHover(true)}
                              onMouseLeave={() => setIsHover(false)}
                            >

                              {isHover ? <span className={`capitalize text-[15px] text-textWarn `}>Unfollow</span> : <span className='capitalize text-[15px] '>Following</span>}
                              

                            </div>
                          </div>
                        </div>
                      </div>
                      {/* handle and name */}
                      <div className='mb-3'>
                        <div className='flex flex-col text-[20px]  tracking tracking-wide'>
                          <div className='shrink'>
                            <span className='break-word font-bold'>{handle}</span>
                          </div >

                          <div className='shrink leading-3'>
                            <span className=' text-[15px] text-lighttext tracking-tight font-normal'>@{handle}</span>
                          </div>
                        </div>
                      </div>
                      {/* address link time joined */}
                      <div className='flex mb-3'>
                        <div className='leading-3 text-normaltext font-normal text-[15px] break-words min-w-0  whitespace-pre'>
                          {/* country */}
                          <span></span>
                          {/* url: blogs */}
                          <span className='text-iconColor mr-3 break-words min-w-0 flex space-x-2'>
                            <span>

                              <HiOutlineCalendarDays />
                            </span>
                            <span>
                              Joined {dayjs(userInfo?.createdAt).format(' MMM  YYYY')}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    Navigation
                  </div>
                </div>


                {/* <TweetLine where={{
                  author: {
                    name: handle
                  }
                }} /> */}
                <TweetLine where={{
                  author: {
                    id: userInfo?.id
                  }
                }} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default PersonalPage