import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  ShieldCheck,
  MapPin,
  Ruler,
  Scale,
  Flag,
  Sun,
  Moon,
  ImageOff,
  Medal,
  Award,
  Star,
  Info,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Utilities                                                         */
/* ------------------------------------------------------------------ */

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

/** Counts a number up from 0 to target once `active` becomes true. */
function useCountUp(target, active, duration = 1100) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

/** Reveals an element once it scrolls into view (IntersectionObserver). */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const RECORD = { wins: 42, losses: 0, draws: 0, ko: 31 };

// Each belt object now contains its specific individual acquisition year
const SUPER_MIDDLEWEIGHT_TITLES = [
  { org: "Ring", label: "RING", full: "The Ring Magazine", name: "Ring Magazine", year: "2025" },
  { org: "WBA", label: "WBA", full: "World Boxing Association", name: "WBA (Super)", year: "2025" },
  { org: "WBC", label: "WBC", full: "World Boxing Council", name: "WBC", year: "2025" },
  { org: "IBF", label: "IBF", full: "International Boxing Federation", name: "IBF", year: "2025" },
  { org: "WBO", label: "WBO", full: "World Boxing Organisation", name: "WBO", year: "2025" },
];

const LIGHT_MIDDLEWEIGHT_TITLES = [
  { org: "WBA", label: "WBA", full: "World Boxing Association", name: "WBA Super", year: "2024" },
];

const WELTERWEIGHT_TITLES = [
  { org: "Ring", label: "RING", full: "The Ring Magazine", name: "Ring Magazine", year: "2023" },
  { org: "WBA", label: "WBA", full: "World Boxing Association", name: "WBA (Super)", year: "2023" },
  { org: "WBC", label: "WBC", full: "World Boxing Council", name: "WBC", year: "2023" },
  { org: "IBF", label: "IBF", full: "International Boxing Federation", name: "IBF", year: "2023" },
  { org: "WBO", label: "WBO", full: "World Boxing Organisation", name: "WBO", year: "2018" },
];

const LIGHT_WELTERWEIGHT_TITLES = [
  { org: "Ring", label: "RING", full: "The Ring Magazine", name: "Ring Magazine", year: "2017" },
  { org: "WBA", label: "WBA", full: "World Boxing Association", name: "WBA (Super)", year: "2017" },
  { org: "WBC", label: "WBC", full: "World Boxing Council", name: "WBC", year: "2016" },
  { org: "IBF", label: "IBF", full: "International Boxing Federation", name: "IBF", year: "2017" },
  { org: "WBO", label: "WBO", full: "World Boxing Organisation", name: "WBO", year: "2015" },
];

const LIGHTWEIGHT_TITLES = [
  { org: "Ring", label: "RING", full: "The Ring Magazine", name: "Ring Magazine", year: "2014" },
  { org: "WBO", label: "WBO", full: "World Boxing Organisation", name: "WBO", year: "2014" },
];

const ORG_STYLE = {
  WBC: { text: "text-emerald-700 dark:text-emerald-400" },
  WBA: { text: "text-amber-700 dark:text-amber-400" },
  IBF: { text: "text-blue-700 dark:text-blue-400" },
  WBO: { text: "text-rose-700 dark:text-rose-400" },
  Ring: { text: "text-slate-700 dark:text-slate-300" },
};

const TIMELINE = [
  {
    year: "2014",
    title: "First World Title",
    desc: "Traveled to Scotland and defeated Ricky Burns by unanimous decision to win the WBO Lightweight World Championship.",
  },
  {
    year: "2017",
    title: "Undisputed Light Welterweight",
    desc: "Knocked out Julius Indongo in the 3rd round to collect all four major titles, becoming the first undisputed champion at 140 lbs in the four-belt era.",
  },
  {
    year: "2023",
    title: "Undisputed Welterweight",
    desc: "Dominated Errol Spence Jr. via 9th-round TKO to unify the welterweight division and become the first male two-division undisputed champion in the four-belt era.",
  },
  {
    year: "2025",
    title: "Three-Division Undisputed & Retirement",
    desc: "Defeated Canelo Alvarez via Unanimous Decision to claim the Undisputed Super Middleweight Championship, concluding a legendary career at 42-0.",
  },
];

const FIGHT_HISTORY = [
  { opponent: "Canelo Alvarez", result: "Win", method: "Unanimous Decision", round: "12/12", date: "Sep 13, 2025", venue: "Las Vegas, NV", status: "Undisputed" },
  { opponent: "Israil Madrimov", result: "Win", method: "Unanimous Decision", round: "12/12", date: "Aug 03, 2024", venue: "Los Angeles, CA", status: "Won Title" },
  { opponent: "Errol Spence Jr.", result: "Win", method: "TKO", round: "9/12", date: "Jul 29, 2023", venue: "Las Vegas, NV", status: "Undisputed" },
  { opponent: "David Avanesyan", result: "Win", method: "KO", round: "6/12", date: "Dec 10, 2022", venue: "Omaha, NE", status: "Defense" },
  { opponent: "Shawn Porter", result: "Win", method: "TKO", round: "10/12", date: "Nov 20, 2021", venue: "Las Vegas, NV", status: "Defense" },
  { opponent: "Kell Brook", result: "Win", method: "TKO", round: "4/12", date: "Nov 14, 2020", venue: "Las Vegas, NV", status: "Defense" },
  { opponent: "Egidijus Kavaliauskas", result: "Win", method: "TKO", round: "9/12", date: "Dec 14, 2019", venue: "New York, NY", status: "Defense" },
  { opponent: "Amir Khan", result: "Win", method: "TKO", round: "6/12", date: "Apr 20, 2019", venue: "New York, NY", status: "Defense" },
  { opponent: "Julius Indongo", result: "Win", method: "KO", round: "3/12", date: "Aug 19, 2017", venue: "Lincoln, NE", status: "Undisputed" },
];

const ACHIEVEMENTS = [
  { icon: Award, label: "Three-Division Undisputed", meta: "Light Welterweight, Welterweight & Super Middleweight" },
  { icon: Trophy, label: "Five-Division World Champion", meta: "Titles captured from 135 lbs to 168 lbs" },
  { icon: ShieldCheck, label: "Undefeated Legend", meta: "Retired with a pristine 42-0 (31 KOs) record" },
  { icon: Star, label: "Fighter of the Year", meta: "Multiple-time consensus award winner" },
  { icon: Medal, label: "Pound-for-Pound King", meta: "Unanimous consensus top P4P fighter" },
];

/* ------------------------------------------------------------------ */
/*  Small presentational building blocks                               */
/* ------------------------------------------------------------------ */

function SectionHeader({ eyebrow, title, t }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 border-b border-current/10 pb-5">
      <div>
        <p className={cn("font-mono text-[11px] uppercase tracking-[0.35em]", t.muted)}>{eyebrow}</p>
        <h2 className={cn("mt-2 font-display text-4xl leading-none tracking-wide sm:text-5xl", t.heading)}>
          {title}
        </h2>
      </div>
    </div>
  );
}

function Watermark({ children, t }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -top-6 right-4 z-10 select-none font-display text-[7rem] leading-none sm:text-[9rem]",
        t.watermark
      )}
    >
      {children}
    </span>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "fixed right-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isDark
          ? "border-[#F5F2E8]/15 bg-[#17181B] text-[#F5F2E8] focus-visible:ring-[#D8B45C]"
          : "border-slate-200 bg-white text-slate-700 focus-visible:ring-[#2359D1]"
      )}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function ProfileImage({ t }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mx-auto w-[260px] sm:w-[300px] md:mx-0">
      <div
        className={cn(
          "group overflow-hidden rounded-sm border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]",
          t.border,
          t.surface
        )}
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-[#C8A14B] via-[#D8B45C] to-[#C8A14B]" aria-hidden="true" />
        <div className={cn("flex aspect-[3/4] items-center justify-center overflow-hidden", t.track)}>
          {failed ? (
            <div className={cn("flex flex-col items-center gap-2 px-6 text-center font-body text-xs", t.muted)}>
              <ImageOff size={26} aria-hidden="true" />
              Photo unavailable
            </div>
          ) : (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1QjHaJFsAGhHHZpYG9X_k3JfNHWOYuHizSVB5M2qh-4ff7IvHcg6chfX&s=20"
              alt="Portrait of Terence Crawford in fighting stance"
              loading="lazy"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover grayscale-[15%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          "absolute -bottom-4 left-5 right-5 flex items-center justify-between gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] shadow-sm",
          t.plaqueEdge
        )}
      >
        <span>Undisputed</span>
        <span className="text-[#C8A14B]">Three Divisions</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, color, active, t, delay = 0 }) {
  const count = useCountUp(value, active);
  return (
    <div
      className={cn(
        "px-6 py-10 text-center transition-all duration-700",
        active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className={cn("font-mono text-[11px] uppercase tracking-[0.35em]", t.muted)}>{label}</p>
      <p className={cn("mt-3 font-display text-6xl sm:text-7xl", color)}>
        {count}
        {suffix}
      </p>
    </div>
  );
}

function ChampionshipCard({ title, org, t, delay = 0, visible }) {
  const style = ORG_STYLE[org.org] ?? ORG_STYLE.Ring;
  return (
    <div
      className={cn(
        "group relative overflow-hidden border p-6 transition-all duration-500 hover:-translate-y-1",
        t.surface,
        t.border,
        t.plaqueShadow,
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
      title={org.full}
    >
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C8A14B] via-[#D8B45C] to-[#C8A14B]" aria-hidden="true" />
      <div className="flex items-start justify-between">
        <span className={cn("font-mono text-xs font-semibold tracking-[0.2em]", style.text)}>{org.label}</span>
        {/* Uses individual year from the org object */}
        <span className={cn("font-mono text-[10px] font-semibold", t.muted)}>{org.year}</span>
      </div>
      <p className={cn("mt-5 font-display text-2xl leading-tight tracking-wide", t.heading)}>
        {title}
      </p>
      <p className={cn("mt-2 font-body text-xs", t.muted)}>{org.name}</p>
    </div>
  );
}

function TimelineItem({ item, t, isLast, visible, delay }) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-[auto_1fr] gap-6 pb-12 transition-all duration-700",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "flex h-3 w-3 shrink-0 rounded-full ring-4",
            t.dotRing
          )}
        />
        {!isLast && <span className={cn("mt-2 w-px flex-1", t.timelineLine)} aria-hidden="true" />}
      </div>
      <div className="-mt-1">
        <p className="font-mono text-sm font-semibold tracking-[0.15em] text-[#C8A14B]">{item.year}</p>
        <h3 className={cn("mt-1 font-display text-2xl tracking-wide", t.heading)}>{item.title}</h3>
        <p className={cn("mt-2 max-w-xl font-body text-sm leading-relaxed", t.body)}>{item.desc}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Champion: "bg-[#C8A14B]/10 text-[#93701F] ring-[#C8A14B]/30 dark:text-[#D8B45C] dark:ring-[#D8B45C]/30",
    Defense: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20",
    "Won Title": "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    Eliminator: "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20",
    Undisputed: "bg-[#C8A14B]/10 text-[#93701F] ring-[#C8A14B]/30 dark:text-[#D8B45C] dark:ring-[#D8B45C]/30",
  };
  return (
    <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] ring-1 ring-inset", map[status])}>
      {status}
    </span>
  );
}

function FightHistoryTable({ t }) {
  return (
    <>
      <div className={cn("hidden overflow-hidden border md:block", t.border)}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", t.muted, t.surfaceMuted)}>
              <th className="px-5 py-4 font-medium">Opponent</th>
              <th className="px-5 py-4 font-medium">Result</th>
              <th className="px-5 py-4 font-medium">Method</th>
              <th className="px-5 py-4 font-medium">Round</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Venue</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", t.divide)}>
            {FIGHT_HISTORY.map((f) => (
              <tr key={`${f.opponent}-${f.date}`} className={cn("font-body text-sm transition-colors", t.rowHover)}>
                <td className={cn("px-5 py-4 font-medium", t.heading)}>{f.opponent}</td>
                <td className="px-5 py-4 font-semibold text-emerald-700 dark:text-emerald-400">{f.result}</td>
                <td className={cn("px-5 py-4", t.body)}>{f.method}</td>
                <td className={cn("px-5 py-4 font-mono text-xs", t.body)}>{f.round}</td>
                <td className={cn("px-5 py-4 font-mono text-xs", t.body)}>{f.date}</td>
                <td className={cn("px-5 py-4", t.body)}>{f.venue}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={f.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {FIGHT_HISTORY.map((f) => (
          <div key={`${f.opponent}-${f.date}-m`} className={cn("border p-5", t.border, t.surface)}>
            <div className="flex items-start justify-between gap-3">
              <p className={cn("font-display text-xl tracking-wide", t.heading)}>{f.opponent}</p>
              <StatusBadge status={f.status} />
            </div>
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              {f.result} · {f.method}
            </p>
            <dl className={cn("mt-4 grid grid-cols-2 gap-y-2 font-body text-xs", t.body)}>
              <dt className={t.muted}>Round</dt>
              <dd className="text-right font-mono">{f.round}</dd>
              <dt className={t.muted}>Date</dt>
              <dd className="text-right font-mono">{f.date}</dd>
              <dt className={t.muted}>Venue</dt>
              <dd className="text-right">{f.venue}</dd>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

function AchievementCard({ item, t, visible, delay }) {
  const Icon = item.icon;
  return (
    <div
      className={cn(
        "group flex items-start gap-4 border p-6 transition-all duration-500 hover:-translate-y-1",
        t.border,
        t.surface,
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 transition-colors",
          "text-[#93701F] ring-[#C8A14B]/30 group-hover:bg-[#C8A14B]/10 dark:text-[#D8B45C] dark:ring-[#D8B45C]/30"
        )}
      >
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <p className={cn("font-display text-xl tracking-wide", t.heading)}>{item.label}</p>
        <p className={cn("mt-1 font-body text-xs", t.muted)}>{item.meta}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

function HeroSection({ t, loaded }) {
  return (
    <header className={cn("relative overflow-hidden border-b", t.border, t.surface)}>
      <div className={cn("pointer-events-none absolute inset-0", t.grid)} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b pb-5 font-mono text-[11px] uppercase tracking-[0.35em]", t.border, t.muted)}>
          <span>Fight Night Program</span>
          <span>P4P Hall of Fame · Retired</span>
        </div>

        <div className="mt-14 grid gap-14 md:grid-cols-[minmax(0,1fr)_300px] md:items-end">
          <div
            className={cn(
              "transition-all duration-1000",
              loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <p className="font-mono text-sm uppercase tracking-[0.4em] text-[#B42318]">
              Southpaw · &quot;Bud&quot;
            </p>
            <h1 className={cn("mt-3 font-display text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.82] tracking-wide", t.heading)}>
              Terence
              <br />
              Crawford
            </h1>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className={cn("font-display text-5xl tracking-wide text-[#C8A14B]")}>
                {RECORD.wins}–{RECORD.losses}–{RECORD.draws}
              </span>
              <span className={cn("font-body text-lg", t.body)}>Three-Division Undisputed Champion</span>
            </div>

            <dl className={cn("mt-10 grid grid-cols-2 gap-x-8 gap-y-4 font-body text-sm sm:grid-cols-4", t.body)}>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-[#2359D1]" aria-hidden="true" />
                <dt className="sr-only">Hometown</dt>
                <dd>Omaha, NE</dd>
              </div>
              <div className="flex items-center gap-3">
                <Ruler size={16} className="shrink-0 text-[#2359D1]" aria-hidden="true" />
                <dt className="sr-only">Height and reach</dt>
                <dd>5&apos;8&quot; · 74&quot;</dd>
              </div>
              <div className="flex items-center gap-3">
                <Scale size={16} className="shrink-0 text-[#2359D1]" aria-hidden="true" />
                <dt className="sr-only">Weight class</dt>
                <dd>Super Middleweight</dd>
              </div>
              <div className="flex items-center gap-3">
                <Flag size={16} className="shrink-0 text-[#2359D1]" aria-hidden="true" />
                <dt className="sr-only">Age</dt>
                <dd>Age 38</dd>
              </div>
            </dl>
          </div>

          <div
            className={cn(
              "transition-all delay-300 duration-1000",
              loaded ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.97] opacity-0"
            )}
          >
            <ProfileImage t={t} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function FighterProfile() {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const koRate = Math.round((RECORD.ko / RECORD.wins) * 100);

  const [tapeRef, tapeVisible] = useReveal();
  const [beltsRef, beltsVisible] = useReveal();
  const [timelineRef, timelineVisible] = useReveal(0.05);
  const [summaryRef, summaryVisible] = useReveal();
  const [historyRef, historyVisible] = useReveal(0.05);
  const [achieveRef, achieveVisible] = useReveal();

  const theme = isDark
    ? {
        page: "bg-[#0F1012] text-[#F5F2E8]",
        surface: "bg-[#17181B] border-[#F5F2E8]/10",
        surfaceMuted: "bg-[#F5F2E8]/[0.03] border-[#F5F2E8]/10",
        rowHover: "hover:bg-[#F5F2E8]/[0.03]",
        heading: "text-[#F5F2E8]",
        body: "text-[#F5F2E8]/70",
        muted: "text-[#F5F2E8]/45",
        divide: "divide-[#F5F2E8]/10",
        border: "border-[#F5F2E8]/10",
        track: "bg-[#F5F2E8]/[0.06]",
        watermark: "text-[#F5F2E8]/[0.035]",
        grid:
          "opacity-[0.05] [background-image:linear-gradient(to_right,#F5F2E8_1px,transparent_1px),linear-gradient(to_bottom,#F5F2E8_1px,transparent_1px)] [background-size:32px_32px]",
        dotRing: "bg-[#D8B45C] ring-[#D8B45C]/20",
        timelineLine: "bg-[#F5F2E8]/10",
        plaqueEdge: "border-[#D8B45C]/25 bg-[#17181B] text-[#F5F2E8]/80",
        plaqueShadow: "shadow-[0_1px_0_0_rgba(216,180,92,0.15)_inset]",
      }
    : {
        page: "bg-[#F8F6F1] text-[#111111]",
        surface: "bg-white border-slate-200",
        surfaceMuted: "bg-slate-50 border-slate-100",
        rowHover: "hover:bg-slate-50",
        heading: "text-[#111111]",
        body: "text-slate-600",
        muted: "text-slate-400",
        divide: "divide-slate-200",
        border: "border-slate-200",
        track: "bg-slate-100",
        watermark: "text-slate-900/[0.035]",
        grid:
          "opacity-[0.04] [background-image:linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] [background-size:32px_32px]",
        dotRing: "bg-[#C8A14B] ring-[#C8A14B]/20",
        timelineLine: "bg-slate-200",
        plaqueEdge: "border-[#C8A14B]/30 bg-white text-slate-600",
        plaqueShadow: "shadow-[0_1px_0_0_rgba(200,161,75,0.2)_inset]",
      };

  return (
    <main className={cn("min-h-screen antialiased transition-colors duration-300 motion-reduce:transition-none", theme.page)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <a
        href="#tape"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[#B42318] focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:text-white"
      >
        Skip to fight record
      </a>

      <ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />

      <HeroSection t={theme} loaded={loaded} />

      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Tale of the Tape */}
        <section id="tape" ref={tapeRef} aria-labelledby="tape-heading" className="relative">
          <Watermark t={theme}>01</Watermark>
          <SectionHeader eyebrow="Section 01 · Certified Record" title="Tale of the Tape" t={theme} />

          <div className={cn("overflow-hidden border", theme.border, theme.surface)}>
            <div className={cn("grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0", theme.divide)}>
              <StatCard label="Wins" value={RECORD.wins} color="text-[#C8A14B]" active={tapeVisible} t={theme} delay={0} />
              <StatCard label="Losses" value={RECORD.losses} color="text-[#B42318]" active={tapeVisible} t={theme} delay={80} />
              <StatCard label="Draws" value={RECORD.draws} color={theme.muted} active={tapeVisible} t={theme} delay={160} />
              <StatCard label="By KO" value={RECORD.ko} color="text-[#2359D1]" active={tapeVisible} t={theme} delay={240} />
            </div>

            <div className={cn("border-t px-6 py-6", theme.border)}>
              <div className={cn("flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]", theme.body)}>
                <span>KO Rate</span>
                <span aria-hidden="true">{koRate}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={koRate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Knockout rate"
                className={cn("mt-3 h-1.5 w-full overflow-hidden rounded-full", theme.track)}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2359D1] to-[#C8A14B] transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                  style={{ width: tapeVisible ? `${koRate}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Championships */}
        <section ref={beltsRef} className="relative mt-24" aria-labelledby="belts-heading">
          <Watermark t={theme}>02</Watermark>
          <SectionHeader eyebrow="Section 02 · Unified &amp; Undisputed" title="Championships" t={theme} />

          <h3 className={cn("font-mono text-xs uppercase tracking-[0.3em]", theme.muted)}>Super Middleweight (168 lbs)</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPER_MIDDLEWEIGHT_TITLES.map((org, i) => (
              <ChampionshipCard key={`smw-${org.org}`} title="Super Middleweight" org={org} t={theme} visible={beltsVisible} delay={i * 70} />
            ))}
          </div>

          <h3 className={cn("mt-12 font-mono text-xs uppercase tracking-[0.3em]", theme.muted)}>Light Middleweight (154 lbs)</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LIGHT_MIDDLEWEIGHT_TITLES.map((org, i) => (
              <ChampionshipCard key={`lmw-${org.org}`} title="Light Middleweight" org={org} t={theme} visible={beltsVisible} delay={i * 70} />
            ))}
          </div>

          <h3 className={cn("mt-12 font-mono text-xs uppercase tracking-[0.3em]", theme.muted)}>Welterweight (147 lbs)</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WELTERWEIGHT_TITLES.map((org, i) => (
              <ChampionshipCard key={`ww-${org.org}`} title="Welterweight" org={org} t={theme} visible={beltsVisible} delay={i * 70} />
            ))}
          </div>

          <h3 className={cn("mt-12 font-mono text-xs uppercase tracking-[0.3em]", theme.muted)}>Light Welterweight (140 lbs)</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LIGHT_WELTERWEIGHT_TITLES.map((org, i) => (
              <ChampionshipCard key={`lww-${org.org}`} title="Light Welterweight" org={org} t={theme} visible={beltsVisible} delay={i * 70} />
            ))}
          </div>

          <h3 className={cn("mt-12 font-mono text-xs uppercase tracking-[0.3em]", theme.muted)}>Lightweight (135 lbs)</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LIGHTWEIGHT_TITLES.map((org, i) => (
              <ChampionshipCard key={`lw-${org.org}`} title="Lightweight" org={org} t={theme} visible={beltsVisible} delay={i * 70} />
            ))}
          </div>
        </section>

        {/* Career Timeline */}
        <section ref={timelineRef} className="relative mt-24" aria-labelledby="timeline-heading">
          <Watermark t={theme}>03</Watermark>
          <SectionHeader eyebrow="Section 03 · The Road Here" title="Career Timeline" t={theme} />

          <div className="mt-4 max-w-3xl">
            {TIMELINE.map((item, i) => (
              <TimelineItem
                key={item.year}
                item={item}
                t={theme}
                isLast={i === TIMELINE.length - 1}
                visible={timelineVisible}
                delay={i * 100}
              />
            ))}
          </div>
        </section>

        {/* Career Summary */}
        <section ref={summaryRef} className="relative mt-24" aria-labelledby="career-heading">
          <Watermark t={theme}>04</Watermark>
          <div
            className={cn(
              "border p-10 transition-all duration-700",
              theme.border,
              theme.surface,
              summaryVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            <h2 id="career-heading" className={cn("font-mono text-xs uppercase tracking-[0.3em]", theme.muted)}>
              Section 04 · Career Summary
            </h2>
            <p className={cn("mt-5 max-w-3xl font-display text-3xl leading-tight tracking-wide sm:text-4xl", theme.heading)}>
              An undefeated master technician and multi-division legend.
            </p>
            <p className={cn("mt-5 max-w-2xl font-body leading-relaxed", theme.body)}>
              Widely regarded as one of the greatest pound-for-pound boxers in history,
              Terence &quot;Bud&quot; Crawford combined elite switch-hitting ability, distance control,
              and ruthless finishing power. He captured 18 major world titles across five weight classes
              and retired as an undefeated, three-division undisputed champion.
            </p>
            <div className={cn("mt-8 flex items-start gap-3 border-l-2 border-[#C8A14B] pl-4 font-body text-sm", theme.body)}>
              <Info size={16} className="mt-0.5 shrink-0 text-[#C8A14B]" aria-hidden="true" />
              Undisputed champion across three distinct weight divisions — an unprecedented historic feat in the four-belt era.
            </div>
          </div>
        </section>

        {/* Fight History */}
        <section ref={historyRef} className="relative mt-24" aria-labelledby="history-heading">
          <Watermark t={theme}>05</Watermark>
          <SectionHeader eyebrow="Section 05 · Selected Bouts" title="Fight History" t={theme} />
          <FightHistoryTable t={theme} />
        </section>

        {/* Achievements */}
        <section ref={achieveRef} className="relative mt-24" aria-labelledby="achievements-heading">
          <Watermark t={theme}>06</Watermark>
          <SectionHeader eyebrow="Section 06 · Honors" title="Achievements" t={theme} />
          <div className="grid gap-4 sm:grid-cols-2">
            {ACHIEVEMENTS.map((item, i) => (
              <AchievementCard key={item.label} item={item} t={theme} visible={achieveVisible} delay={i * 70} />
            ))}
          </div>
        </section>

        <footer className={cn("mt-24 flex flex-col items-center gap-2 border-t pt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em]", theme.border, theme.muted)}>
          <span>Record accurate as of publication · All belts unified</span>
        </footer>
      </div>
    </main>
  );
}