import Image from 'next/image'
import Link from 'next/link'
import React, {useState, useEffect} from 'react'
import { HiEllipsisHorizontal } from "react-icons/hi2"
import { api } from '../../utils/api';
import dayjs from 'dayjs'
import { FiHeart, FiMessageSquare, FiSend, FiBookmark } from 'react-icons/fi'
import {
  useQueryClient,
} from "@tanstack/react-query";
import Comment from './Comment';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
const LIMITTWEETS = 5;

const SingleTweet = ({ tweetId }:{tweetId: string}) => {
  const { data: sessionData } = useSession();
  const [text, setText] = useState("")
  const router = useRouter();
  const utils = api.useContext();
  const client = useQueryClient();
  const { data: images } = api.tweet.getImagesForUser.useQuery({ tweetId });


  const likeMutation: (variables: { tweetId: string }) => void = api.tweet.like.useMutation({
    onSuccess:() =>{
      void utils.tweet.getSingleTweet.invalidate();
    },
  }).mutate;
  
  const unlikeMutation: (variables: { tweetId: string }) => void = api.tweet.unlike.useMutation({
    onSuccess: () => {
      void utils.tweet.getSingleTweet.invalidate();
    },
  }).mutate;

  const { mutateAsync: deleteTweet, } = api.tweet.deleteTweet.useMutation({
    onSuccess: async () => {
      // await api.tweet.timeline.invalidate();
    },
  })
  const { mutateAsync: deleteImage } = api.tweet.deleteImage.useMutation()
  const handleDeleteTweet = async (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    await Promise.all([
      deleteTweet({ tweetId }),
      deleteImage({ tweetId })
    ]);
    router.push(`/${sessionData?.user?.username}`)
  }
  const { mutateAsync: createCommentFn } = api.tweet.createComment.useMutation({
    onSuccess: () => {
      setText("")
      void utils.comment.getComments.invalidate();
    }
  });

  const handleSubmitComment = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createCommentFn({ text, tweetId })
    }
  }


  // const scrollPosition = useScrollPosition();
  const { data:tweet } = api.tweet.getSingleTweet.useQuery({ tweetId})
  console.log(tweet)
  // const { data : tweet, hasNextPage, fetchNextPage, isFetching, refetch: refetchSingleTweet } = api.tweet.timeline.useInfiniteQuery({
  //   limit: LIMITTWEETS,
  //   // where
  // }, {
  //   getNextPageParam: (lastPage) => lastPage.nextCursor
  // })
  let hasLike =false;
  if (tweet?._count.like === undefined)
    return;
  if (tweet?._count.like>0)
    hasLike = true;
  // const hasLike: boolean = tweet?._count.like > 0;
  let hasComment = false;
  if (tweet?._count.comment === undefined)
    return;
  if (tweet?._count.comment > 0)
    hasComment = true;
  // console.log(hasComment)
  // const link = tweet.author.username || tweet.author.name
  // console.log(tweet);
  // refetchSingleTweet();
  // useEffect(() => {
  //   if (scrollPosition > 90 && hasNextPage && !isFetching) {

  //     void fetchNextPage();
  //   }
  // }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);
  // const client = useQueryClient();
  // const where ={{}};
  return (
    <div className='min-h-[1226px]  relative'>
      {/* content of the tweet */}
      <div className='border-b border-bordercl'>
        <div className='flex flex-col'>
          <article className='px-4 overflow-hidden'>
            <div className='flex flex-col flex-1 basis-auto'>
              {/* who follow this person */}
              <div className='pt-3'>
              </div>
              {/* author info */}
              <div className='mb-1 flex  w-full '>
                {/* avatar */}
                <div className='basis-[48px] flex mr-3 flex-grow-0 flex-shrink-0 items-center justify-center relative w-full'>
                  <div className='w-[48px] h-[48px] overflow-hidden relative'>
                    <div className='pt-[48px] block'>
                    </div>
                    <div className='absolute w-full h-full inset-0'>
                      <div className='rounded-full'>
                        <Image src={tweet.author.image} alt="avatar" width={48} height={48}  className="rounded-full"/>
                      </div>
                    </div>
                  </div>
                </div>
                {/* name and username and features */}
                <div className='flex items-center justify-between tracking-wider w-full'>
                  <div className='flex flex-col justify-center items-start flex-shrink text-[15px]'>
                    <div>
                      <Link href={"/"} className=' font-semibold hover:underline'>
                        <span className='break-words min-w-0 leading-5'>
                          {tweet.author.name}
                        </span>
                      </Link>
                    </div>
                    <div className='text-lighttext cursor-pointer '>
                      <Link href={"/"} className="font-normal ">@{tweet.author.username}</Link>
                    </div>
                  </div>
                  {/* features */}
                  <div className='ml-5'>
                    <div className='min-h-[20px]'>
                      <div className=' bg-background rounded-full text-iconFIll hover:text-iconFIllActive hover:bg-interHoverIcon w-[35px] h-[35px]  flex justify-center items-center'>
                        <HiEllipsisHorizontal className='text-[20px]'/>
                      </div>
                    </div>

                    {/* delete */}
                    <button onClick={handleDeleteTweet}>delete</button>
                  </div>
                </div>
                
              </div>
              {/* content time, vew, reweet, likes, interactivity */}
              <div className='flex flex-col'>
                {/* content */}
                <div className=''>
                  {/* text */}
                  <div className='mt-3'>
                    {
                      tweet?.text &&
                      <div className='text-[16px] text-normaltext break-word break-words leading-7'>
                        {tweet?.text}
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
                                  <div className='overflow-hidden h-auto relative rounded-[16px] border-bordercl '>
                                    <div className=' pb-[133.333%] w-full '>
                                    </div>
                                    <div className='absolute w-full h-full inset-0 block border border-bordercl  '>
                                      
                                      <Image src={image.url} alt="alt"
                                        className='w-full h-full' 
                                        width={500} height={500}
                                        />

                                    </div>
                                    
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  }
                  {/* time and view */}
                  <div className='my-4'>
                    <div className='flex items-center justify-start'>
                      <div className='text-iconFIll mr-3 font-normal text-[15px] leading-5 break-words min-w-0'>
                        <div className='flex'>
                          <Link href={"/"} className=" flex items-center tracking-wide">
                            <span className=''>{dayjs(tweet?.createdAt).format(' h:mm A')}
                              
                            </span>
                            <div className='flex items-center justify-center'>
                              <span className='block px-1'>·</span>
                            </div>
                            <span>
                              {dayjs(tweet?.createdAt).format('MMM DD, YYYY')}
                            </span>
                          </Link> 
                          <span>·</span>
                          <div>
                            <span className='text-normaltext font-bold'>11.1M</span>
                            <span> Views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* retweets likes  */}
                  {(hasComment || hasLike) &&
                    <div className='flex'>
                      <div className=' flex flex-wrap border-t border-bordercl py-4 flex-1'>
                        {/* Retweets  OR COMMENT*/}
                        { hasComment && 
                          <div className='pointer-events-auto mr-5'>
                            <Link href={"/"} className="flex text-normaltext cursor-pointer leading-5 break-words min-w-0">
                              <div className='inline-flex font-bold mr-1'>
                                {tweet?._count.comment}
                              </div>
                              <span className='text-iconFIll'>
                                Comments
                              </span>
                            </Link>
                          </div>
                        }
                        {/* Likes */}
                        {hasLike &&
                          <div className='pointer-events-auto mr-5'>
                            <Link href={"/"} className="flex text-normaltext cursor-pointer leading-5 break-words min-w-0">
                              <div className='inline-flex font-bold mr-1'>
                                {tweet?._count.like}
                              </div>
                              <span className='text-iconFIll'>
                                Likes
                              </span>
                            </Link>
                          </div>
                        }
                      </div>
                    </div>
                  }
                  {/* Interaction */}
                  {/* reactions */}
                  <section className='flex justify-between  pb-[6px] pointer-events-auto  gap-y-2  text-iconColor border-y border-bordercl'>
                    <div className='flex justify-center items-center -ml-2 '>
                      <div className={`}cursor-pointer bg-transparent flex justify-center items-center p-2 text-[22.5px] rounded-full ${hasLike ? "hover:bg-interHoverIconActive" : "hover:bg-interHoverIcon"} `}
                        onClick={(e) => {
                          e.stopPropagation();
                          !hasLike ? likeMutation({ tweetId }) : unlikeMutation({ tweetId })
                        }}
                      >
                        <FiHeart className={`${hasLike ? "fill-red-500" : "fill-none"} `} />
                      </div>
                      
                    </div>
                    <div className='flex justify-center items-center '>
                      <div className={`cursor-pointer bg-transparent flex justify-center items-center p-2 text-[22.5px] rounded-full ${hasComment ? "hover:bg-interHoverIconActive" : "hover:bg-interHoverIcon"} `}>
                        <FiMessageSquare />
                      </div>
                      
                    </div>

                    <div className='flex justify-center items-center '>
                      <div className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[22.5px] '>
                        <FiSend />
                      </div>
                      
                    </div>

                    <div className='flex justify-center items-center '>
                      <div className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[22.5px] '>
                        <FiBookmark />
                      </div>
                    </div>

                  </section>
                </div>
              </div>
            </div>
          </article>
          <div>
            {/* add comments */}
            <section className='px-3 py-1 border-t border-solid border-separate border-neutral-300 text-[14px] shrink-0 text-secondary_text relative '>
              <div>
                <form action="" className=' flex boder-0 border-none m-0 p-0 relative align-baseline' >
                  <textarea className=' h-[18px]  grow-border-none outline-none resize-none active:border-none active:outline-none text-start whitespace-pre-wrap w-full rounded-none text-slate-700 appearance-none' placeholder='Add a comment...' onChange={(e) => setText(e.target.value)} value={text} onKeyUp={handleSubmitComment}>
                  </textarea>
                </form>
              </div>
            </section>
          </div>
        </div>

      </div>
      {/* comment */}
      <div>
        
      </div>
      
      {/* <Tweet key={tweet.id} tweet={tweet} input={{ where, limit: LIMITTWEETS }} client={client} utils={utils}
      ></Tweet> */}
      <Comment tweetId ={tweetId} author = {tweet.author} />


    </div>
  )
}

export default SingleTweet