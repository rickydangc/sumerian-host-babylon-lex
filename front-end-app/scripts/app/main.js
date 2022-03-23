/*
© 2021 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
This AWS Content is provided subject to the terms of the AWS Customer Agreement available at
http://aws.amazon.com/agreement or other written agreement between Customer and either
Amazon Web Services, Inc. or Amazon Web Services EMEA SARL or both.
*/

import { SumerianHostUtils } from '../lib/sumerian-host-utils.js';
import { RoomScene } from './scene-room.js';
import { ConversationController } from './conversation-controller.js';
import { VirtualScreen } from './virtual-screen.js';

/**
 * This is the main module for our application. It handles our app's startup
 * process.
 */

// TODO: Update this value to match a Cognito Identity Pool created in your AWS
// account. The unauthenticated IAM role for the pool (usually ending in the
// suffix "Unauth_Role") must have the following managed permissions policies
// assigned to it:
//   - AmazonPollyReadOnlyAccess
//   - AmazonLexRunBotsOnly

const cognitoIdentityPoolId = 'us-west-2:3eb8a906-3615-4894-8b5f-582420fe8e49';

// TODO: Edit the pollyVoice value if you would like the change the Polly voice used by
// the character. See https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
const pollyVoice = 'Joanna';

// TODO: Edit the pollyEngine value if you would like to change which voice
// engine is used. Allowed values are "standard" or "neural". Note that the
// neural engine incurs a higher cost and is not compatible with all voices and
// regions. See https://docs.aws.amazon.com/polly/latest/dg/NTTS-main.html
const pollyEngine = 'neural';

// TODO: Edit the characterId if you would like to use one of the other
// pre-built host characters. Available character IDs are: "Cristine", "Fiona",
// "Grace", "Maya", "Jay", "Luke", "Preston", "Wes"
const characterId = 'Cristine';

let engine;
let scene;
let host;
let shadowGenerator;
let conversation;

// The function calls below define our app's start-up sequence.
configureAwsSdk();
init3dEngine();
await loadScene();
await loadCharacter();
initVirtualScreen();
startApp();

// ==== Functions ====

function configureAwsSdk() {
  AWS.config.region = cognitoIdentityPoolId.split(':')[0];
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    { IdentityPoolId: cognitoIdentityPoolId },
  );
}

function init3dEngine() {
  const canvas = document.getElementById('renderCanvas');
  engine = new BABYLON.Engine(canvas, true, undefined, true);
  // Use our own button to enable audio
  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;

  // Handle window resize
  window.addEventListener('resize', () => engine.resize());
}

async function loadScene() {
  // Create our main scene.
  scene = await RoomScene.create(engine);

  // Configure shadow casting for they key light.
  const keyLight = scene.lights[0];
  shadowGenerator = new BABYLON.ShadowGenerator(1024, keyLight);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 32;

  // Allow camera to be controlled by user.
  const cameraControlEl = document.getElementById('renderCanvas');
  const camera = scene.cameras[0];
  camera.attachControl(cameraControlEl, true);
}

function initVirtualScreen() {
  const screenMesh = scene.getMeshByName('DisplayScreen');
  const virtualScreen = new VirtualScreen(screenMesh, 1280, 720);
  // virtualScreen.loadUrl('content-screen-seating.html?seatNum=5');
  virtualScreen.loadUrl('content-screen-1.html');
}

async function loadCharacter() {
  const pollyConfig = {
    pollyVoice,
    pollyEngine,
  };

  // Instantiate the host.
  const characterConfig = SumerianHostUtils.getCharacterConfig(characterId);
  host = await SumerianHostUtils.createHost(scene, characterConfig, pollyConfig);

  // Tell the host to always look at the camera.
  const camera = scene.cameras[0];
  host.PointOfInterestFeature.setTarget(camera);
  host.owner.position = new BABYLON.Vector3(0.4, 0, 0);

  // Enable host shadows.
  shadowGenerator.addShadowCaster(host.owner, true);

  // TRICKY: Uncomment this line if using the Grace or Fiona characters. It compensates for their
  // eyelid height difference compared to other characters.
  host.AnimationFeature.setLayerWeight('Blink', 0.7);
}

function startApp() {
  // Initialize the virtual screen.
  const screenMesh = scene.getMeshByName('DisplayScreen');
  const virtualScreen = new VirtualScreen(screenMesh, 1280, 720);
  // Load the initial HTML page to display on the virtual screen.
  virtualScreen.loadUrl('content-screen-start.html');

  // Initializes the ConversationController which will manage all conversation
  // flow with the chatbot.
  const talkButton = document.getElementById('talkButton');
  conversation = new ConversationController(host, talkButton, virtualScreen);

  // Wire up the Welcome screen's "begin" button.
  document.getElementById('beginButton').onclick = () => {
    displayScreen('mainScreen');
    conversation.start();
  };

  displayScreen('welcomeScreen');
}

/**
 * Makes the designated screen visible while hiding all other screens.
 *
 * @param {string} screenId The HTML entity ID to match
 */
function displayScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach((screenEl) => {
    if (screenEl.id === screenId) {
      screenEl.classList.remove('hidden');
    } else {
      screenEl.classList.add('hidden');
    }
  });

  // TRICKY: If the render canvas was just revealed the Babylon engine's render resolution
  // needs to be updated.
  engine.resize();
}
