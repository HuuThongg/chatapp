import Link from 'next/link'
import React,{useState} from 'react'
import { FiHeart, FiMessageSquare, FiSend, FiBookmark } from 'react-icons/fi'
import {api as trpc } from '../../utils/api'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";

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

const Interaction = ({ tweetId, likeFn, unlikeFn, hasLike, likeCount  , commentCount ,commentData}:{
  tweetId: string;
  likeCount: number;
  commentCount : number;
  hasLike : boolean;
  unlikeFn: (variables: { tweetId: string }) => void;
  likeFn : (variables: { tweetId: string }) => void;
  // twCreateAt : Date;
  commentData: {
    text: string | null;
    user: {
      name: string | null;
      image: string | null;
    };
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[]
}) => {
  const [ text,setText]= useState("")


  const utils = trpc.useContext()

  const {mutateAsync : createCommentFn}=trpc.tweet.createComment.useMutation({
    onSuccess: ()=>{
      setText("")
      void utils.tweet.timeline.invalidate();
    }
  });

  // const {mutateAsync: deleteCommentFn}=trpc.tweet.deleteComment.useMutation({
  //   onSuccess:  () => {
  //     void utils.tweet.timeline.invalidate();
  //   }
  // })
  // // const commentIdd = comment.id;
  // const {data: comments} = trpc.comment.getComments.useQuery({tweetId});

  // const {mutateAsync : likeCommentFn} =trpc.comment.likeComment.useMutation({
  //   onSuccess:(data, error, variables, context)  =>{
  //     console.log(data, error, variables, context);
  //   },
  // });
  // const { mutateAsync: unlikeCommentFn } = trpc.comment.unlikeComment.useMutation({
  //   onSuccess: (data, error, variables, context) => {
  //     console.log(data, error, variables, context);
  //   },
  // });
  const hasComment : boolean = commentData.length > 0;
  
  return (
    <div className='shrink-0 grow-0 basis-auto  flex flex-col justify-start '>
      <div className=' rounded-lg pointer-events-auto relative '>
        <div className='flex flex-col min-w-[335px] w-full'>
          {/* reactions */}
          <section className='flex justify-between mt-1  pb-[6px] pointer-events-auto max-w-[425px] gap-y-2  text-iconColor'>
              <div className='flex justify-center items-center -ml-2 '>
              <div className={`cursor-pointer bg-transparent flex justify-center items-center p-2 text-[18.5px] rounded-full ${hasLike ? "hover:bg-interHoverIconActive" : "hover:bg-interHoverIcon"} `}
                  onClick={(e) => {
                    e.stopPropagation();
                    !hasLike ? likeFn({ tweetId }) : unlikeFn({ tweetId })
                  }} 
                >
                  <FiHeart className={hasLike ? "fill-red-500" : "fill-none"} />
                </div>
                <div>
                <span className='text-[13px] leading-[16px] text-iconColor'>{likeCount}</span>
                </div>
              </div>
              <div className='flex justify-center items-center '>
                <div className={`cursor-pointer bg-transparent flex justify-center items-center p-2 text-[18.5px] rounded-full ${hasComment  ? "hover:bg-interHoverIconActive" : "hover:bg-interHoverIcon"} `}>
                  <FiMessageSquare />
                </div>
              {hasComment &&   
                <div>
                  <span className='text-[13px] leading-[16px] text-iconColor'>{commentCount}</span>
                </div>
              }
              </div>

              <div className='flex justify-center items-center '>
                <div className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[18.5px] '>
                  <FiSend />
                </div>
                <div>
                  <span className='text-[13px] leading-[16px] text-iconColor'>16
                  </span>
                </div>
              </div>
            
              <div className='flex justify-center items-center '>
                <div className='cursor-pointer bg-transparent flex justify-center items-center p-2 text-[18.5px] '>
                  <FiBookmark />
                </div>
                <div>
                  <span className='text-[13px] leading-[16px] text-iconColor'>16
                  </span>
                </div>
              </div>

          </section>
        </div>
      </div>
    </div>
  )
}

export default Interaction