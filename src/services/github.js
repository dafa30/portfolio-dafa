// src/services/github.js
// Layanan pengambilan data kontribusi GitHub publik secara aman tanpa token rahasia

/**
 * Menghasilkan struktur kalender 52 minggu (364 hari) sebagai fallback
 * ketika API offline, kena batasan rate-limit, atau jaringan tidak tersedia.
 */
function generateFallbackCalendar(today = new Date()) {
  const weeks = [];
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Mulai dari 52 minggu yang lalu pada hari Minggu
  const endDay = new Date(today);
  const startDay = new Date(endDay.getTime() - 52 * 7 * oneDayMs);
  // Geser startDay ke hari Minggu terdekat
  startDay.setDate(startDay.getDate() - startDay.getDay());

  let total = 0;
  let currentDate = new Date(startDay);

  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if (currentDate > endDay) break;
      const dateStr = currentDate.toISOString().split("T")[0];
      
      // Hari biasa tanpa aktivitas (level 0) untuk integritas data nyata
      days.push({
        date: dateStr,
        count: 0,
        level: 0,
      });

      currentDate = new Date(currentDate.getTime() + oneDayMs);
    }
    if (days.length > 0) {
      weeks.push({ days });
    }
    if (currentDate > endDay) break;
  }

  return {
    total: 0,
    weeks,
    isLive: false,
    source: "local-fallback",
  };
}

/**
 * Mengambil kontribusi GitHub untuk username tertentu
 * Menggunakan public endpoint tanpa mengekspos token rahasia
 */
export async function getGitHubContributions(username = "dafa30") {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Gagal memuat data dari endpoint publik`);
    }

    const data = await response.json();

    if (data && data.contributions && Array.isArray(data.contributions)) {
      // Format weeks
      const weeks = [];
      let currentWeek = [];
      let totalCount = data.total?.lastYear || 0;

      data.contributions.forEach((day, index) => {
        currentWeek.push({
          date: day.date,
          count: day.count || 0,
          level: day.level || (day.count > 10 ? 4 : day.count > 5 ? 3 : day.count > 2 ? 2 : day.count > 0 ? 1 : 0),
        });

        if (currentWeek.length === 7 || index === data.contributions.length - 1) {
          weeks.push({ days: [...currentWeek] });
          currentWeek = [];
        }
      });

      return {
        total: totalCount,
        weeks,
        isLive: true,
        source: "github-live",
        username,
      };
    }

    throw new Error("Format respons API tidak dikenali");
  } catch (err) {
    // Tangani kegagalan jaringan atau offline secara transparan
    const fallback = generateFallbackCalendar();
    return {
      ...fallback,
      username,
      isLive: false,
      error: err.name === "AbortError" ? "Timeout: Jaringan lambat" : err.message,
    };
  }
}
