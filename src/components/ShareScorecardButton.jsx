import { useState } from "react";
import { Camera, Download, Loader2 } from "lucide-react";
import {
  generateScorecardImage,
  scorecardFileName,
} from "../utils/scorecardImage.js";

export default function ShareScorecardButton({
  fight,
  card,
  className = "",
}) {
  const [working, setWorking] = useState(false);

  async function createImage() {
    const blob = await generateScorecardImage(fight, card);

    if (!blob) {
      throw new Error("Failed to generate scorecard image.");
    }

    return {
      blob,
      filename: scorecardFileName(fight),
    };
  }

  async function handleShare(e) {
    e.stopPropagation();

    if (working) return;

    setWorking(true);

    try {
      const { blob, filename } = await createImage();

      const file = new File([blob], filename, {
        type: "image/png",
      });

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${fight.fighterA.name} vs ${fight.fighterB.name}`,
          files: [file],
        });
      } else {
        alert("Sharing isn't supported on this device.");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        alert("Unable to share scorecard.");
      }
    } finally {
      setWorking(false);
    }
  }

  async function handleDownload(e) {
    e.stopPropagation();

    if (working) return;

    setWorking(true);

    try {
      const { blob, filename } = await createImage();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      // Desktop browsers support download
      if ("download" in HTMLAnchorElement.prototype) {
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        // Mobile Safari fallback
        window.open(url, "_blank");

        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to download scorecard.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        disabled={working}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide uppercase px-3.5 py-2 rounded border-2 border-ink disabled:opacity-60"
      >
        {working ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Camera size={13} />
        )}

        Share
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={working}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide uppercase px-3.5 py-2 rounded border-2 border-ink disabled:opacity-60"
      >
        <Download size={13} />
        Download
      </button>
    </div>
  );
}