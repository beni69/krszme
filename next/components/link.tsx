import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";

export const Link = (props: LinkProps) => {
    const { children, href, ...rest } = props;

    return (
        <NextLink passHref href={href ?? ""}>
            <ChakraLink {...rest}>{children}</ChakraLink>
        </NextLink>
    );
};

export default Link;
export { NextLink };
