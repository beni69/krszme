import { CopyIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    BoxProps,
    Button,
    Center,
    Heading,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Portal,
    SimpleGrid,
    SkeletonText,
    Spinner,
    Text,
    useClipboard,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import QRCode from "qrcode.react";
import { MutableRefObject, useContext, useRef, useState } from "react";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { GoSync } from "react-icons/go";
import { ImQrcode } from "react-icons/im";
import Card from "../components/card";
import withTitle from "../components/HOC/withTitle";
import Link from "../components/link";
import Loader from "../components/loader";
import { useLinks } from "../lib/api";
import { AuthContext, withAuth } from "../lib/auth";

const LinkMenu = (props: BoxProps & { link: url }) => {
    const { link, ...rest } = props;

    // copy
    const { hasCopied, onCopy } = useClipboard(link.url);
    const toast = useToast({
        status: "success",
        title: "Copied to clipboard",
        variant: "left-accent",
        position: "bottom",
        isClosable: true,
    });
    if (hasCopied) toast();

    // delete
    const leastDestructiveRef = useRef();
    const [isDelOpen, setIsDelOpen] = useState(false);
    const onDelClose = () => setIsDelOpen(false);
    const onDelete = () => {
        onDelClose();
    };

    // qrcode
    const {
        isOpen: isQROpen,
        onOpen: onQROpen,
        onClose: onQRClose,
    } = useDisclosure();

    return (
        <>
            {/* link menu */}
            <Box {...rest}>
                <Menu isLazy>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<HamburgerIcon />}
                    />

                    <MenuList>
                        <MenuItem icon={<CopyIcon />} onClick={onCopy}>
                            Copy link
                        </MenuItem>
                        <MenuItem icon={<ImQrcode />} onClick={onQROpen}>
                            Show QR code
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => setIsDelOpen(true)}>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>

            {/* delete link alert dialog */}
            <AlertDialog
                isOpen={isDelOpen}
                leastDestructiveRef={leastDestructiveRef}
                onClose={onDelClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Delete link</AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this link? People
                            won't be redirected to your site anymore, and if you
                            had a custom code, it can now be taken by anyone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={leastDestructiveRef}
                                onClick={onDelClose}>
                                Cancel
                            </Button>
                            <Button onClick={onDelete} colorScheme="red" ml={3}>
                                Let's do it
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* qr code modal */}
            <Modal isOpen={isQROpen} onClose={onQRClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>QR Code</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>
                        <Center>
                            <QRCode
                                value={link.url}
                                size={256}
                                level="M"
                                renderAs="canvas"
                                imageSettings={{
                                    src: "/android-chrome-512x512.png",
                                    excavate: true,
                                    x: null,
                                    y: null,
                                    height: 69,
                                    width: 69,
                                }}
                            />
                        </Center>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onQRClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const Dashboard = ({ navRef }: { navRef: MutableRefObject<any> }) => {
    const user = useContext(AuthContext);

    const { links, isLoading, forceReload } = useLinks();

    // sorting links
    const [sort, setSort] = useState<"date" | "clicks">("date");
    const [order, setOrder] = useState<"asc" | "desc">("asc");

    const toast = useToast({
        variant: "solid",
        position: "bottom",
        isClosable: true,
    });

    return (
        <>
            {links?.length ? (
                <SimpleGrid
                    as="main"
                    spacing={16}
                    minChildWidth={["240px", "360px"]}
                    m={[8, null, 16]}
                    overflow="hidden" // prevent a useless horizontal scrollbar
                >
                    {(links as url[])
                        .sort((a, b) => {
                            let value: number;
                            switch (sort) {
                                case "date":
                                    value =
                                        new Date(a.timestamp).getTime() -
                                        new Date(b.timestamp).getTime();
                                    break;

                                case "clicks":
                                    value = a.clicks - b.clicks;
                                    break;
                            }
                            if (order === "asc") return value;
                            else return value * -1;
                        })
                        .map(l => (
                            <Card pos="relative" key={l._id}>
                                <LinkMenu
                                    link={l}
                                    pos="absolute"
                                    top={1}
                                    right={1}
                                />

                                <SkeletonText
                                    isLoaded={!isLoading}
                                    noOfLines={1}
                                    spacing={1}
                                    mt={isLoading && 3}>
                                    <Link
                                        href={l.url}
                                        isExternal
                                        variant="cool"
                                        fontSize="lg">
                                        {l.url}
                                    </Link>
                                </SkeletonText>

                                <SkeletonText
                                    isLoaded={!isLoading}
                                    noOfLines={2}
                                    spacing={2}
                                    mt={isLoading && 3}>
                                    <Text>
                                        Destination:{" "}
                                        <Link
                                            href={l.dest}
                                            isExternal
                                            variant="cool"
                                            noOfLines={1}>
                                            {l.dest}
                                        </Link>
                                    </Text>
                                </SkeletonText>

                                <SkeletonText
                                    isLoaded={!isLoading}
                                    noOfLines={1}
                                    spacing={1}
                                    mt={isLoading && 3}>
                                    <Text>Clicks: {l.clicks}</Text>
                                </SkeletonText>

                                <SkeletonText
                                    isLoaded={!isLoading}
                                    noOfLines={1}
                                    spacing={1}
                                    mt={isLoading && 3}>
                                    <Text>
                                        Created at:{" "}
                                        {new Date(l.timestamp).toLocaleString()}
                                    </Text>
                                </SkeletonText>
                            </Card>
                        ))}
                </SimpleGrid>
            ) : links?.length === 0 ? (
                <Center as="main" h={["69vh", null, "80vh"]}>
                    <Heading textAlign="center">
                        you don't have any links
                        <br />
                        go create some
                    </Heading>
                </Center>
            ) : (
                <Loader h={["69vh", null, "80vh"]} />
            )}

            <Portal containerRef={navRef}>
                <Menu closeOnSelect={false} isLazy>
                    <MenuButton
                        as={IconButton}
                        size="sm"
                        aria-label="Sort by"
                        icon={
                            order === "asc" ? (
                                <FaSortAmountDownAlt size="1.125rem" />
                            ) : (
                                <FaSortAmountUpAlt size="1.125rem" />
                            )
                        }
                        mr={2}
                    />
                    <MenuList>
                        <MenuOptionGroup
                            onChange={x => setSort(x as any)}
                            defaultValue={sort}
                            type="radio"
                            title="Sort by">
                            <MenuItemOption value="date">
                                Date created
                            </MenuItemOption>
                            <MenuItemOption value="clicks">
                                Clicks
                            </MenuItemOption>
                        </MenuOptionGroup>
                        <MenuDivider />
                        <MenuOptionGroup
                            onChange={x => setOrder(x as any)}
                            defaultValue={order}
                            type="radio"
                            title="Order">
                            <MenuItemOption
                                value="asc"
                                icon={<FaSortAmountDownAlt size="1.125rem" />}>
                                Ascending
                            </MenuItemOption>
                            <MenuItemOption
                                value="desc"
                                icon={<FaSortAmountUpAlt size="1.125rem" />}>
                                Descending
                            </MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                <IconButton
                    aria-label="refresh"
                    size="sm"
                    icon={
                        isLoading ? (
                            <Spinner size="sm" />
                        ) : (
                            <GoSync size="1.125rem" />
                        )
                    }
                    mr={2}
                    onClick={() => forceReload()}
                />
            </Portal>
        </>
    );
};

export default withAuth(withTitle(Dashboard, "Dashboard"));
