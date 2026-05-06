import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "../i18n/LanguageContext";
import type { BabyState } from "../models/types";
import { aiService } from "../services/aiService";
import { STATE_COLORS } from "./StateDonut";

interface Props {
  counts: Record<BabyState, number>;
}

export function StateBar({ counts }: Props) {
  const { t } = useLanguage();
  const data = aiService.ALL_STATES.map((s) => ({
    state: s,
    label: t.states[s],
    value: counts[s] ?? 0,
  }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-ink-400">
        —
      </div>
    );
  }
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis hide allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            formatter={(v: number) => [v, t.dashboard.statAnalyses]}
            contentStyle={{
              border: "none",
              borderRadius: 12,
              boxShadow: "0 8px 24px -10px rgba(0,0,0,0.15)",
              fontSize: 12,
            }}
            labelStyle={{ color: "#1F2433", fontWeight: 600 }}
          />
          <Bar dataKey="value" radius={[10, 10, 4, 4]}>
            {data.map((d) => (
              <Cell key={d.state} fill={STATE_COLORS[d.state]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
