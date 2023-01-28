import Image from 'next/image'
import Link from 'next/link'
import React, {useState, useEffect} from 'react'
import { HiEllipsisHorizontal } from "react-icons/hi2"
import { api } from '../../utils/api';
import dayjs from 'dayjs'
import { FiHeart, FiMessageSquare, FiSend, FiBookmark } from 'react-icons/fi'
import { util } from 'prettier';

// function updateCache({
//   client,
//   variables,
//   data,
//   action,
//   input,
// }: {
//   client: QueryClient;
//   // input: RouterInputs["tweet"]["timeline"];
//   variables: {
//     tweetId: string;
//   };
//   data: {
//     userId: string;
//   };
//   action: "like" | "unlike";
//   input: RouterInputs["tweet"]["timeline"];
// }) {
//   client.setQueryData(
//     [
//       ["tweet", "timeline"],
//       {
//         // input: {
//         //   limit: 3,
//         //   where:{},
//         // },
//         input,
//         type: "infinite",
//       },
//     ],
//     (oldData) => {
//       // console.log("oldData",oldData);
//       const newData = oldData as InfiniteData<
//         RouterOutputs["tweet"]["timeline"]
//       >;

//       const value = action === "like" ? 1 : -1;

//       const newTweets = newData.pages.map((page) => {
//         return {
//           tweets: page.tweets.map((tweet) => {
//             if (tweet.id === variables.tweetId) {
//               return {
//                 ...tweet,
//                 like: action === "like" ? [data.userId] : [],
//                 _count: {
//                   like: tweet._count.like + value,
//                 },
//               };
//             }

//             return tweet;
//           }),
//         };
//       });
//       const a = { ...newData, page: newTweets }
//       console.log(a)
//       return {
//         ...newData,
//         pages: newTweets,
//       };
//     }
//   );
// }

// function useScrollPosition() {
//   const [scrollPosition, setScrollPosition] = useState(0);

//   const handleScroll = () => {
//     const height =
//       document.documentElement.scrollHeight -
//       document.documentElement.clientHeight;
//     const winScroll =
//       document.documentElement.scrollTop;
//     const scrolled = (winScroll / height) * 100;
//     setScrollPosition(scrolled);
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return scrollPosition;
// }
const LIMITTWEETS = 3;

const SingleTweet = ({ tweetId }:{tweetId: string}) => {
  const utils = api.useContext();

  console.log("before get Imgaers" , tweetId);
  const { data: images, isFetched } = api.tweet.getImagesForUser.useQuery({ tweetId });

  

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const likeMutation: (variables: { tweetId: string }) => void = api.tweet.like.useMutation({
    // onSuccess: (data, variables) => {
    //   updateCache({ client, variables, data, action: "like", input });
    // },
    onSuccess:() =>{
      void utils.tweet.getSingleTweet.invalidate();
    },
  }).mutateAsync;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const unlikeMutation: (variables: { tweetId: string }) => void = api.tweet.unlike.useMutation({
    // onSuccess: (data, variables) => {
    //   updateCache({ client, data, variables, action: "unlike", input });
    // },
    onSuccess: () => {
      void utils.tweet.getSingleTweet.invalidate();
    },
  }).mutateAsync;

  const { mutateAsync: deleteTweet, } = api.tweet.deleteTweet.useMutation({
    // onSuccess: async () => {
    //   await api.tweet.timeline.invalidate();
    // },
  })
  const { mutateAsync: deleteImage } = api.tweet.deleteImage.useMutation()
  const handleDeleteTweet = async (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    await Promise.all([
      deleteTweet({ tweetId }),
      deleteImage({ tweetId })
    ]);
  }

  // const scrollPosition = useScrollPosition();
  const { data:tweet } = api.tweet.getSingleTweet.useQuery({ tweetId})
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
  console.log(hasComment)
  // const link = tweet.author.username || tweet.author.name
  console.log(tweet);
  // refetchSingleTweet();
  // useEffect(() => {
  //   if (scrollPosition > 90 && hasNextPage && !isFetching) {

  //     void fetchNextPage();
  //   }
  // }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);
  // const client = useQueryClient();
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
                        <Image src="https://pbs.twimg.com/profile_images/1617675151373635584/r30JDsSm_normal.jpg" alt="avatar" width={48} height={48}  className="rounded-full"/>
                      </div>
                    </div>
                  </div>
                </div>
                {/* name and username */}
                <div className='flex items-center justify-between tracking-wider w-full'>
                  <div className='flex flex-col justify-start items-center flex-shrink text-[15px]'>
                    <div>
                      <Link href={"/"} className=' font-semibold hover:underline'>
                        <span className='break-words min-w-0 leading-5'>
                          huu thong le
                        </span>
                      </Link>
                    </div>
                    <div className='text-lighttext cursor-pointer '>
                      <Link href={"/"} className="font-normal ">@huuthongle</Link>
                    </div>
                  </div>
                  {/* features */}
                  <div className='ml-5'>
                    <div className='min-h-[20px]'>
                      <div className=' bg-background rounded-full text-iconFIll hover:text-iconFIllActive hover:bg-interHoverIcon w-[35px] h-[35px]  flex justify-center items-center'>
                        <HiEllipsisHorizontal className='text-[20px]'/>
                      </div>
                    </div>
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
                                Retweets
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
            tweet your reply
          </div>
        </div>

      </div>
      {/* comment */}
      <div>

      </div>
    </div>
  )
}

export default SingleTweet