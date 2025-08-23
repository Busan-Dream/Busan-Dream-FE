import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BTC, BMC, BISCO, BECO, BTO } from "@/data/hiresData";

type OrgKey = "BTC" | "BMC" | "BISCO" | "BECO" | "BTO";
type PartKey =
  | "fullTime"
  | "fullTimeDisability"
  | "civilService"
  | "intern"
  | "internDisability";

interface HireChartProps {
  organization: OrgKey;
}

const options = [
  { label: "정규직(일반)", value: "fullTime" },
  { label: "정규직(장애)", value: "fullTimeDisability" },
  { label: "공무직", value: "civilService" },
  { label: "인턴(일반)", value: "intern" },
  { label: "인턴(장애인)", value: "internDisability" },
];

const getData = (org: OrgKey, part: PartKey) => {
  let dataset:
    | typeof BTC
    | typeof BMC
    | typeof BISCO
    | typeof BECO
    | typeof BTO;

  switch (org) {
    case "BTC":
      dataset = BTC;
      break;
    case "BMC":
      dataset = BMC;
      break;
    case "BISCO":
      dataset = BISCO;
      break;
    case "BECO":
      dataset = BECO;
      break;
    case "BTO":
      dataset = BTO;
      break;
  }

  return dataset.find(s => s.part === part)?.data ?? [];
};

const HireChart = ({ organization }: HireChartProps) => {
  const [selected, setSelected] = useState<PartKey>("fullTime");

  const data = useMemo(
    () => getData(organization, selected),
    [organization, selected]
  );

  return (
    <div className="hire_chart space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">기관별 신규 채용 현황</h2>
        <Select
          value={selected}
          onValueChange={val => setSelected(val as PartKey)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem
                key={index}
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 차트 */}
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              tickCount={5}
              hide
            />
            <Tooltip
              content={({ active, payload, label }) => {
                const isVisible = active && payload && payload.length;

                return (
                  <div
                    className="custom-tooltip"
                    style={{ visibility: isVisible ? "visible" : "hidden" }}
                  >
                    {isVisible && (
                      <div className="space-y-1 rounded-md bg-white px-3 py-2 text-sm drop-shadow-md xl:text-base">
                        <p className="label">{`${label}년`}</p>
                        <p className="desc text-blue-500">{`${payload[0].value}명`}</p>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#4DA6FF"
              fill="#4DA6FF"
              fillOpacity={0.4}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HireChart;
