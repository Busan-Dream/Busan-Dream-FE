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

const data = [
  {
    postingYear: "2022",
    postingRate: 125.8,
    postingSelectedNumber: 6,
    postingApplyNumber: 755,
    fill: "var(--color-2022)",
  },
  {
    postingYear: "2023",
    postingRate: 91.8,
    postingSelectedNumber: 5,
    postingApplyNumber: 459,
    fill: "var(--color-2023)",
  },
  {
    postingYear: "2024",
    postingRate: 57.3,
    postingSelectedNumber: 7,
    postingApplyNumber: 401,
    fill: "var(--color-2024)",
  },
];

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

const CompetitionChart = () => {
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
            data={data}
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

                const row = payload[0].payload as {
                  year: string;
                  postingRate: number;
                  postingSelectedNumber: number;
                  postingApplyNumber: number;
                };

                return (
                  <div className="space-y-1 rounded-md border bg-white px-3 py-2 text-sm drop-shadow-md xl:text-base">
                    <p>{`${label}년`}</p>
                    <p className="text-blue-500">경쟁률 {row.postingRate}:1</p>
                    <p className="text-gray-500">
                      선발인원 {row.postingSelectedNumber} / 지원인원{" "}
                      {row.postingApplyNumber}
                    </p>
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
                content={props => {
                  const { x, y, width, height, value } = props;

                  return (
                    <text
                      x={Number(width) + Number(x) - 20}
                      y={Number(y) + Number(height) / 2}
                      fill="#ffffff"
                      fontSize={15}
                      textAnchor="end"
                      alignmentBaseline="middle"
                    >
                      {value} : 1
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
