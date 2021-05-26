import {
    Box,
    Center,
    Flex,
    VStack,
    Text,
    Heading,
    Avatar,
} from "@chakra-ui/react";
import Card from "../components/card";
import withTitle from "../components/HOC/withTitle";
import auth, { withAuth } from "../lib/auth";

const Profile = ({ user }: { user: firebase.default.User }) => {
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
