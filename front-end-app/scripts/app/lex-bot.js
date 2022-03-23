/*
© 2021 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
This AWS Content is provided subject to the terms of the AWS Customer Agreement available at
http://aws.amazon.com/agreement or other written agreement between Customer and either
Amazon Web Services, Inc. or Amazon Web Services EMEA SARL or both.
*/

// TODO: Update the botName and botAlias values to match those of the Lex bot you've created
// in your AWS account.
const botName = 'Demo_SumHostSeating';
const botAlias = 'Dev';

export const LexBotEvents = {
  // Event emitted whenever a Lex response is received.
  RESPONSE_RECEIVED: 'LexResponseReceived',
};

/**
 * This class provides a simple API for interacting with any Lex bot. It emits
 * messages that consumers can subscribe to in order to be informed of Lex
 * bot response events.
 */
export class LexBot {

  /**
   * Creates a new instance of a Lex bot.
   *
   * @param {string} botAlias
   * @param {string} botName
   */
  constructor() {
    this.lex = new AWS.LexRuntime();
    this.anonymousUserId = generateSimpleSessionId();
    this.messageBus = new HOST.Messenger(botName);
  }

  async postUtterance(value) {
    const params = {
      botAlias,
      botName,
      userId: this.anonymousUserId,
      inputText: value,
    };

    const response = await this.lex.postText(params).promise();

    // Emit a message for other objects that may be interested.
    this.messageBus.emit(LexBotEvents.RESPONSE_RECEIVED, response);

    return response;
  }

  /**
   * Allows an object to subsrcibe itself to an event emitted by this LexBot instance.
   *
   * @param {string} message
   *   The event type to listen for. For available events see LexBotEvents.
   * @param {function} callback
   *   The function to trigger when this event occurs.
   */
  listenTo(message, callback) {
    this.messageBus.listenTo(message, callback);
  }

  /**
   * Allows an object to unsubscribe from an event.
   *
   * @param {string} message
   *   The event type to stop listening for. For available events see LexBotEvents.
   * @param {*} callback
   *   The callback function that was previously registered as the event handler.
   */
  stopListening(message, callback) {
    this.messageBus.stopListening(message, callback);
  }

}

/**
 * Generates a random, anonymous ID that can be used to track a user
 * conversation with the Lex bot.
 *
 * IMPORTANT: It is extremely unlikely that this implementation would generate
 * the same random ID for two different users, but it is not impossible. If
 * you need a truly globally unique session ID you will need to use a different
 * approach.
 *
 * @returns {string} A unique ID for this user session
 */
function generateSimpleSessionId() {
  return `${Math.round(Math.random() * 100000000).toString(16)}-${Date.now().toString(16)}`;
}
