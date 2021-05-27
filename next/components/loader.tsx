import { Center, Spinner } from "@chakra-ui/react";

const Loader = () => {
    return (
        <Center h="100vh" w="100vw">
            <Spinner size="xl" />
        </Center>
    );
};

export default Loader;
