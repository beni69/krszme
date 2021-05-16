import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";

const themeSwitcher = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return colorMode === "light" ? (
        <IconButton
            size={"sm"}
            mr={3}
            onClick={toggleColorMode}
            aria-label="Switch to dark theme"
            icon={<MoonIcon />}
        />
    ) : (
        <IconButton
            size={"sm"}
            mr={3}
            onClick={toggleColorMode}
            aria-label="Switch to light theme"
            icon={<SunIcon />}
        />
    );
};

export default themeSwitcher;
