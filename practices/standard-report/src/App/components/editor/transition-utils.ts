import type { EditorSourceRect } from 'src/model';

const toBorderRadius = (value: string) => {
  const radius = Number.parseFloat(value);
  return Number.isFinite(radius) ? radius : 28;
};

export const readEditorSourceRect = (
  element?: Element | null,
): EditorSourceRect | null => {
  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  const computedStyle = window.getComputedStyle(element);

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius: toBorderRadius(computedStyle.borderRadius),
  };
};

export const getViewportRect = (): EditorSourceRect => {
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
  };
};

export const getFallbackRect = (): EditorSourceRect => {
  const width = Math.max(window.innerWidth * 0.88, 320);
  const height = Math.max(window.innerHeight * 0.78, 320);

  return {
    top: Math.max((window.innerHeight - height) / 2, 24),
    left: Math.max((window.innerWidth - width) / 2, 24),
    width: Math.min(width, window.innerWidth - 48),
    height: Math.min(height, window.innerHeight - 48),
    borderRadius: 28,
  };
};

export const getFrameMotionValues = (rect: EditorSourceRect) => {
  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);

  return {
    x: rect.left,
    y: rect.top,
    scaleX: rect.width / viewportWidth,
    scaleY: rect.height / viewportHeight,
    borderRadius: rect.borderRadius,
  };
};

export const findPreviewElement = (pageId: string) => {
  return document.querySelector(`[data-report-preview-page-id="${pageId}"]`);
};
