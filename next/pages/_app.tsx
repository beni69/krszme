import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import Footer from "../components/footer";
import Nav from "../components/nav";
import auth from "../lib/auth";
import theme from "../lib/theme";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState(auth.currentUser);

    auth.onAuthStateChanged(setUser);

    const footerHeight = ["8rem", null, "3.5rem"];

    return (
        <>
            <Head>
                <meta property="og:title" content="krsz.me" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://app.krsz.me" />
                <meta
                    property="og:description"
                    content="a very epic url shortener"
                />
                <meta
                    property="description"
                    content="a very epic url shortener"
                />
                <meta
                    name="keywords"
                    content="url, url shortener, karesz, krsz"
                />
                {/*@ts-ignore*/}
                <title>{Component.pageName} | krsz.me</title>
            </Head>

            <ChakraProvider theme={theme}>
                <Box id="page-container" pos="relative" minH="100vh">
                    <Box id="content=wrap" minH="100vh" pb={footerHeight}>
                        <Nav user={user} />

                        <Component {...pageProps} user={user} />
                    </Box>

                    <Footer h={footerHeight} />
                </Box>
            </ChakraProvider>
        </>
    );
}
