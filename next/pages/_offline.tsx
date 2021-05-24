import { Center, Heading } from "@chakra-ui/react";

const pageOffline = () => {
    return (
        <Center as="main" h={["69vh", null, "80vh"]}>
            <Heading>You are offline</Heading>
        </Center>
    );
};

pageOffline.pageName = "Offline";

export default pageOffline;
