import { useNavigate } from "react-router-dom";
import Pill from "./Pill.jsx";

export default function FightTicket({ fight, eventId, inProgress, alreadyScored, featured }) {
  const navigate = useNavigate();

  return (
    <div
      className={`relative flex overflow-hidden mb-4 rounded ${
        featured
          ? "border-[3px] border-gold shadow-[0_2px_4px_rgba(26,23,20,0.08),0_10px_30px_rgba(212,175,55,0.35)] bg-gradient-to-br from-canvas-light to-[#f0ca63]"
          : "border-2 border-ink shadow-[0_1px_2px_rgba(26,23,20,0.06),0_8px_24px_rgba(26,23,20,0.08)] bg-white"
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-0 bg-gold text-ink font-mono font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-br-md">
          ★ Main Event
        </div>
      )}

      <button
        onClick={() => !alreadyScored && navigate(`/events/${eventId}/fights/${fight.id}/score`)}
        disabled={alreadyScored}
        className={`flex-1 text-left ${featured ? "pt-8 px-5 pb-5" : "px-5 py-4.5"} ${
          alreadyScored ? "opacity-55 cursor-default" : "cursor-pointer"
        }`}
      >
        <div className={`font-display uppercase tracking-wide ${featured ? "font-bold text-2xl" : "font-semibold text-xl"}`}>
          {fight.fighterA.name}
          <span className={`text-corner-red font-bold mx-2 ${featured ? "text-[17px]" : "text-[15px]"}`}>vs</span>
          {fight.fighterB.name}
        </div>
        <div className="flex gap-2 flex-wrap mt-2.5">
          <Pill>{fight.weightClass}</Pill>
          <Pill>{fight.scheduledRounds} Rounds</Pill>
          {fight.titles.map((t) => (
            <Pill key={t} title org={t}>
              {t === "RING" ? "The Ring" : `${t} Title`}
            </Pill>
          ))}
          {alreadyScored && <Pill>Already Scored</Pill>}
          {!alreadyScored && inProgress && (
            <span className="font-mono text-[10.5px] tracking-wide uppercase px-2.5 py-1 rounded-full border border-corner-red text-corner-red">
              Scoring In Progress
            </span>
          )}
        </div>
      </button>

      {!alreadyScored && (
        <div
          className={`flex items-center justify-center flex-shrink-0 border-l-2 border-dashed border-canvas-light/50 ${
            featured ? "w-[130px]" : "w-[110px]"
          }`}
          style={{
            backgroundImage: featured
              ? "repeating-linear-gradient(135deg, #1A1714, #1A1714 6px, #D4AF37 6px, #D4AF37 12px)"
              : "repeating-linear-gradient(135deg, #1A1714, #1A1714 6px, #6B1A25 6px, #6B1A25 12px)",
          }}
        >
          <div className="font-display font-bold text-canvas-light [writing-mode:vertical-rl] tracking-widest text-xs uppercase">
            Score It
          </div>
        </div>
      )}
    </div>
  );
}
