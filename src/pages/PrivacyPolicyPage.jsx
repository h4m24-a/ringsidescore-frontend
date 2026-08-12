import React, { useEffect } from "react";

const COLORS = {
  canvas: "#EDE6D6",
  ink: "#221D16",
  inkSoft: "#443E33",
  muted: "#8A8070",
  line: "#CBC1A6",
  navy: "#2E3D59",
  navyDeep: "#1D2838",
  stamp: "#8B3A3A",
  card: "#F6F1E5",
};

const FILES = [
  {
    tag: "01",
    title: "Information we collect",
    body: [
      { h: "Account information" },
      {
        list: [
          "Your email address.",
          "A securely generated password hash associated with your account. We do not store your password in plain text.",
          "Information necessary to maintain and secure your account.",
        ],
      },
      { h: "Fight-scoring information" },
      "When you use Ringside, we may collect and store:",
      {
        list: [
          "The fights you score.",
          "Your round-by-round scores.",
          "Your final scorecard or result.",
          "The date and time associated with your scoring activity.",
          "Other information directly associated with your scoring history.",
        ],
      },
      "Your scoring history is associated with your account so that you can review your previous scorecards and use features based on your history.",
      { h: "Technical and usage information" },
      {
        list: [
          "IP address.",
          "Browser and device information.",
          "Login and authentication information.",
          "Basic information about how you interact with the Service.",
          "Error, security, and diagnostic information.",
        ],
      },
      "If we introduce analytics, advertising, cookies, or other tracking technologies that collect additional information, we will provide appropriate information about those technologies and obtain consent where required by applicable law.",
    ],
  },
  {
    tag: "02",
    title: "How we use your information",
    body: [
      "We use your information to:",
      {
        list: [
          "Create and maintain your account.",
          "Authenticate you and keep your account secure.",
          "Save and display your fight scorecards.",
          "Maintain your scoring history.",
          "Provide and improve Ringside.",
          "Prevent fraud, abuse, unauthorized access, and other misuse.",
          "Diagnose technical problems and maintain the security of the Service.",
          "Communicate with you about your account, the Service, or important changes to our policies.",
          "Comply with applicable legal obligations.",
        ],
      },
      "We do not use your scoring history to make decisions about your eligibility for employment, credit, insurance, housing, or similar services.",
    ],
  },
  {
    tag: "03",
    title: "Our legal bases for processing",
    body: [
      "Where laws such as the EU General Data Protection Regulation (GDPR) or UK GDPR apply, we process personal information using one or more lawful bases. These may include:",
      { h: "Performance of a contract" },
      "We process information necessary to provide the account and Service you request, including maintaining your account and saving your scorecards.",
      { h: "Legitimate interests" },
      "We may process information where reasonably necessary for legitimate interests such as maintaining Service security, preventing abuse, improving Ringside, and maintaining appropriate business records, provided those interests are not overridden by your rights.",
      { h: "Legal obligation" },
      "We may process information where necessary to comply with applicable laws or valid legal requests.",
      { h: "Consent" },
      "Where applicable law requires consent, we will request it before carrying out the relevant processing. You may withdraw consent where legally permitted.",
    ],
  },
  {
    tag: "04",
    title: "How we use scoring history",
    body: [
      "Your scoring history is part of the functionality of Ringside. We use your scoring history to:",
      {
        list: [
          "Save your scorecards.",
          "Allow you to review previous scores.",
          "Provide statistics or features based on your scoring activity.",
          "Operate and improve the scoring functionality.",
        ],
      },
      "Your scorecards are associated with your account. If we introduce public profiles, public scorecards, leaderboards, social features, or other features that make scoring activity visible to other users, we will provide appropriate information and controls where required by applicable law.",
    ],
  },
  {
    tag: "05",
    title: "Password security",
    body: [
      "We do not store account passwords in plain text. Passwords should be processed using an appropriate password-hashing mechanism and stored in a manner designed to reduce the risk of unauthorized disclosure.",
      "You are responsible for keeping your account credentials confidential and should not reuse your Ringside password on other services.",
      { html: 'If you believe your account has been compromised, contact us at <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a>.' },
    ],
  },
  {
    tag: "06",
    title: "Who we share information with",
    body: [
      "We may share personal information with service providers that help us operate Ringside, such as:",
      {
        list: [
          "Hosting and cloud infrastructure providers.",
          "Database providers.",
          "Authentication or email-delivery providers.",
          "Security and fraud-prevention providers.",
          "Analytics providers, where applicable.",
        ],
      },
      "These providers should only receive information reasonably necessary to perform services for us and, where required, will be subject to appropriate contractual and legal protections.",
      "We may also disclose information:",
      {
        list: [
          "Where required by law or valid legal process.",
          "To protect the rights, safety, security, or property of Ringside, our users, or others.",
          "In connection with a merger, acquisition, financing, restructuring, sale of assets, or similar business transaction.",
        ],
      },
      "We do not sell your personal information for money.",
    ],
  },
  {
    tag: "07",
    title: "International data transfers",
    body: [
      "Ringside is available to users internationally. Your information may therefore be processed in countries other than the country where you live.",
      "Where applicable law restricts international transfers of personal information, we will use appropriate legally recognized safeguards for those transfers.",
    ],
  },
  {
    tag: "08",
    title: "How long we keep information",
    body: [
      "We keep personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy. Generally:",
      {
        list: [
          "Account information is retained while your account remains active.",
          "Scoring history is retained while it is needed to provide your scoring-history functionality.",
          "Certain information may be retained for longer where necessary for security, fraud prevention, dispute resolution, legal claims, or compliance with legal obligations.",
        ],
      },
      "When information is no longer required, we will delete it or securely anonymize it where reasonably practicable.",
    ],
  },
  {
    tag: "09",
    title: "Your privacy rights",
    body: [
      "Depending on where you live and which laws apply to you, you may have rights including:",
      {
        list: [
          "The right to know what personal information we process.",
          "The right to access your personal information.",
          "The right to correct inaccurate information.",
          "The right to request deletion of your information.",
          "The right to restrict or object to certain processing.",
          "The right to receive certain information in a portable format.",
          "The right to withdraw consent where processing is based on consent.",
          "Rights relating to automated decision-making and profiling where applicable.",
        ],
      },
      "These rights are subject to applicable legal exceptions and limitations.",
      { html: 'To exercise a privacy right, contact <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a>. We may need to verify your identity before completing certain requests.' },
    ],
  },
  {
    tag: "10",
    title: "California privacy rights",
    body: [
      "If the California Consumer Privacy Act, as amended by the California Privacy Rights Act (CCPA/CPRA), applies to Ringside and your personal information, California residents may have additional rights, which may include rights to:",
      {
        list: [
          "Know or access the categories and specific pieces of personal information collected.",
          "Delete personal information, subject to applicable exceptions.",
          "Correct inaccurate personal information.",
          "Opt out of the sale or sharing of personal information, where applicable.",
          "Limit certain uses and disclosures of sensitive personal information, where applicable.",
          "Receive equal treatment for exercising applicable privacy rights.",
        ],
      },
      "Ringside does not sell personal information for money.",
      { html: 'To submit a California privacy request, contact <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a>. We will not discriminate against you for exercising privacy rights provided by applicable California law.' },
    ],
  },
  {
    tag: "11",
    title: "European and UK users",
    body: [
      "If EU or UK data-protection law applies to you, you may have additional rights under the GDPR or UK GDPR, including the right to:",
      {
        list: [
          "Request access to your personal data.",
          "Request correction or deletion.",
          "Request restriction of processing.",
          "Object to certain processing.",
          "Request data portability.",
          "Withdraw consent where processing is based on consent.",
          "Lodge a complaint with a relevant data-protection supervisory authority.",
        ],
      },
      "For UK users, the relevant supervisory authority is generally the Information Commissioner's Office (ICO). For EU users, you may generally contact the data-protection authority in the EU country where you live, work, or where you believe an infringement occurred.",
    ],
  },
  {
    tag: "12",
    title: "Cookies and similar technologies",
    body: [
      "Ringside may use cookies or similar technologies that are necessary for login, authentication, security, and basic functionality.",
      "If we use optional analytics, advertising, or other non-essential tracking technologies, we will provide appropriate information and, where required, obtain consent before using them.",
      "You can control certain cookies through your browser and, where provided, our cookie settings.",
    ],
  },
  {
    tag: "13",
    title: "Security",
    body: [
      "We use reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.",
      "However, no internet service can guarantee absolute security.",
      "You should use a unique password for your Ringside account and notify us promptly if you suspect unauthorized access.",
    ],
  },
  {
    tag: "14",
    title: "Changes to this Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time. If we make material changes, we will take reasonable steps to notify users where required by law.",
      'The "Last updated" date at the top of this policy indicates when it was most recently revised.',
    ],
  },
  {
    tag: "15",
    title: "Contact us",
    body: [
      { html: 'Ringside — Fight Scorecards<br/>Website: <a href="https://ringsidescore.com">ringsidescore.com</a><br/>Privacy email: <a href="mailto:ringsidescore@gmail.com">ringsidescore@gmail.com</a>' },
      "If you have questions about this Privacy Policy or how we handle personal information, please contact us by email.",
    ],
  },
];

function useFonts() {
  useEffect(() => {
    const id = "ringside-privacy-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function Stamp() {
  return (
    <div
      style={{
        position: "absolute",
        top: 26,
        right: 26,
        width: 108,
        height: 108,
        borderRadius: "50%",
        border: `2px solid ${COLORS.navy}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(-8deg)",
        opacity: 0.85,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: "50%",
          border: `1px dotted ${COLORS.navy}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 8.5,
          letterSpacing: "0.08em",
          color: COLORS.navy,
          lineHeight: 1.5,
          textTransform: "uppercase",
          padding: 6,
        }}
      >
        Data controller
        <br />
        UK GDPR
        <br />
        on file
      </div>
    </div>
  );
}

function FileEntry({ tag, title, body }) {
  return (
    <section style={{ display: "flex", gap: 22, marginBottom: 8 }}>
      <div
        style={{
          flexShrink: 0,
          width: 46,
          paddingTop: 3,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          color: COLORS.navy,
          fontWeight: 500,
        }}
      >
        {tag}
      </div>
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontFamily: "'Zilla Slab', serif",
            fontWeight: 600,
            fontSize: 20,
            margin: "0 0 18px",
            color: COLORS.ink,
          }}
        >
          {title}
        </h2>
        <div style={{ fontSize: 15.5, lineHeight: 1.85, color: COLORS.inkSoft }}>
          {body.map((block, i) => {
            if (typeof block === "string") {
              return (
                <p key={i} style={{ margin: "0 0 18px" }}>
                  {block}
                </p>
              );
            }
            if (block.h) {
              return (
                <p
                  key={i}
                  style={{
                    margin: "26px 0 10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: COLORS.navy,
                    fontWeight: 500,
                  }}
                >
                  {block.h}
                </p>
              );
            }
            if (block.list) {
              return (
                <ul
                  key={i}
                  style={{
                    listStyle: "none",
                    margin: "10px 0 22px",
                    padding: "18px 20px 8px",
                    background: "#FFFFFF",
                    border: `1px solid ${COLORS.line}`,
                  }}
                >
                  {block.list.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        position: "relative",
                        padding: "0 0 14px 24px",
                        marginBottom: 14,
                        borderBottom:
                          j < block.list.length - 1 ? `1px dotted ${COLORS.line}` : "none",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 8,
                          top: 7,
                          width: 6,
                          height: 6,
                          background: COLORS.navy,
                        }}
                      />
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
      </div>
    </section>
  );
}

export default function RingsidePrivacy() {
  useFonts();

  const linkStyle = `.ringside-privacy a { color: ${COLORS.navy}; text-decoration-color: ${COLORS.stamp}; }`;

  return (
    <div
      style={{
        background: COLORS.canvas,
        minHeight: "100vh",
        fontFamily: "'Source Serif 4', Georgia, serif",
        color: COLORS.ink,
        WebkitFontSmoothing: "antialiased",
      }}
      className="ringside-privacy"
    >
      <style>{linkStyle}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 96px" }}>
        {/* Case-file cover sheet */}
        <div
          style={{
            marginTop: 56,
            position: "relative",
            background: COLORS.card,
            border: `1.5px solid ${COLORS.navyDeep}`,
            padding: "34px 32px 26px",
          }}
        >
          <Stamp />
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.stamp,
              margin: "0 0 16px",
            }}
          >
            Confidential — data protection file
          </p>
          <h1
            style={{
              fontFamily: "'Zilla Slab', serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 6vw, 44px)",
              lineHeight: 1.05,
              margin: "0 0 4px",
              color: COLORS.ink,
              maxWidth: 480,
            }}
          >
            Privacy policy
          </h1>
          <p
            style={{
              fontFamily: "'Zilla Slab', serif",
              fontWeight: 500,
              fontSize: 16,
              color: COLORS.navy,
              margin: "0 0 22px",
            }}
          >
            Ringside — Fight Scorecards
          </p>
          <div
            style={{
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
              Revised — <b style={{ color: COLORS.ink, fontWeight: 500 }}>10 August 2026</b>
            </span>
            <span>
              Controller — <b style={{ color: COLORS.ink, fontWeight: 500 }}>Ringside — Fight Scorecards</b>
            </span>
            <span>
              Site — <b style={{ color: COLORS.ink, fontWeight: 500 }}>ringsidescore.com</b>
            </span>
          </div>
        </div>

        <p style={{ margin: "36px 4px 8px", fontSize: 16, lineHeight: 1.8, color: COLORS.inkSoft }}>
          Ringside — Fight Scorecards ("Ringside", "we", "us", or "our") operates
          ringsidescore.com. For the purposes of applicable UK data-protection law, Ringside is
          the data controller responsible for the personal information described in this
          Privacy Policy. Ringside provides an online service that allows users to create
          accounts and score boxing fights using a scorecard-style interface. Our processing of
          personal information is governed by the UK General Data Protection Regulation (UK
          GDPR), the Data Protection Act 2018, and other applicable data-protection laws.
        </p>

        {/* index rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "44px 0 40px",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.muted,
              whiteSpace: "nowrap",
            }}
          >
            Contents — 15 files
          </span>
          <span style={{ flex: 1, height: 1, background: COLORS.line }} />
        </div>

        {FILES.map((file, i) => (
          <React.Fragment key={file.tag}>
            <FileEntry tag={file.tag} title={file.title} body={file.body} />
            {i < FILES.length - 1 && (
              <div
                style={{
                  height: 1,
                  background: COLORS.line,
                  margin: "40px 0 40px 68px",
                }}
              />
            )}
          </React.Fragment>
        ))}

        <footer
          style={{
            marginTop: 60,
            borderTop: `1.5px solid ${COLORS.navyDeep}`,
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
          <span>Data protection file — end</span>
        </footer>
      </div>
    </div>
  );
}