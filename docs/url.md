# /url

## Contents:

-   [Overview](README.md)
-   [Url](url.md)
-   [User](user.md)
-   [Api error codes](apierror.md)

## Type

A url consists of these fields:

| Field     | Type            | Description                                             |
| --------- | --------------- | ------------------------------------------------------- |
| \_id      | string          | The unique id of the url (also referred to as the code) |
| dest      | string          | The destination (aka the long url)                      |
| url       | string          | the short url (https://krsz.me/[code])                  |
| clicks    | int             | The number of clicks a link has                         |
| userID    | string          | The firebase UID of the creator (or `null`)             |
| timestamp | ISO date string | UTC time of creation                                    |

## **GET** /url/me

**`PROTECTED`**

Returns all of the urls owned by a user

## **POST** /url/create

Create a new url

### Body:

| Field | Type   | Description                                  |
| ----- | ------ | -------------------------------------------- |
| dest  | string | The destination (aka the long url)           |
| code  | string | _(optional)_ A custom code (krsz.me/[code]). |

## **GET** /url/:code

Get data on a url

If you are authenticated as the owner of the link, the whole link object is
returned, otherwise you just get the `_id`, `url`, `dest`.

## **DELETE** /url/:code

**`PROTECTED`**

Deletes a url and returns it
