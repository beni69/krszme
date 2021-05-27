import { NextFunction, Request, Response, Router } from "express";
import { customAlphabet } from "nanoid";
import { isWebUri } from "valid-url";
import ApiError from "./lib/ApiError";
import { auth, verifyUser } from "./lib/firebase";
import { url, Url } from "./lib/mongoose";

const BASE = "https://krsz.me";
const RESERVED = ["home", "app", "api", "login", "signin", "signup", "test"];
const codeRegex = /^[\w\d\.]{3,32}$/;
const codeGen = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    5
);

const router = Router();

router.get("/user/me", async (req, res, next) => {
    const token = await verifyUser(req.header("token"));
    if (!token) return next(new ApiError(10000));

    res.json(token);
});

router.get("/user/:uid", async (req, res, next) => {
    const { uid } = req.params;

    const user = await auth.getUser(uid).catch(() => null);
    console.log({ user });

    if (!user) {
        return next(new ApiError(404));
    }

    const { displayName, photoURL, disabled, providerData } = user;

    res.json({
        uid,
        displayName,
        photoURL,
        disabled,
        providers: providerData.map(d => d.providerId),
    });
});

router.get("/url/me", async (req, res, next) => {
    const token = await verifyUser(req.header("token"));
    if (!token) return next(new ApiError(10000));

    const urls: url[] = await Url.find({ userID: token.uid });

    res.json(urls);
});

router.get(
    "/url/:code",
    async (req: Request, res: Response, next: NextFunction) => {
        const token = await verifyUser(req.header("token"));
        const url: url = await Url.findById(req.params.code);

        if (!url) return next(new ApiError(404));

        const isOwner = url.userID == token?.uid;

        if (!isOwner) {
            const { _id, url: linkUrl, dest } = url;
            res.json({ _id, url: linkUrl, dest });
        } else {
            res.json(url);
        }
    }
);

router.delete("/url/:code", async (req, res, next) => {
    const token = await verifyUser(req.header("token"));
    if (!token) return next(new ApiError(10000));

    const code = req.params.code;

    const url: url = await Url.findById(code);
    if (!url) return next(new ApiError(404));
    if (token.uid !== url.userID) return next(new ApiError(10000));

    await url.remove();

    res.json(url);
});

router.post("/url/create", async (req, res, next) => {
    const token = await verifyUser(req.header("token"));

    let { dest, code } = req.body;

    // return if invalid url
    if (!isWebUri(dest)) return next(new ApiError(10001));

    // return if invalid code
    if (code && !codeRegex.test(code)) return next(new ApiError(10002));

    if (code) {
        // return if code in use
        if (await Url.exists({ _id: code })) return next(new ApiError(10003));
        // return if code is reserved
        if (RESERVED.includes(code)) return next(new ApiError(10004));
    }
    // create code
    else {
        do {
            code = codeGen();
        } while (await Url.exists({ _id: code }));
    }

    const url: url = new Url({
        _id: code,
        dest,
        url: `${BASE}/${code}`,
        userID: token?.uid || null,
    });

    await url.save();

    res.json(url);
});

export default router;
