import React from 'react'
import { FiArrowLeft } from "react-icons/fi"
import { SideBar } from '../../components/sidebar'
import { useRouter } from 'next/router'
import Tweet from '../../components/twpost/Tweet'
import { api } from '../../utils/api'
import SingleTweet from '../../components/singleTweet/SingleTweet'


const LIMITTWEETS = 3;

const Ten = () => {
  const router = useRouter();
  const tweetId = router.query.post_id as string;
  const { data: tweet } = api.tweet.getSingleTweet.useQuery({ tweetId })
  return (
    <div className="z-0 box-border w-full h-full relative" >
      <div className="flex flex-col relative z-0 min-h-screen bg-bgcl">
        <div className="h-full flex shrink-0 items-stretch grow-0 relative ">
          <SideBar />
          <main className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto text-black'>
            <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
              {/* content */}
              <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl  min-h-screen h-full pointer-events-auto'>
                {/* header */}
                <div
                  className='sticky  top-0 z-[3] pointer-events-auto text-[15px] bg-homeCl border-b  '>
                  <div className='h-[53px] max-w-[1000px] cursor-pointer flex  w-full items-center justify-between   px-4 mx-auto'>
                    {/* back */}
                    <div className=' min-w-[56px] min-h-[32px] flex '>
                      <div className='-ml-2 min-w-[36px] min-h-[36px] flex justify-center items-center rounded-full hover:bg-hoverIconBgCl' 
                        onClick={() => router.back()}
                      >
                        <FiArrowLeft className='text-[20px]' />
                      </div>
                    </div>
                    <div className='flex flex-shrink flex-grow justify-center h-full pl-2 '>
                      <div className='flex flex-col  w-full items-start justify-center'>
                        <h2 className='py-[2px] font-bold  text-xl leading-6 text-normaltext break-words overflow-hidden text-ellipsis'>Tweet</h2>
                      </div>
                    </div>
                    <div>

                    </div>
                  </div>
                </div>
                <SingleTweet tweetId={tweetId }/>
                {/* <Tweet key={tweetId} tweet={tweet} input={{ where, limit: LIMITTWEETS }} client={client} utils={utils}
                ></Tweet> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Ten