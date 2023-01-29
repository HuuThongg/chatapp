import type { QueryClient , InfiniteData} from '@tanstack/react-query';
import Link from 'next/link';

import React from 'react'
import type { RouterOutputs, RouterInputs } from '../../utils/api';
import {api as trpc } from '../../utils/api';
import Interaction from './Interaction';
import Image from 'next/image'
import dayjs from 'dayjs'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

function updateCache({
  client,
  variables,
  data,
  action,
  input,
}: {
  client: QueryClient;
  // input: RouterInputs["tweet"]["timeline"];
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
  input: RouterInputs["tweet"]["timeline"];
}) {
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        // input: {
        //   limit: 3,
        //   where:{},
        // },
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      // console.log("oldData",oldData);
      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;

      const value = action === "like" ? 1 : -1;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                like: action === "like" ? [data.userId] : [],
                _count: {
                  like: tweet._count.like + value,
                },
              };
            } 

            return tweet;
          }),
        };
      });
      const a = {...newData,page:newTweets}
      console.log(a)
      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

function Tweet({
  tweet,
  client,
  input,
  // utils
}:{tweet:RouterOutputs['tweet']['timeline']['tweets'][number];
client: QueryClient;
    input: RouterInputs["tweet"]["timeline"];
    // utils: typeof trpc.useContext
}){
  const utils = trpc.useContext();

  const { data: sessionData } = useSession();

  const tweetId : string = tweet.id;
  // const { data: images } = trpc.tweet.getImagesForUser.useQuery({ tweetId });
  const { data: images, isFetched } = trpc.tweet.getImagesForUser.useQuery({ tweetId });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const likeMutation :(variables: { tweetId: string }) => void = trpc.tweet.like.useMutation({
    onSuccess:(data, variables)=>{
      updateCache({ client, variables, data, action:"like",input});
    },
  }).mutateAsync;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const unlikeMutation: (variables: { tweetId: string }) => void = trpc.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "unlike",input });
    },
  }).mutateAsync;

  const {mutateAsync : deleteTweet, } = trpc.tweet.deleteTweet.useMutation({
    onSuccess: async () => {
      await utils.tweet.timeline.invalidate();
    },
  })
  const {mutateAsync : deleteImage} = trpc.tweet.deleteImage.useMutation()
  const handleDeleteTweet =async (e: { stopPropagation: () => void; }) =>{
    e.stopPropagation();
    await Promise.all([
      deleteTweet({ tweetId }),
      deleteImage({ tweetId })
    ]);
  }

  const hasLike :boolean = tweet.like.length > 0;
  // console.log(tweet.author);

  const link = tweet.author.username || tweet.author.name
  const router = useRouter();
  function handleTweetClick(e ){
    e.preventDefault();
    router.push(`/status/${tweetId}`)
  }
  return( 
    <div className='css-intial border-t border-bordercl pt-1 max-w-[598px] w-full z-0'>
      <article className='px-4  hover:bg-tweetHoverCl cursor-pointer'
        onClick={handleTweetClick}
      >
        <div className='flex flex-col pointer-events-auto relative shrink-0 basis-auto'>
          {/* reply to who */}
          <div className='css-intial pt-3'>
          </div>
          {/* actual post */}
          <div className='flex '>
            {/* avatar */}
            <div className='flex basis-12 w-full mr-3 '
              onClick={(e)=>e.stopPropagation() }
            >
              <Link href={`/${link!}`} className=" w-[48px] h-[48px]">
                {tweet.author.image &&
                  <Image src={tweet.author.image} alt={`${tweet.author.name!} profile picture`} className='rounded-full'
                    width={48}
                    height={48} />
                }
              </Link>
            </div>
            {/* right side of tweet  */}
            <div className='flex flex-col flex-wrap w-full'>
              {/* header of the tweet ( handle  and name) */}
              <div className='flex justify-between items-center pointer-events-auto text-[15px] w-full '>
                <div className='flex flex-shrink max-w-full text-[15px] ' onClick={(e) => e.stopPropagation() }>
                  {/* name */}
                  <Link href={`/${tweet.author.username!}`} className=' font-semibold hover:underline '>
                    {tweet.author.name}
                  </Link>
                  {/* handle and time */}
                  <div className='flex text-lighttext cursor-pointer'>
                    <Link href={`/${tweet.author.username!}` 
                      }
                      className="flex"
                      >
                      <div className='font-normal ml-1'>
                        <span className=''>                    @{tweet.author.username}
                        </span>
                      </div>
                      <div className='w-full flex px-1 justify-center items-center content-center  text-center'>
                        <span className=' min-h-0  w-full  '>.</span>
                      </div>
                    </Link>
                    <div className='hover:underline'
                      onClick={handleTweetClick}
                    >
                      <span>{dayjs(tweet.createdAt).fromNow()}</span>
                    </div>
                  </div>

                </div>
                {/* delete */}
                <button onClick={handleDeleteTweet} className='ml-auto'> delete</button>
              </div>
              
              {/*text, images, interactivity */}
              <div className=''>
                {/* text */}
                <div className=''>
                  {
                    tweet.text &&
                    <div className='text-[16px] text-normaltext break-word break-words'>
                      {tweet.text}
                    </div>

                  }
                </div>
                {/* Images */}
                
                {images && 
                  <div className='mt-3'>
                    <div className='flex gap-1 w-full'>
                      <div className='flex justify-start w-full'>
                        <div className='rounded-[16px]  w-full'>
                          <div className='flex h-full w-full grow'>
                            {images && images.map(image => (
                              <Link href={"/"} key={image.id} className=' h-full cursor-pointer outline-none w-full'>
                                <div className='overflow-hidden h-[510px] w-[382.5px] relative rounded-[16px] border-bordercl '>
                                  <div className=' pb-[133.333%] w-full '>
                                  </div>
                                  <div className='absolute w-full h-full inset-0 block border border-bordercl  '>
                                    {/* <img src="https://pbs.twimg.com/media/Fm4RcbLaEAARBZQ?format=jpg&name=small" alt="" /> */}
                                    <img src={image.url} alt="alt" 
                                    className='w-full h-full' />
                                    
                                  </div>
                                  <p>dsads</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                }
                {/* Interaction */}
                <div>
                  <Interaction likeFn={likeMutation} unlikeFn={unlikeMutation} tweetId={tweetId} hasLike={hasLike}  likeCount={tweet._count.like} commentCount={tweet._count.comment} commentData={tweet.comment} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </article>
    </div>
  )
}

export default Tweet