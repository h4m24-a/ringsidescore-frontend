import React, { useEffect } from "react";

const COLORS = {
  canvas: "#EDE6D6",
  ink: "#221D16",
  inkSoft: "#4A4238",
  muted: "#867B65",
  line: "#C9BE9F",
  maroon: "#7C2431",
  gold: "#A5811F",
  card: "#F6F1E5",
};

const ROUNDS = [
  {
    num: "Round 01",
    title: "The service",
    body: [
      "Ringside provides an online scorecard-style experience for scoring boxing fights. Users can record their own round-by-round scores and review their scoring history. Ringside is intended as an entertainment, discussion, and personal record-keeping tool.",
      "Ringside is not an official boxing governing body, sanctioning organization, boxing commission, judge, promoter, or broadcaster. A score generated or recorded through Ringside does not constitute an official result of a boxing match.",
    ],
  },
  {
    num: "Round 02",
    title: "Accounts",
    body: [
      "Some features require you to create an account. When creating an account, you agree to provide an accurate email address and to keep your account information reasonably current.",
      "You are responsible for maintaining the confidentiality of your login credentials and for activity occurring through your account, except where that activity results from circumstances for which Ringside is responsible. You must notify us promptly if you believe someone has accessed your account without permission.",
    ],
  },
  {
    num: "Round 03",
    title: "Eligibility",
    body: [
      "You must be legally permitted to use Ringside in the jurisdiction where you live. Ringside is not directed toward children. If you are below the minimum age at which you may lawfully use an online service or create an account in your jurisdiction, you may not create an account unless any consent or authorization required by applicable law has been obtained.",
      "We may restrict or terminate accounts where we reasonably believe an account has been created in violation of applicable age requirements.",
    ],
  },
  {
    num: "Round 04",
    title: "Your scorecards and activity",
    body: [
      "You retain whatever rights you have in original material you submit to Ringside. By submitting scoring information to Ringside, you grant us a limited, non-exclusive, worldwide license to host, store, reproduce, process, and display that information as reasonably necessary to provide and operate the Service. This includes saving your scorecards and displaying your previous scores to you.",
      "This license does not transfer ownership of your original scorecards or other material to Ringside. If we introduce public scorecards, leaderboards, sharing features, or other community features, additional terms or controls may apply.",
    ],
  },
  {
    num: "Round 05",
    title: "Acceptable use",
    body: [
      "You agree not to:",
      {
        list: [
          "Use Ringside for unlawful purposes.",
          "Attempt to gain unauthorized access to accounts, systems, or data.",
          "Interfere with or disrupt the Service.",
          "Circumvent security or access controls.",
          "Scrape or systematically collect information from the Service in a way that violates applicable law or our technical restrictions.",
          "Upload malicious code or content designed to compromise the Service.",
          "Impersonate another person or falsely claim an affiliation with another person or organization.",
          "Use the Service to violate another person's rights.",
          "Abuse, attack, or deliberately overload the Service.",
          "Attempt to reverse engineer or exploit the Service except where applicable law expressly permits such activity.",
        ],
      },
      "We may suspend or terminate access where reasonably necessary to protect the Service, its users, or others, subject to applicable law.",
    ],
  },
  {
    num: "Round 06",
    title: "Boxing information and accuracy",
    body: [
      "Ringside may contain information about boxing matches, fighters, rounds, scores, dates, records, or other boxing-related information. We attempt to provide useful and accurate information, but we do not guarantee that every piece of boxing-related information is complete, current, or error-free.",
      "Your score is your own assessment using the scoring tools provided by Ringside. A Ringside score should not be represented as an official boxing score unless an authorized boxing authority has separately made that determination.",
    ],
  },
  {
    num: "Round 07",
    title: "No gambling or wagering",
    body: [
      "Ringside is designed for scoring, discussion, and entertainment. Ringside does not itself provide betting, wagering, gambling, or prediction-market services. You may not use Ringside to conduct unlawful gambling or wagering activities.",
      "If we introduce any feature involving money, prizes, competitions, or wagering, that feature will be subject to additional terms and any legally required restrictions.",
    ],
  },
  {
    num: "Round 08",
    title: "Intellectual property",
    body: [
      "Ringside, including its software, interface, design, branding, logos, and original content, is owned by or licensed to Ringside — Fight Scorecards and is protected by applicable intellectual-property laws.",
      "Except as expressly permitted by these Terms or applicable law, you may not copy, modify, distribute, sell, lease, reverse engineer, or commercially exploit Ringside or its proprietary components. Nothing in these Terms gives you ownership of Ringside's trademarks, branding, software, or other intellectual property.",
    ],
  },
  {
    num: "Round 09",
    title: "Third-party services",
    body: [
      "Ringside may use or link to third-party services, websites, data providers, hosting providers, or other resources. We are not responsible for third-party services that we do not control. Your use of a third-party service may be governed by that provider's own terms and privacy policy.",
    ],
  },
  {
    num: "Round 10",
    title: "Availability and changes",
    body: [
      "We may modify, update, suspend, or discontinue parts of Ringside from time to time. We do not guarantee that the Service will always be available, uninterrupted, secure, or error-free. We may perform maintenance or make changes necessary to improve functionality, security, or reliability.",
    ],
  },
  {
    num: "Round 11",
    title: "Account termination",
    body: [
      { html: 'You may stop using Ringside at any time. You may request deletion of your account by contacting <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a> or using any account-deletion feature we provide.' },
      "We may suspend or terminate an account if:",
      {
        list: [
          "You materially breach these Terms.",
          "Your use creates a security or legal risk.",
          "We reasonably believe the account is being used fraudulently or unlawfully.",
          "We discontinue the relevant Service.",
        ],
      },
      "Termination does not automatically require us to delete information that we are legally required or otherwise permitted to retain.",
    ],
  },
  {
    num: "Round 12",
    title: "Disclaimers",
    body: [
      'To the maximum extent permitted by applicable law, Ringside is provided on an "as available" basis. We do not guarantee that the Service will meet every user\'s requirements or that information provided through the Service will always be complete, accurate, or current.',
      "Nothing in these Terms excludes or limits any consumer-protection, statutory, or other legal rights that cannot lawfully be excluded or limited.",
    ],
  },
  {
    num: "Round 13",
    title: "Limitation of liability",
    body: [
      "To the maximum extent permitted by applicable law, Ringside — Fight Scorecards will not be responsible for indirect, incidental, special, consequential, or punitive losses arising from your use of the Service.",
      "Nothing in these Terms limits liability where such limitation is prohibited by law, including liability that cannot legally be excluded or limited under applicable consumer-protection or other mandatory laws.",
    ],
  },
  {
    num: "Round 14",
    title: "Indemnity",
    body: [
      "To the extent permitted by applicable law, you agree to be responsible for losses or claims arising from your unlawful use of Ringside, your material breach of these Terms, or your infringement of another person's rights.",
      "This section does not apply to the extent that the relevant loss was caused by Ringside's own acts or omissions or where such an agreement cannot legally be enforced.",
    ],
  },
  {
    num: "Round 15",
    title: "Privacy",
    body: [
      "Our collection and use of personal information is described in our Privacy Policy. By using Ringside, you acknowledge that you have been provided with that Privacy Policy.",
    ],
  },
  {
    num: "Round 16",
    title: "Governing law",
    body: [
      "These Terms are governed by the laws of England and Wales. If you are a consumer in another country or jurisdiction, you may also have mandatory rights and protections under the laws of that jurisdiction. Nothing in these Terms is intended to exclude or limit those rights where they cannot legally be excluded or limited.",
      "Any dispute that cannot be resolved informally will be subject to the jurisdiction of the courts of England and Wales, except where applicable consumer-protection law gives you the right to bring proceedings in another jurisdiction.",
    ],
  },
  {
    num: "Round 17",
    title: "Changes to these terms",
    body: [
      "We may update these Terms from time to time. If we make material changes, we will take reasonable steps to notify users where appropriate. Your continued use of Ringside after updated Terms become effective means that you accept the updated Terms, except where applicable law requires a different form of acceptance.",
    ],
  },
  {
    num: "Round 18",
    title: "Contact",
    body: [
      { html: 'Ringside — Fight Scorecards<br/>Website: <a href="https://ringsidescore.com">ringsidescore.com</a><br/>Email: <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a>' },
      { html: 'For privacy-related requests, please use <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a>.' },
    ],
  },
];

function useGoogleFonts() {
  useEffect(() => {
    const id = "ringside-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function Ropes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, margin: "44px 0 36px" }}>
      <span style={{ display: "block", height: 2, background: COLORS.line }} />
      <span style={{ display: "block", height: 3, background: COLORS.maroon, opacity: 0.55 }} />
      <span style={{ display: "block", height: 2, background: COLORS.line }} />
    </div>
  );
}

function RoundBody({ body }) {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 1.75, color: COLORS.inkSoft, paddingLeft: 2 }}>
      {body.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} style={{ margin: "0 0 12px" }}>
              {block}
            </p>
          );
        }
        if (block.list) {
          return (
            <ul key={i} style={{ margin: "0 0 12px", paddingLeft: 20 }}>
              {block.list.map((item, j) => (
                <li key={j} style={{ marginBottom: 6 }}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.html) {
          return (
            <p
              key={i}
              style={{ margin: "0 0 12px" }}
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

function Round({ num, title, body }) {
  return (
    <section style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.12em",
            color: "#F6EFE0",
            background: COLORS.maroon,
            padding: "4px 10px 3px",
            textTransform: "uppercase",
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: COLORS.ink,
          }}
        >
          {title}
        </span>
      </div>
      <RoundBody body={body} />
    </section>
  );
}

export default function RingsideTerms() {
  useGoogleFonts();

  const linkStyle = `
    .ringside-terms a { color: ${COLORS.maroon}; text-decoration-color: ${COLORS.gold}; }
  `;

  return (
    <div
      style={{
        background: COLORS.canvas,
        minHeight: "100vh",
        fontFamily: "'Source Serif 4', Georgia, serif",
        color: COLORS.ink,
        WebkitFontSmoothing: "antialiased",
      }}
      className="ringside-terms"
    >
      <style>{linkStyle}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 96px" }}>
        {/* Ticket stub header */}
        <div
          style={{
            marginTop: 56,
            border: `1.5px solid ${COLORS.ink}`,
            background: COLORS.card,
            padding: "36px 32px 28px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 7,
              border: `1px dashed ${COLORS.gold}`,
              pointerEvents: "none",
            }}
          />
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.maroon,
              margin: "0 0 14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Date. 2026-08-10</span>
            <span>18 rounds</span>
          </p>
          <h1
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              fontSize: "clamp(34px, 7vw, 52px)",
              lineHeight: 0.98,
              margin: "0 0 6px",
              color: COLORS.ink,
            }}
          >
            Ringside
            <span
              style={{
                display: "block",
                fontSize: "0.36em",
                letterSpacing: "0.24em",
                color: COLORS.maroon,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              Fight Scorecards
            </span>
          </h1>
          <div
            style={{
              marginTop: 26,
              paddingTop: 16,
              borderTop: `1px solid ${COLORS.line}`,
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 28px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11.5,
              color: COLORS.inkSoft,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <span>
              Doc — <b style={{ color: COLORS.ink, fontWeight: 500 }}>Terms of Service</b>
            </span>
            <span>
              Last updated — <b style={{ color: COLORS.ink, fontWeight: 500 }}>10 August 2026</b>
            </span>
            <span>
              Venue — <b style={{ color: COLORS.ink, fontWeight: 500 }}>ringsidescore.com</b>
            </span>
          </div>
        </div>

        <p style={{ margin: "30px 4px 8px", fontSize: 16, lineHeight: 1.7, color: COLORS.inkSoft }}>
          These Terms of Service ("Terms") govern your use of ringsidescore.com and related
          services operated by Ringside — Fight Scorecards ("Ringside", "we", "us", or "our").
          By creating an account or using Ringside, you agree to these Terms. If you do not
          agree with these Terms, please do not use the Service.
        </p>

        <Ropes />

        {ROUNDS.map((round, i) => (
          <React.Fragment key={round.num}>
            <Round num={round.num} title={round.title} body={round.body} />
            {i < ROUNDS.length - 1 && (
              <div style={{ height: 1, background: COLORS.line, margin: "34px 0 30px" }} />
            )}
          </React.Fragment>
        ))}

        <footer
          style={{
            marginTop: 60,
            borderTop: `1.5px solid ${COLORS.ink}`,
            paddingTop: 22,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          <span>Ringside — Fight Scorecards</span>
          <span>Not an official scoring body</span>
        </footer>
      </div>
    </div>
  );
}