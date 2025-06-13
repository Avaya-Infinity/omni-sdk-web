# API to Generate JWT for Omni SDK User

To authorize your client application to use the Omni SDK, you need to generate a JSON Web Token (JWT) for each end user (customer) of your client/frontend application. Your backend web application server must securely generate this token using the Avaya Infinity™ API described below and pass the JWT back to the client/frontend application.

> [!CAUTION]
> Do not expose the `client_id` and `client_secret` to your client/frontend applications. These credentials should only be used by your backend web application server to securely generate the JWT for the end user. Exposing these credentials to the client/frontend applications can lead to security vulnerabilities.

> [!TIP]
> A sample implementation of the backend web application server to fetch JWTs for your client applications is available [here](https://github.com/Avaya-Infinity/omni-sdk-starter-kit).

## Request

### Endpoint

```HTTP
POST https://<avaya-infinity-hostname>/auth/realms/avaya/protocol/openid-connect/token
```

### Request Headers

| Key       | Value                                  |
|-----------|----------------------------------------|
| `Content-type` | `application/x-www-form-urlencoded` |

### Request Body

| Parameter | Required | Description |
|-----------|----------|-------------|
| grant_type| Yes      | The type of grant being requested. This must be `custom_sdk_grant_type` |
| client_id | Yes      | The client Id provided to you by your Avaya Infinity™ account administrator |
| client_secret | Yes  | The client secret provided to you by your Avaya Infinity™ account administrator |
| integrationId | Yes | The unique identifier of the Web Chat Integration created for your client application. |
| customerId | Yes     | A unique identifier for the user (customer) using the application. Ensure `customerId` remains constant for the same user across different sessions. Review [this section](#choosing-the-customerid-for-generating-jwt) for more information. |
| customerName | No   | The name of the user |
| customerIdentifiers | No | A [Customer Identifiers JSON object](#customer-identifiers) containing additional identifiers (email address and phone number) of the user. These identifiers help Avaya Infinity™ build a comprehensive Customer Journey for the user. |

### Customer Identifiers

| Field | Type | Description |
|-------|------|-------------|
| emailAddresses | Array of strings | An array of email addresses associated with the user. Currently, only one email address is supported. |
| phoneNumbers | Array of strings | An array of phone numbers associated with the user. Currently, only one phone number is supported. |

### Request Example

```curl
curl --location 'https://axp-dev-playground.ixcc-sandbox.avayacloud.com/auth/realms/avaya/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=custom_sdk_grant_type' \
--data-urlencode 'client_id=ten1-client1' \
--data-urlencode 'client_secret=NJQUtiUtzNTf9DrWs6sD44Ph7TvwtGLg' \
--data-urlencode 'integrationId=018d010305a09b0c39ec40c52c' \
--data-urlencode 'customerId=jhondoe01234' \
--data-urlencode 'customerName=John Doe' \
--data-urlencode 'customerIdentifiers={ "emailAddresses": ["john@example.com"], "phoneNumbers": ["+91 20 1234 5678"] }' \
```

## Response

### Response Headers

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

### Response Body

| Parameter | Description |
|-----------|-------------|
| access_token | The JWT token that your client application must pass to Omni SDK. |
| expires_in | The number of seconds until the token expires. This is 600 seconds (10 minutes). |
| token_type | The type of token returned. This is always `Bearer`. |
| not-before-policy | The time before which the token is not valid. This is always 0, meaning the token is valid immediately. |
| refresh_expires_in | The number of seconds until the token can no longer be refreshed. This is always 0, meaning the token cannot be refreshed. |
| scope | The scopes granted to the token. This includes `organization`, `email`, and `profile` scopes. |

### Response Examples

#### `Success` | `200 OK`

```json
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJrb196ZDFTSnR2RzhxNHAtYlZYWExJMkdkZWZZNDBkSFg0NjdlZHhGeXpVIn0.eyJleHAiOjE3NDk4MDMxOTEsImlhdCI6MTc0OTgwMjU5MSwianRpIjoiMjBjMmMyNmEtZDEyNi00N2IwLWI5NTktM2UzNWM0YzUwNTdmIiwiaXNzIjoiaHR0cHM6Ly9heHAtZGV2LXBsYXlncm91bmQuaXhjYy1zYW5kYm94LmF2YXlhY2xvdWQuY29tL2F1dGgvcmVhbG1zL2F2YXlhIiwic3ViIjoiamhvbmRvZTAxMjM0NSIsInR5cCI6IkJlYXJlciIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJzZGstdXNlciJdfSwib3JnYW5pemF0aW9uIjpbIjAwMWQwMTAyMjA1NDg0OTM5OTA4OGE4MWFkIl0sImN1c3RvbWVySWQiOiJqaG9uZG9lMDEyMzQ1IiwiaW50ZWdyYXRpb25JZCI6IjAxOGQwMTAzMDVhMDliMGMzOWVjNDBjNTJjIn0.VfYmXSnxciVRRPC_qitMpMaGAvpQtb3002x-tnkVNQCvxjFP6cf8sRSlCg0dnSzJDw5ndo8v7qCvy6TB5SxpwS2Dh7f3coUEGuom4KE6KNm78cMIGL8PyOzrAvMsU91BD3ePbRUqlZdUf6Ng6pyILkvAvqtE3KE6clSm-F18GSt2KfYMu5Wxx0Bd0kvECTbv2ySV5Uov__UrN3v6GgBeX5mRTLI0-nLxgEe4NFXrz_zmD33vsnRG6MF-TVDkfGS7DeCgZ-4s3rNuhEDKvedsXkHCScvdELfACJX40GGXlyjcMr6SZnSuypIr4cDjGfgz75_zDzaTsNI4pkpPvTfyaw",
    "expires_in": 600,
    "refresh_expires_in": 0,
    "token_type": "Bearer",
    "not-before-policy": 0,
    "scope": "organization email profile"
}
```

#### `Error` | `401 Unauthorized` | Invalid Client Credentials

```json
{
    "error": "invalid_client",
    "error_description": "Invalid client or Invalid client credentials"
}
```

#### `Error` | `400 Bad Request` | Invalid Web Chat Integration Id

```json
{
    "error": "invalid_request",
    "error_description": "{\"title\":\"Resource Not Found\",\"status\":404,\"detail\":\"The integration Id does not exist. Please check the integration Id and try again.\"}\n"
}
```

#### `Error` | `400 Bad Request` | Invalid Email Address in `customerIdentifiers`

```json
{
    "error": "invalid_request",
    "error_description": "{\"title\":\"VALIDATION_FAILED\",\"status\":400,\"detail\":\"invalid email address john\"}\n"
}
```

## Choosing the 'customerId' for Generating JWT

When generating the JWT for the user, you must provide a `customerId` that uniquely identifies the user of your client application. This `customerId` is used by Avaya Infinity™ to trace the user across different sessions allowing the user to seamlessly join and resume their on-going conversation.

The type of users using your client application can be broadly classified into two categories:

- **Logged-in Users**: These users would have a unique identifier in your backend system, like a user ID or email address or phone number.
  
  - If the unique identifier is a sensitive information like the email address or the phone number, it is recomended to generate a separate identifer based on this identifier and use it as the `customerId` when generating the JWT. Ensure this identifier remains consistent for the same user across different sessions so that Avaya Infinity™ can trace the user seamlessly. For example, generating a one-way hash of the sensitive identifier will ensure that the resultant value always remains constant for the same user across different sessions for the same user.
  - If the unique identifier is not sensitive, you can use it directly as the `customerId` when generating the JWT.

- **Guest Users**: These users do not have a unique identifier in your backend system. You can generate a random identifier for them as the `customerId` when generating the JWT.

The JWT is short lived and expires after 10 minutes. Your client application must implement the `JwtProvider` interface of the Omni SDK. The 'fetchJwt()' method of this interface will be invoked by the Omni SDK 3 minutes before the token is about to expire so that your application can request your backend web application for a new token and return it back to the Omni SDK.
