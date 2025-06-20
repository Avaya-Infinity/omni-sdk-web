# Omni SDK Messaging

The Omni SDK Messaging module allows you to add Avaya Infinity™ chat capabilities into your Client website. The Omni SDK Messaging module depends on the Omni SDK Core module. Please refer to the [Omni SDK Core documentation](./core.md) before using the Messaging module.

## Main features

1. **Message History**: Provides a message history feature that allows users to view all messages exchanged in a conversation thread.
2. **Resume Conversation**: Allows users to resume a messaging conversation thread at any time. This includes auto resuming the conversation initiated from another session of the same user, to converse simultaneously from multiple devices. Auto resuming might take a minute to detect an active conversation on another session.
3. **Canned Messages**: Generates messages configured by the account admin for the web chat integration, if the user has not sent the first message on the conversation.
4. **Send Message**: Allows users to send messages to other participants in a conversation thread.
5. **Receive Message**: Allows users to receive messages from other participants in a conversation thread.
6. **Receive rich media messages**: Supports quick reply rich media messages allowing dynamic and engaging content within the messaging interface.
7. **Send rich media messages**: Supports response to quick reply rich media messages.
8. **Send and receive attachments**: Allows users to send and receive attachments like images, videos, audio, documents etc, to other participants in a conversation thread.
9. **Typing indicators**: Enables sending typing indicator of the user and receiving typing indicator(s) of other participants in the conversation.
10. **Download Transcript:** Allows users to download the conversation transcript, once the conversation is closed.

## Installation

Omni SDK Messaging module requires the Omni SDK Core module.

To install the Omni SDK Messaging module, run the following command:

```bash
npm install --save @avaya/infinity-omni-sdk-messaging
```

This will install both Omni SDK Core and Omni SDK Messaging.

## Usage

The Omni SDK Messaging module provides the [`MessagingConversation`](https://avaya-infinity.github.io/omni-sdk-web/functions/_avaya_infinity_omni_sdk_messaging.MessagingConversation.html) [mixin](https://www.typescriptlang.org/docs/handbook/mixins.html) that extends the Base Conversation of the Omni SDK Core module with Messaging capabilities. To use the Messaging module, you need to import the `MessagingConversation` mixin function and apply it. Check out more details about additional functionalities in the `Using additional functionality` section of The [Omni SDK Core's documentation](./core.md).

Example of how to use Omni SDK Messaging module:

```ts
// Note: Here ... (dot dot dot) indicates the rest of the code, which is excluded for brevity.

import { AvayaInfinityOmniSdk } from '@avaya/infinity-omni-sdk-core';
import { MessagingConversation } from '@avaya/infinity-omni-sdk-messaging';

const EnhancedConversationClass = MessagingConversation();

const userSession = await AvayaInfinityOmniSdk.init({...}, EnhancedConversationClass);

const defaultConversation = userSession.conversations[0];

// The `defaultConversation` object has methods of both Omni SDK Core and Messaging modules.
defaultConversation.addParticipantAddedListener(...) // <-- Omni SDK Core method
defaultConversation.sendMessage(...); // <-- Omni SDK Messaging method
```

## Messaging Conversation

The Messaging Conversation provides APIs to send and receive rich media and attachment messages, get conversation history, listen to message events and get the messaging transcript. For more details on the APIs exposed on the Messaging Conversation, refer to the [`MessagingConversationTrait`](https://avaya-infinity.github.io/omni-sdk-web/interfaces/_avaya_infinity_omni_sdk_messaging.MessagingConversationTrait.html) interface.

### Getting conversation history

To get the conversation history, use the `getMessages()` method on the Conversation. The `getMessages()` method returns a `PageIterator` object that can be used to iterate over the messages in the conversation. The `getMessages()` API takes an optional parameter `pageSize` which specifies the number of messages to fetch in a single page. The default value of `pageSize` is 10 and maximum page size is 50.

> [!NOTE]
> The iterator can only be used to get messages conversed in the conversation from start up until the point the iterator was created. For newer messages please listen to the message events. Do not use the `getMessages()` API to get new messages.

Each Page of the iterator contains a list of messages. Pages with higher page number will contain older messages. The iterator can be used to get messages in both directions (forward and backward).

The `PageIterator.previous()` and `PageIterator.next()` are async methods, when called they fetch the previous and next page of messages respectively and each resolves with an Array of [`Message`](https://avaya-infinity.github.io/omni-sdk-web/types/_avaya_infinity_omni_sdk_messaging.Message.html). The `PageIterator.hasNext()` and `PageIterator.hasPrevious()` methods check if there are more messages in the next and previous pages, respectively.

At any point `PageIterator.items` can be used to get the messages on the current page.

```ts
function showMessagesOnUI(messages) {
    // Logic to show messages on UI.
    // ...
}

const iterator = await conversation.getMessages(15);

showMessagesOnUI(iterator.items);

const loadMore = document.getElementById("load-more-button");

loadMore.onclick = function () {
    if (iterator.hasPrevious()) {
        const previousPage = await iterator.previous();
        showMessagesOnUI(previousPage);
    }
};
```

To determine if a message is a canned message, you can check if the `canned` property of the `Message` object is `true`. Canned messages are pre-configured messages that are generated when the user has not sent any message in the conversation.

### Sending messages

As of now, the Omni SDK Messaging module supports sending these types of messages:

- Text(Plain text, Emoji's, Links)
- Rich text (Markdown)
- Reply
- Attachment

To send a message, use the `sendMessage()` method on the Conversation. The `sendMessage()` method takes a `SendMessageRequest` object as a parameter. Based on the type of message you want to send, you can use one of the following implementations of `SendMessageRequest` to construct your message:

- `TextMessage`: To send a plain text message.
- `ReplyMessage`: To send a reply message.
- `AttachmentMessage`: To send an attachment message.

#### Sending plaintext messages

To send a plain text message, use the `TextMessage` class to build your message. The `TextMessage` class constructor takes a `text` and an optional `parentMessageId` parameter. The `parentMessageId` is the messageId of the message to which the current message is a reply.

```ts
const message = new TextMessage("Hi");
conversation.sendMessage(message);
```

#### Sending rich media reply messages

To send a rich media reply message, use the `ReplyMessage` class to build your message. The `ReplyMessage` class constructor takes in the action `payload` of the selected action from the list of actions in the original message. Along with `payload`, you can also pass optional arguments `actionText`, `iconUrl` and the `parentMessageId` parameter. Here the `parentMessageId` can be used to specify the original reply request message to which this current message is a reply.

```ts
const message = new ReplyMessage(
    "CUSTOMER_HAPPY",
    "Happy",
    "https://example.com/happy.png",
);
conversation.sendMessage(message);
```

#### Sending attachment messages

To send an attachment message, use the `AttachmentMessage` class to build your message. The `AttachmentMessage` class constructor takes in the `File` object and optional arguments `text` (optional text to send along side the file), `parentMessageId`. The `parentMessageId` is the messageId of the message to which the current message is a reply. The `AttachmentMessage` class can be used to send images as well.

```ts
const fileInput = document.getElementById("file-input");
let selectedFile;

fileInput.onchange = function () {
    selected = fileInput.files[0];
};

const sendAttachmentButton = document.getElementById("send-attachment-button");

sendAttachmentButton.onclick = function () {
    const message = new AttachmentMessage(
        selectedFile,
        "Here is the invoice",
    );
    conversation.sendMessage(message);
};
```

### Waiting for message to be sent

The `sendMessage()` API returns a `Promise` that resolves with the [`Message`](https://avaya-infinity.github.io/omni-sdk-web/types/_avaya_infinity_omni_sdk_messaging.Message.html) object corresponding to the message that sent. This object contains unique `messageId` of this message and other details.

### Message delivery

The Client must listen to the the Message Delivered event to be notified when the messages that were sent by the User are delivered to the Avaya Infinity™ platform. To do so the Client use the `addMessageDeliveredListener()` method on the Conversation object to register the Message Delivered event listener. The `addMessageDeliveredListener()` method takes a function as the argument. This function will be called with the [`MessageEvent`](https://avaya-infinity.github.io/omni-sdk-web/interfaces/_avaya_infinity_omni_sdk_messaging.MessageEvent.html) object corresponding to the message that was sent. The `MessageEvent` object contains unique `messageId` of this message and other details.

```ts
function showTickOnUI(message) {
    // Logic to show tick on UI.
    // ...
}

conversation.addMessageDeliveredListener((message) => {
    showTickOnUI(message);
});
```

### Receiving messages

The Client must listen to the the Message Arrived event to be notified when the messages are received from the Agent. To do so the Client use the `addMessageArrivedListener()` method on the Conversation object to register the Message Arrived event listener. The `addMessageArrivedListener()` method takes a function as the argument. This function will be called with the [`MessageEvent`](https://avaya-infinity.github.io/omni-sdk-web/interfaces/_avaya_infinity_omni_sdk_messaging.MessageEvent.html) object corresponding to the message that received. The `MessageEvent` object contains the unique `messageId` and body of the message sent by the Agent.

```ts
function showMessagesOnUI(message) {
    // Logic to show messages on UI.
    // ...
}

conversation.addMessageArrivedListener((message) => {
    showMessagesOnUI(message);
});
```

To check if the message that arrived is a canned message, you can check if the `canned` property of the `MessageEvent` object is `true`. Canned messages are pre-configured messages that are generated when the user has not sent any message in the conversation.

### Sending typing indicators

The Omni SDK Messaging module supports sending typing indicators to notify other participants in the conversation that the user is typing. To achieve this, the client should use the `notifyUserTyping()` method on the Conversation object.

This method essentially acts like a beacon. Call this method while the user is typing to notify the Contact Center about the user's typing activity. For example, call this method on every input change or key down events.

Example:

```ts
const inputField = document.getElementById("input-field");

inputField.addEventListener("keydown", () => {
    conversation.notifyUserTyping();
});
```

### Receiving typing indicators

To show typing indicators when other participants in the conversation are typing, the Client must listen to the typing started and stopped events. To do so, the Client can use the `addTypingStartedListener()` and `addTypingStoppedListener()` methods on the Conversation object to register the typing started and typing stopped event listeners. The `addTypingStartedListener()` and `addTypingStoppedListener()` methods take the listener function as the argument. The listeners will be called with the `TypingStarted` and `TypingStopped` object corresponding to the respective typing events, which contain details of the participant who started or stopped typing.

Example:

```ts
function showTypingIndicatorOnUi(participant) {
    // Logic to show typing indicator for the given participant on UI.
    // ...
}

function hideTypingIndicatorOnUi(participant) {
    // Logic to hide typing indicator for the given participant on UI.
    // ...
}

conversation.addTypingStartedListener((typingStartedEvent: TypingStarted) => {
    showTypingIndicatorOnUi(typingStartedEvent.participant);
});

conversation.addTypingStoppedListener((typingStoppedEvent: TypingStopped) => {
    hideTypingIndicatorOnUi(typingStoppedEvent.participant);
});
```

## Avaya Infinity Messaging Namespace

The Omni SDK Messaging module consists of [`AvayaInfinityMessaging`](https://avaya-infinity.github.io/omni-sdk-web/modules/_avaya_infinity_omni_sdk_messaging.AvayaInfinityMessaging.html) namespace which contains a set of APIs which aren't directly coupled to the concept of Messaging Conversation. This namespace consists of APIs and Events related to the networking model used by the Omni SDK Messaging to get messages and events from Avaya Infinity™ platform.

During the session, the state of SDK’s connection with Avaya Infinity™ platform Servers can change. In all the cases the network state changes are notified in the form of events. The Client can subscribe to these events for handling the changes in network.

List of Events:

| Event Name              | Description                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event Stream Connecting | This event is raised when the Messaging module tries to connect with the event stream.                                                                                               |
| Event Stream Connected  | This event is raised when the Messaging module’s connection attempt was successful, and the connection with Avaya Infinity™ platform is established.                                                      |
| Event Stream Failed     | This event is raised when the event stream breaks/fails due to some reason. Details like the reason for failure and the duration after which next retry attempt will be made are provided in the event. |
| Event Stream Closed     | This event is raised when the Messaging module disconnects itself from the event stream.                                                                                             |

The Client can use respective `add/remove` methods exposed by the `AvayaInfinityMessaging` namespace to subscribe/unsubscribe to these events.

Example:

```ts
import { AvayaInfinityMessaging } from "@avaya/infinity-omni-sdk-messaging";

AvayaInfinityMessaging.addEventStreamConnectingListener((eventPayload) => {
    // Show connecting on UI.
});

AvayaInfinityMessaging.addEventStreamConnectedListener((eventPayload) => {
    // Show connected on UI.
});

AvayaInfinityMessaging.addEventStreamFailedListener((eventPayload) => {
    // Show network disconnected on UI.
    console.log(
        `Omni SDK disconnected due to ${eventPayload.reason}, next retry attempt will be made after ${eventPayload.retryAfter} seconds.`,
    );
});

AvayaInfinityMessaging.addEventStreamClosedListener((eventPayload) => {
    // Show connection closed on UI.
});
```

If the event stream breaks/fails, the SDK will try to reconnect with Avaya Infinity™ platform until the reconnection window expires. It will try to make multiple attempts to reconnect with Avaya Infinity™ platform. The interval between each subsequent attempt will keep on increasing till the reconnection window (5 minutes) expires. If the SDK is unable to reconnect within the reconnection window, the SDK will stop trying to reconnect.

Post this, the Client can make an explicit attempt to retry connecting with Avaya Infinity™ platform. To do so, the Client must call the `retryConnection()` method exposed by the `AvayaInfinityMessaging` namespace.

```ts
import { AvayaInfinityMessaging } from "@avaya/infinity-omni-sdk-messaging";

AvayaInfinityMessaging.retryConnection();
```

This method is not an `async` method and a successful return of this method doesn't guarantee that the SDK has been connected with Avaya Infinity™ platform yet, instead the Client should subscribe to the Event Stream Connected event. In case of failure during the manual retry attempt, the Client will be notified via the Event Stream Failed event.

If the manual retry is successful, the Client will be notified via the Event Stream Connected event and the SDK will resume its connection with Avaya Infinity™ platform.

Calling `retryConnection()` method when the SDK is disconnected but within the reconnection window will just reset the delay interval between the subsequent attempts and will attempt to reconnect immediately.

Calling `retryConnection()` method when the SDK is not disconnected will throw an Error.
