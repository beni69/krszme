import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import withTitle from "../components/HOC/withTitle";
import Link from "../components/link";

const linknotfound = () => {
    return (
        <Center h={["69vh", null, "80vh"]}>
            <VStack>
                <Heading>Oops, this link doesn't seem to exist.</Heading>
                <Text>
                    Create your own links{" "}
                    <Link variant="cool" href="/">
                        here
                    </Link>
                </Text>
            </VStack>
        </Center>
    );
};

export default withTitle(linknotfound, "Link not found");
