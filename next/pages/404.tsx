import { Center, Heading } from "@chakra-ui/react";

const page404 = () => {
    return (
        <Center as="main" h={["69vh", null, "80vh"]}>
            <Heading>404 - not found</Heading>
        </Center>
    );
};

page404.pageName = "Not Found";

export default page404;
