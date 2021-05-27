import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

const link = (props: LinkProps) => {
    const { children, href, ...rest } = props;

    return (
        <NextLink passHref href={href}>
            <ChakraLink {...rest}>{children}</ChakraLink>
        </NextLink>
    );
};

export default link;
