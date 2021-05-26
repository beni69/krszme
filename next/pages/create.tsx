import { Box, Center, Heading } from "@chakra-ui/react";
import withTitle from "../components/HOC/withTitle";
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

export default withTitle(Create, "Create a link");
