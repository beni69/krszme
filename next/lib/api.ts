import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import useSWR from "swr";
import { getToken } from "./auth";

const API = "https://krsz.me";

const fetcher = async (url: string, user: string) => {
    const token = await getToken();
    const res = await fetch(API + url, {
        headers: {
            "content-type": "application/json",
            token,
        },
    });
    const data = await res.json();
    return data;
};

export const useLinks = () => {
    const toast = useToast({
        variant: "subtle",
        position: "top",
        isClosable: true,
        duration: null,
        onCloseComplete: () => setTimeout(() => setSlowToastOpen(false), 5000),
    });

    const { data, error, mutate } = useSWR<url[]>("/api/url/me", fetcher, {
        refreshInterval: 15000, // refresh every 15sec
        onSuccess: () => setLoading(false),
        onLoadingSlow: () => {
            if (slowToastOpen) return;
            toast({
                status: "info",
                title: "Taking too long?",
                description:
                    "Our server could be down. Or your internet is just bad. I have no idea",
            });
            setSlowToastOpen(true);
        },
    });
    const [slowToastOpen, setSlowToastOpen] = useState(false);
    const [loading, setLoading] = useState(!error && !data);

    return {
        links: data,
        isLoading: loading,
        forceReload: () => {
            setLoading(true);
            mutate();
        },
    };
};

export async function newLink(data: { url: string; code?: string }) {
    const res = fetch(`${API}/api/url/create`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            token: await getToken(),
        },
        body: JSON.stringify(data),
    });

    sessionStorage.removeItem("links");

    return res;
}

export async function deleteLink(link: url | string): Promise<[Response, any]> {
    if (!link) return;

    const code = typeof link === "string" ? link : link._id;

    const res = await fetch(`${API}/api/url/${code}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            token: await getToken(),
        },
    });

    const data = await res.json();

    console.debug({ data });

    return [res, data];
}

export async function testAPI() {
    const res = await fetch(`${API}/test`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            token: await getToken(),
        },
    });

    const data = await res.json();
    console.info({ data });

    return data;
}
