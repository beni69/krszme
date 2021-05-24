import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    CloseButton,
    Flex,
    Heading,
    Link,
    SimpleGrid,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import Card from "../components/card";
import { deleteLink, getLinks } from "../lib/api";
import auth, { withAuth } from "../lib/auth";

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

const Dashboard = ({ user }) => {
    const [links, setLinks] = useState([] as url[]);
    const [ddOpen, setDdOpen] = useState(false);
    const cancelRef = useRef();
    const [L2D, setL2D] = useState(null as url);
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

        getLinks().then(setLinks);
    };

    auth.onAuthStateChanged(u => {
        if (u && !links.length) getLinks().then(setLinks);
    });

    return links.length ? (
        <>
            <SimpleGrid
                as="main"
                spacing={16}
                minChildWidth={["240px", "360px"]}
                m={[8, null, 16]}>
                {links.map(l => (
                    <Card key={l._id} pos="relative">
                        <CloseButton
                            pos="absolute"
                            top={0}
                            right={0}
                            m={1}
                            onClick={() => delPopup(l)}
                        />

                        <Link href={l.url} target="_blank" fontSize="md">
                            {l.url}
                        </Link>

                        <Text>
                            Destination:{" "}
                            <Link href={l.dest} target="blank">
                                {l.dest}
                            </Link>
                        </Text>

                        <Text>Clicks: {l.clicks}</Text>

                        <Text>
                            Created at: {new Date(l.timestamp).toLocaleString()}
                        </Text>
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
    ) : (
        <Flex
            align="center"
            justify="space-evenly"
            m={48}
            direction={{ base: "column", md: "row" }}>
            <Heading align="center">no links</Heading>
        </Flex>
    );
};

Dashboard.pageName = "Dashboard";

export default withAuth(Dashboard);
