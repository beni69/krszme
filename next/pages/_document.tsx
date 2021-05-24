import { ColorModeScript } from "@chakra-ui/color-mode";
import Document, {
    DocumentContext,
    Head,
    Html,
    Main,
    NextScript,
} from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta
                        name="description"
                        content="a very epic url shortener"
                    />
                    <meta
                        name="keywords"
                        content="url, url shortener, karesz, krsz"
                    />
                    <link rel="manifest" href="/manifest.json" />
                    {/* <meta name="theme-color" content="#0f1ff3" /> */}

                    {/* OpenGraph */}
                    <meta property="og:title" content="krsz.me" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://app.krsz.me" />
                    <meta
                        property="og:description"
                        content="a very epic url shortener"
                    />

                    {/* favicon */}
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/apple-touch-icon.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon-16x16.png"
                    />
                </Head>
                <body>
                    <ColorModeScript initialColorMode="system" />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
