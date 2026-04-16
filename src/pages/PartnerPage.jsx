import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BENEFITS = [
  { icon: "🎯", title: "입점비 0원", desc: "제휴 등록에 별도 비용이 없습니다." },
  { icon: "💰", title: "초기 수수료 0원", desc: "서비스 초기에는 수수료 없이 운영됩니다." },
  { icon: "👥", title: "신규 회원 유입", desc: "광고 없이 새로운 회원이 찾아옵니다." },
  { icon: "⭐", title: "우선 노출", desc: "초기 파트너는 앱 상단에 먼저 노출됩니다." },
];

const FAQS = [
  { q: "제휴 등록에 비용이 드나요?", a: "아니요. 입점비는 없습니다. 서비스 초기에는 수수료도 받지 않습니다." },
  { q: "기존 회원 운영에 영향이 있나요?", a: "전혀 없습니다. 기존 운영 방식 그대로 유지하면서 추가 수익만 생깁니다." },
  { q: "정산은 어떻게 되나요?", a: "월 매출의 90%를 실제 방문 비율에 따라 분배합니다. 투명하게 정산됩니다." },
  { q: "별도 장비 설치가 필요한가요?", a: "별도 장비 설치가 필요 없습니다. 앱 QR 체크인으로 모든 게 처리됩니다." },
  { q: "지금 제휴하면 어떤 혜택이 있나요?", a: "초기 제휴 헬스장은 앱 내 우선 노출 혜택을 받습니다. 서비스 성장과 함께 유입 기회도 늘어납니다." },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111" }}>{q}</span>
        <span style={{ fontSize: "1.1rem", color: "#16a34a", display: "inline-block", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 16 }}>+</span>
      </button>
      {open && <p style={{ fontSize: "0.85rem", color: "#666", paddingBottom: 18, lineHeight: 1.75, margin: 0 }}>{a}</p>}
    </div>
  );
}

export default function PartnerPage() {
  const [form, setForm] = useState({ name: "", gym: "", location: "", contact: "", size: "", note: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name.trim() || !form.gym.trim() || !form.contact.trim()) {
      setError("성함, 헬스장 이름, 연락처는 필수 항목입니다.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const { error: err } = await supabase.from("partner_inquiries").insert([{
        name: form.name.trim(),
        gym: form.gym.trim(),
        contact: form.contact.trim(),
        note: `위치: ${form.location} / 규모: ${form.size} / 문의: ${form.note}`.trim(),
      }]);
      if (err) throw err;
      setStatus("success");
    } catch (e) {
      console.error(e);
      setError("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
    }
  }

  const s = {
    green: "#16a34a", greenLight: "#f0fdf4", black: "#0d0d0d",
    gray1: "#444", gray2: "#777", gray3: "#bbb", gray4: "#f7f7f7",
  };
  const input = {
    width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10,
    padding: "12px 14px", fontSize: "0.875rem", color: s.black,
    background: "#fafafa", fontFamily: "inherit",
  };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", color: s.black, background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        button, input, textarea, select { font-family: inherit; }
        .btn-primary { background: #16a34a; color: #fff; font-weight: 700; padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer; font-size: 0.95rem; transition: background 0.2s, transform 0.15s; display: inline-block; }
        .btn-primary:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
        .btn-primary:disabled { background: #86efac; cursor: not-allowed; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #16a34a !important; }
        @media (max-width: 768px) {
          .grid-2col { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: s.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>모</div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>모두의 헬스</span>
        </a>
        <a href="/" style={{ fontSize: "0.85rem", color: s.gray2 }}>← 메인으로</a>
      </nav>

      {/* ── 히어로 ── */}
      <section style={{ background: "#0a1628", padding: "64px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(29,158,117,0.2)", color: "#5dcaa5", fontSize: "0.75rem", fontWeight: 700, padding: "5px 14px", borderRadius: 100, marginBottom: 20 }}>
            🤝 초기 제휴 파트너 모집 중
          </div>
          <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.3, marginBottom: 14 }}>
            헬스장 파트너로<br />함께 성장하세요
          </h1>
          <p style={{ fontSize: "1rem", color: "#8892a4", lineHeight: 1.8, marginBottom: 6 }}>
            입점비 0원, 초기 수수료 0원.<br />
            새로운 회원 유입과 운영 효율을 동시에 경험해보세요.
          </p>
          <p style={{ fontSize: "0.85rem", color: "#5dcaa5", fontWeight: 600 }}>
            문의 주시면 48시간 내 담당자가 연락드립니다.
          </p>
        </div>
      </section>

      {/* ── 혜택 배너 ── */}
      <section style={{ background: s.greenLight, borderBottom: "1px solid #dcfce7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", overflowX: "auto", gap: 0, scrollbarWidth: "none" }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", borderRight: i < BENEFITS.length - 1 ? "1px solid #dcfce7" : "none", minWidth: 180 }}>
              <span style={{ fontSize: "1.3rem" }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f6e56" }}>{b.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#15803d" }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }}>

        {/* 왼쪽: 설명 */}
        <div className="hide-mobile">
          <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: s.green, marginBottom: 10 }}>왜 지금인가</p>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 900, lineHeight: 1.35, marginBottom: 16 }}>
            초기 파트너가<br />먼저 기회를<br />가져갑니다
          </h2>
          <p style={{ fontSize: "0.9rem", color: s.gray1, lineHeight: 1.8, marginBottom: 32 }}>
            서비스 초반에 합류한 헬스장이 지역 내 노출과
            유입 기회를 먼저 선점합니다. 같은 지역에서
            늦게 합류할수록 선택받을 기회가 줄어듭니다.
          </p>

          {/* 운영 방식 */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: s.gray2, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>운영 방식</p>
            {[
              { n: "1", title: "제휴 등록", desc: "문의 후 담당자와 협의해 완료" },
              { n: "2", title: "회원 방문", desc: "앱에서 헬스장 찾아 QR 체크인" },
              { n: "3", title: "정산 확인", desc: "방문 비율 기반 월 정산" },
            ].map((step, i) => (
              <div key={step.n} style={{ display: "flex", gap: 14, marginBottom: i < 2 ? 16 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: s.green, color: "#fff", fontWeight: 900, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 2 }}>{step.title}</div>
                  <div style={{ fontSize: "0.82rem", color: s.gray2 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 신뢰 신호 */}
          <div style={{ background: s.gray4, borderRadius: 14, padding: "18px 20px" }}>
            <p style={{ fontSize: "0.78rem", color: s.gray2, lineHeight: 1.7 }}>
              💬 <strong>"광고비 없이 새 회원이 생긴다는 게 가장 좋아요."</strong><br />
              <span style={{ color: s.gray3 }}>— 초기 테스트 파트너 헬스장</span>
            </p>
          </div>
        </div>

        {/* 오른쪽: 폼 */}
        <div>
          {status !== "success" ? (
            <div style={{ background: s.gray4, borderRadius: 20, padding: "32px 28px", border: "1.5px solid #efefef" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 6 }}>제휴 문의하기</h3>
              <p style={{ fontSize: "0.82rem", color: s.gray2, marginBottom: 24 }}>아래 정보를 입력해주시면 빠르게 연락드릴게요.</p>

              {/* 2열 그리드 */}
              <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>담당자 성함 *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="홍길동" style={input} />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>헬스장 이름 *</label>
                  <input value={form.gym} onChange={e => setForm({ ...form, gym: e.target.value })} placeholder="○○ 헬스클럽" style={input} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>헬스장 위치</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="예) 서울 강남구 역삼동" style={input} />
              </div>

              <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>연락처 *</label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="010-0000-0000" style={input} />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>헬스장 규모</label>
                  <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} style={{ ...input, cursor: "pointer" }}>
                    <option value="">선택해주세요</option>
                    <option value="소규모 (50평 미만)">소규모 (50평 미만)</option>
                    <option value="중규모 (50~150평)">중규모 (50~150평)</option>
                    <option value="대규모 (150평 이상)">대규모 (150평 이상)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: s.gray1, display: "block", marginBottom: 6 }}>
                  문의 내용 <span style={{ color: s.gray3, fontWeight: 400 }}>(선택)</span>
                </label>
                <textarea rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="궁금하신 점이나 특이사항을 자유롭게 적어주세요."
                  style={{ ...input, resize: "vertical" }} />
              </div>

              <button onClick={handleSubmit} disabled={status === "loading"} className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "1rem" }}>
                {status === "loading" ? "전송 중..." : "제휴 문의 보내기"}
              </button>

              {status === "error" && (
                <div style={{ marginTop: 12, padding: "11px 16px", background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: 10, fontSize: "0.85rem", color: "#dc2626" }}>
                  ⚠️ {error}
                </div>
              )}

              <p style={{ textAlign: "center", fontSize: "0.72rem", color: s.gray3, marginTop: 14 }}>
                입력하신 정보는 제휴 문의 목적으로만 사용됩니다.
              </p>
            </div>
          ) : (
            <div style={{ background: s.greenLight, borderRadius: 20, padding: "56px 36px", textAlign: "center", border: "1.5px solid #dcfce7" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontWeight: 900, fontSize: "1.3rem", marginBottom: 10 }}>문의가 접수되었습니다!</h3>
              <p style={{ fontSize: "0.9rem", color: s.gray1, lineHeight: 1.7, marginBottom: 24 }}>
                48시간 내로 담당자가 연락드릴게요.<br />
                초기 파트너로 함께해주셔서 감사합니다.
              </p>
              <a href="/" style={{ fontSize: "0.875rem", color: s.green, fontWeight: 700 }}>← 메인으로 돌아가기</a>
            </div>
          )}
        </div>
      </div>

      {/* ── FAQ ── */}
      <section style={{ padding: "56px 24px", background: s.gray4, borderTop: "1px solid #efefef" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: 32, textAlign: "center" }}>자주 묻는 질문</h2>
          <div style={{ background: "#fff", borderRadius: 16, padding: "8px 28px", border: "1.5px solid #efefef" }}>
            {FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d0d0d", padding: "32px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: s.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 11 }}>모</div>
            <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>모두의 헬스</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#555" }}>contact@moduhealth.kr</div>
          <div style={{ fontSize: "0.72rem", color: "#444" }}>© 2025 모두의 헬스</div>
        </div>
      </footer>
    </div>
  );
}
