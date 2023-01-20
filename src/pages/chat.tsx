import React, {useEffect} from 'react'
import { SideBar } from '../components/sidebar'
import Link from "next/link";
import { api } from "../utils/api";
import useOnChange from "../hooks/useOnChange"

import NavBar from "../components/NavBar/NavBar";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

type InputWLabelsPros = {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


const InputWLabels = ({ name, value, onChange }: InputWLabelsPros) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name}>Change {name}</label>
      <input
        name={name}
        id={name}
        placeholder={name}
        onChange={onChange}
        value={value}
        className="h-10 w-full rounded-lg bg-level2 px-3 py-2 outline-none placeholder:text-quaternaryText"
      />
    </div>
  )
}

const Chat = () => {
  const { data: sessionData } = useSession();

  const { data } = api.chat.hello.useQuery({ text: " there, welcome to the chat app" });
  const {
    values: { name, username, image },
    setValues,
    handleChange,
  } = useOnChange({ name: "", username: "", image: "" });

  const changeUserDataMutation = api.user.changeUserData.useMutation();
  const changeUserData = (event: React.SyntheticEvent) => {
    event.preventDefault();
    changeUserDataMutation.mutate({
      name: name || undefined,
      username: username || undefined,
      image: image || undefined,
    });
  };
  useEffect(() => {
    if (sessionData?.user) {
      setValues({
        name: sessionData.user.name || "",
        username: sessionData.user.username || "",
        image: sessionData.user.image || "",
      });
    }
  }, [sessionData]);

  return (
    <div className="z-0 box-border w-full h-full relative" >
      <div className="flex flex-col relative z-0 min-h-screen bg-bgcl">
        <div className="h-full flex shrink-0 items-stretch grow-0 relative ">
          <SideBar />

          <div className='flex flex-col p-0 m-0 border-none grow items-start  shrink basis-auto  text-[15px] relative  bg-bgcl pointer-events-auto text-black'>
            <div className='w-[990px] flex flex-col shrink grow  basis-auto m-0 p-0 min-h-0 min-w-0 relative z-0'>
              {/* content */}
              <div className='max-w-full w-full z-[1] border-x border-bordercl bg-bgcl  min-h-screen h-full pointer-events-auto'>
                <NavBar />

                <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
                  <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
                    {data ? <p>{data.greeting}</p> : <p>Loading..</p>}
                  </div>
                  <form
                    className="flex flex-col space-y-5 rounded-xl bg-level1 p-8 shadow-sm"
                    onSubmit={changeUserData}
                  >
                    {sessionData?.user?.image && (
                      <Image
                        src={sessionData.user.image}
                        alt="profile image"
                        className="mx-auto h-11 w-11 rounded-full"
                        width={44}
                        height={44}
                      />
                    )}
                    <InputWLabels name="name" value={name!} onChange={handleChange} />
                    <InputWLabels
                      name="username"
                      value={username!}
                      onChange={handleChange}
                    />
                    <InputWLabels name="image" value={image!} onChange={handleChange} />
                    <button
                      type="submit"
                      className="h-9 w-full rounded-lg bg-primaryText text-invertedPrimaryText"
                    >
                      Submit
                    </button>
                  </form>
                  <AuthShowcase />
                </main>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  )
}

export default Chat
const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = api.user.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};