import { Pie, PieChart } from "recharts";

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

export interface ChartPieLabelProps {
  title: string;
  description?: string;
  chartData: {
    label: string;
    value: number;
    fill: string;
  }[];
}

export function ChartPieLabel({
  chartData,
  title,
  description,
}: ChartPieLabelProps) {
  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.label] = {
      label: item.label,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, text) => (
                    <div className="flex justify-between items-center text-wrap w-full">
                      <span>{text}</span>
                      <span>{formatCompactNumber(Number(value))}</span>
                    </div>
                  )}
                  hideLabel
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              labelLine={true}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
