import {
  Bar,
  BarChart,
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
        "/busan/posting/post-chart",
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
                        <p className="text-blue-500">
                          경쟁률{" "}
                          {row.postingRate === 0
                            ? "데이터 없음"
                            : `${row.postingRate}:1`}
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
              <LabelList
                dataKey="postingRate"
                position="insideRight"
                offset={8}
                content={({ x, y, width, height, value }) => {
                  if (x == null || y == null) return null;

                  return (
                    <text
                      x={Number(x) + Number(width) + 5}
                      y={Number(y) + Number(height) / 2}
                      fill={value === 0 ? "#888" : "#fff"}
                      fontSize={14}
                      textAnchor="end"
                      alignmentBaseline="middle"
                    >
                      {value === 0 ? "데이터 없음" : `${value} : 1`}
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
