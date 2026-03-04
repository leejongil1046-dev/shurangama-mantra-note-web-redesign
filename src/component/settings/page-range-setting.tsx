import Slider from "rc-slider";
import "rc-slider/assets/index.css";

type PageRangeSettingProps = {
  totalPages: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

export default function PageRangeSetting({
  totalPages,
  value,
  onChange,
}: PageRangeSettingProps) {
  const [pageStart, pageEnd] = value;

  return (
    <section className="flex items-start justify-between gap-40">
      <div className="min-w-[140px] space-y-1 pt-1">
        <h2 className="text-2xl font-medium text-gray-800">페이지 선택</h2>
        <p className="text-md text-gray-500">
          1~{totalPages}페이지 중 연속된 구간을 선택합니다.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between pt-1 text-md text-gray-500">
          <span>
            선택 범위: {pageStart}페이지 ~ {pageEnd}페이지
          </span>
          <span>전체: 1 ~ {totalPages}</span>
        </div>

        <div className="px-1">
          <Slider
            range
            min={1}
            max={totalPages}
            value={[pageStart, pageEnd]}
            onChange={(v) => {
              if (!Array.isArray(v)) return;
              const [start, end] = v;
              onChange([start, end]);
            }}
            allowCross={false}
            step={1}
            trackStyle={[{ backgroundColor: "#50535b", height: 6 }]}
            railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
            handleStyle={[
              {
                borderColor: "#111827",
                backgroundColor: "#ffffff",
                width: 16,
                height: 16,
                marginTop: -5,
              },
              {
                borderColor: "#111827",
                backgroundColor: "#ffffff",
                width: 16,
                height: 16,
                marginTop: -5,
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
