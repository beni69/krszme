import { getUser } from "./auth";

const API = "https://krsz.me";

export async function newLink(data: { url: string; code?: string }) {
    const body = {
        ...data,
        token: await getUser()
            ?.getIdToken()
            .catch(() => undefined),
    };

    const res = fetch(`${API}/api/url/create`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return res;
}

export async function getLinks() {
    const res = await fetch(`${API}/api/url/me`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ token: await getUser().getIdToken() }),
    });
    const data = await res.json();
    console.debug({ data });

    return data;
}

export async function testAPI() {
    const body = { token: await getUser().getIdToken() };

    const res = await fetch(`${API}/test`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    console.info({ data });
    return data;
}
