import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ── 데이터 ── */
const GYM_VALUES = [
  {
    icon: "🎯",
    title: "입점비 0원",
    desc: "제휴 등록에 별도 비용이 없습니다. 부담 없이 먼저 경험해보세요.",
  },
  {
    icon: "💰",
    title: "초기 수수료 0원",
    desc: "서비스 초기 단계에는 수수료 없이 운영됩니다.",
  },
  {
    icon: "👥",
    title: "신규 회원 유입",
    desc: "광고 없이도 모두의 헬스 회원이 헬스장을 찾아옵니다.",
  },
  {
    icon: "📊",
    title: "이용 흐름 파악",
    desc: "방문 횟수와 시간대별 이용 현황을 한눈에 확인할 수 있습니다.",
  },
  {
    icon: "✅",
    title: "체크인 자동 관리",
    desc: "QR 체크인으로 방문 기록이 자동으로 쌓입니다. 따로 정리할 필요가 없어요.",
  },
  {
    icon: "⭐",
    title: "초기 제휴점 우선 노출",
    desc: "먼저 합류한 헬스장이 앱 내 상단 노출 혜택을 가져갑니다.",
  },
];

const HOW_STEPS = [
  {
    n: "1",
    title: "제휴 등록",
    desc: "간단한 문의 후 담당자와 협의해 제휴를 완료합니다. 별도 설비 설치 없이 바로 시작할 수 있어요.",
  },
  {
    n: "2",
    title: "회원 방문 및 체크인",
    desc: "모두의 헬스 회원이 앱에서 헬스장을 찾아 방문합니다. QR 하나로 체크인이 완료됩니다.",
  },
  {
    n: "3",
    title: "이용 현황 확인",
    desc: "실제 방문 데이터를 바탕으로 유입과 재방문 흐름을 확인하고 운영에 참고할 수 있습니다.",
  },
];

const EARLY_REASONS = [
  {
    icon: "🏆",
    title: "지역 내 먼저 노출",
    desc: "같은 지역 헬스장 중 먼저 합류한 곳이 앱 내 상단에 노출됩니다.",
  },
  {
    icon: "📈",
    title: "서비스 성장과 함께",
    desc: "회원이 늘수록 방문이 늘고, 정산도 자연스럽게 늘어납니다.",
  },
  {
    icon: "🤝",
    title: "초기 파트너 우대",
    desc: "정식 확장 전 합류 파트너에게는 별도 조건을 협의드립니다.",
  },
];

const FAQS = [
  {
    q: "제휴 등록에 비용이 드나요?",
    a: "아니요. 입점비는 없습니다. 서비스 초기에는 수수료도 받지 않습니다.",
  },
  {
    q: "기존 회원 운영에 영향이 있나요?",
    a: "기존 회원 운영과 완전히 별개로 운영됩니다. 추가 수익 창출 수단으로만 활용하시면 됩니다.",
  },
  {
    q: "정산은 어떻게 되나요?",
    a: "월 매출의 90%를 실제 방문 비율에 따라 제휴 헬스장에 분배합니다. 방문이 많을수록 더 많이 정산됩니다.",
  },
  {
    q: "지금 제휴하면 어떤 혜택이 있나요?",
    a: "초기 제휴 헬스장은 앱 내 우선 노출 혜택을 받습니다. 서비스가 성장할수록 먼저 합류한 헬스장이 더 많은 유입 기회를 가져갑니다.",
  },
  {
    q: "체크인이나 이용 현황은 어떻게 확인하나요?",
    a: "파트너용 대시보드에서 방문 현황, 시간대별 이용 패턴, 정산 내역을 확인할 수 있습니다.",
  },
];

/* ── 유틸 ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    }}>{children}</div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "20px 0", background: "none",
        border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111" }}>{q}</span>
        <span style={{
          fontSize: "1.1rem", color: "#16a34a", display: "inline-block",
          transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s",
          flexShrink: 0, marginLeft: 16,
        }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: "0.875rem", color: "#666", paddingBottom: 20, lineHeight: 1.75, margin: 0 }}>
          {a}
        </p>
      )}
    </div>
  );
}

/* ── 메인 ── */
export default function App() {
  const [navSolid, setNavSolid] = useState(false);
  const [form, setForm] = useState({ name: "", gym: "", contact: "", note: "" });
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [email, setEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState("idle");
  const [notifyError, setNotifyError] = useState("");

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handlePartnerSubmit() {
    if (!form.name.trim() || !form.gym.trim() || !form.contact.trim()) {
      setFormError("성함, 헬스장 이름, 연락처는 필수 항목입니다.");
      setFormStatus("error");
      return;
    }
    setFormStatus("loading");
    setFormError("");
    try {
      const { error } = await supabase.from("partner_inquiries").insert([{
        name: form.name.trim(), gym: form.gym.trim(),
        contact: form.contact.trim(), note: form.note.trim() || null,
      }]);
      if (error) throw error;
      setFormStatus("success");
    } catch (err) {
      console.error(err);
      setFormError("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setFormStatus("error");
    }
  }

  async function handleNotifySubmit() {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNotifyError("올바른 이메일 주소를 입력해주세요.");
      setNotifyStatus("error");
      return;
    }
    setNotifyStatus("loading");
    setNotifyError("");
    try {
      const { error } = await supabase.from("notify_list").insert([{ email: trimmed }]);
      if (error && error.code === "23505") { setNotifyStatus("success"); return; }
      if (error) throw error;
      setNotifyStatus("success");
    } catch (err) {
      console.error(err);
      setNotifyError("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setNotifyStatus("error");
    }
  }

  const s = {
    green: "#16a34a", greenDark: "#15803d", greenLight: "#f0fdf4",
    black: "#0d0d0d", gray1: "#444", gray2: "#777", gray3: "#bbb",
    gray4: "#f7f7f7", white: "#fff",
  };
  const inputStyle = {
    width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10,
    padding: "11px 14px", fontSize: "0.875rem", color: s.black, background: "#fafafa",
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", color: s.black, background: s.white, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        button, input, textarea { font-family: inherit; }

        .btn-primary {
          background: #16a34a; color: #fff; font-weight: 700;
          padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer;
          font-size: 0.95rem; transition: background 0.2s, transform 0.15s; display: inline-block;
        }
        .btn-primary:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
        .btn-primary:disabled { background: #86efac; cursor: not-allowed; }

        .btn-ghost {
          background: #fff; color: #333; font-weight: 600;
          padding: 14px 28px; border-radius: 12px; border: 1.5px solid #ddd; cursor: pointer;
          font-size: 0.95rem; transition: border-color 0.2s, color 0.2s, transform 0.15s; display: inline-block;
        }
        .btn-ghost:hover { border-color: #16a34a; color: #16a34a; transform: translateY(-1px); }

        .card {
          background: #fff; border: 1.5px solid #efefef; border-radius: 16px;
          padding: 28px 24px; transition: box-shadow 0.2s, transform 0.2s;
        }
        .card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); transform: translateY(-3px); }

        .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf4; color: #16a34a; font-size: 0.78rem; font-weight: 700;
          padding: 5px 14px; border-radius: 100px;
        }
        .section-label {
          font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em;
          text-transform: uppercase; color: #16a34a; display: block; margin-bottom: 10px;
        }
        input:focus, textarea:focus { outline: none; border-color: #16a34a !important; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .grid-2col { grid-template-columns: 1fr !important; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns a { text-align: center; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navSolid ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: navSolid ? "blur(12px)" : "none",
        borderBottom: navSolid ? "1px solid #f0f0f0" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: s.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 13 }}>모</div>
            <span style={{ fontWeight: 800, fontSize: "1rem" }}>모두의 헬스</span>
          </a>
          <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
            {[["파트너 혜택","#values"],["운영 방식","#how"],["선점 혜택","#early"],["FAQ","#faq"]].map(([l,h]) => (
              <a key={l} href={h} style={{ fontSize: "0.875rem", color: s.gray1, fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <a href="#partner-form" className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem", borderRadius: 10 }}>
            제휴 문의 →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "120px 24px 100px", background: `linear-gradient(160deg, ${s.greenLight} 0%, #fff 65%)`, textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <span className="tag">🤝 초기 제휴 파트너 모집 중</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.9rem, 5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.25, color: s.black, marginBottom: 20 }}>
            여러 헬스장을<br />
            <span style={{ color: s.green }}>하나의 멤버십</span>으로 연결합니다
          </h1>
          <p style={{ fontSize: "1.05rem", color: s.gray1, lineHeight: 1.85, marginBottom: 10, maxWidth: 560, margin: "0 auto 10px" }}>
            회원에게는 더 유연한 운동 경험을,<br />
            헬스장에는 새로운 유입과 운영 효율을 드립니다.
          </p>
          <p style={{ fontSize: "0.88rem", color: s.green, fontWeight: 700, marginBottom: 36 }}>
            입점비 0원 · 초기 수수료 0원 · 초기 제휴점 우선 노출
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#partner-form" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }}>
              🏋️ 제휴 문의하기
            </a>
            <a href="#notify" className="btn-ghost" style={{ fontSize: "1rem", padding: "16px 32px" }}>
              오픈 알림 신청하기
            </a>
          </div>
        </div>
      </section>

      {/* ── 점주 가치 제안 ── */}
      <section id="values" style={{ padding: "88px 24px", background: s.white }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="section-label">헬스장 파트너 혜택</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, lineHeight: 1.3, marginBottom: 12 }}>
                새로운 유입부터<br />운영 효율까지
              </h2>
              <p style={{ fontSize: "0.95rem", color: s.gray2, maxWidth: 480, margin: "0 auto" }}>
                광고비 없이 회원을 받고, 방문 현황을 파악하고,<br />
                정산까지 한 흐름으로 관리할 수 있습니다.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {GYM_VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.07}>
                <div className="card">
                  <div style={{ fontSize: "2rem", marginBottom: 14 }}>{v.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8, color: s.black }}>{v.title}</div>
                  <p style={{ fontSize: "0.85rem", color: s.gray2, lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 운영 방식 ── */}
      <section id="how" style={{ padding: "88px 24px", background: s.gray4 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="section-label">운영 방식</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: 12 }}>
                3단계로 끝납니다
              </h2>
              <p style={{ fontSize: "0.95rem", color: s.gray2 }}>
                복잡한 절차 없이, 기존 운영 방식 그대로 유지하면 됩니다.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {HOW_STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.1}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", border: "1.5px solid #efefef" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: s.green, color: "#fff", fontWeight: 900, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    {step.n}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 10 }}>{step.title}</div>
                  <p style={{ fontSize: "0.85rem", color: s.gray2, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 왜 지금인가 ── */}
      <section id="early" style={{ padding: "88px 24px", background: s.black }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80", display: "block", marginBottom: 10 }}>왜 지금인가</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>
                초기 파트너가<br />먼저 기회를 가져갑니다
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#888", maxWidth: 460, margin: "0 auto" }}>
                지금 합류하면 지역 내 노출과 유입 기회를 먼저 선점할 수 있습니다.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 48 }}>
            {EARLY_REASONS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 16, padding: "28px 24px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#16a34a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff", marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: "0.85rem", color: "#777", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: "center" }}>
              <a href="#partner-form" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }}>
                지금 제휴 문의하기 →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 일반 사용자 섹션 ── */}
      <section style={{ padding: "88px 24px", background: s.greenLight }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <span className="section-label">일반 회원 안내</span>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.3rem)", fontWeight: 900, lineHeight: 1.3, marginBottom: 16 }}>
              한 번의 멤버십으로<br />서울 어디서든 운동하세요
            </h2>
            <p style={{ fontSize: "0.95rem", color: s.gray1, lineHeight: 1.85, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
              연간권 없이, 한 달씩. 집 근처든 회사 근처든<br />
              가장 가까운 제휴 헬스장을 자유롭게 이용하는<br />
              서비스를 준비하고 있습니다.
            </p>
            <div style={{ display: "inline-flex", gap: 32, background: "#fff", borderRadius: 20, padding: "24px 40px", border: "1.5px solid #dcfce7", marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
              {[["📅","월 단위 이용"],["📍","서울 제휴 헬스장"],["💳","월 50,000원"]].map(([icon, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1 }}>{label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.88rem", color: s.gray2, marginBottom: 24 }}>
              아직 서비스 오픈 전입니다. 오픈 시 가장 먼저 안내받고 싶다면 알림을 신청해주세요.
            </p>
            <a href="#notify" className="btn-ghost" style={{ fontSize: "0.95rem" }}>
              오픈 알림 신청하기
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── 오픈 알림 신청 ── */}
      <section id="notify" style={{ padding: "72px 24px", background: s.white, borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 900, marginBottom: 10 }}>오픈 알림 신청</h2>
            <p style={{ fontSize: "0.9rem", color: s.gray2, marginBottom: 28 }}>
              서울 오픈 소식을 가장 먼저 알려드릴게요.
            </p>
            {notifyStatus !== "success" ? (
              <>
                <div style={{ maxWidth: 420, margin: "0 auto" }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleNotifySubmit()}
                    placeholder="이메일 주소" disabled={notifyStatus === "loading"}
                    style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "13px 16px", fontSize: "0.9rem", marginBottom: 10 }}
                  />
                  <button onClick={handleNotifySubmit} disabled={notifyStatus === "loading"}
                    className="btn-primary" style={{ width: "100%", padding: "13px 20px", borderRadius: 10 }}>
                    {notifyStatus === "loading" ? "..." : "오픈 알림 신청하기"}
                  </button>
                </div>
                {notifyStatus === "error" && (
                  <div style={{ marginTop: 10, fontSize: "0.82rem", color: "#dc2626" }}>⚠️ {notifyError}</div>
                )}
              </>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.greenLight, color: s.green, fontWeight: 700, padding: "14px 24px", borderRadius: 12, fontSize: "0.9rem" }}>
                ✓ 신청 완료! 오픈 소식을 가장 먼저 알려드릴게요.
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "88px 24px", background: s.gray4 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-label">FAQ</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900 }}>자주 묻는 질문</h2>
            </div>
          </FadeIn>
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 32px", border: "1.5px solid #efefef" }}>
            {FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── 마지막 CTA ── */}
      <section style={{ padding: "100px 24px", background: s.green, textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
              초기 제휴 파트너 모집
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: 16 }}>
              지금, 초기 파트너로<br />함께하세요
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
              입점비와 초기 수수료 없이 먼저 경험해보세요.<br />
              유입과 운영 효율을 함께 만들어갑니다.
            </p>
            <a
              href="#partner-form"
              style={{ display: "inline-block", background: "#fff", color: s.green, fontWeight: 800, fontSize: "1rem", padding: "16px 40px", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.16)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.12)"; }}
            >
              제휴 문의하기 →
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── 제휴 문의 폼 ── */}
      <section id="partner-form" style={{ padding: "88px 24px", background: s.white }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span className="section-label">제휴 문의</span>
              <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: 12 }}>
                함께 성장할 파트너를<br />찾고 있습니다
              </h2>
              <p style={{ fontSize: "0.9rem", color: s.gray1 }}>문의 주시면 48시간 내 연락드리겠습니다.</p>
            </div>
          </FadeIn>
          {formStatus !== "success" ? (
            <FadeIn delay={0.1}>
              <div style={{ background: s.gray4, borderRadius: 20, padding: 36, border: "1.5px solid #efefef" }}>
                <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[
                    { label: "담당자 성함", key: "name", placeholder: "홍길동" },
                    { label: "헬스장 이름", key: "gym", placeholder: "○○ 헬스클럽" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>{label} *</label>
                      <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder} disabled={formStatus === "loading"} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>연락처 (이메일 또는 전화) *</label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    placeholder="contact@gym.kr" disabled={formStatus === "loading"} style={inputStyle} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>
                    문의 내용 <span style={{ color: s.gray3, fontWeight: 400 }}>(선택)</span>
                  </label>
                  <textarea rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                    placeholder="헬스장 위치, 규모, 궁금한 점 등을 자유롭게 적어주세요."
                    disabled={formStatus === "loading"} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button onClick={handlePartnerSubmit} disabled={formStatus === "loading"}
                  className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "1rem" }}>
                  {formStatus === "loading" ? "전송 중..." : "제휴 문의 보내기"}
                </button>
                {formStatus === "error" && (
                  <div style={{ marginTop: 12, padding: "11px 16px", background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: 10, fontSize: "0.875rem", color: "#dc2626" }}>
                    ⚠️ {formError}
                  </div>
                )}
                <p style={{ textAlign: "center", fontSize: "0.75rem", color: s.gray3, marginTop: 12 }}>
                  입력하신 정보는 제휴 문의 목적으로만 사용됩니다.
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div style={{ background: s.greenLight, borderRadius: 20, padding: "48px 36px", textAlign: "center", border: "1.5px solid #dcfce7" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>문의가 접수되었습니다!</h3>
                <p style={{ fontSize: "0.875rem", color: s.gray1 }}>48시간 내로 담당자가 연락드릴게요.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d0d0d", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: s.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>모</div>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.9rem" }}>모두의 헬스</div>
              <div style={{ fontSize: "0.72rem", color: "#555" }}>서울 초기 파트너 모집 중</div>
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
