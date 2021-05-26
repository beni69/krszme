import { Center, Heading } from "@chakra-ui/react";
import withTitle from "../components/HOC/withTitle";

const page404 = () => {
    return (
        <Center as="main" h={["69vh", null, "80vh"]}>
            <Heading>404 - not found</Heading>
        </Center>
    );
};

export default withTitle(page404, "Not found");
