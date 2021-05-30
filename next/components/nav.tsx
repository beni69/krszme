import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useContext } from "react";
import { AuthContext, signOut } from "../lib/auth";
import Link from "./link";
import ThemeSwitcher from "./themeSwitcher";

const Links: {
    name: string;
    href: string;
}[] = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
];

const NavLink = ({ link }: { link: typeof Links[0] }) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={link.href}>
        {link.name}
    </Link>
);

const NavUser = ({ user }: { user: firebase.default.User }) => {
    // user logged in
    return user ? (
        <>
            {/* action button */}
            <NextLink href="/create">
                <Button
                    variant={"solid"}
                    colorScheme={"blue"}
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}>
                    Create
                </Button>
            </NextLink>
            {/* user pfp */}
            <Menu>
                <MenuButton
                    _focus={{}}
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}>
                    <Avatar
                        size={"sm"}
                        name={user.displayName}
                        src={user.photoURL}
                    />
                </MenuButton>
                {/* user dropdown */}
                <MenuList rootProps={{ style: { right: 0 } }}>
                    <NextLink href="/profile">
                        <MenuItem>Profile</MenuItem>
                    </NextLink>
                    <MenuDivider />
                    <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
                </MenuList>
            </Menu>
        </>
    ) : (
        // user not logged in
        <NextLink href="/login">
            <Button variant={"solid"} colorScheme={"blue"} size={"sm"} mr={4}>
                Sign in
            </Button>
        </NextLink>
    );
};

export default function Nav({ navRef }) {
    const user = useContext(AuthContext);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} w="100%">
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                {/* hamburger menu icon */}
                <IconButton
                    size={"md"}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={"Open Menu"}
                    display={{ md: "none" }}
                    onClick={isOpen ? onClose : onOpen}
                />
                {/* the links */}
                <HStack spacing={8} alignItems={"center"}>
                    <HStack
                        as={"nav"}
                        spacing={4}
                        display={{ base: "none", md: "flex" }}>
                        {Links.map(link => (
                            <NavLink key={link.name} link={link} />
                        ))}
                    </HStack>
                </HStack>
                {/* right side */}
                <Flex alignItems={"center"}>
                    <Flex alignItems={"center"} ref={navRef} />

                    <Flex alignItems={"center"}>
                        <ThemeSwitcher />
                        <NavUser user={user} />
                    </Flex>
                </Flex>
            </Flex>

            {/* the hamburger menu on phones */}
            {isOpen ? (
                <Box pb={4} display={{ md: "none" }}>
                    <Stack as={"nav"} spacing={4}>
                        {Links.map(link => (
                            <NavLink key={link.name} link={link} />
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}
