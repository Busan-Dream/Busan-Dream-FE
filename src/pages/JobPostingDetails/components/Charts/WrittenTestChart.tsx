import {
  Bar,
  BarChart,
  CartesianGrid,
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
    postingPassScore: 88.75,
    fill: "var(--color-2022)",
  },
  {
    postingYear: "2023",
    postingPassScore: 91,
    fill: "var(--color-2023)",
  },
  {
    postingYear: "2024",
    postingPassScore: 85,
    fill: "var(--color-2024)",
  },
];

const chartConfig = {
  "2022": {
    label: "2022",
    color: "oklch(0.809 0.105 251.813)",
  },
  "2023": {
    label: "2023",
    color: "oklch(0.623 0.214 259.815)",
  },
  "2024": {
    label: "2024",
    color: "oklch(0.546 0.245 262.881)",
  },
} satisfies ChartConfig;

const WrittenTestChart = () => {
  return (
    <div className="written_test_chart space-y-5">
      <div>
        <h2 className="text-xl font-semibold">연도별 필기합격선 현황</h2>
      </div>
      {/* 차트 */}
      <ResponsiveContainer width="100%">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
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
              fill="var(--color-desktop)"
              radius={5}
              barSize={40}
              name="합격선"
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-gray-900 text-base"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default WrittenTestChart;
