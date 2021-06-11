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
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
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

                    <MenuList
                        rootProps={{
                            style: {
                                right: 0,
                            },
                        }}
                        className="bruh">
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

    const toast = useToast({
        variant: "solid",
        position: "bottom",
        isClosable: true,
    });

    return (
        <>
            {links ? (
                <SimpleGrid
                    as="main"
                    spacing={16}
                    minChildWidth={["240px", "360px"]}
                    m={[8, null, 16]}>
                    {links.map((l: url) => (
                        <Card pos="relative">
                            <LinkMenu
                                link={l}
                                pos="absolute"
                                top={1}
                                right={1}
                            />

                            <SkeletonText isLoaded={!isLoading}>
                                <Link
                                    href={l.url}
                                    isExternal
                                    variant="cool"
                                    fontSize="lg">
                                    {l.url}
                                </Link>
                            </SkeletonText>

                            <SkeletonText isLoaded={!isLoading}>
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

                            <SkeletonText isLoaded={!isLoading}>
                                <Text>Clicks: {l.clicks}</Text>
                            </SkeletonText>

                            <SkeletonText isLoaded={!isLoading}>
                                <Text>
                                    Created at:{" "}
                                    {new Date(l.timestamp).toLocaleString()}
                                </Text>
                            </SkeletonText>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Loader h={["69vh", null, "80vh"]} />
            )}

            <Portal containerRef={navRef}>
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
