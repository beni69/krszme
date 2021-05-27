import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "../../lib/auth";

const withAuth = WrappedComponent => {
    return props => {
        if (typeof window === "undefined") return null;

        const Router = useRouter();
        const user = useContext(AuthContext);

        if (!user) {
            Router.replace("/login");
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
