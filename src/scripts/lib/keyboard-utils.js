/*
Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at

  http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied. See the License for the specific language governing
permissions and limitations under the License.
*/

const keyStates = new Map();

document.addEventListener('keydown', (event) => {
  keyStates.set(event.key, Date.now());
});

document.addEventListener('keyup', (event) => {
  keyStates.delete(event.key);
});

/**
 * This class provides static methods and properties for checking the state
 * of keyboard keys.
 */
export class KeyboardUtils {

  /**
   * Queries whether a specific key is pressed.
   *
   * @param {string} keyCode The key code of the key you'd like to query
   * @returns {boolean}
   */
  static isKeyDown(keyCode) {
    return keyStates.has(keyCode);
  }

  /**
   * @returns {Array} An array of key codes
   */
  static get pressedKeys() {
    return [...keyStates.keys()];
  }

  /**
   * Of the keys currently pressed, returns the most recently pressed key.
   * Returns `null` if no key is pressed.
   *
   * @returns {string}
   */
  static get mostRecentKey() {
    return [...keyStates.keys()][0];
  }

}
