// Semua isi di sini bersumber dari CV_DAFA_ADI_RAHARJO.pdf
// (CV, transkrip, ijazah, dan sertifikat yang dilampirkan).

export const profile = {
  name: "Dafa Adi Raharjo",
  firstName: "Dafa",
  role: "Full-Stack Web Developer",
  degree: "S.Kom.",
  email: "dafaadi2002@gmail.com",
  phone: "+62 813-8447-6814",
  whatsapp: "https://wa.me/6281384476814",
  github: "https://github.com/dafa30",
  githubLabel: "github.com/dafa30",
  linkedin: "https://www.linkedin.com/in/dafa-adi-raharjo",
  linkedinLabel: "linkedin.com/in/dafa-adi-raharjo",
  location: "Tangerang, Banten",
  cv: "/CV_DAFA_ADI_RAHARJO.pdf",
  photo: "/dafa1.jpg",
  tagline:
    "Saya merancang dan mengembangkan aplikasi web fullstack dengan UI yang intuitif dan arsitektur sistem yang terstruktur. Saya fokus membantu perusahaan menerjemahkan alur kerja yang rumit menjadi solusi digital yang cepat dan dapat diandalkan.",
  summary:
    "Lulusan S1-Teknik Informatika dengan fokus pada pengembangan aplikasi web dan pemrograman. Memiliki pengalaman dalam menganalisis kebutuhan, merancang dan mengembangkan aplikasi, serta melakukan pengujian, debugging, dan troubleshooting sistem. Terbiasa menerapkan pendekatan terstruktur dalam menyelesaikan permasalahan dan mengembangkan solusi sesuai kebutuhan pengguna. Seorang yang adaptif, teliti, dan siap berkembang serta mempelajari teknologi baru sesuai dengan kebutuhan perusahaan.",
};

export const facts = [
  { label: "Lokasi", value: "Tangerang, Banten" },
  { label: "Fokus", value: "Pengembangan aplikasi web dan pemrograman" },
  { label: "Bahasa", value: "Indonesia (aktif), Inggris (dasar)" },
  { label: "Kualifikasi inti", value: "Pengembangan web, troubleshooting jaringan, analisis sistem" },
];

export const experience = [
  {
    id: "aplika",
    company: "PT. Aplika Media Nusantara",
    role: "IT Support | Programmer",
    image: "/certificates/cert-magang-aplika.jpg",
    descKey: "experience.aplikaDesc",
    description:
      "Mengembangkan aplikasi helpdesk terintegrasi untuk pelaporan dan pengelolaan permasalahan IT, menganalisis kebutuhan sistem, mengembangkan fitur sesuai kebutuhan pengguna, serta melakukan pengujian, debugging, dan perbaikan sistem untuk memastikan aplikasi berjalan dengan optimal.",
  },
  {
    id: "mpr",
    company: "Majelis Permusyawaratan Rakyat Republik Indonesia (MPR RI)",
    role: "IT Support | Programmer",
    image: "/certificates/cert-magang-mpr.jpg",
    descKey: "experience.mprDesc",
    description:
      "Mengembangkan aplikasi web manajemen persuratan untuk mendigitalisasi proses pengelolaan surat masuk dan surat keluar, merancang alur sistem, serta melakukan pengujian, debugging, dan implementasi fitur berdasarkan kebutuhan pengguna.",
  },
];

export const education = {
  degree: "S1 Teknik Informatika",
  school: "Universitas Pamulang",
  period: "2021 – 2026",
  title: "Sarjana Komputer (S.Kom.)",
  graduated: "Lulus 28 Februari 2026",
  gpa: 3.47,
  gpaMax: 4,
  predicate: "Sangat Memuaskan",
  specialization: "Rekayasa Perangkat Lunak",
  thesisTitle:
    "Implementasi dan Pengujian Efektivitas Metode Extreme Programming dalam Pengembangan Aplikasi Web Manajemen Persuratan pada Lembaga MPR RI",
};

export const techStack = [
  { name: "HTML5", category: "Frontend", slug: "html5" },
  { name: "CSS3", category: "Frontend", slug: "css3" },
  { name: "JavaScript", category: "Language", slug: "javascript" },
  { name: "TypeScript", category: "Language", slug: "typescript" },
  { name: "PHP", category: "Backend", slug: "php" },
  { name: "Laravel", category: "Backend", slug: "laravel" },
  { name: "React", category: "Frontend", slug: "react" },
  { name: "Next.js", category: "Fullstack", slug: "nextdotjs" },
  { name: "Tailwind CSS", category: "Frontend", slug: "tailwindcss" },
  { name: "Bootstrap", category: "Frontend", slug: "bootstrap" },
  { name: "Node.js", category: "Backend", slug: "nodedotjs" },
  { name: "MySQL", category: "Database", slug: "mysql" },
  { name: "PostgreSQL", category: "Database", slug: "postgresql" },
  { name: "Git", category: "Tools", slug: "git" },
  { name: "GitHub", category: "Tools", slug: "github" },
  { name: "REST API", category: "Architecture", slug: "restapi" },
  { name: "Docker", category: "DevOps", slug: "docker" },
];

export const skills = {
  teknis: [
    ...techStack.map((t) => t.name),
    "React.js",
  ],
};

export const certificates = [
  {
    id: "cert-odoo-2026",
    year: "2026",
    title: "Workshop Odoo Development",
    issuer: "Dunia Coding",
    detail:
      "Peserta workshop “Bangun Smart POS & Loyalty Point Sendiri dari Nol dengan Odoo 19”, 5–6 September 2026, 4 jam pembelajaran bersama pemateri Rafael Natanael.",
    image: "/certificates/cert-odoo.png",
  },
  {
    id: "cert-bnsp-programmer-2025",
    year: "2025",
    title: "Pemrogram (Programmer)",
    issuer: "Badan Nasional Sertifikasi Profesi",
    detail:
      "Sertifikat kompetensi bidang aktivitas pemrograman, konsultasi, dan kegiatan yang berhubungan. Diterbitkan 28 Juli 2025 melalui Lembaga Sertifikasi Profesi Universitas Pamulang, berlaku 3 tahun.",
    image: "/certificates/cert-bnsp-programmer.png",
  },
  {
    id: "cert-magang-mpr-2025",
    year: "2025",
    title: "Sertifikat Magang MPR RI",
    issuer: "Sekretariat Jenderal MPR RI",
    detail:
      "Menyelesaikan magang di Subbagian Hubungan Antarlembaga, Bagian Pemberitaan dan Hubungan Antarlembaga, Biro Hubungan Masyarakat dan Sistem Informasi, Deputi Bidang Administrasi, 2–30 Juni 2025.",
    image: "/certificates/cert-magang-mpr.jpg",
  },
  {
    id: "cert-bnsp-web-2024",
    year: "2024",
    title: "Pengembang Web Pratama (Junior Web Developer)",
    issuer: "Badan Nasional Sertifikasi Profesi",
    detail:
      "Sertifikat kompetensi bidang pengembangan perangkat lunak dan pemrograman. Diterbitkan 2 Oktober 2024 melalui Lembaga Sertifikasi Profesi Informatika, berlaku 3 tahun.",
    image: "/certificates/cert-bnsp-web.png",
  },
  {
    id: "cert-magang-aplika-2024",
    year: "2024",
    title: "Sertifikat Penghargaan Magang",
    issuer: "PT. Aplika Media Nusantara",
    detail:
      "Diberikan atas kinerja yang luar biasa selama program magang pada periode 1 Maret – 1 April 2024.",
    image: "/certificates/cert-magang-aplika.jpg",
  },
];

export const projects = [
  {
    id: "helpdesk",
    name: "Aplikasi Helpdesk",
    nameEn: "IT Helpdesk Application",
    category: "Full-Stack Web App",
    image: "/projects/helpdesk.svg",
    descKey: "projects.helpdesk.desc",
    goalKey: "projects.helpdesk.goal",
    featuresKey: "projects.helpdesk.features",
    tech: ["php", "laravel", "mysql", "bootstrap", "javascript"],
    link: {
      repo: null,
      demo: null,
      isPrivate: true,
      noteKey: "projects.privateCompanyNote",
    },
    verifiedSource: "PT. Aplika Media Nusantara (IT Support | Programmer)",
  },
  {
    id: "persuratan",
    name: "Aplikasi Persuratan",
    nameEn: "Mail Management Application",
    category: "Enterprise Web App",
    image: "/projects/persuratan.svg",
    descKey: "projects.persuratan.desc",
    goalKey: "projects.persuratan.goal",
    featuresKey: "projects.persuratan.features",
    tech: ["php", "laravel", "mysql", "bootstrap", "javascript", "git"],
    link: {
      repo: null,
      demo: null,
      isPrivate: true,
      noteKey: "projects.mprResearchNote",
    },
    verifiedSource: "Sekretariat Jenderal MPR RI & Jurnal OKTAL 2026 (Extreme Programming)",
  },
  {
    id: "perpustakaan",
    name: "Aplikasi Perpustakaan",
    nameEn: "Library Management Application",
    category: "Information System",
    image: "/projects/perpustakaan.svg",
    descKey: "projects.perpustakaan.desc",
    goalKey: "projects.perpustakaan.goal",
    featuresKey: "projects.perpustakaan.features",
    tech: ["php", "mysql", "bootstrap", "javascript"],
    link: {
      repo: null,
      demo: null,
      isConfigurable: true,
      noteKey: "projects.repoConfigurableNote",
    },
    verifiedSource: "Sistem Informasi Manajemen Sirkulasi Pustaka",
  },
  {
    id: "undangan-digital",
    name: "Undangan Digital",
    nameEn: "Digital Wedding Invitation",
    category: "Interactive Web Platform",
    image: "/projects/undangan-digital.svg",
    descKey: "projects.undangan.desc",
    goalKey: "projects.undangan.goal",
    featuresKey: "projects.undangan.features",
    tech: ["react", "tailwindcss", "javascript", "html5", "css3"],
    link: {
      repo: null,
      demo: null,
      isConfigurable: true,
      noteKey: "projects.repoConfigurableNote",
    },
    verifiedSource: "Platform Undangan Web Interaktif & Responsif",
  },
  {
    id: "tiket-wisata",
    name: "Aplikasi Tiket Wisata",
    nameEn: "Tourism Ticketing Application",
    category: "Web Application",
    image: "/projects/tiket-wisata.svg",
    descKey: "projects.tiket.desc",
    goalKey: "projects.tiket.goal",
    featuresKey: "projects.tiket.features",
    tech: ["php", "laravel", "mysql", "tailwindcss", "javascript"],
    link: {
      repo: null,
      demo: null,
      isConfigurable: true,
      noteKey: "projects.repoConfigurableNote",
    },
    verifiedSource: "Sistem Informasi Katalog & Simulasi Pemesanan Tiket Destinasi",
  },
];

export const sections = [
  { id: "tentang",     labelKey: "nav.tentang" },
  { id: "keahlian",   labelKey: "nav.keahlian" },
  { id: "pengalaman", labelKey: "nav.pengalaman" },
  { id: "proyek",     labelKey: "nav.proyek" },
  { id: "kontribusi", labelKey: "nav.kontribusi" },
  { id: "kontak",     labelKey: "nav.kontak" },
];
