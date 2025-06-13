import { LogLevel } from "@avaya/infinity-omni-sdk-messaging-ui";

export const Configs = {
	integrationId: "<integration id>", // The unique web chat integration id configured in Avaya Infinity admin console.
	avayaInfinityHost: "<avaya infinity hostname>", // Hostname of the Avaya Infinity API endpoint to connect to.
	tokenServerUrl: "<token URL>", // URL of your backend app server for fetching JWT token
	idleTimeoutDuration: 300000, // 5 minutes
	idleShutdownGraceTimeoutDuration: 30000, // 30 seconds
	logLevel: LogLevel.DEBUG, // Log level for the Messaging UI
	contextParameters: {}, // Context parameters for the Messaging UI
};
