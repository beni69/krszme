import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "light",
    useSystemColorMode: true,
};

//@ts-ignore
const theme = extendTheme({ config });

export default theme;
