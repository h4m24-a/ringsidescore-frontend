// Renders a shareable PNG snapshot of a scorecard using the native Canvas API.
// Deliberately dependency-free (no html2canvas/dom-to-image) — it redraws the
// scorecard from the underlying data rather than rasterizing the live DOM, so
// it always reflects the full card (rounds, totals, result) regardless of
// whether the on-screen row is currently expanded.

const COLORS = {
  canvas: "#EDE6D6",
  canvasLight: "#F7F4EC",
  ink: "#1A1714",
  cornerRed: "#8B2331",
  gold: "#D4AF37",
  goldLight: "#DEC079",
  slate: "#3E4A52",
  slateLight: "#5A6A73",
  line: "rgba(26,23,20,0.14)",
  lineStrong: "rgba(26,23,20,0.28)",
};

const FONT_DISPLAY = "Oswald";
const FONT_MONO = "JetBrains Mono";

async function ensureFontsReady() {
  if (!document.fonts) return;
  const weights = [
    "400 12px Oswald",
    "600 12px Oswald",
    "700 12px Oswald",
    "700 22px Oswald",
    "400 11px 'JetBrains Mono'",
    "700 11px 'JetBrains Mono'",
  ];
  try {
    await Promise.all(weights.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
  } catch {
    // Fonts API not fully supported — fall back to whatever is available.
  }
}

function lastName(fullName) {
  return fullName.trim().split(" ").slice(-1)[0];
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function resultBadge(card) {
  const { result } = card;

  if (result.type !== "stoppage") {
    return {
      text: "DECISION",
      bg: COLORS.slate,
      fg: COLORS.canvasLight,
    };
  }

  // Normalizes result code / subType / label for method of victory
  const rawCode = (result.code || result.subType || result.label || "").toUpperCase();

  let text = "STOPPAGE";
  let bg = COLORS.cornerRed;

  switch (true) {
    case rawCode.includes("TKO"):
      text = "TKO";
      break;
    case rawCode.includes("KO"):
      text = "KO";
      break;
    case rawCode.includes("DQ") || rawCode.includes("DISQUALIFICATION"):
      text = "DQ";
      break;
    case rawCode.includes("NC") || rawCode.includes("NO CONTEST"):
      text = "NC";
      bg = COLORS.slateLight;
      break;
    case rawCode.includes("RTD") || rawCode.includes("RETIREMENT"):
      text = "RTD";
      break;
    case rawCode.includes("SUB"):
      text = "SUB";
      break;
    default:
      text = rawCode || "STOPPAGE";
      break;
  }

  return { text, bg, fg: COLORS.canvasLight };
}

function resultLine(fight, card) {
  const { result } = card;
  const isStoppage = result.type === "stoppage";
  const isNC = isStoppage && (result.code === "NC" || result.subType === "NC");
  if (isNC) return { plain: "Result: No Contest — no winner declared." };
  if (isStoppage) {
    return {
      prefix: "Winner: ",
      winner: result.winner,
      suffix: ` — ${result.label || result.code || "Stoppage"} in Round ${result.roundStopped}`,
    };
  }
  if (result.winner === "draw") return { plain: "Result: Draw" };
  return { prefix: "Winner: ", winner: result.winner, suffix: " — Unanimous Decision" };
}

/**
 * Draws the scorecard onto a freshly created canvas at the given device scale
 * and returns the canvas element (not yet converted to an image).
 */
async function drawScorecardCanvas(fight, card, { scale = 2 } = {}) {
  await ensureFontsReady();

  const W = 800;
  const rowH = 34;
  const headerH = 108;
  const bodyTopH = 150;
  const tableHeaderH = 30;
  const rounds = card.rounds;
  const tableH = tableHeaderH + rounds.length * rowH + 46; // +46 for totals row
  const footerH = 46;
  const H = headerH + bodyTopH + tableH + footerH;

  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.textBaseline = "alphabetic";

  const nameA = lastName(fight.fighterA.name);
  const nameB = lastName(fight.fighterB.name);
  const badge = resultBadge(card);
  const line = resultLine(fight, card);

  // ---- Header ----
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, 0, W, headerH);

  ctx.fillStyle = COLORS.canvasLight;
  ctx.font = `700 26px ${FONT_DISPLAY}`;
  ctx.fillText(`${fight.fighterA.name.toUpperCase()} VS ${fight.fighterB.name.toUpperCase()}`, 32, 48);

  ctx.fillStyle = COLORS.goldLight;
  ctx.font = `500 13px '${FONT_MONO}'`;
  const subtitle = `${fight.weightClass.toUpperCase()}${
    fight.titles.length > 0 ? ` · ${fight.titles.join("/").toUpperCase()} TITLE` : " · NON-TITLE"
  }`;
  ctx.fillText(subtitle, 32, 74);

  // badge pill (top right)
  ctx.font = `700 12px '${FONT_MONO}'`;
  const badgeText = badge.text.toUpperCase();
  const badgePad = 16;
  const badgeW = ctx.measureText(badgeText).width + badgePad * 2;
  const badgeH = 30;
  const badgeX = W - 32 - badgeW;
  const badgeY = 32;
  ctx.fillStyle = badge.bg;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  ctx.fillStyle = badge.fg;
  ctx.textAlign = "center";
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2 + 4);
  ctx.textAlign = "left";

  // ---- Body top: result line + mini score boxes ----
  ctx.fillStyle = COLORS.canvasLight;
  ctx.fillRect(0, headerH, W, bodyTopH);

  let cursorY = headerH + 42;
  ctx.font = `600 17px ${FONT_DISPLAY}`;
  if (line.plain) {
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(line.plain, 32, cursorY);
  } else {
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(line.prefix, 32, cursorY);
    const prefixW = ctx.measureText(line.prefix).width;
    ctx.fillStyle = COLORS.cornerRed;
    ctx.fillText(line.winner, 32 + prefixW, cursorY);
    const winnerW = ctx.measureText(line.winner).width;
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(line.suffix, 32 + prefixW + winnerW, cursorY);
  }

  // Mini score boxes
  const boxY = headerH + 66;
  const boxH = 54;
  const boxGap = 14;
  const boxW = (W - 64 - boxGap * 2) / 3;
  const boxes = [
    { label: `${nameA.toUpperCase()} TOTAL`, value: String(card.result.finalTotals.a) },
    { label: `${nameB.toUpperCase()} TOTAL`, value: String(card.result.finalTotals.b) },
    {
      label: "ROUNDS SCORED",
      value: `${rounds.filter((r) => r.a != null).length} / ${rounds.length}`,
    },
  ];
  boxes.forEach((b, i) => {
    const bx = 32 + i * (boxW + boxGap);
    ctx.fillStyle = COLORS.canvas;
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 1;
    roundRect(ctx, bx, boxY, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.slate;
    ctx.font = `400 10.5px '${FONT_MONO}'`;
    ctx.fillText(b.label, bx + 12, boxY + 20);
    ctx.fillStyle = COLORS.ink;
    ctx.font = `600 18px ${FONT_DISPLAY}`;
    ctx.fillText(b.value, bx + 12, boxY + 42);
  });

  // ---- Round-by-round table ----
  const tableTop = headerH + bodyTopH;
  ctx.fillStyle = COLORS.canvasLight;
  ctx.fillRect(0, tableTop, W, tableH);

  // Position columns cleanly: Fighter A (left), Round (center), Fighter B (right)
  const colX = { a: 180, round: 400, b: 620 };
  let ty = tableTop + 22;
  ctx.fillStyle = COLORS.slate;
  ctx.font = `400 10.5px '${FONT_MONO}'`;
  ctx.textAlign = "center";
  ctx.fillText(nameA.toUpperCase(), colX.a, ty);
  ctx.fillText("ROUND", colX.round, ty);
  ctx.fillText(nameB.toUpperCase(), colX.b, ty);
  ctx.textAlign = "left";

  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(32, ty + 10);
  ctx.lineTo(W - 32, ty + 10);
  ctx.stroke();

  ty += 10;
  const isStoppage = card.result.type === "stoppage";

  rounds.forEach((r) => {
    ty += rowH;

    const rowTop = ty - rowH;
    const rowBottom = ty;
    const rowCenter = rowTop + rowH / 2;

    const wasStoppedBefore =
      isStoppage && r.round > card.result.roundStopped;

    // Centered Round label (with optional stoppage flag)
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.ink;
    ctx.font = `600 14px ${FONT_DISPLAY}`;
    
    if (r.round === card.result.roundStopped && isStoppage) {
      ctx.fillText(`R${r.round}`, colX.round - 24, rowCenter + 5);
      ctx.fillStyle = COLORS.cornerRed;
      ctx.font = `700 9px '${FONT_MONO}'`;
      ctx.fillText("STOPPED", colX.round + 28, rowCenter + 4);
    } else {
      ctx.fillText(`R${r.round}`, colX.round, rowCenter + 5);
    }

    if (wasStoppedBefore) {
      ctx.fillStyle = COLORS.slateLight;
      ctx.font = `400 11px '${FONT_MONO}'`;
      ctx.fillText("—", colX.a, rowCenter + 4);
      ctx.fillText("—", colX.b, rowCenter + 4);
    } else {
      const highlightA =
        r.a != null &&
        r.b != null &&
        !r.even &&
        r.a > r.b;

      const highlightB =
        r.a != null &&
        r.b != null &&
        !r.even &&
        r.b > r.a;

      drawScoreChip(
        ctx,
        colX.a,
        rowCenter,
        r.a,
        "blue",
        highlightA,
        r.knockdownA
      );

      drawScoreChip(
        ctx,
        colX.b,
        rowCenter,
        r.b,
        "red",
        highlightB,
        r.knockdownB
      );
    }

    ctx.textAlign = "left";

    // separator
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(32, rowBottom);
    ctx.lineTo(W - 32, rowBottom);
    ctx.stroke();
  });

  // Totals row
  ty += 34;
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(32, ty - 22);
  ctx.lineTo(W - 32, ty - 22);
  ctx.stroke();

  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 19px ${FONT_DISPLAY}`;
  ctx.textAlign = "center";
  ctx.fillText(String(card.result.finalTotals.a), colX.a, ty);
  ctx.fillText("Total", colX.round, ty);
  ctx.fillText(String(card.result.finalTotals.b), colX.b, ty);
  ctx.textAlign = "left";

  // ---- Footer branding ----
  const footerTop = tableTop + tableH;
  ctx.fillStyle = COLORS.canvas;
  ctx.fillRect(0, footerTop, W, footerH);
  ctx.fillStyle = COLORS.slateLight;
  ctx.font = `400 11px '${FONT_MONO}'`;
  ctx.fillText("SCORED ON RINGSIDE", 32, footerTop + footerH / 2 + 4);
  ctx.textAlign = "right";
  const dateStr = card.date
    ? new Date(card.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "";
  if (dateStr) ctx.fillText(dateStr, W - 32, footerTop + footerH / 2 + 4);
  ctx.textAlign = "left";

  return canvas;
}

function drawScoreChip(
  ctx,
  centerX,
  centerY,
  value,
  corner,
  highlight,
  knockdown
) {
  const radius = 15;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

  if (highlight) {
    ctx.fillStyle =
      corner === "blue"
        ? COLORS.slate
        : COLORS.cornerRed;

    ctx.fill();

    ctx.fillStyle = COLORS.canvasLight;
  } else {
    ctx.strokeStyle = COLORS.lineStrong;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = COLORS.slate;
  }

  ctx.font = `700 12px '${FONT_MONO}'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    value == null ? "—" : String(value),
    centerX,
    centerY + 1
  );

  // KD = Knockdown in this round
  if (knockdown) {
    ctx.fillStyle = COLORS.gold;
    ctx.font = `700 8px '${FONT_MONO}'`;

    ctx.fillText(
      "Scored Knockdown",
      centerX,
      centerY + radius + 10
    );
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

/**
 * Generates a PNG blob of the given scorecard, suitable for sharing or
 * downloading. Resolves to null if canvas rendering isn't supported.
 */
export async function generateScorecardImage(fight, card, options = {}) {
  const canvas = await drawScorecardCanvas(fight, card, options);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}

export function scorecardFileName(fight) {
  const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${slug(fight.fighterA.name)}-vs-${slug(fight.fighterB.name)}-scorecard.png`;
}