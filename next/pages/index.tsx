import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import Card from "../components/card";
import { NextLink } from "../components/link";
import ShortenerForm from "../components/shortenerForm";
import { AuthContext } from "../lib/auth";

export default function Home() {
    const user = useContext(AuthContext);

    const btnProps = user
        ? {
              text: "Go to dashboard",
              href: "/dashboard",
          }
        : {
              text: "Create an account",
              href: "/login",
          };

    return (
        <Box as="main" mb={16}>
            <VStack m={28}>
                <Heading as="h1" fontSize="6xl" textAlign="center">
                    krsz.me
                </Heading>
                <Text as="h2" fontSize="xl" textAlign="center">
                    an epic url shortener
                </Text>
            </VStack>
            <Flex
                align="center"
                justify="space-evenly"
                direction={{ base: "column", md: "row" }}>
                <Card mb={{ base: 12, md: 0 }}>
                    <Heading fontSize="md" mb={4}>
                        Create a link
                    </Heading>
                    <ShortenerForm />
                </Card>

                <NextLink href={btnProps.href}>
                    <Button
                        maxW="420px"
                        minW="240px"
                        p={8}
                        fontSize="2xl"
                        colorScheme="blue">
                        {btnProps.text}
                    </Button>
                </NextLink>
            </Flex>
        </Box>
    );
}
