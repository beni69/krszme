import {
    Box,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

const Footer = () => (
    <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}>
        <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ base: "center", md: "space-between" }}
            align={{ base: "center", md: "center" }}>
            <Text>© 2021 The Karesz Foundation. All rights reserved</Text>
            <Stack direction="row" spacing={6}>
                <Link href="/terms">Legal stuff</Link>
            </Stack>
        </Container>
    </Box>
);

export default Footer;
