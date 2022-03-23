/*
© 2021 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
This AWS Content is provided subject to the terms of the AWS Customer Agreement available at
http://aws.amazon.com/agreement or other written agreement between Customer and either
Amazon Web Services, Inc. or Amazon Web Services EMEA SARL or both.
*/

/**
 * When this script is added to the header of an HTML page that is used in an iframe it will
 * send an image capture of itself to the parent HTML page via a call to `document.postMessage()`.
 * The value that is passed will be a base 64 image URL.
 *
 * You must include both this script and the "htmlToImage" library in the header of the iframe
 * page in this order:
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.9.0/html-to-image.js"></script>
 * <script src="scripts/iframe-capture.js"></script>
 */

export function renderPageAsImage() {
  console.log(`Rendering page as image. ${window.location}`);

  const el = document.getElementById('content');
  htmlToImage.toPng(el)
    .then((dataUrl) => {
      window.parent.postMessage(dataUrl, '*');
    })
    .catch((error) => {
      console.error('There was a problem turning the HTML content into a PNG image.', error);
    });
}
