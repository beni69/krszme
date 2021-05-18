import { Box, Flex, Heading } from "@chakra-ui/react";
import ShortenerForm from "../components/shortenerForm";

const Create = () => {
    return (
        <Flex align="center" justify="center" h="100%">
            <Box>
                <Heading fontSize="3xl" mb={4} textAlign="center">
                    Create a link
                </Heading>
                <ShortenerForm />
            </Box>
        </Flex>
    );
};

Create.pageName = "Create a link";

export default Create;
