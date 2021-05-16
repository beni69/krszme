import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";

const Card = ({ children, ...props }: BoxProps) => {
    return (
        <Box
            maxW="420px"
            minW="240px"
            bg={useColorModeValue("white", "gray.900")}
            boxShadow="2xl"
            rounded="lg"
            p={6}
            textAlign="center"
            {...props}>
            {children}
        </Box>
    );
};

export default Card;
