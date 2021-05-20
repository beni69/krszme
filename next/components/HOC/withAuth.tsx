import { useRouter } from "next/router";

const withAuth = WrappedComponent => {
    return props => {
        if (typeof window === "undefined") return null;

        const Router = useRouter();
        const user = { props };

        if (!user) {
            Router.replace("/login");
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
