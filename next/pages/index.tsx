import {
    Box,
    Heading,
    Stack,
    HStack,
    Text,
    VStack,
    Flex,
    Button,
    FormControl,
} from "@chakra-ui/react";
import Card from "../components/card";
import ShortenerForm from "../components/shortenerForm";

export default function Home({ user }) {
    return (
        <Box as="main" h="100%">
            <VStack as="title" m={28}>
                <Heading as="h1" fontSize="6xl">
                    krsz.me
                </Heading>
                <Text as="h2" fontSize="xl">
                    A no-bs url shortener
                </Text>
            </VStack>
            <Flex
                align="center"
                justify="space-evenly"
                mt={48}
                direction={{ base: "column", md: "row" }}>
                <Card mb={{ base: 12, md: 0 }}>
                    <Heading fontSize="md" mb={4}>
                        Create a link
                    </Heading>
                    <ShortenerForm />
                </Card>

                {user ? (
                    <Button
                        as="a"
                        href="/dashboard"
                        maxW="420px"
                        minW="240px"
                        p={8}
                        fontSize="2xl"
                        colorScheme="blue">
                        Go to dashboard
                    </Button>
                ) : (
                    <Button
                        as="a"
                        href="/login"
                        maxW="420px"
                        minW="240px"
                        p={8}
                        fontSize="2xl"
                        colorScheme="blue">
                        Create an account
                    </Button>
                )}
            </Flex>
        </Box>
    );
}
Home.pageName = "Home";
