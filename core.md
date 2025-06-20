# Omni SDK Core

## Overview

The Omni SDK Core module provides a set of basic functionalities to initialize, shutdown the SDK, and create and end conversation for the end user. The Omni SDK Core establishes the session with Avaya Infinity™ platform for the end user, manages the session inactivity, and participants involved in the conversation.

## Installation

To install the Omni SDK Core, run the following command:

```bash
npm install --save @avaya/infinity-omni-sdk-core
```

Omni SDK Core exports a set of types and classes. Out of all the exports, the class `AvayaInfinityOmniSdk` is the origin point of the Omni SDK Core usage flow. It can be imported as follows:

```typescript
import { AvayaInfinityOmniSdk } from "@avaya/infinity-omni-sdk-core";
```

## Usage

### Prerequisites

Before using the Avaya Infinity™ Omni SDK refer to [this section](./README.md#next-steps) for a list of prerequisites.

### Using additional functionalities

The [Conversation](#conversation) of Core module is extended by other modules of Avaya Infinity Omni SDK. This extensibility is achieved using the concept of [Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html).

Each additional functionality exports a mixin which enhances the conversation object with its own set of properties and methods. For example, if you use Omni SDK Messaging module, then the conversation object will have additional properties and methods to send and receive messages.

Please refer to the documentation of the additional functionality module that you are using to know more about the methods that it adds on the Conversation.

List of currently available additional functionalities:

- [Omni SDK Messaging](./messaging.md)

#### How to use the additional functionalities

To use the additional functionalities, the Client has to install the additional functionality module (refer to the installation instructions of each additional functionality module for more details).

Each additional functionality module exports a mixin function. The base conversation from Omni SDK Core module can be enhanced by applying this mixin. This will come in handy when we add new functionalities in future releases.

Example of adding Omni SDK Messaging functionality to the Core Conversation:

```ts
// TS/JS
import { AvayaInfinityOmniSdk } from '@avaya/infinity-omni-sdk-core';
import { MessagingConversation } from '@avaya/infinity-omni-sdk-messaging';

const EnhancedConversationClass = MessagingConversation();

// All arguments are not shown for brevity, refer to the Initialization section for the complete initialization example.
const userSession = await AvayaInfinityOmniSdk.init(..., EnhancedConversationClass);
```

### Authentication

The Avaya Infinity Omni SDK uses JSON Web Tokens (JWT) for client authentication and requires a valid JWT to function. The JWT is obtained from your own backend web application that communicates with Avaya Infinity™ platform's authentication API.

The SDK expects an implementation of the [`JwtProvider`](https://avaya-infinity.github.io/omni-sdk-web/interfaces/_avaya_infinity_omni_sdk_core.JwtProvider.html) interface to be provided during [initialization](#initialization). The implementation of this interface must implement these methods:

1. `onExpiryWarning`: This method is called when the JWT is about to expire. In the argument of this method, the remaining time in milliseconds before the JWT expires is provided.
2. `onExpiry`: This method is called when the JWT has expired.

**The consumers of SDK should call the `AvayaInfinityOmniSdk.setJwt()` to provide a new JWT to the SDK.**

JWT Provider example (in TypeScript):

```typescript
import { JwtProvider } from "@avaya/infinity-omni-sdk-core";

class MyJwtProvider implements JwtProvider {
  onExpiryWarning(timeToExpiry: number): void {
    // ...
  }

  onExpiry(): void {
    // ...
  }
}
```

JWT Provider example (in JavaScript):

```js
class MyJwtProviderJS {
    onExpiryWarning(timeToExpiry) {
        // ...
    }

    onExpiry(): void {
        // ...
    }
}
```

### Initialization

Before any operation can be performed with the SDK, it must be initialized. The initialization process creates a new session for the current user (identified by the JWT) and returns a `UserSession` object that contains the Conversation object corresponding to the User's ongoing conversation. For more details see the [Conversation](#conversation) section.

Initialization can be done by calling the static method `init()` on the class `AvayaInfinityOmniSdk`. The `init()` method takes two arguments:

1. `initParams`: An object which has all the initialization parameters and configurations.
2. `EnhancedConversationClass`: A Conversation class enhanced by applying the [additional functionalities](#using-additional-functionalities) using mixins.

Initialization Example:

```typescript
import { AvayaInfinityOmniSdk } from '@avaya/infinity-omni-sdk-core';
import { MessagingConversation } from '@avaya/infinity-omni-sdk-messaging';

const EnhancedConversationClass = MessagingConversation();

const initParams = {
    host: '<avaya-infinity-hostname>',
    integrationId: '<integrationId>',
    token: '<JWT>',
    jwtProvider: new MyJwtProvider(),
    displayName: 'John Doe',
    logLevel: 'debug',
    idleTimeoutDuration: 5 * 60 * 1000, // in milliseconds
    idleShutdownGraceTimeoutDuration: 1 * 60 * 1000, // in milliseconds
}

const userSession = await AvayaInfinityOmniSdk.init(initParams, EnhancedConversationClass);
```

The `init()` method returns a `Promise` that resolves to a `UserSession` object. The `UserSession` object contains the conversation object(s) that can be used for further operations.

#### Waiting for initialization to complete

Being an `async` method, the Client can `await` on the promise returned by the `init()` (as shown in above example) method to wait for the SDK initialization to complete.

Alternatively, the SDK emits an initialized event after the SDK initialization has completed. The Client can listen to these events by providing a listener function to SDK.

> [!IMPORTANT]
> In order to receive the initialized event, it is imperative to provide the listener function before calling the `init()` method.

```ts
AvayaInfinityOmniSdk.addSdkInitializedListener((userSession) => {
  // userSession object contains the conversation object that can be used for further operations. More details on the conversation object are below.

  console.log("SDK Initialized");
  // ... your code.
});
```

### Conversation

A conversation object represents the conversation of the current user with the Contact Center.

The Core Conversation contains -

- Method to get the details of the participants involved in the conversation.
- Method to provide listeners for the participant change events.
- Method to set the context parameters used for routing.
- Method to end the conversation.
- Property `conversationId`.
- Property to know the current state of the conversation.

> [!NOTE]
> Based on [additional functionality](#using-additional-functionalities) that is included, the conversation will have additional properties and methods. Check out the documentation of each functionality that has been added to know more about the methods that it adds on to the Conversation.

#### Creating a Conversation

To create a conversation, invoke the static method `createConversation()` on the `AvayaInfinityOmniSdk` class. It takes 'EnhancedConversationClass' as an optional argument, which is the class that has been enhanced by applying the additional functionalities using mixins. If not provided, the `CoreConversation` class will be used.

```ts
const EnhancedConversationClass = MessagingConversation();
const conversation = await AvayaInfinityOmniSdk.createConversation(EnhancedConversationClass);
```

> [!IMPORTANT]
> The `createConversation()` method can only be called after the SDK has been initialized.
> The class provided as an argument to the `createConversation()` method must be the same class that was used when `init()` was called.
> At a time only one conversation can be created for the current user. If a conversation already exists, the `createConversation()` method will throw an error.

#### Context Parameters

Context parameters are used to provide routing information to the Avaya Infinity™ platform. These parameters are used to route the conversation to the appropriate agent or queue. The context parameters can be set using the `setContextParameters()` method on the conversation object.

```ts
conversation.setContextParameters({
    key1: "value1",
    key2: "value2",
    // ...
});
```

#### Participants

The Client can get the list of participants involved in the conversation by using the property `participants` on the conversation object. The `participants` property is an array of `Participant` objects. Each `Participant` object contains that participant's details like id of the participant, their display name, their role and the channel on which they are participating in the conversation.

```ts
const participants = conversation.participants;
```

#### Events

Apart from the initialized and shutdown events, the SDK emits a few more events that the consumers can listen to. These events are specific to the Conversation and hence the APIs to listen to these events are provided on the Conversation object.

| Event Name          | Description                                                  | API to provide listener                             |
| ------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Participant Added   | Emitted when a new participant is added to the conversation. | `conversation.addParticipantAddedListener()`        |
| Participant Removed | Emitted when a participant is removed from the conversation. | `conversation.addParticipantDisconnectedListener()` |

The APIs to provide listeners returns a handlerId for that listener. This handleId can be used to remove the listener for that event.

```ts
const participantAddedHandlerId = conversation.addParticipantAddedListener((participant) => {
    console.log("Participant Added:", participant);
    // ... your code.
});

// To remove the listener
conversation.removeParticipantAddedListener(participantAddedHandlerId);

// Similarly for Participant Removed event

const participantDisconnectedHandlerId = conversation.addParticipantDisconnectedListener((participant) => {
    console.log("Participant Removed:", participant);
    // ... your code.
});

// To remove the listener
conversation.removeParticipantDisconnectedListener(participantDisconnectedHandlerId);
```

#### Ending a Conversation

To end the conversation, call the `end()` method on the conversation object. This will end the conversation for the current user. This method returns a `Promise` that resolves when the conversation has been successfully ended and all the associated channels are closed.

```ts
await conversation.end();
```

An `ConversationEnded` event is emitted after the conversation has been successfully ended. The consumers can listen to this event by providing a listener function to the conversation object. The same event is also emitted when the conversation is ended by the Contact Center.

```ts
conversation.addConversationEndedListener((event) => {
    console.log("Conversation with ID:", event.conversationId, "Ended");
    // ... your cleanup code.
});
```

### User Activity

The SDK provides mechanism to automatically clear up the session if the User's session has not been active for the configured amount of time. The following sections explain what is considered as User Activity along with various timers and events that support this feature.

#### Timeouts

The Omni SDK Core provides two timeouts to manage the session inactivity:

The first timer is the idle timer which is started right after the session is created. Any activity from the User or Client (mentioned below) resets this timer. This timer expires when there are no activities for the configured duration. Once this timer expires the SDK will emit the Idle Timeout event and provide the configured grace period duration in the event's payload. The Client can show an appropriate message on the UI, warning the User about inactivity, by handling this event.

The second timer is idle shutdown grace timer which runs after the idle timer has expired. This timer provides additional grace period for User or the Client to extend the session. After this timer expires, the session is terminated automatically and the SDK will raise the shutdown event and shut itself down (see [shutdown](#shutting-down-the-sdk) section for more details). If the Client wants to continue it must be reinitialize the SDK to do so.

Both the timeout values can be configured during the initialization by providing their values in the init params object passed as the first argument to the `AvayaInfinityOmniSdk.init()` method.

```ts
await AvayaInfinityOmniSdk.init({
    // Other init params
    idleTimeoutDuration: 5 * 60 * 1000, // in milliseconds
    idleShutdownGraceTimeoutDuration: 1 * 60 * 1000, // in milliseconds
});
```

The Idle Timeout event can be listened to by providing a listener for the same.

```ts
function warnUser(message) {
    // Show warning on UI.
}

const handlerId = AvayaInfinityOmniSdk.addIdleTimeOutInvokedListener((eventPayload) => {
    warnUser("You have been inactive for a while. Do you want to continue?");
});

// It can be removed by calling the removeIdleTimeoutListener method.
AvayaInfinityOmniSdk.removeIdleTimeOutInvokedListener(handlerId);
```

#### Extending the session

The `AvayaInfinityOmniSdk` provides a method called `resetIdleTimeout()` which can be used to reset the idle timer or the grace timer. This method can be called whenever there is any activity from the User or the Client.

This method also helps the Client to extend the session in scenarios where the Client is aware that the User is active based on events from its UI.

Apart from this method, calling a subset of other methods provided by the Additional Functionalities is also considered as User activities. The list of methods that are considered as User Activity are provided in the documentation of the respective Additional Functionality.

The `resetIdleTimeout()` method only impacts the timers as opposed to calling methods of Additional Functionalities which also perform the operation that the method is supposed to do.

```js
function showWarningBox(eventPayload) {
    const continueChatButton = document.getElementById  ("inactivity-warning-continue-chat");
  
    continueChatButton.onclick = () => {
      AvayaInfinityOmniSdk.resetIdleTimeout();
    };
    // ...
    setTimeout(hideWarningBox, eventPayload.gracePeriod);
}

function hideWarningBox() {
    // ...
}
```

### Shutting down the SDK

The current user's session can be terminated by calling the `shutdown()` method of `AvayaInfinityOmniSdk`. This will end the session and cleanup all the corresponding data within the SDK. **Irrespective of the success or failure of the termination operation, the SDK cleanup will be performed.**

To shut down the SDK, call the `shutdown()` method on the `AvayaInfinityOmniSdk` class. The `shutdown()` method returns a `Promise` that resolves when the SDK has been successfully shut down.

```typescript
await AvayaInfinityOmniSdk.shutdown();
```

> [!IMPORTANT]
> Once the SDK is shutdown the Conversation object(s) are also removed, hence the Client must re-initialize the SDK incase it wants to start again. However, this doesn't close the conversation of the User. Post re-initialization, the User can continue the conversation from where it was left.

Similar to the initialization process, the SDK emits a shutdown event after the SDK has been successfully shut down. The consumers can listen to these events by providing a listener function to SDK.

```ts
AvayaInfinityOmniSdk.addSdkShutdownListener(() => {
    console.log("SDK Shutdown");
    // ... your cleanup code.
});
```
