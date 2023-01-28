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

const Interaction = ({ tweetId, likeFn, unlikeFn, hasLike, twCreateAt, likeCount  , commentCount ,commentData}:{
  tweetId: string;
  likeCount: number;
  commentCount : number;
  hasLike : boolean;
  unlikeFn: (variables: { tweetId: string }) => void;
  likeFn : (variables: { tweetId: string }) => void;
  twCreateAt : Date;
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

  const {mutateAsync: deleteCommentFn}=trpc.tweet.deleteComment.useMutation({
    onSuccess:  () => {
      void utils.tweet.timeline.invalidate();
    }
  })

  const hasComment : boolean = commentData.length > 0;
  
  
  const handleSubmitComment = (e:React.FormEvent<HTMLTextAreaElement>)=>{
    if (e.key === "Enter") {
      e.preventDefault();
      createCommentFn({text,tweetId})
    }
  }
  return (
    <div className='shrink-0 grow-0 basis-auto  flex flex-col justify-start '>
      <div className=' rounded-lg pointer-events-auto relative '>
        <div className='flex flex-col min-w-[335px] w-full'>
          {/* reactions */}
          <section className='flex justify-between mt-3  pb-[6px] pointer-events-auto max-w-[425px] gap-y-2  text-iconColor'>
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
          
          {/* content */}
          <div className=' mx-0 mt-0 mb-auto px-3 overflow-auto relative'>
            {/* comments */}
            {/* view all  comments */}
            {hasComment && 
              <div className='mb-1'>
                <Link href="#" className='w-full text-secondary_text '>View all {commentCount} comments</Link>
              </div>
            }
            {/* create comments */}
            {/* <form id="createComment" onSubmit={handleSubmitComment} className="flex w-full  py-4 px-1 border rounded-md justify-between" >
              <textarea className='bg-white w-full' placeholder='Tweet your reply' onChange={(e) => setText(e.target.value)} value={text} onKeyPress={handleSubmitComment}></textarea>
            </form> */}

            {/* show comments */}
            <div className='shrink-0 grow-0 flex flex-col mb-1'>
              {/* render comments from database */}
              {commentData.map((comment) =>(
                <div key={comment.id} className="flex py-1">
                  <Image 
                    src={ comment.user.image || '/../../images/manAvatarDefault.jpg'} 
                  alt="user profile" 
                  className='w-[24px] h-[24px] rounded-full'
                  width={24}
                  height={24}
                  />
                  <div>{comment.user.name}</div>
                  <p className='mx-2' > {comment.text}</p>
                  
                  <div>{dayjs(comment.createdAt).format('ddd h:mm:ss A MMM DD YYYY')}</div>

                  <button onClick={()=>{deleteCommentFn({commentId: comment.id})}} className='ml-auto'> delete</button>
                </div>
              ))}
              {/* each comment */}
              {/* <div className=' shrink-0 grow-0 flex justify-start mb-1 items-center'>
                <div className='w-full flex-auto'>
                  <span>
                    <Link href="#">HuuThong </Link>
                  </span>
                  <span className='text-slate-500'> i m le huu thong</span>
                </div>
                <span>
                  <FiHeart />
                </span>
              </div> */}
            </div>
          </div>
          {/* time */}
          {/* <div className=' pl-3 mb-3 pointer-events-auto'>
            <div className='text-secondary_text text-[14px]'>
              <span className='block text-[12px]'>{dayjs(twCreateAt).fromNow()}</span>
            </div>
          </div> */}

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
  )
}

export default Interaction