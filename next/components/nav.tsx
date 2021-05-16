import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import auth from "../lib/auth";
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

const NavUser = ({ user }) =>
    // user logged in
    user ? (
        <>
            {/* action button */}
            <Button
                as="a"
                href="/create"
                variant={"solid"}
                colorScheme={"blue"}
                size={"sm"}
                mr={4}
                leftIcon={<AddIcon />}>
                Create
            </Button>
            {/* user pfp */}
            <Menu>
                <MenuButton
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
                <MenuList>
                    <MenuItem as="a" href="/profile">
                        Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => auth.signOut()}>Sign out</MenuItem>
                </MenuList>
            </Menu>
        </>
    ) : (
        // user not logged in
        <Button
            as={"a"}
            href="/login"
            variant={"solid"}
            colorScheme={"blue"}
            size={"sm"}
            mr={4}>
            Sign in
        </Button>
    );

export default function Nav({ user }) {
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
                    <ThemeSwitcher />
                    <NavUser user={user} />
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
