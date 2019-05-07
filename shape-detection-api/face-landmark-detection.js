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
    const faces = await new FaceDetector().detect(img);
    faces.forEach(face => {
      const div = document.createElement('div');
      const box = face.boundingBox;
      const computedStyle = getComputedStyle(img);
      const [top, right, bottom, left] = [
        computedStyle.marginTop,
        computedStyle.marginRight,
        computedStyle.marginBottom,
        computedStyle.marginLeft
      ].map(m => parseInt(m, 10));
      const scaleX = img.width / img.naturalWidth;
      const scaleY = img.height / img.naturalHeight;
      div.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      div.style.position = 'absolute';
      div.style.top = `${scaleY * box.top + top}px`;
      div.style.left = `${scaleX * box.left + left}px`;
      div.style.width = `${scaleX * box.width}px`;
      div.style.height = `${scaleY * box.height}px`;
      img.before(div);

      const landmarkSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      landmarkSVG.style.position = 'absolute';
      landmarkSVG.classList.add('landmarks');
      landmarkSVG.setAttribute('viewBox', `0 0 ${img.width} ${img.height}`);
      landmarkSVG.style.width = `${img.width}px`;
      landmarkSVG.style.height = `${img.height}px`;
      face.landmarks.map((landmark) => {
        landmarkSVG.innerHTML += `<polygon class="landmark-${landmark.type}" points="${
        landmark.locations.map((point) => {
          return `${scaleX * point.x},${scaleY * point.y} `;
        }).join(' ')
      }" /></svg>`;
      });
      div.before(landmarkSVG);
    });
  } catch(e) {
    console.error(e);
  }
});

