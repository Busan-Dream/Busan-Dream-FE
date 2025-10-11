import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/apis/api";
import { useEffect, useState } from "react";

type RequestBody = {
  postingOrgan: string;
  postingField: string;
  postingPart: string;
  postingYear: string;
};

// 서버 응답 원본 타입
interface ApiRow {
  postingYear: string;
  postingSelectedNumber: number | null;
  postingApplyNumber: number | null;
  postingPassScore: number | null;
  postingRate: number | null; // "100.6:1" 또는 "null"
}

// 차트용 타입 - postingPassScore 제거
type ChartRow = Omit<ApiRow, "postingPassScore"> & {
  fill?: string;
};

interface CompetitionChartProps {
  postingOrgan: string;
  postingField: string;
  postingPart: string;
  postingYear: string;
}

// 샘플 데이터
// const data = [
//   {
//     postingYear: "2022",
//     postingRate: 125.8,
//     postingSelectedNumber: 6,
//     postingApplyNumber: 755,
//     fill: "var(--color-2022)",
//   },
//   {
//     postingYear: "2023",
//     postingRate: 91.8,
//     postingSelectedNumber: 5,
//     postingApplyNumber: 459,
//     fill: "var(--color-2023)",
//   },
//   {
//     postingYear: "2024",
//     postingRate: 57.3,
//     postingSelectedNumber: 7,
//     postingApplyNumber: 401,
//     fill: "var(--color-2024)",
//   },
// ];

const chartConfig = {
  "2022": {
    label: "2022",
    color: "oklch(70.7% 0.165 254.624)",
  },
  "2023": {
    label: "2023",
    color: "oklch(54.6% 0.245 262.881)",
  },
  "2024": {
    label: "2024",
    color: "oklch(42.4% 0.199 265.638)",
  },
} satisfies ChartConfig;

const COLORS = [
  "oklch(0.809 0.105 251.813)", // 1번째 막대
  "oklch(0.623 0.214 259.815)", // 2번째 막대
  "oklch(0.546 0.245 262.881)", // 3번째 막대
];

const CompetitionChart = ({
  postingOrgan,
  postingYear,
  postingField,
  postingPart,
}: CompetitionChartProps) => {
  const [chartData, setChartData] = useState<ChartRow[]>([]);

  const { mutate } = useMutation<ApiRow[], unknown, RequestBody>({
    mutationFn: async body => {
      const { data } = await axiosInstance.post<ApiRow[]>(
        "/busan/posting/chart",
        body
      );
      return data;
    },
    onSuccess: rows => {
      const mapped: ChartRow[] = rows.map(({ postingRate, ...rest }) => ({
        ...rest,
        postingRate: postingRate === null ? 0 : Number(postingRate), // null이면 0
        hasData: postingRate !== null, // 데이터 유무 flag 추가
      }));
      setChartData(mapped);
    },
    onError: () => {
      console.error("경쟁률 차트 불러오기 실패");
    },
  });

  useEffect(() => {
    mutate({ postingOrgan, postingField, postingPart, postingYear });
  }, [postingOrgan, postingField, postingPart, postingYear, mutate]);

  return (
    <div className="competition_chart space-y-5">
      <div>
        <h2 className="text-xl font-semibold">연도별 채용경쟁률 현황</h2>
      </div>
      {/* 차트 */}
      <ResponsiveContainer width="100%">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ right: 50, top: 0, left: 0, bottom: 0 }}
          >
            <YAxis
              dataKey="postingYear"
              type="category"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: "16px" }}
              tickMargin={10}
            />
            <XAxis
              dataKey="postingRate"
              type="number"
              domain={[0, "dataMax"]}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const row = payload[0].payload;

                return (
                  <div className="space-y-1 rounded-md border bg-white px-3 py-2 text-sm drop-shadow-md xl:text-base">
                    <p>{`${label}년`}</p>
                    {row.postingRate == null ? (
                      <p className="text-gray-500">데이터 없음</p>
                    ) : (
                      <>
                        <p className="text-gray-900">
                          경쟁률{" "}
                          <span
                            className={`${row.postingRate === 0 ? "text-gray-600" : "text-blue-500"}`}
                          >
                            {row.postingRate === 0
                              ? "데이터 없음"
                              : `${row.postingRate}:1`}
                          </span>
                        </p>
                        <p className="text-gray-500">
                          선발인원 {row.postingSelectedNumber ?? "-"} / 지원인원{" "}
                          {row.postingApplyNumber ?? "-"}
                        </p>
                      </>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey="postingRate"
              layout="vertical"
              radius={5}
              maxBarSize={40}
            >
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
              <LabelList
                dataKey="postingRate"
                // position="insideRight" 는 0일 때 축에 딱 붙어버림 → 커스텀으로 제어
                content={({ x = 0, y = 0, width = 0, height = 0, value }) => {
                  const cy = Number(y) + Number(height) / 2;
                  const xEnd = Number(x) + Number(width);
                  const isZero = Number(value) === 0;

                  // 0이면 바깥쪽(축 오른쪽)으로, 0이 아니면 막대 안쪽 우측으로
                  const labelX = isZero ? xEnd + 8 : xEnd - 8;
                  const anchor = isZero ? "start" : "end";
                  const fill = isZero ? "#666" : "#fff";

                  return (
                    <text
                      x={labelX}
                      y={cy}
                      fill={fill}
                      fontSize={14}
                      textAnchor={anchor}
                      alignmentBaseline="middle"
                    >
                      {isZero ? "데이터 없음" : `${value} : 1`}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default CompetitionChart;
