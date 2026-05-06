import { CheckIcon } from "./Icon";

interface Props {
  suggestions: string[];
}

export function SuggestionsList({ suggestions }: Props) {
  return (
    <ul className="space-y-2">
      {suggestions.map((s, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-2xl bg-mint-softer px-3 py-2.5"
        >
          <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-white text-emerald-600 shadow-sm">
            <CheckIcon size={16} />
          </span>
          <span className="text-sm leading-snug text-ink-700">{s}</span>
        </li>
      ))}
    </ul>
  );
}
