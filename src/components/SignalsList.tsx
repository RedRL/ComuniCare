import type { SignalEvidence } from "../models/types";

interface Props {
  signals: SignalEvidence[];
}

export function SignalsList({ signals }: Props) {
  return (
    <ul className="space-y-2">
      {signals.map((s) => {
        const pct = Math.round(s.weight * 100);
        return (
          <li
            key={s.signal}
            className="flex items-center gap-3 rounded-2xl bg-cream-100/60 px-3 py-2.5"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold tabular-nums text-ink-700 shadow-sm">
              {pct}
            </span>
            <span className="text-sm text-ink-700">{s.signal}</span>
          </li>
        );
      })}
    </ul>
  );
}
