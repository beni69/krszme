import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

//@ts-ignore
const theme = extendTheme(
    {
        components: {
            Link: {
                variants: {
                    cool: props => ({
                        color:
                            props.colorScheme &&
                            `${props.colorScheme}.${
                                props.colorMode === "light" ? 500 : 200
                            }`,
                    }),
                },
            },
        },
        config: {
            initialColorMode: "dark",
        },
    },
    withDefaultColorScheme({ colorScheme: "blue", components: ["Link"] })
);

export default theme;
