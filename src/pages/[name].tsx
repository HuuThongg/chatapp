import React from 'react'
import { useRouter } from 'next/router';
import { SideBar } from '../components/sidebar';
import { FiArrowLeft } from 'react-icons/fi'
import Image from 'next/image'
const PersonalPage = () => {
  const router = useRouter();
  // handle is like @Thngle#3215
  const handle= router.query.name as string;
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
                      <div className='min-w-[36px] min-h-[36px] flex justify-start items-center'>
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
                      </div>
                    </div>
                  </div>
                  <div>
                    Navigation
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default PersonalPage