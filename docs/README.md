# krsz.me API docs

## Contents:

-   [Overview](README.md)
-   [Url](url.md)
-   [User](user.md)
-   [Api error codes](apierror.md)

## Authentication

User auth is handled by firebase. When interacting with the API, some endpoints
are freely available to all, while others require authentication. In the docs,
these routes are markd as `protected`. The firebase JWT token can be used to
manually authenticate with the api, through http headers.

`Authorization: firebase <firebase_token>`

_The only problem is that firebase JWTs aren't persistent. They can change by
the minute making it very hard to create third party apps. I am planning on
creating a custom API Key system to fix this when I figure out how._
