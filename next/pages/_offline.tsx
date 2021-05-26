import { Center, Heading } from "@chakra-ui/react";
import withTitle from "../components/HOC/withTitle";

const pageOffline = () => {
    return (
        <Center as="main" h={["69vh", null, "80vh"]}>
            <Heading>You are offline</Heading>
        </Center>
    );
};

export default withTitle(pageOffline, "You are offline");
