import type { VBIReportBuilder, VBIReportPageDSL } from '@visactor/vbi';
import { Carousel } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { useCarouselDisplayIndex } from '../../hooks/useCarouselDisplayIndex';
import { PagePreviewCard } from '../page/PagePreviewCard';

type ReportCarouselProps = {
  pages: VBIReportPageDSL[];
  activePageId: string;
  reportBuilder: VBIReportBuilder;
  revision: number;
  style?: CSSProperties;
  onAdd: () => void;
  onChange: (pageId: string) => void;
  onEdit: (pageId: string) => void;
  onRemove: (pageId: string) => void;
};

export const ReportCarousel = ({
  pages,
  activePageId,
  reportBuilder,
  revision,
  onAdd,
  onChange,
  onEdit,
  onRemove,
}: ReportCarouselProps) => {
  const carouselRef = useRef<CarouselRef | null>(null);
  const { goTo } = useCarouselDisplayIndex(pages, activePageId, carouselRef);

  return (
    <section className="standard-report-stage-shell">
      <Carousel
        ref={carouselRef}
        className="standard-report-carousel"
        infinite={false}
        dots={false}
        afterChange={(index) => {
          const nextPage = pages[index];
          if (nextPage) onChange(nextPage.id);
        }}
      >
        {pages.map((page, index) => (
          <div key={page.id} className="standard-report-slide">
            <PagePreviewCard
              canGoNext={index < pages.length - 1}
              canGoPrev={index > 0}
              canRemove={pages.length > 1}
              page={page}
              reportBuilder={reportBuilder}
              revision={revision}
              onAddPage={onAdd}
              onEdit={onEdit}
              onGoNext={() => goTo(index + 1)}
              onGoPrev={() => goTo(index - 1)}
              onRemovePage={onRemove}
            />
          </div>
        ))}
      </Carousel>
    </section>
  );
};
