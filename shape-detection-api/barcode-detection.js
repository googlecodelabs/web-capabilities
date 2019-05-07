/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.querySelectorAll('img[alt]:not([alt=""])').forEach(async (img) => {
  try {
    const barcodes = await new BarcodeDetector().detect(img);
    barcodes.forEach(barcode => {
      const div = document.createElement('div');
      const box = barcode.boundingBox;
      const computedStyle = getComputedStyle(img);
      const [top, right, bottom, left] = [
        computedStyle.marginTop,
        computedStyle.marginRight,
        computedStyle.marginBottom,
        computedStyle.marginLeft
      ].map(m => parseInt(m, 10));
      const scaleX = img.width / img.naturalWidth;
      const scaleY = img.height / img.naturalHeight;
      div.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
      div.style.position = 'absolute';
      div.style.top = `${scaleY * box.top + top}px`;
      div.style.left = `${scaleX * box.left - left}px`;
      div.style.width = `${scaleX * box.width}px`;
      div.style.height = `${scaleY * box.height}px`;
      div.style.color = 'black';
      div.style.fontSize = '14px';      
      div.textContent = `${barcode.rawValue}`;
      img.before(div);
    });
  } catch(e) {
    console.error(e);
  }
});

