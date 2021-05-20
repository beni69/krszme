import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import ShortenerForm from "../components/shortenerForm";

const Create = () => {
    return (
        <Center h={["69vh", null, "80vh"]}>
            <Box>
                <Heading fontSize="3xl" mb={4} textAlign="center">
                    Create a link
                </Heading>
                <ShortenerForm />
            </Box>
        </Center>
    );
};

Create.pageName = "Create a link";

export default Create;
