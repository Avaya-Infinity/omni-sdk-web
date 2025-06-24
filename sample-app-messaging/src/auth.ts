import { Configs } from "./config";

const User = {
	userId: "<user id>", // User's unique ID
	userName: "<user name>", // User's name
	userIdentifiers: {
		emailAddresses: ["<email address>"], // User's email address
		phoneNumbers: ["<phone number>"], // User's phone number
	}
};

export const Authenticator = {
	async fetchToken() {
		console.log("Fetching JWT token for user:", User);
		const response = await fetch(Configs.tokenServerUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(User),
		});

		if (!response.ok) throw new Error(await response.text());

		const { jwtToken } = await response.json();
		return jwtToken;
	},

	getUser() {
		console.log("Returning user information:", User);
		return User;
	},
};
