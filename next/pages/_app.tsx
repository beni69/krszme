import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import Footer from "../components/footer";
import Loader from "../components/loader";
import Nav from "../components/nav";
import auth, { AuthContext } from "../lib/auth";
import theme from "../lib/theme";
import "../styles/globals.css";
import PlausibleProvider from "next-plausible";
import type { User } from "firebase/auth";

export default function MyApp({ Component, pageProps }: AppProps) {
    const PROD = process.env.NODE_ENV === "production";
    if (typeof window !== "undefined") console.log({ PROD });

    const router = useRouter();
    const [user, setUser] = useState<User>(undefined);
    auth.onAuthStateChanged(setUser);
    const footerHeight = ["8rem", null, "3.5rem"];
    const navRef = useRef(null);

    return (
        <>
            <Head>
                <title>krsz.me</title>
            </Head>

            <PlausibleProvider
                domain="app.krsz.me"
                customDomain="https://plausible.vbeni.dev"
                selfHosted>
                {/* chakra ui */}
                <ChakraProvider theme={theme}>
                    {/* react icons */}
                    <IconContext.Provider
                        value={{ style: { verticalAlign: "middle" } }}>
                        {/* custom firebase auth context */}
                        <AuthContext.Provider value={user}>
                            {user !== undefined ? (
                                <Box
                                    id="page-container"
                                    pos="relative"
                                    minH="100vh">
                                    <Box
                                        id="content=wrap"
                                        minH="100vh"
                                        pb={footerHeight}>
                                        <Nav navRef={navRef} />

                                        <Component
                                            {...pageProps}
                                            navRef={navRef}
                                        />
                                    </Box>

                                    <Footer h={footerHeight} />
                                </Box>
                            ) : (
                                <Loader h="100vh" w="100vw" />
                            )}
                        </AuthContext.Provider>
                    </IconContext.Provider>
                </ChakraProvider>
            </PlausibleProvider>
        </>
    );
}
