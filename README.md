# Avaya Infinity™ Omni SDK - Web

> **:warning: Disclaimer**
>
> Installing, downloading, copying or using this SDK is subject to terms and conditions available in the LICENSE.

## Prerequisites

Before you start integrating your web application with the Avaya Infinity™ Omni SDK, you need to make sure that you have the `integrationId` (also know as the web chat ID). The Avaya Infinity™ account administrator should be able to provide you with this detail.

Your backend application server additionally needs changes to be able to acquire JWT tokens for your web application. Refer to [this guide](./guides/overview.md#provisioning-an-integration) for a detailed description about this.

## Getting Started

The Avaya Infinity™ Web Omni SDK consist of three modules:

- [Omni SDK Core](./core.md)
- [Omni SDK Messaging](./messaging.md)
- [Omni SDK Messaging UI](./messaging-ui.md)

Start with the [Omni SDK Core](./core.md) module to initialize the SDK and establish a session with Avaya Infinity™. The easiest and fastest way to enable your application with Omni SDK Messaging capabilities is to use the built-in [Omni SDK Messaging UI](./messaging-ui.md). In case your application needs to handle messaging events or you want to create your own Messaging UI, use the [Omni SDK Messaging](./messaging.md) module.

## License

View [LICENSE](https://support.avaya.com/css/public/documents/101038288)

## Changelog

View [CHANGELOG.md](./CHANGELOG.md)
