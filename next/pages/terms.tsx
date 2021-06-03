import { Box, Center, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import withTitle from "../components/HOC/withTitle";

const Terms = () => (
    <Center as="main" h={["69vh", null, "80vh"]}>
        <Box maxW="2xl">
            <Heading mb={4}>krsz.me Terms of Service</Heading>
            <Text>
                I want this site to be able to be used by anybody. However
                please refrain from linking to malicious or otherwise harmful
                websites.
            </Text>
            <Text>
                To protect from any bad things, I reserve the right to terminate
                your account for any reason, without any prior notice.
            </Text>
            <Text>
                If your account has been banned, please fill out an appeal form{" "}
                <Link href="https://krsz.me/ccQCq" isExternal variant="cool">
                    here.
                </Link>
            </Text>
            <Heading mt={16} mb={4}>
                krsz.me Privacy Policy
            </Heading>
            <Text>
                This site uses google analytics to collect some data about the
                time you spend here. This information can't be linked back to
                you in any way. I do not sell this data to anyone, the only
                purpose is to help me build this site even better.
            </Text>
        </Box>
    </Center>
);

export default withTitle(Terms, "Terms of Service");
