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
import {
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { GoSync } from "react-icons/go";
import { ImQrcode } from "react-icons/im";
import Card from "../components/card";
import withTitle from "../components/HOC/withTitle";
import Link from "../components/link";
import analytics from "../lib/analytics";
import { deleteLink, getLinks } from "../lib/api";
import { AuthContext, withAuth } from "../lib/auth";

const DeleteAlert = ({ isOpen, leastDestructiveRef, onClose, onOk }) => (
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={leastDestructiveRef}
        onClose={onClose}>
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader>Delete link</AlertDialogHeader>

                <AlertDialogBody>
                    Are you sure you want to delete this link? People won't be
                    redirected to your site anymore, and if you had a custom
                    code, it can now be taken by anyone.
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={leastDestructiveRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onOk} colorScheme="red" ml={3}>
                        Let's do it
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
);

const LinkMenu = (
    props: BoxProps & { link: url; onDel: (link: url) => void }
) => {
    const { link, onDel, ...rest } = props;

    const { hasCopied, onCopy } = useClipboard(link.url);
    const toast = useToast({
        status: "success",
        title: "Copied to clipboard",
        variant: "left-accent",
        position: "bottom",
        isClosable: true,
    });
    if (hasCopied) toast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box {...rest}>
                <Menu>
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
                        <MenuItem icon={<ImQrcode />} onClick={onOpen}>
                            Show QR code
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => onDel(link)}>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
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
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const array = (n: number, item?: any) => {
    const arr = [];

    for (let i = 0; i < n; i++) {
        arr.push(item);
    }

    return arr;
};

const Dashboard = ({ navRef }: { navRef: MutableRefObject<any> }) => {
    const user = useContext(AuthContext);
    const [links, setLinks] = useState<url[]>(
        array(6, {
            _id: "example",
            clicks: 69,
            dest: "https://example.com",
            timestamp: new Date(),
            url: "https://example.com",
            userID: "12345678901234567890",
            dummy: true,
        } as url)
    );
    const [loading, setLoading] = useState(true);
    // stuff below is needed for deleting links
    const [ddOpen, setDdOpen] = useState(false);
    const cancelRef = useRef();
    const [L2D, setL2D] = useState<url>(null);

    const toast = useToast({
        variant: "solid",
        position: "bottom",
        isClosable: true,
    });

    const delPopup = (link: url) => {
        setDdOpen(true);
        setL2D(link);
    };

    const del = async () => {
        setDdOpen(false);

        const [res, data] = await deleteLink(L2D);

        if (!res.ok || data.error) {
            if (data.code === 429)
                toast({
                    status: "error",
                    title: "You are deleting links too fast",
                    description: "Please wait a bit before trying again.",
                });
            else
                toast({
                    status: "error",
                    title: "Error",
                    description: "An unknown error occured.",
                });
            return;
        }

        toast({
            status: "success",
            title: "Success",
            description: "Link deleted.",
        });

        analytics().logEvent("delete_link");

        load(true);
    };

    const load = async (force = false) => {
        setLoading(true);

        const l = await getLinks(force);

        if ((l as ApiError).error) {
            if (!(links[0] as any).dummy) setLoading(false);

            toast({
                status: "warning",
                title: "You are refreshing too fast",
                description:
                    "I know watching the clicks coming in is fun but you need to chill out.",
            });
            return;
        }
        setLinks(l as url[]);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, [user]);

    return (
        <>
            <SimpleGrid
                as="main"
                spacing={16}
                minChildWidth={["240px", "360px"]}
                m={[8, null, 16]}>
                {links.map(l => (
                    <Card pos="relative">
                        <LinkMenu
                            link={l}
                            onDel={delPopup}
                            pos="absolute"
                            top={1}
                            right={1}
                            // m={2}
                        />

                        <SkeletonText isLoaded={!loading}>
                            <Link
                                href={l.url}
                                isExternal
                                variant="cool"
                                fontSize="lg">
                                {l.url}
                            </Link>
                        </SkeletonText>

                        <SkeletonText isLoaded={!loading}>
                            <Text>
                                Destination:{" "}
                                <Link href={l.dest} isExternal variant="cool">
                                    {l.dest}
                                </Link>
                            </Text>
                        </SkeletonText>

                        <SkeletonText isLoaded={!loading}>
                            <Text>Clicks: {l.clicks}</Text>
                        </SkeletonText>

                        <SkeletonText isLoaded={!loading}>
                            <Text>
                                Created at:{" "}
                                {new Date(l.timestamp).toLocaleString()}
                            </Text>
                        </SkeletonText>
                    </Card>
                ))}
            </SimpleGrid>

            <DeleteAlert
                isOpen={ddOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setDdOpen(false)}
                onOk={del}
            />

            <Portal containerRef={navRef}>
                <IconButton
                    aria-label="refresh"
                    size="sm"
                    icon={
                        loading ? (
                            <Spinner size="sm" />
                        ) : (
                            <GoSync size="1.125rem" />
                        )
                    }
                    mr={2}
                    onClick={() => load(true)}
                />
            </Portal>
        </>
    );
};

export default withAuth(withTitle(Dashboard, "Dashboard"));
