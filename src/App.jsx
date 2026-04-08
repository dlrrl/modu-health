import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ── 데이터 ── */
const PROBLEMS = [
  { icon: "💸", text: "연간권 선결제가 부담스럽다" },
  { icon: "📍", text: "이사하면 헬스장을 새로 등록해야 한다" },
  { icon: "😓", text: "못 간 달에도 요금은 그대로다" },
  { icon: "🔒", text: "한 지점에만 묶여 선택권이 없다" },
];

const USER_BENEFITS = [
  { icon: "📅", title: "월 단위", desc: "언제든 시작하고, 언제든 해지" },
  { icon: "📍", title: "어디서든", desc: "서울 제휴 헬스장 자유롭게" },
  { icon: "💳", title: "월 50,000원", desc: "추가 요금 없음" },
  { icon: "🔄", title: "유연하게", desc: "이사·출장에도 끄떡없이" },
];

const GYM_BENEFITS = [
  { icon: "👥", title: "신규 고객 유입", desc: "기존에 없던 방문객이 생깁니다" },
  { icon: "⏰", title: "유휴 시간 수익화", desc: "비어있는 시간대를 매출로" },
  { icon: "0원", title: "입점비 없음", desc: "방문 비율 기반으로만 정산" },
  { icon: "📈", title: "추가 매출", desc: "기존 회원 영향 없이 수익 추가" },
];

const STEPS = [
  { n: "1", title: "가입", desc: "앱에서 빠르게 회원가입" },
  { n: "2", title: "구독", desc: "월 50,000원 결제" },
  { n: "3", title: "탐색", desc: "지도에서 헬스장 찾기" },
  { n: "4", title: "운동", desc: "QR 체크인 후 바로 이용" },
];

const FAQS = [
  { q: "정말 여러 헬스장을 이용할 수 있나요?", a: "네. 구독 하나로 서울 내 모든 제휴 헬스장을 추가 비용 없이 이용하실 수 있습니다." },
  { q: "헬스장 정산은 어떻게 되나요?", a: "월 매출의 90%를 실제 방문 비율에 따라 제휴 헬스장에 분배합니다. 많이 방문받을수록 더 많이 정산됩니다." },
  { q: "출시 지역은 어디인가요?", a: "현재 서울을 중심으로 제휴 헬스장을 모집 중입니다. 가입하시면 출시 소식을 가장 먼저 알려드릴게요." },
  { q: "중도 해지 시 환불되나요?", a: "월 단위 결제로, 이용 기간 중 해지 시 다음 달부터는 자동 결제가 중단됩니다." },
];

/* ── 컴포넌트 ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111" }}>{q}</span>
        <span style={{ fontSize: "1.1rem", color: "#16a34a", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 16 }}>+</span>
      </button>
      {open && <p style={{ fontSize: "0.875rem", color: "#666", paddingBottom: 20, lineHeight: 1.7, margin: 0 }}>{a}</p>}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ name: "", gym: "", contact: "", note: "" });
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const s = {
    /* tokens */
    green: "#16a34a",
    greenDark: "#15803d",
    greenLight: "#f0fdf4",
    greenMid: "#dcfce7",
    black: "#0d0d0d",
    gray1: "#444",
    gray2: "#888",
    gray3: "#bbb",
    gray4: "#f5f5f5",
    white: "#ffffff",
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", color: s.black, background: s.white, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
        .btn-primary {
          background: #16a34a; color: #fff; font-weight: 700;
          padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer;
          font-size: 0.95rem; transition: background 0.2s, transform 0.15s;
          display: inline-block;
        }
        .btn-primary:hover { background: #15803d; transform: translateY(-1px); }
        .btn-ghost {
          background: transparent; color: #111; font-weight: 600;
          padding: 14px 28px; border-radius: 12px; border: 1.5px solid #ddd; cursor: pointer;
          font-size: 0.95rem; transition: border-color 0.2s, transform 0.15s;
          display: inline-block;
        }
        .btn-ghost:hover { border-color: #16a34a; transform: translateY(-1px); }
        .card {
          background: #fff; border: 1.5px solid #f0f0f0; border-radius: 16px;
          padding: 24px; transition: box-shadow 0.2s, transform 0.2s;
        }
        .card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.07); transform: translateY(-3px); }
        .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf4; color: #16a34a; font-size: 0.78rem; font-weight: 700;
          padding: 5px 12px; border-radius: 100px; letter-spacing: 0.02em;
        }
        .section-label {
          font-size: 0.72rem; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: #16a34a; display: block; margin-bottom: 10px;
        }
        .price-big { font-size: clamp(2.8rem, 6vw, 4.5rem); font-weight: 900; color: #0d0d0d; line-height: 1; }
        input:focus, textarea:focus { outline: none; border-color: #16a34a !important; }
        .partner-cta-wrap { position: relative; }
        .partner-cta-glow::after {
          content: '';
          position: absolute; inset: -6px; border-radius: 18px;
          background: linear-gradient(135deg, #16a34a33, #86efac22);
          z-index: -1; filter: blur(12px);
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-col { flex-direction: column !important; }
          .mobile-full { width: 100% !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navSolid ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: navSolid ? "blur(12px)" : "none",
        borderBottom: navSolid ? "1px solid #f0f0f0" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: s.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 13 }}>모</div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: s.black }}>모두의 헬스</span>
          </a>
          <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
            {[["서비스 소개", "#how"], ["혜택", "#benefits"], ["파트너", "#partner"], ["FAQ", "#faq"]].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: "0.875rem", color: s.gray1, fontWeight: 500 }}>{label}</a>
            ))}
          </div>
          <a href="#partner-form" className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem", borderRadius: 10 }}>
            제휴 문의 →
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: 120, paddingBottom: 100, background: `linear-gradient(180deg, ${s.greenLight} 0%, #fff 100%)`, textAlign: "center", padding: "120px 24px 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ marginBottom: 28 }}>
            <span className="tag">🚀 서울 출시 준비 중</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.2, color: s.black, marginBottom: 20 }}>
            헬스장, 이제<br />
            <span style={{ color: s.green }}>월 5만원</span>으로<br />
            서울 어디서든
          </h1>

          {/* Price highlight */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#fff", border: "1.5px solid #dcfce7", borderRadius: 16, padding: "14px 24px", marginBottom: 28, boxShadow: "0 4px 20px rgba(22,163,74,0.08)" }}>
            <div className="price-big">50,000</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: s.gray1 }}>원 / 월</div>
              <div style={{ fontSize: "0.78rem", color: s.gray2, marginTop: 2 }}>제휴 헬스장 자유 이용</div>
            </div>
          </div>

          <p style={{ fontSize: "1rem", color: s.gray1, lineHeight: 1.75, marginBottom: 36 }}>
            연간권 없이, 한 달씩 구독하고<br />
            서울 제휴 헬스장을 자유롭게 다니세요.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#partner-form" className="btn-primary partner-cta-wrap partner-cta-glow" style={{ fontSize: "1rem", padding: "16px 32px" }}>
              🏋️ 헬스장 제휴 문의하기
            </a>
            <a href="#notify" className="btn-ghost" style={{ fontSize: "1rem", padding: "16px 32px" }}>
              출시 알림 받기
            </a>
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
            {["입점비 없음", "언제든 해지 가능", "방문 비율 기반 정산"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: s.gray2 }}>
                <span style={{ color: s.green, fontWeight: 700 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Mock UI strip */}
        <div style={{ maxWidth: 880, margin: "60px auto 0", background: "#fff", borderRadius: 20, border: "1.5px solid #e8f5e9", overflow: "hidden", boxShadow: "0 16px 60px rgba(22,163,74,0.08)" }}>
          {/* browser chrome */}
          <div style={{ background: "#f8faf8", borderBottom: "1px solid #eee", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#ff6b6b","#ffd93d","#6bcb77"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 6, height: 22, display: "flex", alignItems: "center", padding: "0 10px" }}>
              <span style={{ fontSize: "0.72rem", color: "#aaa" }}>app.moduhealth.kr</span>
            </div>
          </div>
          {/* app content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, background: "#f9fdf9" }}>
            {/* Map area */}
            <div style={{ gridColumn: "1/3", padding: 20, borderRight: "1px solid #eee" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray2, marginBottom: 12 }}>📍 내 주변 헬스장</div>
              <div style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", borderRadius: 12, height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <span style={{ fontSize: "2rem" }}>🗺️</span>
                {[{t:"32%",l:"20%"},{t:"55%",l:"60%"},{t:"25%",l:"70%"},{t:"70%",l:"35%"}].map((p, i) => (
                  <div key={i} style={{ position: "absolute", top: p.t, left: p.l, width: 10, height: 10, background: s.green, borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 0 0 3px rgba(22,163,74,0.2)" }} />
                ))}
              </div>
            </div>
            {/* Stats */}
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray2, marginBottom: 12 }}>이번 달</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: s.green, marginBottom: 4 }}>8</div>
              <div style={{ fontSize: "0.75rem", color: s.gray2 }}>회 방문</div>
              <div style={{ marginTop: 16, fontSize: "0.75rem", color: s.gray2 }}>이용 헬스장</div>
              {["강남 피트니스","마포 짐","홍대 스포츠"].map(g => (
                <div key={g} style={{ fontSize: "0.75rem", fontWeight: 600, color: s.gray1, marginTop: 4 }}>· {g}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section style={{ padding: "80px 24px", background: s.white }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">문제 인식</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, lineHeight: 1.3 }}>
                헬스장 등록,<br />이런 경험 없으셨나요?
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {PROBLEMS.map((p, i) => (
              <FadeIn key={p.text} delay={i * 0.08}>
                <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>{p.icon}</div>
                  <p style={{ fontSize: "0.875rem", color: s.gray1, fontWeight: 500, lineHeight: 1.5 }}>{p.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section style={{ padding: "80px 24px", background: s.greenLight }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">해결책</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, lineHeight: 1.3 }}>
                모두의 헬스가<br />다르게 만들었습니다
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: "🔁", title: "월 단위 구독", body: "50,000원으로 시작, 언제든 해지 가능. 장기 계약 없습니다." },
              { icon: "🗺️", title: "서울 제휴 헬스장", body: "앱에서 가까운 제휴 헬스장을 찾아 QR 하나로 바로 입장." },
              { icon: "📊", title: "방문 기반 정산", body: "이용자가 방문한 만큼 헬스장에 정산됩니다. 투명하게." },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="card" style={{ background: "#fff" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: "0.875rem", color: s.gray1, lineHeight: 1.65 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" style={{ padding: "80px 24px", background: s.white }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">이용 방법</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900 }}>4단계로 끝납니다</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, position: "relative" }}>
            {STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.1}>
                <div style={{ textAlign: "center", padding: "24px 16px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.green, color: "#fff", fontWeight: 900, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    {step.n}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 }}>{step.title}</div>
                  <p style={{ fontSize: "0.82rem", color: s.gray2, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── USER BENEFITS ─── */}
      <section id="benefits" style={{ padding: "80px 24px", background: s.gray4 }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">이용자 혜택</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900 }}>이용자에게 좋은 이유</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {USER_BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.08}>
                <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>{b.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 6 }}>{b.title}</div>
                  <p style={{ fontSize: "0.82rem", color: s.gray2 }}>{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GYM PARTNER ─── */}
      <section id="partner" style={{ padding: "80px 24px", background: s.black }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4ade80", display: "block", marginBottom: 10 }}>헬스장 파트너</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>제휴 헬스장에 좋은 이유</h2>
              <p style={{ fontSize: "0.9rem", color: "#888", maxWidth: 400, margin: "0 auto" }}>입점비 없이, 추가 고객과 매출을 만들어드립니다.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
            {GYM_BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.08}>
                <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 16, padding: "24px 20px", textAlign: "center", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#16a34a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                  <div style={{ fontSize: b.icon === "0원" ? "1rem" : "2rem", fontWeight: b.icon === "0원" ? 900 : 400, color: b.icon === "0원" ? "#4ade80" : "auto", marginBottom: 12 }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff", marginBottom: 6 }}>{b.title}</div>
                  <p style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.5 }}>{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: "center" }}>
              <a href="#partner-form" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }}>
                제휴 문의하기 →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ padding: "80px 24px", background: s.white }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">FAQ</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900 }}>자주 묻는 질문</h2>
            </div>
          </FadeIn>
          {FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ─── PARTNER FORM ─── */}
      <section id="partner-form" style={{ padding: "80px 24px", background: s.greenLight }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span className="section-label">제휴 문의</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: 12 }}>함께 성장할 헬스장을<br />찾고 있습니다</h2>
              <p style={{ fontSize: "0.9rem", color: s.gray1 }}>문의 주시면 48시간 내 연락드리겠습니다.</p>
            </div>
          </FadeIn>
          {!sent ? (
            <FadeIn delay={0.1}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 36, border: "1.5px solid #dcfce7" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[
                    { label: "담당자 성함", key: "name", placeholder: "홍길동" },
                    { label: "헬스장 이름", key: "gym", placeholder: "○○ 헬스클럽" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>{label}</label>
                      <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder} required
                        style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "11px 14px", fontSize: "0.875rem", color: s.black, background: "#fafafa" }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>연락처 (이메일 또는 전화)</label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    placeholder="contact@gym.kr" required
                    style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "11px 14px", fontSize: "0.875rem", color: s.black, background: "#fafafa" }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>문의 내용 <span style={{ color: s.gray3, fontWeight: 400 }}>(선택)</span></label>
                  <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={3}
                    placeholder="헬스장 위치, 규모, 궁금한 점 등을 자유롭게 적어주세요."
                    style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "11px 14px", fontSize: "0.875rem", color: s.black, background: "#fafafa", resize: "vertical" }} />
                </div>
                <button onClick={() => { if (form.name && form.gym && form.contact) setSent(true); }} className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "1rem" }}>
                  제휴 문의 보내기
                </button>
                <p style={{ textAlign: "center", fontSize: "0.75rem", color: s.gray3, marginTop: 12 }}>입력하신 정보는 제휴 문의 목적으로만 사용됩니다.</p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div style={{ background: "#fff", borderRadius: 20, padding: "48px 36px", textAlign: "center", border: "1.5px solid #dcfce7" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>문의가 접수되었습니다!</h3>
                <p style={{ fontSize: "0.875rem", color: s.gray1 }}>48시간 내로 담당자가 연락드릴게요.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── NOTIFY ─── */}
      <section id="notify" style={{ padding: "72px 24px", background: s.white, borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: 10 }}>출시 알림 받기</h2>
            <p style={{ fontSize: "0.9rem", color: s.gray2, marginBottom: 28 }}>서울 출시 소식을 가장 먼저 알려드릴게요.</p>
            {!notified ? (
              <div style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto" }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  style={{ flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "13px 16px", fontSize: "0.9rem" }} />
                <button onClick={() => { if (email) setNotified(true); }} className="btn-primary" style={{ padding: "13px 20px", borderRadius: 10, whiteSpace: "nowrap" }}>
                  알림 받기
                </button>
              </div>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.greenLight, color: s.green, fontWeight: 700, padding: "14px 24px", borderRadius: 12, fontSize: "0.9rem" }}>
                ✓ 등록 완료! 출시 소식을 가장 먼저 알려드릴게요.
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#0d0d0d", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: s.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>모</div>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.9rem" }}>모두의 헬스</div>
              <div style={{ fontSize: "0.72rem", color: "#555" }}>서울 출시 준비 중</div>
            </div>
          </div>
          <div style={{ fontSize: "0.82rem", color: "#555" }}>
            제휴 문의 <span style={{ color: "#888" }}>contact@moduhealth.kr</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#444" }}>© 2025 모두의 헬스</div>
        </div>
      </footer>
    </div>
  );
}
