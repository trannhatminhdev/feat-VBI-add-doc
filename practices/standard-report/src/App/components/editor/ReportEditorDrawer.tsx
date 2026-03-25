import { ArrowLeftOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from 'motion/react';
import { APP as StandardAPP } from 'standard';
import { Button } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type EditorSourceRect, useReportStore } from 'src/model';
import { useReportPageBuilder } from '../../hooks/useReportPageBuilder';
import {
  findPreviewElement,
  getFallbackRect,
  getFrameMotionValues,
  getViewportRect,
  readEditorSourceRect,
} from './transition-utils';

type TransitionPhase = 'closed' | 'opening' | 'open' | 'closing';
const CLOSE_FALLBACK_MS = 420;

const FRAME_TRANSITION = {
  type: 'spring',
  stiffness: 250,
  damping: 30,
  mass: 0.88,
} as const;

const BACKDROP_TRANSITION = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

const createSafeSourceRect = (
  pageId?: string,
  sourceRect?: EditorSourceRect | null,
): EditorSourceRect | null => {
  if (sourceRect) {
    return sourceRect;
  }

  if (pageId && typeof document !== 'undefined') {
    return readEditorSourceRect(findPreviewElement(pageId));
  }

  return null;
};

export const ReportEditorDrawer = () => {
  const open = useReportStore((state) => state.editorOpen);
  const pageId = useReportStore((state) => state.activePageId);
  const sourceRect = useReportStore((state) => state.editorSourceRect);
  const report = useReportStore((state) => state.report);
  const reportBuilder = useReportStore((state) => state.reportBuilder);
  const closeEditor = useReportStore((state) => state.closeEditor);
  const pageBuilder = useReportPageBuilder(reportBuilder, pageId);
  const page = report.pages.find((item) => item.id === pageId);
  const [phase, setPhase] = useState<TransitionPhase>('closed');
  const [mounted, setMounted] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [frameRect, setFrameRect] = useState<EditorSourceRect>(() =>
    typeof window === 'undefined'
      ? { top: 0, left: 0, width: 0, height: 0, borderRadius: 0 }
      : getViewportRect(),
  );
  const rafRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearPending = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearPending();
    setMounted(false);
    setShowEditor(false);
    setPhase('closed');
    closeEditor();
  }, [clearPending, closeEditor]);

  const beginClose = useCallback(() => {
    if (!mounted) {
      closeEditor();
      return;
    }

    clearPending();
    setShowEditor(false);
    setPhase('closing');

    const targetRect =
      createSafeSourceRect(
        pageId,
        readEditorSourceRect(findPreviewElement(pageId)),
      ) ??
      sourceRect ??
      getFallbackRect();

    rafRef.current = requestAnimationFrame(() => {
      setFrameRect(targetRect);
    });
    closeTimeoutRef.current = window.setTimeout(() => {
      finishClose();
    }, CLOSE_FALLBACK_MS);
  }, [clearPending, closeEditor, finishClose, mounted, pageId, sourceRect]);

  useEffect(() => {
    if (!open || !pageId || typeof window === 'undefined') {
      return;
    }

    clearPending();

    const nextSourceRect =
      createSafeSourceRect(pageId, sourceRect) ?? getFallbackRect();

    setMounted(true);
    setShowEditor(false);
    setPhase('opening');
    setFrameRect(nextSourceRect);

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setFrameRect(getViewportRect());
      });
    });

    return () => {
      clearPending();
    };
  }, [clearPending, open, pageId, sourceRect]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        beginClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [beginClose, mounted]);

  useEffect(() => {
    return () => {
      clearPending();
    };
  }, [clearPending]);

  const handleFrameAnimationComplete = useCallback(() => {
    if (phase === 'opening') {
      setShowEditor(true);
      setPhase('open');
      return;
    }

    if (phase === 'closing') {
      finishClose();
    }
  }, [finishClose, phase]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <div
        className={`standard-report-editor-root is-${phase}`}
        data-testid="standard-report-editor-root"
      >
        <motion.div
          className="standard-report-editor-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'closing' ? 0 : 1 }}
          transition={BACKDROP_TRANSITION}
          onClick={beginClose}
        />
        <div className="standard-report-editor">
          <motion.div
            className="standard-report-editor-frame"
            initial={false}
            animate={getFrameMotionValues(frameRect)}
            transition={FRAME_TRANSITION}
            onAnimationComplete={handleFrameAnimationComplete}
          >
            <div className="standard-report-editor-header">
              <div className="standard-report-editor-nav">
                <Button
                  className="standard-report-editor-back"
                  color="default"
                  variant="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={beginClose}
                >
                  Go Back
                </Button>
              </div>
              <div className="standard-report-editor-summary">
                <span className="standard-report-editor-kicker">
                  Chart Editor
                </span>
                <h2 className="standard-report-editor-title">
                  {page?.title || '编辑图表'}
                </h2>
              </div>
            </div>

            <div className="standard-report-editor-body">
              {showEditor && pageBuilder ? (
                <StandardAPP builder={pageBuilder.chart} mode="edit" />
              ) : (
                <div className="standard-report-editor-placeholder" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};
