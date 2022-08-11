import { ThemeProvider } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import Layout from "../components/layout";
import { signIn } from "../entities/user/user.dal";
import "../styles/globals.css";
import { theme } from "../utils/theme";
import SignIn from "./login";
import { isNil } from "ramda";
import { User } from "../entities/user/user";
export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState<User>();
  const onSignIn = async (id: string, password: string) => {
    const user = await signIn(id, password);
    if (!isNil(user)) setUser(user);
  };
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>P+1</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#00838f" />
      </Head>
      <ThemeProvider theme={theme}>
        {user ? (
          <Layout user={user}>
            <Component {...pageProps} user={user} setUser={setUser} />
          </Layout>
        ) : (
          <SignIn onSignIn={onSignIn}></SignIn>
        )}
      </ThemeProvider>
    </>
  );
}
