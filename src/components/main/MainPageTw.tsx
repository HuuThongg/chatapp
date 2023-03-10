
import React, { useState, useRef, useEffect } from 'react';
import NextImage from "next/image";

import { api as trpc } from '../../utils/api'
import { GrImage } from 'react-icons/gr'
import { BsEmojiSmile } from 'react-icons/bs'
import * as z from 'zod'
import { TweetLine } from '../twpost';
import AuthShowcase from '../AuthShowcase/AuthShowcase';
import Picker from '@emoji-mart/react'
import data, { EmojiMartData } from '@emoji-mart/data'

import { tweetSchema } from '../../constants/schemas';
import type { ImageDimensions } from '../../constants/schemas';

const MainPageTw = () => {

  const utils = trpc.useContext();

  const fileInput = useRef<HTMLInputElement>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const toggleEmojiRef = useRef<HTMLDivElement>(null);
  const [isOpenEmoji, setOpenEmoji] = useState<boolean>(false)
  const controlHeight = useRef<HTMLDivElement>(null)
  const [text, setText] = useState<string>("")
  const [error, setError] = useState<string | null | boolean>(false);
  const [file, setFile] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      setText("")
      // void utils.tweet.timeline.invalidate();
    },
    onError: (error) => {
      console.error("Error Occured on OnError", error)
    },
  })

  const { mutateAsync: createPresignedUrl } = trpc.tweet.createPresignedUrl.useMutation();


  const { mutateAsync: deleteAllImages } = trpc.tweet.deleteImage.useMutation();


  // const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
  //   const files = e.currentTarget.files;
  //   if (!files) return;
  //   const fileList: File[] = [];
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     if(!file) return;
  //     // fileList.push(file!);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (i == 0) {
  //         const img = new Image();
  //         img.onload = () => {
  //           const width = img.width;
  //           const height = img.height;
  //           setImageDimensions({ width, height });
  //         }
  //         if (typeof reader.result === 'string') {
  //           img.src = reader.result;
  //         }
  //       }
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");
  //       const convertedImg = new Image();
  //       let widthW, heightH
  //       convertedImg.onload = () => {
  //         const mWidth= 500;
  //         canvas.width = convertedImg.width;
  //         canvas.height = convertedImg.height;
  //         const aspectRatio = convertedImg.width / convertedImg.height
  //         // context?.drawImage(convertedImg, 0,0, canvas.width, canvas.height, 0, 0, 500, 500);
  //         context?.drawImage(convertedImg, 0, 0, 500, 700);
  //         setImages(prevImages => {
  //           if (typeof reader.result === 'string') {
  //             const resizedImage = canvas.toDataURL("image/jpeg");
  //             fileList.push(resizedImage);
  //             return [...prevImages, resizedImage];
  //           }
  //           return prevImages;
  //         });
  //       }
  //       convertedImg.src = reader.result;
  //     }
  //     if (file) {
  //       reader.readAsDataURL(file);
  //     }
  //   }
  //   setFile(fileList);
  // }


  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    const fileList: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fileList.push(file!);
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prevImages => {
          if (typeof reader.result === 'string') {
            return [...prevImages, reader.result];
          }
          return prevImages;
        });

        if (i == 0) {

          const img = new Image();
          img.onload = () => {
            const width = img.width;
            const height = img.height;
            setImageDimensions({ width, height });
          }
          if (typeof reader.result === 'string') {
            img.src = reader.result;
          }
        }
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    }
    setFile(fileList);
  }


  const selectImage = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLInputElement>) {
    console.log("first")
    e.preventDefault();
    try {
      tweetSchema.parse({ text })
    } catch (er) {
      if (er instanceof Error)
        return setError(er.message);
    }
    const result = await mutateAsync({ text });
    if (!file) {
      void utils.tweet.timeline.invalidate();
      return;
    }
    const tweetId = result?.tweetId;
    const data: unknown[] = await createPresignedUrl({ tweetId: tweetId, n: file.length });

    await uploadImage(data, e);
  }
  

  // function postData(url: string, fields: unknown, file: string) {
  //   const formData = new FormData();
  //   for (const name in fields) {
  //     formData.append(name, fields[name]);
  //   }
  //   const blob = dataURItoBlob(file);
  //   formData.append('file', blob, 'file.jpeg');
  //   return fetch(url, {
  //     method: 'POST',
  //     body: formData,
  //   });
  // }

  // function dataURItoBlob(dataURI: string) {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: mimeString });
  // }
  






  function postData(url:string, fields: unknown, file: File[]) {
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
  async function uploadImage(data: unknown[], e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!file) return;
    // const amountFiles : number = file.length;

    // const { url, fields }: { url: string, fields: any } = await createPresignedUrl({tweet.tweetId ,n: amountFiles}) as any;
    // console.log(data);
    const postDataPromise = data.map((imgI4: { url: string; fields: any; }, index: string | number) => postData(imgI4.url, imgI4.fields, file[index])
    )
    await Promise.all(postDataPromise)

    void utils.tweet.timeline.invalidate();

    if (file) {
      file.forEach(file => URL.revokeObjectURL(file));
      setImages([]);
    }
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // deleteAllImages({tweetId: twId});
  }

  function checkHeight() {
    if (controlHeight?.current && controlHeight.current.offsetHeight > 780) {
      controlHeight.current.style.overflowY = 'auto'
    }
  }

  function addEmoji(e: { native: string; }) {
    console.log(text);
    const emoji : string = e.native;

    setText(text + emoji)
  }
  function handleInputTweetChange(e: { target: { value: React.SetStateAction<string>; }; }) {
    setText(e.target.value)
  }

  useEffect(() => {
    checkHeight()
  }, [])

  useEffect(() => {
    const checkIfLickedOutside = (e: MouseEvent) => {
      // // If the emjoi selection is open and the clicked target is not within the emjoi selection, then close selection
      if (isOpenEmoji && toggleEmojiRef.current && !toggleEmojiRef.current.contains(e.target as Node))
        setOpenEmoji(false);
    };
    document.addEventListener("mousedown", checkIfLickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfLickedOutside);
    };
  }, [isOpenEmoji]);
  const firstImageRatio = imageDimensions.height / imageDimensions.width
  let tweetButtonDisabled = true;
  if (text !== "" || images.length > 0) {
    tweetButtonDisabled = false;
  }
  return (
    <main className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto text-black'>
      <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
        {/* content */}
        <div className='max-w-[600px] w-full z-[1] border-x border-bordercl bg-bgcl  min-h-screen h-full pointer-events-auto'>
          {/* login logout */}
          <AuthShowcase />
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
          <div className=' pointer-events-auto  '>
            <div className=' px-4'>
              <div className=' relative flex py-1  '>
                {/* avatar */}
                <div className='flex flex-col  mt-1 mr-[13px]  w-[53px] z-0 relative bg-transparent grow-0 '>
                  <div className='pb-[100%] pointer-events-auto block w-[53px]'>
                  </div>
                  <div className='absolute top-0 left-0 w-[53px] h-[53px]'>
                    <div className='w-full h-full'>
                      <NextImage className='rounded-full'
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

                          <form id="createPost" onSubmit={handleSubmit} className=" relative flex  flex-col  border-none rounded-md 
                          cursor-text text-left text-xl  w-full ">


                            <textarea onChange={handleInputTweetChange}
                              className='block border-none active:border-none whitespace-pre-wrap break-words  pointer-events-auto w-full max-h-[768px] h-full scrollbar-hide' rows={2}
                              placeholder="what&apos;s happenings?" value={text}
                            />

                            {/* <span className=' -mt-9 whitespace-pre-wrap break-words  h-full pointer-events-none text-teal-300 overflow-hidden text-ellipsis'>{text}
                            </span> */}

                          </form>
                        </div>
                      </div>



                      {error && JSON.stringify(error)}

                    </div>

                  </div>

                  {/* images picked from pc */}
                  
                  {images.length > 0 &&
                    <div className='my-1 w-full relative ' >
                      <div className='flex w-full overflow-hidden relative'>
                        {/* padding */}
                        <div className={`w-full  ${firstImageRatio > 1.33 ? 'pb-[133.333%]' : firstImageRatio > 1.00 ? 'pb-[calc(100)px)]' : 'pb-[56.25%]'} ${images.length > 1 ? "pb-[56.25%]" : ""}`}>
                        </div>
                        <div className='absolute w-full h-full  top-0 left-0 bottom-0'>
                          <div className='flex w-full h-full'>
                            {/* images on the left */}
                            <div className='mr-3 flex flex-col grow basis-0 space-y-2'>
                              {/* uppper image */}
                              <div className='grow cursor-pointer basis-0 w-full  rounded-[16px] relative overflow-hidden '>
                                <div className='absolute inset-0'>
                                  <img src={images[0]} alt="" className='w-full h-full  object-scale-down '  />
                                </div>
                              </div>
                              {/* below image */}
                              {(images[1] && images[2]) &&
                                <div className='grow cursor-pointer  basis-0 rounded-[16px] relative overflow-hidden'>
                                  <div className='absolute inset-0'>
                                    <img src={images[1]} alt="" className='w-full h-full' />
                                  </div>
                                </div>
                              }
                            </div>

                            {/* images on the right */}
                            {images[2] &&
                              <div className=' flex flex-col grow basis-0 space-y-2'>
                                {/* uppper image */}
                                {images[2] &&
                                  <div className='grow cursor-pointer basis-0 w-full  rounded-[16px] relative overflow-hidden'>
                                    <div className='absolute inset-0'>
                                      <img src={images[2]} alt="" className='w-full h-full  object-scale-down ' />
                                    </div>
                                  </div>
                                }
                                {/* down image */}
                                {images[3] &&
                                  <div className='grow cursor-pointer  basis-0 rounded-[16px] relative overflow-hidden'>
                                    <div className='absolute inset-0'>
                                      <img src={images[3]} alt="" className='w-full h-full' />
                                    </div>
                                  </div>
                                }
                              </div>
                            }

                            {/* images on the right */}
                            {(images[1] && !images[2]) &&
                              <div className=' flex flex-col grow basis-0 space-y-2'>

                                <div className='grow cursor-pointer basis-0 w-full  rounded-[16px] relative overflow-hidden'>
                                  <div className='absolute inset-0'>
                                    <img src={images[1]} alt="" className='w-full h-full  object-scale-down ' />
                                  </div>
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                  }
                  {/* things added to a post */}
                  <div className=' flex flex-col z-0 relative w-full border-t border-bordercl'>
                    <div className='box-border flex items-center  flex-wrap z-[1] justify-between pointer-events-auto bg-primary_bg w-full'>

                      {/* add images, emojs to tweet */}
                      <div className='flex justify-center items-center'>
                        {/* pick images from file */}
                        <div className='flex items-center justify-center mt-3'>
                          <div className='w-[36px] h-[36px]  rounded-[9999px] flex items-center justify-center cursor-pointer overflow-hidden hover:bg-interHoverIcon active:bg-interHoverIconActive  '
                            onClick={selectImage
                            }
                          >
                            <div className='flex items-center justify-center grow '>
                              <GrImage />
                            </div>
                          </div>

                          <input
                            placeholder='pick files'
                            className=' w-[0.1px] h-[0.1px] z-[-1] opacity-0 absolute overflow-hidden appearance-none cursor-default'
                            type="file" multiple accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime' onChange={onFileChange}
                            ref={fileInput}
                          />
                          {/* BsEmojiSmile */}
                        </div>

                        {/* pick emoji */}
                        <div className='flex items-center justify-center mt-3'
                          ref={toggleEmojiRef}
                        >
                          <div className='w-[36px] h-[36px]  rounded-[9999px] flex items-center justify-center cursor-pointer overflow-hidden hover:bg-interHoverIcon active:bg-interHoverIconActive  '
                            onClick={() => setOpenEmoji(true)
                            }
                          >
                            <div className='flex items-center justify-center grow '>
                              <BsEmojiSmile />
                            </div>
                          </div>
                          {isOpenEmoji &&
                            <Picker data={data} onEmojiSelect={addEmoji} />
                          }
                        </div>
                      </div>

                      <div className='mt-1'>
                        <button className={`bg-iconFIllActive px-5 py-2 mr-2 rounded-[20px] text-white font-medium hover:bg-tweetButonHover text-base ${tweetButtonDisabled ? "opacity-50" : "opacity-100"}`}
                          onClick={handleSubmit} disabled={tweetButtonDisabled}
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
            <TweetLine where={{}} />
          </section>
        </div>
        {/* search */}
      </div>
    </main>
  )
}

export default MainPageTw;