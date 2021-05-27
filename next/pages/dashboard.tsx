import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    CloseButton,
    SimpleGrid,
    SkeletonText,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import Card from "../components/card";
import withTitle from "../components/HOC/withTitle";
import Link from "../components/link";
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

const array = (n: number, item?: any) => {
    const arr = [];

    for (let i = 0; i < n; i++) {
        arr.push(item);
    }

    return arr;
};

const Dashboard = () => {
    const user = useContext(AuthContext);
    const [links, setLinks] = useState<url[]>(
        array(6, {
            _id: "example",
            clicks: 69,
            dest: "https://example.com",
            timestamp: new Date(),
            url: "https://example.com",
            userID: "12345678901234567890",
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

    const load = () =>
        getLinks().then(l => {
            setLinks(l);
            console.log({ links, l });

            setTimeout(() => setLoading(false), 300);
        });

    const del = async () => {
        const [res, data] = await deleteLink(L2D);

        if (!res.ok || data.error)
            return toast({
                status: "error",
                title: "Error",
                description: "An unknown error occured.",
            });

        toast({
            status: "success",
            title: "Success",
            description: "Link deleted.",
        });

        load();
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
                        <CloseButton
                            pos="absolute"
                            top={0}
                            right={0}
                            m={1}
                            onClick={() => delPopup(l)}
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
        </>
    );
};

export default withAuth(withTitle(Dashboard, "Dashboard"));
