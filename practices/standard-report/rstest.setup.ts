import { expect } from '@rstest/core';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';

expect.extend(jestDomMatchers);

const createCanvasContext = () => {
  return {
    fillStyle: '',
    strokeStyle: '',
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    rect() {},
    fill() {},
    stroke() {},
    clip() {},
    save() {},
    restore() {},
    translate() {},
    scale() {},
    rotate() {},
    setTransform() {},
    transform() {},
    drawImage() {},
    fillText() {},
    strokeText() {},
    createImageData() {
      return [];
    },
    getImageData() {
      return { data: new Uint8ClampedArray() };
    },
    putImageData() {},
    measureText() {
      return { width: 0 };
    },
  };
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: () => createCanvasContext(),
});
