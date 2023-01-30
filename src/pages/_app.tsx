import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { api } from "../utils/api";
import "../styles/globals.css";
import {Inter} from "@next/font/google"

const mainFont = Inter({
  subsets : ["latin"],
  variable : "--font-main-font",
  display: 'optional'
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider defaultTheme="light" >
      <SessionProvider session={session}>
        {/* <div className={`${mainFont.variable} font-sans`}> */}
          <Component {...pageProps} />
        {/* </div> */}
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
