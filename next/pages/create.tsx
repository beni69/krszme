import { Flex } from "@chakra-ui/react";
import ShortenerForm from "../components/shortenerForm";

const Create = () => {
    return (
        <Flex align="center" justify="center" h="100%">
            <ShortenerForm />
        </Flex>
    );
};

Create.pageName = "Create a link";

export default Create;
