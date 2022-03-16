/*
© 2021 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
This AWS Content is provided subject to the terms of the AWS Customer Agreement available at
http://aws.amazon.com/agreement or other written agreement between Customer and either
Amazon Web Services, Inc. or Amazon Web Services EMEA SARL or both.
*/

export class VirtualScreen {

  constructor(mesh, resolutionWidth, resolutionHeight) {
    this._mesh = mesh;
    this.material = this._initMeshMaterial(mesh);

    // Create a hidden iframe to render the content.
    this._createIFrame(resolutionWidth, resolutionHeight);

    window.addEventListener('message', this.handleWindowMessage.bind(this));
  }

  get mesh() {
    return this._mesh;
  }

  loadUrl(url) {
    this.iframe.src = url;
  }

  handleWindowMessage(message) {
    this.material.emissiveTexture = new BABYLON.Texture(
      message.data,
      undefined,
      true,
      false,
    );
  }

  _createIFrame(width, height) {
    this.iframe = document.createElement('iframe');
    this.iframe.id = '_virtualScreenContentSource';
    const { style } = this.iframe;
    style.visibility = 'hidden';
    style.width = `${width}px`;
    style.height = `${height}px`;
    document.body.appendChild(this.iframe);
  }

  _initMeshMaterial(mesh) {
    const material = new BABYLON.StandardMaterial('VirtualScreenMat', mesh.getScene());
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.specularColor = new BABYLON.Color3(0, 0, 0);

    mesh.material = material;

    return material;
  }

}
