import { Avatar, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import Card from "../components/card";
import withTitle from "../components/HOC/withTitle";
import { AuthContext, withAuth } from "../lib/auth";

const Profile = () => {
    const user = useContext(AuthContext);

    if (!user) return null;

    return (
        <Center as="main" h={["69vh", null, "80vh"]}>
            <VStack as={Card} p={24}>
                <Avatar
                    size={"xl"}
                    name={user.displayName}
                    src={user.photoURL}
                />
                <Heading>{user.displayName}</Heading>
                <Text>{user.email}</Text>
            </VStack>
        </Center>
    );
};

export default withAuth(withTitle(Profile, "Profile"));
