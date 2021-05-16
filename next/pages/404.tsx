import { Flex, Heading } from "@chakra-ui/react";

const page404 = () => {
    return (
        <Flex align="center" justify="center" h={"100%"}>
            <Heading>404 - not found</Heading>
        </Flex>
    );
};

page404.pageName = "Not Found";

export default page404;
