# Custom API Error Codes

## Contents:

-   [Overview](README.md)
-   [Url](url.md)
-   [User](user.md)
-   [Api error codes](apierror.md)

| Code  | Message                      | More info                                                                                         |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| 10000 | Invalid or missing jwt token | This route requires authentication, but it failed                                                 |
| 10001 | Destination invalid          | Link destionation is not a valid url                                                              |
| 10002 | Code invalid                 | The custom code must contain between 3 and 32 characters, that can be letters, numbers and a dot. |
| 10003 | Code in use                  |                                                                                                   |
| 10004 | Code is reserved             | There are some reserved words that the custom code isn't allowed to contain.                      |
