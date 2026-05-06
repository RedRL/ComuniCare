import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "../i18n/LanguageContext";
import type { BabyState } from "../models/types";

const COLORS: Record<BabyState, string> = {
  tired: "#7C7AE6",
  overstimulated: "#F2A66B",
  hungry: "#5DC9A1",
  discomfort: "#E97A8A",
  content: "#7CB6E8",
  playful: "#E9C46A",
  other: "#B6BCC9",
};

interface Props {
  data: { state: BabyState; value: number }[];
}

export function StateDonut({ data }: Props) {
  const { t } = useLanguage();
  const filtered = data.filter((d) => d.value > 0);
  if (filtered.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-ink-400">
        —
      </div>
    );
  }
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="state"
            innerRadius={48}
            outerRadius={76}
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
          >
            {filtered.map((d) => (
              <Cell key={d.state} fill={COLORS[d.state]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name, payload) => [
              `${Math.round(value * 100)}%`,
              t.states[(payload?.payload?.state as BabyState) ?? "other"],
            ]}
            contentStyle={{
              border: "none",
              borderRadius: 12,
              boxShadow: "0 8px 24px -10px rgba(0,0,0,0.15)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const STATE_COLORS = COLORS;
