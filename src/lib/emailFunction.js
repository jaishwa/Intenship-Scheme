// FutureFit - Email Notification Edge Function
// Sends approval or rejection emails to students via Gmail SMTP (nodemailer)

import nodemailer from "npm:nodemailer@6.9.9";

const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@futurefit.ai";

function getApprovalHtml(studentName, companyName, role) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f8f7ff; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(79,70,229,0.15); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 48px 32px; text-align: center; color: white; }
    .header h1 { margin: 12px 0 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; }
    .header p { color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 16px; font-weight: 500; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); color: white; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; margin-top: 20px; backdrop-filter: blur(4px); }
    .body { padding: 48px 40px; }
    .greeting { font-size: 24px; font-weight: 800; color: #1e1b4b; margin-bottom: 24px; }
    .message { color: #475569; line-height: 1.8; margin: 20px 0; font-size: 16px; }
    .highlight-box { background: #f0fdf4; border: 1px solid #dcfce7; border-left: 6px solid #22c55e; padding: 24px; border-radius: 12px; margin: 32px 0; }
    .highlight-box .label { font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 1px; }
    .highlight-box .value { font-size: 20px; font-weight: 800; color: #166534; margin-top: 6px; }
    .cta { text-align: center; margin: 40px 0 20px; }
    .cta a { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff !important; padding: 16px 40px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 20px rgba(79,70,229,0.3); }
    .footer { background: #f8f7ff; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 14px; margin: 6px 0; }
    .logo { font-weight: 900; color: #4f46e5; font-size: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 40px;">🚀</div>
      <h1>Congratulations!</h1>
      <p>A new milestone awaits you</p>
      <span class="badge">✨ APPLICATION SELECTED</span>
    </div>
    <div class="body">
      <p class="greeting">Hi ${studentName}! 🎉</p>
      <p class="message">
        We have incredible news! The hiring team has reviewed your profile and matching scores, and they've officially <strong>approved</strong> your application for:
      </p>
      <div class="highlight-box">
        <div class="label">Internship Position</div>
        <div class="value">${role} at ${companyName}</div>
      </div>
      <p class="message">
        The team at <strong>${companyName}</strong> was highly impressed with your skills and background. They will be reaching out to you shortly via this email thread or through your FutureFit profile with the next steps for onboarding.
      </p>
      <p class="message">
        Make sure your profile is fully up to date and you're ready to make an impact! We're rooting for you every step of the way. 🚀
      </p>
      <div class="cta">
        <a href="https://futurefit.app/student/applications">Go to Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <div class="logo">FutureFit</div>
      <p>AI-Powered Smart Internship Allocation</p>
      <p style="margin-top: 16px; color: #cbd5e1; font-size: 11px; font-style: italic;">
        Transforming student careers through technology.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function getRejectionHtml(studentName, companyName, role) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f8f7ff; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(100,116,139,0.15); }
    .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 48px 32px; text-align: center; color: white; }
    .header h1 { margin: 12px 0 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.25); color: white; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; margin-top: 20px; backdrop-filter: blur(4px); }
    .body { padding: 48px 40px; }
    .greeting { font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 24px; }
    .message { color: #64748b; line-height: 1.8; margin: 20px 0; font-size: 16px; }
    .highlight-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 6px solid #94a3b8; padding: 24px; border-radius: 12px; margin: 32px 0; }
    .highlight-box .label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .highlight-box .value { font-size: 18px; font-weight: 700; color: #334155; margin-top: 6px; }
    .tips-card { background: #f0f9ff; border-radius: 16px; padding: 28px; margin: 32px 0; border: 1px solid #e0f2fe; }
    .tips-card h3 { color: #0369a1; font-size: 15px; font-weight: 800; margin: 0 0 16px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
    .tips-card ul { margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 15px; line-height: 2; }
    .cta { text-align: center; margin: 40px 0 20px; }
    .cta a { background: #475569; color: #ffffff !important; padding: 16px 40px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; }
    .footer { background: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 14px; }
    .logo { font-weight: 900; color: #475569; font-size: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 40px;">📋</div>
      <h1>Application Update</h1>
      <span class="badge">STATUS NOTIFICATION</span>
    </div>
    <div class="body">
      <p class="greeting">Dear ${studentName},</p>
      <p class="message">
        Thank you for your interest in the position with <strong>${companyName}</strong>. After careful review of all applicants, the company has decided to move forward with other candidates at this time.
      </p>
      <div class="highlight-box">
        <div class="label">Applied Position</div>
        <div class="value">${role} at ${companyName}</div>
      </div>
      <div class="tips-card">
        <h3>💡 Pro-Tips for your Next Application</h3>
        <ul>
          <li>Sharpen your technical skills with new projects</li>
          <li>Focus on internships with higher AI match scores</li>
          <li>Highlight your local college achievements</li>
        </ul>
      </div>
      <p class="message">
        Don't be discouraged! Your FutureFit score remains high for several other matching roles. We encourage you to keep exploring new opportunities on your dashboard.
      </p>
      <div class="cta">
        <a href="https://futurefit.app/student/internships">Explore Opportunities</a>
      </div>
    </div>
    <div class="footer">
      <div class="logo">FutureFit</div>
      <p>AI-Powered Career Matching</p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = async function (request) {
  // CORS Handling
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { studentEmail, studentName, action, companyName, role } = body;

  if (!studentEmail || !studentName || !action || !companyName || !role) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const isApproved = action === "approved";
  const htmlContent = isApproved 
    ? getApprovalHtml(studentName, companyName, role) 
    : getRejectionHtml(studentName, companyName, role);

  // Fallback for testing: If SMTP is not yet configured, return the HTML for preview
  if (!SMTP_USER || !SMTP_PASS || SMTP_USER === "") {
    return new Response(
      JSON.stringify({ 
        success: true, 
        warning: "SMTP not configured. Email preview returned instead.",
        previewHtml: htmlContent,
        subject: isApproved ? "🎉 Congratulations! Application Approved" : "📋 Application Update"
      }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  // Real SMTP Logic
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const mailOptions = {
    from: `"FutureFit Platform" <${FROM_EMAIL}>`,
    to: studentEmail,
    subject: isApproved
      ? `🎉 Congratulations! Your application for ${role} is Approved!`
      : `📋 Update on your application for ${role}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return new Response(
      JSON.stringify({ error: "SMTP failed", details: error.message, previewHtml: htmlContent }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
};
