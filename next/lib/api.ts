import { getToken } from "./auth";

const API = "https://krsz.me";

export async function newLink(data: { url: string; code?: string }) {
    const res = fetch(`${API}/api/url/create`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            token: await getToken(),
        },
        body: JSON.stringify(data),
    });

    return res;
}

export async function getLinks() {
    const res = await fetch(`${API}/api/url/me`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            token: await getToken(),
        },
    });

    const data = await res.json();
    console.debug({ data });

    return data;
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
