# Installing Avaya Infinity™ Omni SDK using tarballs

## Installing Omni SDK for running the sample application

1. To the sample-app-messaging, you must have already cloned the [Omni SDK Web](https://github.com/Avaya-Infinity/omni-sdk-web) repository.
2. change directory to the `sample-app-messaging` folder.
3. Run the following command to install the Omni SDK tarballs:

   ```bash
   npm install ../lib/avaya-infinity-omni-sdk-core-0.0.1.tgz ../lib/avaya-infinity-omni-sdk-messaging-0.0.1.tgz ../lib/avaya-infinity-omni-sdk-messaging-ui-0.0.1.tgz
   ```

4. Follow the instructions in the [README](../sample-app-messaging/README.md) file of the sample application to run it.

## Installing Omni SDK into your project

1. Download this 'lib' folder containing the Omni SDK tarballs into the root directory of your project.
2. Run the following command to install the Omni SDK tarballs:

   ```bash
   npm install ./lib/avaya-infinity-omni-sdk-core-0.0.1.tgz ./lib/avaya-infinity-omni-sdk-messaging-0.0.1.tgz ./lib/avaya-infinity-omni-sdk-messaging-ui-0.0.1.tgz
   ```
