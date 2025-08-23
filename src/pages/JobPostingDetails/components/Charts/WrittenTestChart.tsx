import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/apis/api";
import { useEffect, useState } from "react";

interface WrittenTestChartProps {
  postingOrgan: string;
  postingField: string;
  postingPart: string;
  postingYear: string;
}

type RequestBody = {
  postingOrgan: string;
  postingField: string;
  postingPart: string;
  postingYear: string;
};

// 서버 응답 타입 (다양한 필드가 올 수 있지만 여기선 연도/합격선만 사용)
interface ApiRow {
  postingYear: string;
  postingPassScore: number | null;
  // ...다른 필드가 있어도 무시
}

// 차트용 타입: 합격선만 사용
interface ChartRow {
  postingYear: string;
  postingPassScore: number | null;
  fill?: string;
}

const chartConfig = {
  "2022": { label: "2022", color: "oklch(0.809 0.105 251.813)" },
  "2023": { label: "2023", color: "oklch(0.623 0.214 259.815)" },
  "2024": { label: "2024", color: "oklch(0.546 0.245 262.881)" },
} satisfies ChartConfig;

const COLORS = [
  "oklch(0.809 0.105 251.813)", // 1번째 막대
  "oklch(0.623 0.214 259.815)", // 2번째 막대
  "oklch(0.546 0.245 262.881)", // 3번째 막대
];

const WrittenTestChart = ({
  postingOrgan,
  postingYear,
  postingField,
  postingPart,
}: WrittenTestChartProps) => {
  const [chartData, setChartData] = useState<ChartRow[]>([]);

  const { mutate, isPending } = useMutation<ApiRow[], unknown, RequestBody>({
    mutationFn: async body => {
      const { data } = await axiosInstance.post<ApiRow[]>(
        "/busan/posting/post-chart",
        body
      );
      return data;
    },
    onSuccess: rows => {
      // 서버에서 온 데이터 중 연도/합격선만 추려서 차트 데이터로 변환
      const mapped: ChartRow[] = rows.map(
        ({ postingYear, postingPassScore }) => ({
          postingYear,
          postingPassScore, // null이면 그대로 유지 (바를 0으로 그리고 라벨만 "데이터 없음" 처리)
        })
      );
      setChartData(mapped);
    },
    onError: () => {
      console.error("필기 합격선 차트 불러오기 실패");
      setChartData([]);
    },
  });

  useEffect(() => {
    mutate({ postingOrgan, postingField, postingPart, postingYear });
  }, [postingOrgan, postingField, postingPart, postingYear, mutate]);

  return (
    <div className="written_test_chart space-y-5">
      <div>
        <h2 className="text-xl font-semibold">연도별 필기합격선 현황</h2>
      </div>

      <ResponsiveContainer width="100%">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="postingYear"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: "16px" }}
            />
            <YAxis domain={[0, 100]} hide />

            <Bar
              dataKey="postingPassScore"
              radius={5}
              barSize={40}
              name="합격선"
            >
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-gray-900 text-sm xl:text-base"
                content={props => {
                  const { x, y, width, value } = props;
                  const label = value == null ? "데이터 없음" : `${value}`;

                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y)}
                      dy={-10}
                      textAnchor="middle"
                      fill={value == null ? "#888" : "#101828"}
                      fontSize={14}
                    >
                      {label}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>

      {isPending && <p className="text-sm text-gray-500">불러오는 중...</p>}
    </div>
  );
};

export default WrittenTestChart;
