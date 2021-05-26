import Head from "next/head";

const withTitle = (WrappedComponent, title: string) => {
    const hocComponent = ({ ...props }) => (
        <>
            <Head>
                <title>{title} | krsz.me</title>
            </Head>
            <WrappedComponent {...props} pageName={title} />
        </>
    );

    return hocComponent;
};
export default withTitle;
