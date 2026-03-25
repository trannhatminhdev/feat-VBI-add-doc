import type { VBIReportBuilder, VBIReportPageDSL } from '@visactor/vbi';
import { Carousel } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { CSSProperties } from 'react';
import { useCallback, useRef } from 'react';
import { useCarouselDisplayIndex } from '../../hooks/useCarouselDisplayIndex';
import { PagePreviewCard } from '../page/PagePreviewCard';

type ReportCarouselProps = {
  pages: VBIReportPageDSL[];
  activePageId: string;
  reportBuilder: VBIReportBuilder;
  style?: CSSProperties;
  onAdd: () => void;
  onChange: (pageId: string) => void;
  onEdit: (pageId: string, sourceElement?: HTMLElement | null) => void;
  onRemove: (pageId: string) => void;
};

export const ReportCarousel = ({
  pages,
  activePageId,
  reportBuilder,
  onAdd,
  onChange,
  onEdit,
  onRemove,
}: ReportCarouselProps) => {
  const carouselRef = useRef<CarouselRef | null>(null);
  const { goTo } = useCarouselDisplayIndex(pages, activePageId, carouselRef);
  const handleAfterChange = useCallback(
    (index: number) => {
      const nextPage = pages[index];
      if (nextPage) onChange(nextPage.id);
    },
    [onChange, pages],
  );

  return (
    <Carousel
      ref={carouselRef}
      className="standard-report-carousel"
      infinite={false}
      dots={false}
      afterChange={handleAfterChange}
    >
      {pages.map((page, index) => (
        <div key={page.id} className="standard-report-slide">
          <PagePreviewCard
            canRemove={pages.length > 1}
            index={index}
            page={page}
            pageCount={pages.length}
            reportBuilder={reportBuilder}
            onAddPage={onAdd}
            onEdit={onEdit}
            onNavigate={goTo}
            onRemovePage={onRemove}
          />
        </div>
      ))}
    </Carousel>
  );
};
