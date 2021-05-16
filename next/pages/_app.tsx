import { ChakraProvider } from "@chakra-ui/react";
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

    return (
        <>
            <Head>
                <title>{Component.name} | krsz.me</title>
            </Head>

            <ChakraProvider theme={theme}>
                <Nav user={user} />

                <Component {...pageProps} user={user} />

                <Footer />
            </ChakraProvider>
        </>
    );
}
