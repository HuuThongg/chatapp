import { type NextPage } from "next";
import Head from "next/head";
import { SideBar } from "../components/sidebar";
import { MainPageTw } from '../components/main'
import { createPortal } from 'react-dom';
const  Home: NextPage = () => {
  
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <NavBar /> */}
      <div className="z-0 box-border w-full h-full relative" >
        <div className="flex flex-col relative z-0 min-h-screen bg-bgcl">
          <div className="h-full flex shrink-0 items-stretch grow-0 relative ">
            <SideBar />
            <MainPageTw />
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;


// type TechnologyCardProps = {
//   name: string;
//   description: string;
//   documentation: string;
// };

// const TechnologyCard = ({
//   name,
//   description,
//   documentation,
// }: TechnologyCardProps) => {
//   return (
//     <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
//       <h2 className="text-lg text-gray-700">{name}</h2>
//       <p className="text-sm text-gray-600">{description}</p>
//       <a
//         className="m-auto mt-3 w-fit text-sm text-violet-500 underline decoration-dotted underline-offset-2"
//         href={documentation}
//         target="_blank"
//         rel="noreferrer"
//       >
//         Documentation
//       </a>
//     </section>
//   );
// };
