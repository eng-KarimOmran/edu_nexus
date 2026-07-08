import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/formatCompactNumber";

export interface ChartBarLabelProps {
  title: string;
  description?: string;
  chartData: {
    label: string;
    value: number;
    fill: string;
  }[];
}

export function ChartBarLabel({
  title,
  description,
  chartData,
}: ChartBarLabelProps) {
  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.label] = {
      label: item.label,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span>
                      {typeof value === "number"
                        ? formatCompactNumber(value)
                        : value}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => formatCompactNumber(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
