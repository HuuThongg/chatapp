
import * as fs from 'fs';

import React, { useState, useRef, useEffect } from 'react';

import Image from 'next/image'
// import ImagePicker from '../createPost/ImagePicker'

import { object, string } from 'zod'
import { api as trpc } from '../../utils/api'
import { GrImage } from 'react-icons/gr'
import * as z from 'zod'
import { TweetLine } from '../twpost';
import AuthShowcase from '../AuthShowcase/AuthShowcase';

export const tweetSchema = z.optional(object({
  text: z.optional(string(
    {
      required_error: 'Text is required'
    }
  )),
}))
// export const tweetSchema = z.object({
//                 text: z.string().optional(),
//               })
//               .optional()


const MainPageTw = () => {
  const utils = trpc.useContext();

  const fileInput = useRef<HTMLInputElement>(null);
  const controlHeight = useRef(null)
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null | boolean>(false);
  const [file, setFile] = useState<any>(null);

  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess:  () => {
      setText("")
      // void utils.tweet.timeline.invalidate();
    },
    onError: (error) => {
      console.error("Error Occured on OnError", error)
    },
  })

  const { mutateAsync: createPresignedUrl } = trpc.tweet.createPresignedUrl.useMutation();

  // const { data: tweetData } = trpc.tweet.timeline.useQuery({
  //   limit: 9,
  // })
  
  // const twId: string = tweetData?.tweets[0]?.id;

  // const { data: images, refetch: refetchImages } = trpc.tweet.getImagesForUser.useQuery({ tweetId: twId });

  const { mutateAsync: deleteAllImages } = trpc.tweet.deleteImage.useMutation();

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fileList.push(file);

    }
    setFile(fileList);
  }

  const selectImage = () => {
    if(fileInput.current){
        fileInput.current.click();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    try {
      tweetSchema.parse({ text })
    } catch (er: any) {
      setError(er.message);
      return;
    }
    const result = await mutateAsync({ text });
    if(!file) return;
    const tweetId = result?.tweetId;
    const data = await createPresignedUrl({ tweetId: tweetId, n: file.length }) as any;
    await uploadImage(data, e);
  }
  function postData(url: RequestInfo | URL, fields: any, file: { type: any; }) {
    const data = { ...fields, 'Content-type': file.type, file }
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    return fetch(url, {
      method: 'POST',
      body: formData,
      
    });
  }
  async function uploadImage(data: any[], e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!file) return;
    // const amountFiles : number = file.length;

    // const { url, fields }: { url: string, fields: any } = await createPresignedUrl({tweet.tweetId ,n: amountFiles}) as any;
    const postDataPromise = data.map((imgI4: { url: any; fields: any; }, index: string | number) => postData(imgI4.url, imgI4.fields, file[index])
    )
    void Promise.all(postDataPromise)
      .then(() => {
        void utils.tweet.timeline.invalidate();

      })
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // deleteAllImages({tweetId: twId});
  }
  
  function checkHeight () {
    if (controlHeight.current.offsetHeight > 780) {
      controlHeight.current.style.overflowY = 'auto'
    }
  }
  useEffect(() => {
    checkHeight()
  }, [])
  return (
    <main className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto text-black'>
      <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
        {/* content */}
        <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl  min-h-screen h-full pointer-events-auto'>
          {/* login logout */}
          <AuthShowcase/>
          {/* Home */}
          <div 
          className='sticky  top-0 z-[3] pointer-events-auto text-[15px] bg-homeCl border-b  '>
            <div className='h-[53px] max-w-[1000px] cursor-pointer flex p-4 w-full items-center justify-start mx-auto  '>
              <h1 className='text-[20px] leading-6'>
                <div className='block font-semibold blur-none  text-black'>Home</div>
              </h1>
            </div>
          </div>
          {/* create tweet //  new tweet */}
          <div className='css-intial  pointer-events-auto  '>
            <div className='pb-2 px-4'>
              <div className=' relative flex py-1  '>
                {/* avatar */}
                <div className='flex flex-col  mt-1 mr-[13px]  w-[53px] z-0 relative bg-transparent grow-0 '>
                  <div className='pb-[100%] pointer-events-auto block w-[53px]'>
                  </div>
                  <div className='absolute top-0 left-0 w-[53px] h-[53px]'>
                    <div className='w-full h-full'>
                      <Image className='rounded-full'
                        src="https://cdn.discordapp.com/icons/937768886412132392/6693a262a7711148211abae46fe393a4.webp?size=96" alt="Picture of the author"
                        width={500}
                        height={500}

                      />
                    </div>
                  </div>
                </div>
                {/* right side of create tweet */}
                <div className=' relative flex flex-col justify-center items-start box-border  pt-1  w-[calc(100%-53px-13px)] flex-1'>
                  {/* text */}
                  <div className=' w-full'>
                    <div className='py-4 '>
                      <div className='overflow-y-auto max-h-[768px] min-h-[26px] w-full' ref={controlHeight}>
                        <div className='  h-full relative '>

                          <form id="createPost" onSubmit={handleSubmit} className=" relative flex w-full flex-col  border-none rounded-md pointer-events-auto
                          cursor-text text-left text-xl">


                            <input  type="text" onChange={(e) => setText(e.target.value)} 
                              className='border-none active:border-none whitespace-pre-wrap break-words  pointer-events-auto w-full max-h-[768px] h-full ' 
                              placeholder="what&apos;s happenings?"
                            value={text} />
                            <span className=' -mt-9 whitespace-pre-wrap break-words  h-full pointer-events-none text-teal-300 overflow-hidden text-ellipsis'>{text}
                            </span>
                            
                          </form>
                        </div>
                      </div>

                      

                      {error && JSON.stringify(error)}

                    </div>

                  </div>
                  {/* things added to a post */}

                  <div className=' flex flex-col z-0 relative w-full'>
                    <div className='box-border flex items-center  flex-wrap z-[1] justify-between pointer-events-auto bg-primary_bg w-full'>
                      <div className='flex items-center justify-center mt-3'>
                        <div className='w-[36px] h-[36px]  rounded-[9999px] flex items-center justify-center cursor-pointer '
                          onClick={selectImage
                          }
                        >
                          <div className='flex items-center justify-center grow'>
                            <GrImage />
                          </div>
                        </div>
                        <input
                          className=' w-[0.1px] h-[0.1px] z-[-1] opacity-0 absolute overflow-hidden appearance-none cursor-default'
                          type="file" multiple accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime' onChange={onFileChange}
                          ref={fileInput}
                        />
                      </div>
                      <div>
                        <button className='bg-blue-500 px-5 py-2 mr-2 rounded-[20px] text-white font-medium hover:bg-blue-600 text-base'
                          onClick={handleSubmit}
                        >Tweet</button>
                        {/* <button
                          onClick={handleDelete}
                        >Delete</button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className=' border-t border-bordercl '>
            <TweetLine where={{}}/>
          </section>
        </div>
        {/* search */}
      </div>
    </main>
  )
}

export default MainPageTw;