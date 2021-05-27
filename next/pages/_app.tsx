import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import Footer from "../components/footer";
import Loader from "../components/loader";
import Nav from "../components/nav";
import auth, { AuthContext } from "../lib/auth";
import theme from "../lib/theme";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<firebase.default.User>(undefined);

    auth.onAuthStateChanged(setUser);

    const footerHeight = ["8rem", null, "3.5rem"];

    // if (user === undefined) return null;

    return (
        <>
            <Head>
                <title>krsz.me</title>
            </Head>

            {/* chakra ui */}
            <ChakraProvider theme={theme}>
                {/* custom firebase auth context */}
                <AuthContext.Provider value={user}>
                    {user !== undefined ? (
                        <Box id="page-container" pos="relative" minH="100vh">
                            <Box
                                id="content=wrap"
                                minH="100vh"
                                pb={footerHeight}>
                                <Nav />

                                <Component {...pageProps} />
                            </Box>

                            <Footer h={footerHeight} />
                        </Box>
                    ) : (
                        <Loader />
                    )}
                </AuthContext.Provider>
            </ChakraProvider>
        </>
    );
}
