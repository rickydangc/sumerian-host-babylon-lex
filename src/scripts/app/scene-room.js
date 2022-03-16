/*
© 2021 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
This AWS Content is provided subject to the terms of the AWS Customer Agreement available at
http://aws.amazon.com/agreement or other written agreement between Customer and either
Amazon Web Services, Inc. or Amazon Web Services EMEA SARL or both.
*/

/**
 * @module room-scene
 *
 * This module demonstrates a scene which was created in the Blender 3D modeling
 * app and exported as glTF. The scene's geometry and lights come directly from
 * Blender. The camera for the scene is created programmatically.
 *
 * This module exports an object named RoomScene which provides a `create()` method.
 */

/**
 * Creates the scene.
 *
 * @param {BABYLON.Engine} engine
 * @returns {BABYLON.Scene}
 */
async function create(engine) {
  const scene = new BABYLON.Scene(engine);
  scene.useRightHandedSystem = true;

  const modelUrl = './3d-assets/environments/room_model/room_model.gltf';
  const sceneAssets = await BABYLON.SceneLoader.LoadAssetContainerAsync(modelUrl);
  sceneAssets.addAllToScene();

  addCamera(scene);

  engine.runRenderLoop(scene.render.bind(scene));

  return scene;
}

function addCamera(scene) {
  const position = new BABYLON.Vector3(0.1, 1.5, 1);
  const aimTarget = new BABYLON.Vector3(-0.3, 1.52, 0);
  const camera = new BABYLON.UniversalCamera('flyCam', position, scene);
  camera.speed = 0.02;
  camera.minZ = 0.05;
  camera.maxZ = 1000;
  camera.fov = 0.6;

  // Set the key bindings that will control camera movement.
  const keyCodes = { w: 87, a: 65, s: 83, d: 68, q: 81, e: 69 };
  camera.keysLeft = [keyCodes.a];
  camera.keysRight = [keyCodes.d];
  camera.keysUp = [keyCodes.w];
  camera.keysDown = [keyCodes.s];
  camera.keysUpward = [keyCodes.e];
  camera.keysDownward = [keyCodes.q];

  camera.setTarget(aimTarget);
}

export const RoomScene = { create };
