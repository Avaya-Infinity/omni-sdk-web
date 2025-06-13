# Omni SDK Messaging UI

Avaya Infinity™ Omni SDK Messaging UI provides a highly customizable user interface as a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for messaging that can be easily integrated into the Client website to enable messaging capabilities.

The Omni SDK Messaging UI is build on top of [Omni SDK Core](./core.md) and [Omni SDK Messaging](./messaging.md) SDKs. Before using the Avaya Infinity™ Omni SDK Messaging UI, please refer to [this page](https://developers.avayacloud.com/avaya-experience-platform/docs/omni-sdk-introduction#next-steps) for a list of prerequisites.

## Features

- **Create and End Conversations:** Allows users to create new conversations and end existing ones.
- **Show messages with status:** Shows the messages from various sources such as agents, supervisors, and bots with time and status indicators, including real-time updates for messages being sent, successfully delivered to Avaya Infinity™ platform, or requiring a retry due to failure.
- **Message Organization:** Organizes messages based on the date, providing users with a structured and easily navigable conversation timeline for a seamless and enjoyable messaging experience.
- **Message History:** Retrieve and display historical messages in a conversation, enabling users to reference messages from previous interactions for context and continuity.
- **Infinite Scrolling:** Improve user experience by automatically fetching older messages as users scroll to the top, ensuring a seamless and uninterrupted conversation exploration.
- **Message Retry:** Facilitate communication resilience by allowing users to retry sending messages that may have failed in previous attempts.
- **Attachments:** Enhances communication capabilities by enabling users to send attachments, either independently or with accompanying text messages, fostering a richer and more interactive messaging experience.
- **Rich Media:** Supports quick reply rich media messages allowing dynamic and engaging content within the messaging interface.
- **Rich Text:** Supports markdown formatted rich text messages, enabling users to send and receive messages with enhanced formatting options for enriched expression.
- **Typing indicators:** Provides real-time typing indicators to show when the participants in a Conversation are typing, enhancing the conversational experience by providing immediate feedback on the other party's engagement.
- **Print and Download Transcript:** Allows users to print or download the conversation transcript, once the conversation is closed, providing a convenient way to save and share important interactions for future reference.
- **Customizability**: Provides customizations options for developers to tweak the messaging interface to meet the specific visual requirements of their brand.

## Installation

To install the Avaya Infinity™ Omni SDK Messaging UI, run the following command:

```bash
npm install --save @avaya/infinity-omni-sdk-messaging-ui
```

The Avaya Infinity™ Omni SDK Messaging UI depends on the Omni SDK Core SDK and Omni SDK Messaging SDK, which are bundled with the Avaya Infinity™ Omni SDK Messaging UI.

## Usage

The Avaya Infinity™ Omni SDK Messaging UI exports a Web Component `<avaya-infinity-omni-sdk-messaging-ui>` that should be used in your HTML code. The Messaging UI exports the class responsible for the Web Component as `AvayaInfinityOmniSdkMessagingUi`. To render the Messaging UI on the screen, you need to explicitly [load](#load-messaging-ui) it by passing the required [configuration](#configuration). Once loaded, the Messaging UI instance can be [initialized](#initialization) to start the web chat.

**Example:**

Your website's main HTML file: `index.html`

```html
<!-- Your index.html -->
<!doctype html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Messaging-App-UI</title>
        <script src="/path/to/your-website-script.js"></script>
    </head>
    <body>
        <avaya-infinity-omni-sdk-messaging-ui></avaya-infinity-omni-sdk-messaging-ui>
    </body>
</html>
```

### Configuration

As stated above the Avaya Infinity™ Omni SDK Messaging UI requires some configurations to be set before it can be rendered. This should be done by creating a config object of type `MessagingUiConfig` and use it to load the Messaging UI.

**Example:**

```js
 const messagingUiConfig = {
    host: "<Avaya Infinity Hostname>",
    integrationId: "<Web Chat Integration Id>",
    // Other optional configurations are omitted for brevity.
    // Please refer to 'MessagingUiConfig' type for more details.
 };
```

#### Configuration options

The Avaya Infinity™ Omni SDK Messaging UI supports following configuration options:

| Option                             | Type                                         | Required/Optional | Description                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | -------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `host`                             | `string`                                     | Required          | Hostname of the Avaya Infinity™ platform.                                                                                                                                                                                                             |
| `integrationId`                    | `string`                                     | Required          | The Web Chat Integration Id available to your account administrator when the Web Chat Integration was created.                                                                                                                                                                                              |
| `sessionParameters`                | `object`                                     | Optional          | The session parameters to be passed to the Avaya Infinity™ platform.                                                                                                                                                                                                                                                        |
| `logLevel`                         | `LogLevel`                                   | Optional          | The log level for the Messaging UI. Default is `WARN`.                                                                                                                                                                                                                                           |
| `idleTimeoutDuration`              | `number`                                     | Optional          | The duration in milliseconds after which the user is considered idle.                                                                                                                                                                                                                                         |
| `idleShutdownGraceTimeoutDuration` | `number`                                     | Optional          | The maximum time in milliseconds a user can still remain inactive after the idle timeout, before which the Messaging UI automatically shuts down.                                                                                                                                                                                   |
| `locale`                           | `string`                                     | Optional          | The locale to be used for the Messaging UI. Default is `en-US`.                                                                                                                                                                                                                                  |
| `onMessageBubbleClicked`           | `function`                                   | Optional          | The callback function to be called when the message bubble is clicked.                                                                                                                                                                                                                                        |
| `onInit`                           | `function`                                   | Optional          | The callback function to be called when the Messaging UI is initialized for the current User (identified by the JWT).                                                                                                                                                                            |
| `onShutdown`                       | `function`                                   | Optional          | The callback function to be called when the current session for the current User is closed.                                                                                                                                                                                                                   |
| `onIdleTimeout`                    | `function`                                   | Optional          | The callback function to be called when the current User is considered idle.                                                                                                                                                                                                                                  |
| `beforeMessageSend`                | `function`                                   | Optional          | The callback function to be called before a message is sent.                                                                                                                                                                                                                                                  |
| `beforeMessageRender`              | `function`                                   | Optional          | The callback function to be called before a message is rendered on the screen.                                                                                                                                                                                                                                |
| `displayStrings`                   | `DisplayStrings`                             | Optional          | An object containing the display strings and their translations to be used in the Messaging UI. See [custom display strings and translations](#custom-display-strings-and-translations) section.                                                                                                 |
| `emojiMartTranslations`            | `Record<Locale,EmojiMartTranslation>`        | Optional          | Messaging UI uses [Emoji Mart](https://github.com/missive/emoji-mart) Component as emoji picker. This configuration expects an object containing the display strings and their translations to be used for the emoji mart component.                                                             |
| `themeCustomizations`              | `Record<string, MessagingUiTheme>` | Optional          | An object containing the theme customizations for the Messaging UI. Each key is a theme name and the value is the customizations for that theme. See [theme customization](#theme-customization) section.                                                                                        |
| `initialTheme`                     | `string`                                     | Optional          | Name of the initial theme to be applied out of the themes provided via the `themeCustomizations` configuration for the Messaging UI.                                                                                                                                                                |

### Load Messaging UI

The Messaging UI should be loaded by calling the static load method on the class `AvayaInfinityOmniSdkMessagingUi`. This method takes the configuration object of type `MessagingUiConfig` as an argument along with a JWT (see [Authentication](#authentication) section for more details). It returns a `Promise` which resolves when the Messaging UI is loaded successfully.

> [!NOTE]
> The Messaging UI can only be loaded once per page.

```js
import { AvayaInfinityOmniSdkMessagingUi } from '@avaya/infinity-omni-sdk-messaging-ui';

// Your code ...

async function loadMessagingUi() {
    // Create the configuration object for the Messaging UI.
    const messagingUiConfig = {
        host: "<Avaya Infinity Hostname>",
        integrationId: "<Web Chat Integration Id>",
        // Other optional configurations are omitted for brevity.
        // Please refer to 'MessagingUiConfig' type for more details.
    };

    // Fetch the JWT from your backend web application.
    const token = await myBackendServer.fetchToken(); 

    // Load the Messaging UI with the configuration and JWT.
    await AvayaInfinityOmniSdkMessagingUi.load(messagingUiConfig, token);
}

// Call the loadMessagingUi function when the window is loaded.
window.onload = () => {
    // Load the Messaging UI when the window is loaded.
    loadMessagingUi()
};
```

### Authentication

The Messaging UI doesn't authenticate the User. It expects the User to be authenticated by your website and its backend web application. The Messaging UI uses JSON Web Tokens (JWT) and requires a valid JWT to function. The JWT is obtained from your own backend web application that communicates with Avaya Infinity™ platform's authentication API.

The Messaging UI expects an implementation of the `JwtProvider` interface to be provided during [initialization](#initialization). The `JwtProvider` implementation must have two methods:

1. `onExpiryWarning`: This method will be invoked to notify that the JWT is about to expire. It provides the remaining time before expiration. Your implementation should ideally use this time to fetch a new JWT and set it in the Messaging UI to maintain a seamless user experience.
2. `onExpiry`: This method will be invoked to notify that the JWT has expired and the services provided by Messaging UI have been disrupted. When invoked, fetch a new JWT and immediately set it in Messaging UI to resume its services.

**Your client should call the `setJwt()` on the instance of `AvayaInfinityOmniSdkMessagingUi` to provide a new JWT to the Messaging UI.**

JWT Provider example (in TypeScript):

```typescript
import { JwtProvider } from "@avaya/infinity-omni-sdk-messaging-ui";

class MyJwtProvider implements JwtProvider {
    onExpiryWarning(timeToExpiry: number): void {
        // Fetch the JWT from your backend web application.
        const token = await myBackendServer.fetchToken();
        // Set the new JWT in the Messaging UI.
        AvayaInfinityOmniSdkMessagingUi.getInstance().setJwt(token);
    }

    onExpiry(): void {
        // Fetch the JWT from your backend web application.
        const token = await myBackendServer.fetchToken();
        // Set the new JWT in the Messaging UI.
        AvayaInfinityOmniSdkMessagingUi.getInstance().setJwt(token);
    }
}
```

JWT Provider example (in JavaScript):

```js
class MyJwtProviderJS {
  onExpiryWarning(timeToExpiry) {
        // Fetch the JWT from your backend web application.
        const token = await myBackendServer.fetchToken();
        // Set the new JWT in the Messaging UI.
        AvayaInfinityOmniSdkMessagingUi.getInstance().setJwt(token);
  }

  onExpiry() {
        // Fetch the JWT from your backend web application.
        const token = await myBackendServer.fetchToken();
        // Set the new JWT in the Messaging UI.
        AvayaInfinityOmniSdkMessagingUi.getInstance().setJwt(token);
  }
}
```

### Initialization

Before the User can start sending messages, the Messaging UI must be initialized. The initialization process creates a new session for the current user (identified by the JWT) post which the user can start sending messages. The initialization can be done by calling the `init` method on the instance of the `<avaya-infinity-omni-sdk-messaging-ui>` Web Component.

It can be imported as follows:

```ts
import { AvayaInfinityOmniSdkMessagingUi } from "@avaya/infinity-omni-sdk-messaging-ui";
```

Once imported, the instance can be procured by using the static method `getInstance()` on the class `AvayaInfinityOmniSdkMessagingUi`. The `init` method can then be called on the returned instance object to initialize the Avaya Infinity™ Omni SDK Messaging UI.

> [!WARNING]
> Currently Messaging UI supports a single instance, using multiple instances of the `<avaya-infinity-omni-sdk-messaging-ui>` can lead to unpredictable behavior.

**Example:**

```js
const avayaInfinityOmniSdkMessagingUi = AvayaInfinityOmniSdkMessagingUi.getInstance();

// Arguments excluded in this example for brevity.
avayaInfinityOmniSdkMessagingUi.init(...);
```

The `init()` method takes an object of type `MessagingUiInitParams` containing the following properties:

- `jwtProvider`: An implementation of the `JwtProvider` interface. See [Authentication](#authentication) section.
- `userName` (optional): The name of the current User to be displayed in the Messaging UI.
- `jwt`: The JWT for the current User.
- `contextParameters` (optional): The context parameters to be passed to the Avaya Infinity™ platform for routing.
- `sessionParameters` (optional): The session parameters to be passed to the Avaya Infinity™ platform.

The `init()` method returns a `Promise` which resolves when the Messaging UI is initialized successfully.

Full example:

```ts
import { AvayaInfinityOmniSdkMessagingUi } from '@avaya/infinity-omni-sdk-messaging-ui';

const avayaInfinityOmniSdkMessagingUi = AvayaInfinityOmniSdkMessagingUi.getInstance();

const messagingUiInitParameters = {
    jwtProvider: new MyJwtProvider();
    jwt: '<User JWT>',
    displayName: 'John Doe',
    contextParameters: {
      'key1': 'value1',
      'key2': 'value2',
      // ...
    }
}

// Arguments excluded in this example for brevity.
await avayaInfinityOmniSdkMessagingUi.init(messagingUiInitParameters);
```

#### Waiting for initialization

As shown in above example the `init()` method returns a `Promise` which resolves when the Messaging UI is initialized successfully, developers can `await` on this promise.

Alternatively, developers can also listen to the `onInit` callback provided during [configuration](#configuration) to know when the Messaging UI is initialized successfully. The `onInitialized()` callback is called when the Messaging UI is initialized successfully. The instance on which the initialization occurred is passed as an argument to the callback.

#### When to initialize

Since the initialization process creates a new session for the User, it should be done whenever the User changes. See [shutdown](#shutting-down) section to know how to end the previous User's session when the current User changes.

Since, the Messaging UI doesn't authenticate the User, it gives the flexibility to your client website to decide when to initialize the Messaging UI. The initialization can be done when the User logs in or whenever the User clicks on the messaging bubble, or any other flow that suits your website.

To know when a User has clicked on the messaging bubble, the Messaging UI provides a callback `onMessageBubbleClicked` which is called when the User clicks on the messaging bubble. This callback must be provided during [configuration](#configuration).

The `onMessageBubbleClicked` callback automatically receives the instance of the `<avaya-infinity-omni-sdk-messaging-ui>` Web Component on which the User had clicked. This instance can be used to call the `init` method to initialize the Messaging UI.

### Shutting down

Whenever the User changes or the User logs out, the Messaging UI should be shut down to end the current User's session. Post that the Messaging UI can be re-[initialized](#initialization) for the new User.

To shutdown, the Messaging UI provides a `shutdown()` method on the instance of the `<avaya-infinity-omni-sdk-messaging-ui>` Web Component. The `shutdown()` method returns a `Promise` which resolves when the Messaging UI is shut down successfully.

**Example:**

```ts
import { AvayaInfinityOmniSdkMessagingUi } from "@avaya/infinity-omni-sdk-messaging-ui";

const avayaInfinityOmniSdkMessagingUi = AvayaInfinityOmniSdkMessagingUi.getInstance();

await avayaInfinityOmniSdkMessagingUi.shutdown();
```

Alternatively, you can also listen to the shutdown event by providing the `onShutdown()` callback during [configuration](#configuration). The `onShutdown()` callback is called when the SDK is shut down. The instance on which the shutdown event occurred is passed as an argument to the callback.

### User Activity

The Messaging UI internally has two timers to track the User's inactivity.

The first timer is the idle timer which is started right after the session is created. This timer expires when there are no activities for the configured duration. Once this timer expires the Messaging UI will emit the Idle Timeout Invoked event and provide the configured grace period duration in the event's payload. The Client can show an appropriate message on the UI, warning the User about inactivity, by handling this event. Any activity from the User like sending a message etc will reset this timer.

The second timer is idle shutdown grace timer which runs after the idle timer has expired. This timer provides additional grace period for User or the Client to extend the session. After this timer expires, the session is terminated automatically and the Messaging UI will raise the shutdown event and shut itself down (see [shutdown](#shutting-down) section for more details). If the Client wants to continue it must be reinitialize the SDK to do so.

Both the timeout values can be [configured](#configuration).

Developers can listen to the Idle Timeout Invoked event by providing the `onIdleTimeout()` callback during [configuration](#configuration). Alternatively, developers can also add listener for the Idle Timeout Invoked event by calling the static method `addIdleTimeOutInvokedListener()` on the class `AvayaInfinityOmniSdkMessagingUi`. Regardless of which approach is used, the callback will be called when the User is considered idle. And the instance on which the event occurred is passed as an argument to the callback.

#### Extending the session

The Messaging UI provides a static method `resetIdleTimeout()` on the class `AvayaInfinityOmniSdkMessagingUi` to reset the idle timer. This method helps the Client Website to extend the session in scenarios where the Client Website is aware that the User is active based on events from its UI.

### Custom display strings and translations

The Messaging UI provides an option to customize the display strings used in the UI. This can be done by providing the `displayStrings` configuration during [initialization](#configuration).

Check out the [`DisplayStrings`](https://github.com/Avaya-Infinity/omni-sdk-web/types/_avaya_infinity_omni_sdk_messaging_ui.DisplayStrings.html) type exported by the Messaging UI to know the strings that can be customized.

The `displayNames` property of the `DisplayStrings` can take either [`TextConfig`](https://github.com/Avaya-Infinity/omni-sdk-web/types/_avaya_infinity_omni_sdk_messaging_ui.TextConfig.html) or [`displayNameModifier`](https://github.com/Avaya-Infinity/omni-sdk-web/types/_avaya_infinity_omni_sdk_messaging_ui.DisplayNameModifier.html) callback function as a value for each of the participants. This function provides participant name as the parameter and expects a string in return.

The locale of the messaging UI can be changed by calling the static method `setLocale()` on the class `AvayaInfinityOmniSdkMessagingUi`, which takes the locale string as an argument.

Note: The custom display name to use for anonymous user can be provided through the `userDetails`.

### Theme Customization

There are two ways to customize the look and feel of the Messaging UI.

#### Theme defined from Admin Console

Your account administrator can change the look and feel of the Messaging UI from Avaya Infinity™ Admin Console. When the Messaging UI is loaded, it will automatically fetch the theme defined in the Admin Console for the Web Chat Integration and uses it the default theme.

This option allows the account administrator to change the theme without requiring any changes to the client application code. However, the customization are limited to only to basic color options. To achieve more advanced customizations, you can use the [client side custom themes](#custom-themes-through-client-side-configuration).

> [!NOTE]
> Any changes made to the theme in the Admin Console will be reflected in the Messaging UI when the page is refreshed and the Messaging UI is loaded again.

#### Custom themes through client side configuration

The Messaging UI provides an extensive set of customization options like colors, fonts, icons etc. Developers can create multiple themes and pass them to the Messaging UI in the `themeCustomizations` in the [configuration](#configuration).

Themes can be changed at runtime by calling the static method `applyTheme()` on the class `AvayaInfinityOmniSdkMessagingUi` and passing the name of the desired theme.

You can switch back to the default theme by calling the static method `applyDefaultTheme()` on the class `AvayaInfinityOmniSdkMessagingUi`.

The [`MessagingUiTheme`](https://github.com/Avaya-Infinity/omni-sdk-web/types/_avaya_infinity_omni_sdk_messaging_ui.MessagingUiTheme.html) type exported by the Messaging UI provides the structure of the theme object and all available options that can be changed. The options are organized by the various areas in the UI.

> [!NOTE]
> Browsers on iOS devices may auto zoom on the input fields if their fontSize is less than `16px`. To avoid this behavior, the `fontSize` of the `textInput` field in the theme configuration should be set to `16px` or more.

#### Typing indicator customization

Messaging UI's typing indicator is composed of three parts namely the participant avatar(s), typing text and animation. They are displayed in the same order. The following customizations are available under the `typingIndicators` section of the `MessagingUiTheme` -

1. Participant avatar(s): The participant avatars can be hidden by setting the `show` property of `participantAvatars` to `false`.

2. Typing text: By default, the typing text will contain names of the participants who are typing. The participant names can be excluded from the typing text by setting the `show` property of `participantNames` to `false` in the `typingText` subsection.

3. Animation: The color of the typing indicator animation can be customized by setting the `indicatorColor` property of `animation`.

### Other utilities and methods

In this section we will cover the various utilities and methods provided by the Messaging UI apart from the ones already discussed in the previous sections.

#### Instance Properties

The Messaging UI provides the following properties on `AvayaInfinityOmniSdkMessagingUi` class instance:

- `loaded`: A boolean value indicating whether the Messaging UI is loaded or not. This is available on the instance of the `AvayaInfinityOmniSdkMessagingUi` class.

- `initialized`: A boolean value indicating whether the Messaging UI is initialized or not. This is available on the instance of the `AvayaInfinityOmniSdkMessagingUi` class.

#### Static Properties

The Messaging UI provides the following static properties on `AvayaInfinityOmniSdkMessagingUi` class:

- `currentThemeName`: The name of the current theme being used by the Messaging UI. This is available as a static property of the `AvayaInfinityOmniSdkMessagingUi` class.

#### Instance Methods

The Messaging UI provides the following methods on `AvayaInfinityOmniSdkMessagingUi` class instance:

- `minimize()`: Minimizes the Messaging UI to the messaging bubble. This is available as a static method of the `AvayaInfinityOmniSdkMessagingUi` class.
- `maximize()`: Maximizes the Messaging UI from the messaging bubble. This is available as a static method of the `AvayaInfinityOmniSdkMessagingUi` class. This method can be called only when the Messaging UI has been initialized.

#### Static Methods

The Messaging UI provides the following static methods on `AvayaInfinityOmniSdkMessagingUi` class:

- `setLogLevel()` : Sets the log level for the Messaging UI.
- `setShutdownListener()`: Sets the event handler callback that needs to be invoked when the Messaging UI is shutdown. This method will override the event handler callback that was provided in the configuration object passed to the `AvayaInfinityOmniSdkMessagingUi.load()` method.
- `setIdleTimeOutInvokedListener()`: Sets the event handler callback that needs to be invoked when the idle timeout is reached. This method will override the event handler callback that was provided in the configuration object passed to the `AvayaInfinityOmniSdkMessagingUi.load()` method.
- `setInitializedListener()`: Sets the event handler callback that needs to be invoked when the Messaging UI is initialized. This method will override the event handler callback that was provided in the configuration object passed to the `AvayaInfinityOmniSdkMessagingUi.load()` method.
- `clearShutdownListener()`: Clears the event handler callback that was attached to the Messaging UI shutdown event. This method will remove the event handler callback that was previously configured.
- `clearIdleTimeOutInvokedListener()`: Clears the event handler callback that was attached to the Messaging UI idle timeout event. This method will remove the event handler callback that was previously configured.
- `clearInitializedListener()`: Clears the event handler callback that was attached to the Messaging UI initialization event. This method will remove the event handler callback that was previously configured.
