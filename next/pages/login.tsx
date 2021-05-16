import { Box, Flex } from "@chakra-ui/react";
import FirebaseUI from "react-firebaseui/StyledFirebaseAuth";
import { auth, uiConfig } from "../lib/auth";

const Login = ({ user }) => {
    if (user) return <h3>already signed in</h3>;

    return (
        <Flex alignItems={"center"} justifyContent={"center"} h="100%">
            <FirebaseUI uiConfig={uiConfig} firebaseAuth={auth} />
        </Flex>
    );
};

export default Login;
