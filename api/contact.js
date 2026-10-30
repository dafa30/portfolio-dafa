// api/contact.js
// Handler backend pengiriman email kontak menggunakan Resend API secara server-side

function validateInput({ name, email, message }) {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "Nama tidak boleh kosong (minimal 2 karakter).";
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Format email tidak valid.";
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return "Pesan tidak boleh kosong (minimal 5 karakter).";
  }
  return null;
}

export async function handleContactSubmission(payload) {
  const { name, email, message, _gotcha } = payload || {};

  // Honeypot spam protection: Jika _gotcha terisi, anggap bot dan buang diam-diam
  if (_gotcha) {
    return { status: 200, body: { success: true, message: "OK" } };
  }

  // Validasi input
  const validationError = validateInput({ name, email, message });
  if (validationError) {
    return { status: 400, body: { success: false, error: validationError } };
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  // Kredensial server-side dari environment variable
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "dafaadi2002@gmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      status: 503,
      body: {
        success: false,
        error: "Layanan pengiriman email belum aktif: RESEND_API_KEY belum dikonfigurasi di file .env server. Silakan hubungi via email langsung atau WhatsApp.",
      },
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: cleanEmail,
        subject: `[Portfolio] Pesan Baru dari ${cleanName}`,
        text: `Nama Pengirim: ${cleanName}\nEmail Pengirim: ${cleanEmail}\n\nPesan:\n${cleanMessage}\n\n---\nDikirim melalui Form Kontak Portfolio Dafa Adi Raharjo`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        status: res.status,
        body: {
          success: false,
          error: data.message || "Gagal mengirim email melalui layanan Resend.",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        id: data.id,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Terjadi gangguan koneksi ke layanan email server: " + (err.message || "Unknown error"),
      },
    };
  }
}

// Default export untuk deployment serverless (Vercel / Node HTTP)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body || "{}");
      const result = await handleContactSubmission(parsed);
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.body));
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Invalid JSON payload" }));
    }
  });
}
