import type { VBIReportPageDSL } from '@visactor/vbi';
import type { CarouselRef } from 'antd/es/carousel';
import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

export const useCarouselDisplayIndex = (
  pages: VBIReportPageDSL[],
  activePageId: string,
  carouselRef: RefObject<CarouselRef | null>,
) => {
  const activeIndex = Math.max(
    pages.findIndex(({ id }) => id === activePageId),
    0,
  );

  useEffect(() => {
    if (pages[activeIndex]) carouselRef.current?.goTo(activeIndex);
  }, [activeIndex, carouselRef, pages]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!pages[nextIndex]) return;
      carouselRef.current?.goTo(nextIndex);
    },
    [carouselRef, pages],
  );

  return { goTo };
};
