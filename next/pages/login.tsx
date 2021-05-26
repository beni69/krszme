import { Center, Flex, Heading } from "@chakra-ui/react";
import FirebaseUI from "react-firebaseui/StyledFirebaseAuth";
import withTitle from "../components/HOC/withTitle";
import { auth, uiConfig } from "../lib/auth";

const Login = ({ user }) => {
    if (user) return <Center as={Heading}>already signed in</Center>;

    return (
        <Flex
            as="main"
            alignItems={"center"}
            justifyContent={"center"}
            h="100%">
            <FirebaseUI uiConfig={uiConfig} firebaseAuth={auth} />
        </Flex>
    );
};

export default withTitle(Login, "Login");
