import { useSession,signIn } from 'next-auth/react'
import { useTheme } from 'next-themes';
import React, { useEffect } from 'react'
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '../../constants';
import IconButton from '../IconButton/IconButton';
import { IoMoonOutline } from "react-icons/io5";
import { api } from '../../utils/api';
import Chat from '../Chat';

const NavBar = () => {
  const {data: sessionData} = useSession();
  const {theme, setTheme} = useTheme();
  const changeUserThemeMutation = api.user.changeUserTheme.useMutation();

  const changeTheme = () => {
    changeUserThemeMutation.mutate(
      {theme: theme==="light" ? "dark" :"light"},
      {
        onSettled: (data, error) => {
          if (data) {
            setTheme(data.theme);
          }
          if (error) {
            alert(error.message);
          }
        },
      }
    )
  }

  useEffect(()=>{
    if(sessionData?.user){
      if(sessionData.user.theme !== theme)
        setTheme(sessionData.user.theme)
      // else {
      //   if(theme !== "light")
      //     setTheme("light");
      // }
    }
  },[sessionData])
  return (
    <nav className=" top-0 z-50 flex h-14 w-full items-center justify-end space-x-2 bg-level1 px-4 shadow-sm ">
      {sessionData?.user ? (
        <>
          <IconButton onClick={changeTheme}>
            <IoMoonOutline />
          </IconButton>
          <Chat/>
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              alt="avatar image"
              src={sessionData.user.image || PLACEHOLDER_IMAGE}
              className="h-8 w-8 rounded-full"
              width={32}
              height={32}
            />
          </div>
        </>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </nav>
  )
}

export default NavBar