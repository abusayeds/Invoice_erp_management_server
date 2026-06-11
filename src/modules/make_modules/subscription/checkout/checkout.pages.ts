const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@yourcompany.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const shell = (title: string, body: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    background:#f0efe9;color:#111}
  .card{width:100%;max-width:480px;background:#fff;border-radius:20px;
    border:0.5px solid #e0dfd8;overflow:hidden;animation:rise .4s ease both}
  @keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  .top{padding:36px 36px 24px;text-align:center;border-bottom:0.5px solid #e0dfd8}
  .icon-wrap{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;
    justify-content:center;margin:0 auto 16px;animation:pop .45s .1s cubic-bezier(.2,1.4,.4,1) both}
  @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
  .icon-wrap svg{width:32px;height:32px}
  .top h1{font-size:20px;font-weight:600;letter-spacing:-.01em;margin-bottom:6px}
  .top p{font-size:14px;color:#6b6b67;line-height:1.55}
  .body{padding:24px 28px 8px}
  .rows{border:0.5px solid #e0dfd8;border-radius:12px;overflow:hidden;margin-bottom:20px}
  .row{display:flex;justify-content:space-between;align-items:center;gap:16px;
    padding:11px 16px;font-size:13px;border-bottom:0.5px solid #e0dfd8}
  .row:last-child{border-bottom:0}
  .row .k{color:#888;font-weight:400}
  .row .v{color:#111;font-weight:500;text-align:right;word-break:break-word}
  .pill{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;
    font-weight:500;background:#EAF3DE;color:#27500A}
  .note{background:#f7f7f4;border:0.5px solid #e0dfd8;border-radius:12px;
    padding:16px 18px;margin-bottom:20px}
  .note h3{font-size:12px;font-weight:500;color:#888;text-transform:uppercase;
    letter-spacing:.05em;margin-bottom:10px}
  .note ul{list-style:none;display:grid;gap:6px}
  .note li{font-size:13px;color:#6b6b67;line-height:1.6;padding-left:20px;position:relative}
  .note li:before{content:"–";position:absolute;left:0;color:#bbb}
  .actions{padding:4px 28px 24px;display:flex;flex-direction:column;gap:8px}
  .btn{display:flex;align-items:center;justify-content:center;width:100%;padding:11px 20px;
    border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;
    transition:opacity .12s}
  .btn:hover{opacity:.85}
  .btn-success{background:#EAF3DE;color:#27500A;border:0.5px solid #C0DD97}
  .btn-cancel{background:#FCEBEB;color:#A32D2D;border:0.5px solid #F09595}
  .ghost{background:transparent;color:#888;border:0.5px solid #e0dfd8}
  .foot{padding:14px 28px 22px;text-align:center;font-size:12px;
    color:#aaa;border-top:0.5px solid #e0dfd8}
  .foot a{color:#888;font-weight:500;text-decoration:none}
</style>
</head>
<body>
  <div class="card">${body}
    <div class="foot">Need help? <a href="mailto:${esc(SUPPORT_EMAIL)}">${esc(SUPPORT_EMAIL)}</a></div>
  </div>
</body>
</html>`;

const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#3B6D11" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
const crossIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#A32D2D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

const dashboardBtn = (label: string, cls: string) =>
  FRONTEND_URL
    ? `<a class="btn ${cls}" href="${esc(FRONTEND_URL)}">${esc(label)}</a>`
    : `<button class="btn ${cls}" onclick="window.close()">${esc(label)}</button>`;

export type SuccessData = {
  planName?: string;
  amount?: number | null;
  currency?: string;
  billingCycle?: string | null;
  email?: string | null;
  sessionId?: string;
  date?: Date;
};

export const renderSuccessPage = (d: SuccessData): string => {
  const amount =
    d.amount != null ? `${d.amount.toFixed(2)} ${(d.currency || "usd").toUpperCase()}` : "—";
  const cycle = d.billingCycle
    ? d.billingCycle.charAt(0).toUpperCase() + d.billingCycle.slice(1)
    : "—";
  const when = (d.date || new Date()).toUTCString();

  const row = (k: string, v: string, raw = false) =>
    `<div class="row"><span class="k">${esc(k)}</span><span class="v">${raw ? v : esc(v)}</span></div>`;

  const body = `
    <div class="top">
      <div class="icon-wrap" style="background:#EAF3DE">${checkIcon}</div>
      <h1>Payment successful</h1>
      <p>Your subscription is now active. Thank you for your purchase!</p>
    </div>
    <div class="body">
      <div class="rows">
        ${row("Plan", d.planName || "Subscription Plan")}
        ${row("Amount paid", amount)}
        ${row("Billing cycle", cycle)}
        ${row("Status", `<span class="pill">Paid</span>`, true)}
        ${d.email ? row("Billed to", d.email) : ""}
        ${d.sessionId ? row("Reference", d.sessionId) : ""}
        ${row("Date", when)}
      </div>
      <div class="note">
        <h3>What happens next</h3>
        <ul>
          <li>Your plan features are unlocked immediately across your workspace.</li>
          <li>A payment receipt has been sent to your billing email.</li>
          <li>You can review or change your plan anytime from Subscription settings.</li>
        </ul>
      </div>
    </div>
    <div class="actions">
      ${dashboardBtn("Go to dashboard", "btn-success")}
    </div>`;

  return shell("Payment Successful", body);
};

export const renderCancelPage = (): string => {
  const body = `
    <div class="top">
      <div class="icon-wrap" style="background:#FCEBEB">${crossIcon}</div>
      <h1>Payment cancelled</h1>
      <p>No charge was made. Your card has not been billed.</p>
    </div>
    <div class="body">
      <div class="note">
        <h3>What you can do</h3>
        <ul>
          <li>Your checkout was cancelled before completing the payment.</li>
          <li>You can return and try again whenever you are ready.</li>
          <li>If money was deducted by mistake, it will be refunded automatically.</li>
        </ul>
      </div>
    </div>
    <div class="actions">
      ${dashboardBtn("Try again", "btn-cancel")}
      <button class="btn ghost" onclick="window.close()">Close this window</button>
    </div>`;

  return shell("Payment Cancelled", body);
};