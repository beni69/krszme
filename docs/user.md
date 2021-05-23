# /user

Since users and auth is just handled by firebase, a User is the same concept as
in firebase.

## Contents:

-   [Overview](README.md)
-   [Url](url.md)
-   [User](user.md)
-   [Api error codes](apierror.md)

## **GET** /user/me

**`PROTECTED`**

Returns data on the authenticated user

View the data model
[here](https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken)

## **GET** /user/:uid

Returns a lot less data about the user, but it is publicly available.

### Returns

| Field       | Type     | Description                                                                  |
| ----------- | -------- | ---------------------------------------------------------------------------- |
| uid         | string   |
| displayName | string   |
| photoURL    | string   |
| disabled    | boolean  | Whether the user account is disabled (eg. banned)                            |
| providers   | string[] | An array of names of firebase sign-in providers (google.com, password, etc.) |

This data comes from the same source as the one at _`GET /user/me`_ so check out
the link above for more info on the fields.
