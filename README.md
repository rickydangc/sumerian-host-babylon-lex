# BabylonJS, Amazon Lex, and Sumerian Host Sample

This sample BabylonJS application demonstrates how to combine the open source Sumerian Host characters with Amazon Lex.

## Prerequisites

- Have [NodeJS](https://nodejs.org/en/) installed
- *Recommended:* [Visual Studio Code](https://code.visualstudio.com/) or similar JavaScript-friendly editor

## Developer Quick Start

### Local Setup

Clone this repository (or download the contents as a ZIP file.)

In a command terminal, navigate to the root of the downloaded repository:

```
cd sumerian-host-lex-babylon-sample
```

Install dependencies:

```
npm install
```

Fix any installation audit issues:

```
npm audit fix
```

### AWS Setup

In order for the demo to be runnable you will need to set up a few things in your AWS account. The steps below will guide you through creating a **Cognito Identity Pool** that allows this application to talk to two AWS services—Amazon Polly and Amazon Lex. You'll also create the actual **Amazon Lex chatbot** that powers this demo.

#### App Credentials Setup

In order to allow our front-end application to make API calls to Amazon Lex and Amazon Polly we must create authorization credentials that it can use.

In the AWS console, navigate to the Cognito service.

Confirm that the Cognito console is set to your desired AWS region. (Example, "us-east-1")

Click **"Manage Identity Pools"**.

If you've never created an identity pool before you will be taken directly to the "Getting started wizard". If instead you see a dashboard view with a "Create new identity pool" button, click that button to be taken to the "Getting started wizard".

Give the identity pool a meaningful name specific to your application. We'll use the name *"Demo_SumHostSeating"* for these instructions.

Tick the **"Enable access to unauthenticated identites"** checkbox to *ON*. This will allow anonymous web visitors to use our application.

Click the **"Create Pool"** button at the bottom of the page.

You will be presented with a page informing you that some IAM roles will be created on your behalf. If you expand the "View Details" section you'll see that two IAM roles will be created for you—one representing logged-in (authenticated) users of your app and one representing anonymous (unauthenticated) users. Click the **"Allow"** button at the bottom of the page.

You will be presented with a "Sample code" page. While you don't need most of the sample code presented, you ***must*** ✏️ copy the Identity pool ID value shown in the code, and save it for use later in these instructions. The value will look similar to `"us-east-1:1ab23f45-6789-8cde-7654-f1g0549h0cce"`

Use the AWS console search bar to navigate to the IAM service.

Click the **"Roles"** tab in the left nav.

Use the IAM Roles search field to search for the name you gave your Cognito Identity Pool (ex. *"Demo_SumHostSeating"*). You should get two results—one with an "Unauth_Role" suffix and one with an "Auth_Role" suffix.

Click the role name of the "Unauth_Role" entry to access that IAM role.

Select **Add permissions > Attach policies**.

In the search box, search for *"AmazonLexRunBotsOnly"*. Tick the checkbox next to that policy to select it. This policy will allow our application to access Amazon Lex.

Click the **"Clear filters"** button, and use the search box again and search for *"AmazonPollyReadOnlyAccess"*. Tick the checkbox next to that policy to select it. This policy will allow our application to access Amazon Polly.

Now that you've selected the two permissions policies required by our application, click the **"Attach policies"** button.

In the resulting screen, confirm that both polices have been added to the list of permissions policies for the role.

Your app credentials setup is now complete! 🎉

#### Lex Bot Setup

From the AWS console, navigate to the Amazon Lex service.

Confirm that the Lex console is set to your desired AWS region. This must be the same region you chose when creating your Cognito Identity Pool.

If presented with a **"Get Started"** button, click it.

> ⚠️ By default you will be taken to the Lex V2 console. However, the bot used in this demo is only compatible with Lex V1. In the left-hand navigation, select "Return to the V1 console" before proceeding.

From the Bots tab, select **Actions > Import**.

Give the bot a name. We'll use the name *"Demo_SumHostSeating"* for these instructions.

Import the "<repository-root>/amazon-lex/Demo_SumHostSeating_Bot_LEX_V1.zip" file from your local computer.

After the bot definition has been imported you should see the bot listed in the console. Click the bot name to access the bot.

Click the **"Build"** button in the upper right-hand corner.

A message window will appear. Dismiss this window by clicking its **"Build"** button.

After the build completes click the **"Publish"** button.

When prompted, give the bot a meaningful alias. We'll use the alias *"Dev"* for these instructions. 

Click the **"Publish"** button to complete the publishing process.

Once publishing is complete, ✏️ write down the "Bot Name" and "Alias" values so you can easily refer to them later. You may dismiss the notification window after doing this.

Your Lex bot setup is now complete! 🎉

### Front-end Application Setup

Before you can run the demo app you will need to make a few small edits to the source code.

Using your favorite code editor, open the "<repository-root>/front-end-app/scripts/app/main.js" file.

On line 24, replace the `cognitoIdentityPoolId` value with the Cognito Identity Pool ID you created earlier. Save your changes.

Open the "<repository-root>/front-end-app/scripts/app/lex-bot.js" file.

On lines 10 and 11 update the `botName` and `botAlias` values to match the bot name and bot alias you created earlier. Save your changes.

Your front-end application setup is now complete! 🎉 Now you're ready to [run the demo](#running-the-demo) ⤵️ or to [start active development](#project-details-for-developers) ⤵️.

## Running the Demo

### Starting the Demo

In a command terminal, navigate to the root of the downloaded repository.

```
cd sumerian-host-lex-babylon-sample
```

Use the following command which will start up a local web server and launch the application in a browser.

```
npm start
```

> ✏️ **Note:** When you are done testing, you can stop the local web server by pressing **Ctrl-C** while using the same terminal window in which you started the server.

### Demo Notes

Microphone recording is not implemented in this demo. Instead, there are some "magic" keyboard keys you can use to simulate various spoken input values. To trigger these simulated speech inputs, press and release the "push-to-talk" button on screen while holding down one of the following keys:

- **1** key = *"Where is my desk"*
- 2 key = *"ABC1234"*
- **3** key = *"ABE1234"*
- **4** key = "00012357"
- **Y** key = *"yes"*
- **N** key = "no"
- If no key is pressed a value of "sssss" will be sent to Lex, representing unintelligble audio

## Project Details for Developers

Below is a description of the top-level folders.

```
📁 amazon-lex       👈 Contains Lex bot definition
📁 art-source       👈 Contains source files for 2D and 3D art assets used in the app
📁 front-end-app    👈 Source code for the main application
```

#### Finding important dev tasks

To quickly see which values you may need to update and which areas require you to add your own implementation, do a project-wide search for *"TODO:"*. This will bring up a list of TODO comments highlighting important areas that may need your attention.

#### Changing the host character

If you'd like to change which host character is used, open the **"/front-end-app/scripts/app/main.js"** file and edit the `characterId` value (line 39.)

#### Changing the host voice

If you'd like to change the voice used by the host, open the **"<repo>/front-end-app/scripts/app/main.js"** file and edit the `pollyVoice` value (line 28) and, optionally, the `pollyEngine` value (line 34.)

#### Customizing host clothing

Host character clothing can be customized by editing certain texture (image) files. As an example, this project includes a modified version of the shirt texture used by the "Cristine" character. The texture has been modified to include a company logo. The modified texture is located at:

 ```
 /front-end-app/3d-assets/characters/adult_female/cristine/textures/shirt_diff.jpg
 ```

Other character textures share a similar file organization pattern.

#### Customizing the 3D environment

A simple 3D room model has been created for this demo. The source Blender file for this 3D asset is found at:

````
/art-source/3d/environments/room_model/room_model.blend
````

If you'd like to modify this 3D asset, open it in [Blender](https://www.blender.org/) (free open source 3D application), make your edits, and then export it as a glTF for use by the application following this process...

From Blender, **File > Export > glTF 2.0**.

In the window that appears, within the right hand panel enable the settings as show below:

![Blender glTF export settings](./art-source/docs/Blender_glTF_export_settings.png)

Set the export destination to:

````
<repo>/front-end-app/3d-assets/environments/room_model/room_model.gltf
````

Click the **Export glTF 2.0** button.

The next time you run the application your updated 3D room model will be used.

#### Script file overview

The following application scripts are found under **/front-end-app/scripts/app/**...

📄 **main.js** 

This is the main entry point of the application.

📄 **scene-room.js** 

The script handles loading and setup of the visual 3D environment of your scene. It also creates the camera used by the application.

📄 **conversation-controller.js** 

This script manages the flow of the chatbot conversation. If you want to change how the app handles user input or how it responds to chatbot responses, do that here.

📄 **lex-bot.js** 

This script provides a simple API for interacting with any Lex bot.

📄 **iframe-capture.js** and 📄 **virtual-screen.js**

These scripts work together to enable regular web pages to be displayed on the virtual screen in the 3D environment. The "iframe-capture.js" script should be included in any web page that you want to be able to display on the virtual screen. See the following web pages as examples of how to use the "iframe-capture.js" script – 📄 **/front-end-app/content-screen-start.html** and 📄 **/front-end-app/content-screen-seating.html**



