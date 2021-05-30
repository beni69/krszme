import { getToken, getUser } from "./auth";

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

    sessionStorage.removeItem("links");

    return res;
}

export async function getLinks(force = false): Promise<url[]> {
    if (!getUser()) return [];

    // 1 min
    const DELAY = 60000;

    let links = window && JSON.parse(sessionStorage.getItem("links"));
    if (
        force !== true &&
        links &&
        links.uid === getUser().uid &&
        links.time + DELAY > Date.now()
    ) {
        return links.l;
    }

    const res = await fetch(`${API}/api/url/me`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            token: await getToken(),
        },
    });

    const data = await res.json();
    console.debug({ data });

    links = JSON.stringify({ uid: getUser().uid, l: data, time: Date.now() });
    window && sessionStorage.setItem("links", links);

    return data;
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
