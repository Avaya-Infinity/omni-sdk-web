// ./config must be imported first, before @avaya/infinity-omni-sdk-messaging-ui,
// because window.messagingUiConfig must be defined before the UI is loaded.
import "./config";
import "@avaya/infinity-omni-sdk-messaging-ui";
import { Authenticator } from "./auth";
import { AvayaInfinityOmniSdkMessagingUi, JwtProvider } from "@avaya/infinity-omni-sdk-messaging-ui";
import { Configs } from "./config";
import themes from "./customization/themes";
import displayStrings from "./customization/display-strings";

async function initOnMessageBubbleClicked(instance: AvayaInfinityOmniSdkMessagingUi) {
	console.log("Message bubble clicked", instance);
	try {
		if (!instance) throw new Error("Instance of avaya-infinity-omni-sdk-messaging-ui doesn't exist");
		if (instance.initialized) return;

		const jwtProvider: JwtProvider = {
			onExpire() {
				console.log("JWT has expired");
			},

			async onExpireWarning(remainingTime: number) {
				console.log(`JWT will expire in ${remainingTime} ms`);

				const token = await Authenticator.fetchToken();
				instance.setJwt(token);
			},
		};

		instance.init({
			jwtProvider,
			jwt: await Authenticator.fetchToken(),
			userName: Authenticator.getUser().userName,
			contextParameters: Configs.contextParameters, // change to whatever parameters you would like to send
		});
	} catch (e) {
		console.log("Error while initializing avaya-infinity-omni-sdk-messaging-ui", e);
		throw e;
	}
}

async function loadMessagingUi() {
	const messagingUiConfig = {
		themeCustomizations: themes,
		// initialTheme: "professional", // <-- Enable this to use your own custom theme defined in ./customization/themes.ts
		displayStrings: displayStrings,
		host: Configs.avayaInfinityHost,
		integrationId: Configs.integrationId,
		idleTimeoutDuration: Configs.idleTimeoutDuration,
		logLevel: Configs.logLevel,
		idleShutdownGraceTimeoutDuration: Configs.idleShutdownGraceTimeoutDuration,

		onIdleTimeOut: function (instance: any) {
			console.log("onIdleTimeOut", instance.name);
		},

		onInit: function (instance: any) {
			console.log("onInit get name", instance.name);
		},
		onShutdown: function (instance: any) {
			console.log("onShutdown get initialized", instance.initialized);
		},

		onMessageBubbleClicked: initOnMessageBubbleClicked
	};
	try {
		const token = await Authenticator.fetchToken();
		await AvayaInfinityOmniSdkMessagingUi.load(messagingUiConfig, token);
	} catch (err) {
		console.error("Error while loading Avaya Infinity Omni Messaging UI", err);
		throw err;
	}
}

window.onload = async function () {
	if (AvayaInfinityOmniSdkMessagingUi.loaded) {
		console.log("Avaya Infinity Omni Messaging is already loaded");
		return;
	}
	try {
		await loadMessagingUi();
	} catch (error) {
		console.error("Failed to initialize message bubble:", error);
	}
};
