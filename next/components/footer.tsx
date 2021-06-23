import {
    Box,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import SocialButton from "./SocialButton";

const Footer = ({ h }) => (
    <Box
        as="footer"
        pos="absolute"
        bottom={0}
        w="100%"
        h={h}
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}>
        <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            h={h}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ base: "center", md: "space-between" }}
            align="center">
            <Text align="center">
                © 2021 The Karesz Foundation. All rights reserved
            </Text>
            <Stack direction="row" spacing={6} align="center">
                <Link href="/terms">Legal stuff</Link>
                <SocialButton label="GitHub" href="https://krsz.me/github">
                    <FaGithub />
                </SocialButton>
            </Stack>
        </Container>
    </Box>
);

export default Footer;
