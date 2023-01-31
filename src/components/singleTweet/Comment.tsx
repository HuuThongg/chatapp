import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { api } from '../../utils/api'
import dayjs from 'dayjs'
import Reaction from './Reaction';
import { z } from "zod";


const Comment = ({tweetId ,author}:{tweetId:string , author:{
  name: string, username: string
}}) => {

  const utils = api.useContext();
  const { data: tweet } = api.tweet.getSingleTweet.useQuery({ tweetId });

  const { data: comments } = api.comment.getComments.useQuery({ tweetId });
  
  const {mutate: deleteComment} = api.comment.deleteComment.useMutation({
    onSuccess:()=>{
      void utils.comment.invalidate();
    }
  });
  const images = null;

  console.log(comments);
  
  return (
    <div>
      {(comments !== undefined && comments.length > 0 ) &&
        comments.map((comment) =>(
          <div key={comment.id} className='css-intial border-t border-bordercl pt-1 max-w-[598px] w-full z-0'>
            <article className='px-4  hover:bg-tweetHoverCl cursor-pointer'>
              <div className='flex flex-col pointer-events-auto relative shrink-0 basis-auto pb-2'>
                {/* reply to who */}
                <div className='inline-block py-2'>
                  {/* <div>
                    Replying to
                    <span>@Huuthongngngng</span>
                  </div> */}
                </div>
                {/* actual post */}
                <div className='flex'>
                  {/* avatar */}
                  <div className='flex basis-12 w-full mr-3 '
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/${tweet.author.username!}`} className=" w-[48px] h-[48px]">
                      {comment.user.image &&
                        <Image src={comment.user.image} alt={`${comment.user.name!} profile picture`} className='rounded-full'
                          width={48}
                          height={48} />
                      }
                    </Link>
                  </div>
                  {/* right side of tweet  */}
                  <div className='flex flex-col flex-wrap w-full'>
                    {/* header of the tweet ( handle  and name) */}
                    <div className='flex justify-between items-center pointer-events-auto text-[15px] w-full '>
                      <div className='flex flex-shrink max-w-full text-[15px] ' onClick={(e) => e.stopPropagation()}>
                        {/* name */}
                        <Link href={`/${comment.user.username!}`} className=' font-semibold hover:underline '>
                          {comment.user.name}
                        </Link>
                        {/* handle and time */}
                        <div className='flex text-lighttext cursor-pointer'>
                          <Link href={`/${comment.user.username!}`
                          }
                            className="flex"
                          >
                            <div className='font-normal ml-1'>
                              <span className=''>                    @{comment.user.username}
                              </span>
                            </div>
                            <div className='w-full flex px-1 justify-center items-center content-center  text-center'>
                              <span className=' min-h-0  w-full  '>·</span>
                            </div>
                          </Link>
                          <div className='hover:underline'
                          // onClick={handleTweetClick}
                          >

                            <span>{dayjs(comment.createdAt).fromNow()}</span>
                          </div>
                        </div>
                      </div>
                      {/* delete */}
                      <button onClick={(e)=>{
                        e.stopPropagation();
                        deleteComment({ commentId:comment.id })
                      }} className='ml-auto'> delete</button>
                    </div>

                    {/* reply to who */}
                    <div className='inline-block '>
                      <div className='text-iconColor text-[15px] cursor-pointer tracking-wide'>
                        Replying to
                        <span className='text-normaltext ml-1'>@{author.username}</span>
                      </div>
                    </div>

                    {/*text, images, interactivity */}
                    <div className=''>
                      {/* text */}
                      <div className=''>
                        {
                          comment.text &&
                          <div className='text-[16px] text-normaltext break-word break-words'>
                              {comment.text}
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
                                          <Image src={image.url} alt="alt"
                                            className='w-full h-full' width={50} height={50} />

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
                      {/* reaction : like, button. send */}
                      <Reaction comment={comment} utils={utils}/>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ))
      } 
    </div>
  )
}

export default Comment