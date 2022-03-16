/*
© 2021 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
This AWS Content is provided subject to the terms of the AWS Customer Agreement available at
http://aws.amazon.com/agreement or other written agreement between Customer and either
Amazon Web Services, Inc. or Amazon Web Services EMEA SARL or both.
*/

import { LexBot, LexBotEvents } from './lex-bot.js';
import { KeyboardUtils } from '../lib/keyboard-utils.js';

/**
 * This class manages the flow of the chat bot conversation.
 */
export class ConversationController {

  /**
   * @param {HOST.HostObject} sumerianHost
   *   The host character participating in the conversation
   * @param {HtmlElement} talkButton
   *   UI button that the user presses while talking
   */
  constructor(sumerianHost, talkButton, virtualScreen) {
    this.host = sumerianHost;
    this.virtualScreen = virtualScreen;
    this.speech = sumerianHost.TextToSpeechFeature;
    this.bot = new LexBot();

    // Set up UI event handling
    talkButton.addEventListener('mousedown', this._onTalkButtonPress.bind(this));
    talkButton.addEventListener('mouseup', this._onTalkButtonRelease.bind(this));

    // Subscribe to LexBot events.
    this.bot.listenTo(LexBotEvents.RESPONSE_RECEIVED, this._onLexBotResponse.bind(this));
  }

  /**
   * Starts the conversation flow.
   */
  async start() {
    const message = `Hello! And welcome to the team. I'm here to help. Just press and hold the talk
    button below to ask me a question. For example, ask me, "Where is my desk?`;

    this.speech.play(message);
  }

  /**
   * Triggered whenever the user presses the talk button.
   */
  _onTalkButtonPress() {
    this.speech.stop();

    // Ensure the host looks at the user.
    const scene = BABYLON.Engine.LastCreatedScene;
    const camera = scene.cameras[0];
    this.host.PointOfInterestFeature.setTarget(camera);

    // TODO: Add logic here that starts recording the user's voice.
  }

  /**
   * Triggered whenever the user releases the talk button.
   */
  _onTalkButtonRelease() {
    // TODO: Replace the code below with actual logic that stops recording the
    // user's voice and submits that recording to the Lex bot. You'll find
    // relevant sample code in the following article:
    // https://aws.amazon.com/blogs/machine-learning/capturing-voice-input-in-a-browser/
    this._simulateUserUtterance();
  }

  /**
   *
   * @param {object} response
   *   The response object retuned from Lex. See the AWS docs link below for a
   *   description of the available properties. Specifically, look at the `data`
   *   argument that is passed to the `callback` function:
   *   https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexRuntime.html#postText-property
   */
  _onLexBotResponse(response) {
    switch (response.dialogState) {
      // This case indicates the bot needs to know the task the user would like
      // help with.
      case 'ElicitIntent': {
        this.speech.play(response.message);
        break;
      }

      // This case indicates the bot is asking for more information.
      case 'ElicitSlot': {
        this.virtualScreen.loadUrl('content-screen-start.html');
        this.speech.play(response.message);
        break;
      }

      // This case indicates the bot has collected all necessary slot values but
      // would like to confirm with the user whether the values are correct.
      case 'ConfirmIntent': {
        // TRICKY: In order to get Polly to pronounce the employee ID as individual
        // characters rather than words we need to inject some SSML tags
        // that surround the employee ID value.
        const employeeId = response.slots.EmployeeId;
        const sentenceParts = response.message.split(employeeId);
        const ssml = `<speak>${sentenceParts[0]}<say-as interpret-as="characters">${employeeId}</say-as>${sentenceParts[1]}`;
        this.speech.play(ssml);
        break;
      }

      // This case indicates the bot has all necessary info and has completed
      // the task.
      case 'Fulfilled': {
        // TODO: Add logic here that reads the appropriate property from the Lex
        // response indicated the person's desk number. For now, we'll fake it
        // by generating a seat number based on their employee ID.
        const employeeId = response.slots.EmployeeId;
        const idAsNum = employeeId.split('').reduce((numHash, char) => numHash + char.charCodeAt(0), 0);
        const seatNum = idAsNum % 12;

        this.speech.play(response.message);

        // Display the seating chart on the virtual screen with the correct desk
        // highlighted.
        this.virtualScreen.loadUrl(`content-screen-seating.html?employeeId=${employeeId}&seatNum=${seatNum}`);

        // After a short delay, make the host draw attention to the screen.
        setTimeout(() => {
          const scene = BABYLON.Engine.LastCreatedScene;

          // Make host look at the "ScreenPOI" invisible object which is
          // contained within the scene.
          const poiNode = scene.getTransformNodeByName('ScreenPOI');
          this.host.PointOfInterestFeature.setTarget(poiNode);

          // Trigger a built-in gesture.
          this.host.GestureFeature.playGesture('Gesture', 'you', { holdTime: 0.2 });
        }, 1300);

        break;
      }

      // This case indicates the bot has not gotten all necessary info to
      // complete the task and is giving up.
      case 'Failed': {
        this.virtualScreen.loadUrl('content-screen-start.html');
        this.speech.play(response.message);
        break;
      }

      default: {
        console.error(`Unexpected Lex dialog state: "${response.dialogState}"\n`);
        console.log(response);
      }
    }
  }

  /**
   * This demo doesn't currently include the ability to actually record a user's
   * voice, so this function simulates a user's utterance depending on which
   * keyboard key is pressed at the time it is called.
   */
  _simulateUserUtterance() {
    switch (KeyboardUtils.mostRecentKey) {
      case '1': {
        this.bot.postUtterance('Where is my desk');
        break;
      }

      case '2': {
        this.bot.postUtterance('ABC1234');
        break;
      }

      case '3': {
        this.bot.postUtterance('ABE1234');
        break;
      }

      case '4': {
        this.bot.postUtterance('00012357');
        break;
      }

      case 'y': {
        this.bot.postUtterance('yes');
        break;
      }

      case 'n': {
        this.bot.postUtterance('no');
        break;
      }

      default: {
        this.bot.postUtterance('sssss'); // unintelligible audio
      }
    }
  }

}
