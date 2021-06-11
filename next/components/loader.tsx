import { Center, CenterProps, Spinner } from "@chakra-ui/react";

const Loader = (props: CenterProps) => {
    return (
        <Center {...props}>
            <Spinner size="xl" />
        </Center>
    );
};

export default Loader;
