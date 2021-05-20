import { Flex, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import Card from "../components/card";
import { getLinks } from "../lib/api";
import auth, { withAuth } from "../lib/auth";

const Dashboard = ({ user }) => {
    const [links, setLinks] = useState([]);

    auth.onAuthStateChanged(u => {
        if (u && !links.length) getLinks().then(setLinks);
    });

    return links.length ? (
        <SimpleGrid
            as="main"
            spacing={16}
            minChildWidth={["240px", "360px"]}
            m={[8, null, 16]}>
            {links.map(l => (
                <Card key={l._id}>
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
