import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { BabyIcon, InfoIcon, SparkleIcon } from "./Icon";

export function BottomNav() {
  const { t } = useLanguage();
  const items = [
    { to: "/analyze", label: t.nav.analyze, Icon: SparkleIcon },
    { to: "/dashboard", label: t.nav.myBaby, Icon: BabyIcon },
    { to: "/about", label: t.nav.about, Icon: InfoIcon },
  ];
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="pointer-events-auto safe-bottom mx-auto mb-3 w-[min(420px,calc(100%-1.25rem))] rounded-3xl border border-white/70 bg-white/85 p-1.5 shadow-glow backdrop-blur-xl">
        <ul className="flex items-center justify-between">
          {items.map(({ to, label, Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2.5 text-xs font-medium transition",
                    isActive
                      ? "bg-ink-900 text-white"
                      : "text-ink-500 hover:text-ink-900",
                  ].join(" ")
                }
              >
                <Icon size={22} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
