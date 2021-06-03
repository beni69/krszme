import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import Footer from "../components/footer";
import Loader from "../components/loader";
import Nav from "../components/nav";
import { logPage } from "../lib/analytics";
import auth, { AuthContext } from "../lib/auth";
import theme from "../lib/theme";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    const PROD = process.env.NODE_ENV === "production";
    if (typeof window !== "undefined") console.log({ PROD });

    const router = useRouter();
    const [user, setUser] = useState<firebase.default.User>(undefined);
    auth.onAuthStateChanged(setUser);
    const footerHeight = ["8rem", null, "3.5rem"];
    const navRef = useRef(null);

    useEffect(() => {
        if (!PROD) return;

        router.events.on("routeChangeComplete", logPage);

        logPage(window.location.pathname);

        return () => {
            router.events.off("routeChangeComplete", logPage);
        };
    }, []);

    return (
        <>
            <Head>
                <title>krsz.me</title>
            </Head>

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

                                    <Component {...pageProps} navRef={navRef} />
                                </Box>

                                <Footer h={footerHeight} />
                            </Box>
                        ) : (
                            <Loader />
                        )}
                    </AuthContext.Provider>
                </IconContext.Provider>
            </ChakraProvider>
        </>
    );
}
