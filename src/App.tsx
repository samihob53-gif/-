import { useState, useEffect } from "react";
import { ViewState, Note, Report } from "./types";
import Dashboard from "./components/Dashboard";
import ChatView from "./components/ChatView";
import NotesView from "./components/NotesView";
import ReportsView from "./components/ReportsView";
import LoginView from "./components/LoginView";
import { Sparkles, HelpCircle, Bell, ArrowLeft, Bot, ExternalLink, Sun, Moon, Globe, LogOut, User } from "lucide-react";
import { TRANSLATIONS } from "./utils/translations";

// Default notes in Arabic
const DEFAULT_NOTES: Note[] = [
  {
    id: "default-note-1",
    title: "خطة مراجعة سير العمل الذاتي",
    content: "- مراجعة التقارير اليومية والبلاغات المفتوحة.\n- تنظيم الاجتماع الافتراضي مع الفنيين للتأكد من صيانة شبكة الفندق.\n- مراجعة لوحة الملاحظات وصياغة تلخيص البريد الإلكتروني الأسبوعي لتسليمه للإدارة العليا.",
    createdAt: "١٤ يونيو ٢٠٢٦",
    category: "work",
    color: "work",
  },
  {
    id: "default-note-2",
    title: "أفكار لتطوير اللياقة والصحة الشخصية 🏃‍♂️",
    content: "١. شرب ٣ لتر من المياه يومياً والاهتمام بمواعيد الوجبات.\n٢. تخصيص ٣٠ دقيقة يومية للمشي السريع في الصباح الباكر.\n٣. تجنب المشروبات الغازية والأغذية المصنعة لضمان توازن الطاقة اليومي والنشاط الذهني.",
    createdAt: "١٤ يونيو ٢٠٢٦",
    category: "personal",
    color: "personal",
  },
];

// Default reports in Arabic with triage
const DEFAULT_REPORTS: Report[] = [
  {
    id: "default-report-1",
    title: "عطل شبكة الواي فاي بقاعة العروض الكبرى",
    department: "IT",
    description: "شبكة الاتصال لا تظهر للمشتركين والضيوف منذ العاشرة صباحاً، مما يؤثر على سير ورش العمل التدريبية الجارية حالياً في القاعة الرئيسية.",
    status: "progress",
    createdAt: "١٤ يونيو ٢٠٢٦",
    priority: "أولوية قصوى",
    priorityReason: "القطاع المعطل هو قطاع عام يخدم الجمهور والمحاضرين، وتأخير الصيانة يتسبب في شلل خدمات الورش الحية.",
    summary: "انقطاع شامل للشبكة المحلية اللاسلكية يعوق سير برنامج الورش الرئيسية بقاعة العروض.",
    solutions: [
      "يرجى إعادة تشغيل جهاز الموزع المركزي وموجه التدفق المركزي بالطابق الأرضي يدوياً.",
      "توفير شبكة بديلة احتياطية (كبيل إيثرنت مباشر) لمحاضر المنصة حتى يتم الفحص الإلكتروني الشامل."
    ],
  },
  {
    id: "default-report-2",
    title: "أصوات غير طبيعية من مكيف مكتب الموارد البشرية",
    department: "maintenance",
    description: "تخرج أصوات احتكاك قوية ومقلقة من مروحة المكيف الجداري بالمكتب الجنوبي، ويظهر تساقط قطرات مياه طفيفة بالقرب من لوحة الكهرباء الفرعية.",
    status: "resolved",
    createdAt: "١٢ يونيو ٢٠٢٦",
    priority: "متوسطة",
    priorityReason: "المشكلة في مكيف إداري فردي لكن تساقط مياه بجانب لوحة كهرباء تزيد خطورة الالتماس الكهربي.",
    summary: "تسريب مياه وأصوات غريبة من المكيف بالمكتب الجنوبي للموارد البشرية بقرابة الكهرو-فنية.",
    solutions: [
      "فصل التغذية عن المكيف فوراً لتجنب التماس الكهرباء.",
      "تنظيف فلاتر المصيدة ومجرى الفوائض لضمان تدفق المياه للجهة الصحيحة."
    ],
  },
];

export default function App() {
  const [view, setView] = useState<ViewState>("dashboard");
  const [currentUser, setCurrentUser] = useState<{ email: string; role: "citizen" | "official"; fullName: string } | null>(() => {
    const stored = localStorage.getItem("workspace_current_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [lang, setLang] = useState<"ar" | "fr" | "zgh">(() => {
    const stored = localStorage.getItem("workspace_language");
    return (stored as "ar" | "fr" | "zgh") || "ar";
  });
  const [greeting, setGreeting] = useState("أهلاً بك");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("workspace_dark_mode");
    return stored === "true";
  });

  // Toggle .dark class in root element & save state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("workspace_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  // Update greeting and persist lang selection
  useEffect(() => {
    localStorage.setItem("workspace_language", lang);

    const now = new Date();
    const hrs = now.getHours();
    if (lang === "ar") {
      if (hrs < 12) {
        setGreeting("صباح الخير يا ضيفنا العزيز ☀️");
      } else if (hrs < 17) {
        setGreeting("يومك سعيد وأهلاً بك ☕");
      } else {
        setGreeting("مساء الخير يا ضيفنا العزيز 🌙");
      }
    } else if (lang === "fr") {
      if (hrs < 12) {
        setGreeting("Bonjour, cher visiteur ☀️");
      } else if (hrs < 17) {
        setGreeting("Bon après-midi, bienvenue ☕");
      } else {
        setGreeting("Bonsoir, cher visiteur 🌙");
      }
    } else { // 'zgh' Amazigh
      if (hrs < 12) {
        setGreeting("ⵜⵉⴼⴰⵡⵉⵏ, ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ ☀️ (Tifawin)");
      } else if (hrs < 17) {
        setGreeting("ⴰⵙⵙ ⵢⴻⴳⴰⵏ ⴷ ⴰⵎⴻⵥⵍⵓ, ⴰⵣⵓⵍ ☕ (Azul)");
      } else {
        setGreeting("ⵜⵉⵎⴻⵏⵙⵉⵡⵉⵏ ⵜⵉⵎⴻⵥⵍⵓⵜⵉⵏ 🌙 (Timensiwin)");
      }
    }
  }, [lang]);

  // Load and save state correctly
  useEffect(() => {
    // Set notes
    const localNotes = localStorage.getItem("workspace_notes");
    if (localNotes) {
      try {
        setNotes(JSON.parse(localNotes));
      } catch {
        setNotes(DEFAULT_NOTES);
      }
    } else {
      setNotes(DEFAULT_NOTES);
      localStorage.setItem("workspace_notes", JSON.stringify(DEFAULT_NOTES));
    }

    // Set reports
    const localReports = localStorage.getItem("workspace_reports");
    if (localReports) {
      try {
        setReports(JSON.parse(localReports));
      } catch {
        setReports(DEFAULT_REPORTS);
      }
    } else {
      setReports(DEFAULT_REPORTS);
      localStorage.setItem("workspace_reports", JSON.stringify(DEFAULT_REPORTS));
    }
  }, []);

  const saveAndSetNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem("workspace_notes", JSON.stringify(newNotes));
  };

  const saveAndSetReports = (newReports: Report[]) => {
    setReports(newReports);
    localStorage.setItem("workspace_reports", JSON.stringify(newReports));
  };

  const handleLogin = (user: { email: string; role: "citizen" | "official"; fullName: string }) => {
    setCurrentUser(user);
    localStorage.setItem("workspace_current_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("workspace_current_user");
    setView("dashboard");
  };

  const t = TRANSLATIONS[lang];

  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
        lang={lang}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-zellij-tile text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden transition-colors duration-200 ${isDarkMode ? "dark" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Algerian Sovereign State Dignity Top Information Strip */}
      <div className="bg-gradient-to-r from-[#006633] via-[#006633] to-[#d21034] text-white text-[10px] font-bold py-1 px-4 border-b border-amber-500/30 tracking-wider">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            🇩🇿 {lang === "ar" ? "الجمهورية الجزائرية الديمقراطية الشعبية" : lang === "fr" ? "République Algérienne Démocratique et Populaire" : "ⵜⴰⴳⴷⵓⴷⴰ ⵜⴰⴷⵣⴰⵢⵔⵉⵜ ⵜⴰⵎⴰⴳⴷⴰⵢⵜ ⵜⴰⵖⴻⵔⴼⴰⵏⵜ"}
          </span>
          <span className="opacity-90 hidden md:inline">
            {lang === "ar" ? "وزارة الداخلية والجماعات المحلية والتهيئة العمرانية | المراقبة الحية والنزاهة" : lang === "fr" ? "Ministère de l'Intérieur, des Collectivités Locales et de l'Aménagement du Territoire" : "ⵜⴰⵎⴰⵡⴰⵙⵜ ⵏ ⵜⴻⵀⴻⵍⵍⴰ ⵜⴰⴳⴻⵏⵙⴰⵏⵜ"}
          </span>
          <span className="text-amber-200 font-black animate-pulse">
            {lang === "ar" ? "بوابة بلغني الرسمية" : lang === "fr" ? "Portail Officiel Balaghni" : "ⴱⴰⵍⵖⵏⵉ ⵓⵏⵚⵉⴱ"}
          </span>
        </div>
      </div>

      {/* Dynamic Navigation Bar (Dynamic RTL/LTR Support) */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Algerian State Sovereign Flag Badge with elegant stable design */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md bg-white shrink-0">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-[#006633] h-full"></div>
                <div className="w-1/2 bg-white h-full"></div>
              </div>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <path d="M 50 25 A 25 25 0 0 0 50 75 A 32 32 0 0 0 50 25" fill="#d21034" />
                <polygon points="56,39.5 58.4,46.8 66,46.8 59.8,51.2 62.2,58.5 56,54 49.8,58.5 52.2,51.2 46,46.8 53.7,46.8" fill="#d21034" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.appName}</h1>
                <span className="bg-emerald-105 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest font-mono">DZD-OFFICIAL</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">{t.appSubtitle}</p>
            </div>
          </div>

          {/* dynamic customized greeting based on actual time representation */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-slate-600 select-none">{greeting}</span>
          </div>

          {/* Quick link buttons & Language switch */}
          <div className="flex items-center justify-end gap-2 text-xs">
            {/* Quick dashboard trigger with breadcrumb indicator if navigating */}
            {view !== "dashboard" && (
              <button
                onClick={() => setView("dashboard")}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-2 rounded-xl border border-slate-200/60 font-medium transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{t.home}</span>
                <ArrowLeft className={`w-3.5 h-3.5 ${lang !== "ar" ? "rotate-180" : ""}`} />
              </button>
            )}

            {/* Premium Language Dropdown */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-2.5 py-1.5 gap-1.5 shadow-3xs hover:border-blue-400/50 transition-all">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "ar" | "fr" | "zgh")}
                className="bg-transparent text-xs font-bold text-slate-705 outline-none cursor-pointer border-none py-0.5 pr-1 focus:ring-0 focus:outline-none"
              >
                <option value="ar" className="text-slate-800 bg-white">العربية (AR)</option>
                <option value="fr" className="text-slate-800 bg-white">Français (FR)</option>
                <option value="zgh" className="text-slate-800 bg-white">ⵜⴰⵎⴰⵣⵉⵖⵜ (ZGH)</option>
              </select>
            </div>

            {/* Dark Mode switcher toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-500 hover:text-blue-600 transition-all cursor-pointer flex items-center justify-center"
              title={isDarkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <div className="p-2 bg-slate-50 border border-slate-200/50 rounded-xl text-slate-400 hover:text-blue-600 cursor-help" title="Help Support">
              <HelpCircle className="w-4 h-4" />
            </div>

            {/* Logged in User Tag and Logout trigger */}
            <div className="flex items-center gap-2 border-r border-slate-100/80 dark:border-slate-800/80 pr-2 mr-2">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-slate-800 dark:text-slate-150 leading-tight">
                  {currentUser.fullName}
                </p>
                <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded-md font-bold mt-0.5 ${
                  currentUser.role === "official"
                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-350"
                    : "bg-amber-100 dark:bg-amber-950/45 text-amber-800 dark:text-amber-300"
                }`}>
                  {currentUser.role === "official"
                    ? (lang === "ar" ? "رئيس مصلحة" : lang === "fr" ? "Chef de service" : "ⴰⵇⴻⵔⵔⵓⵢ ⵏ ⵓⵡⵡⵓⵔ")
                    : (lang === "ar" ? "عضو مسجل" : lang === "fr" ? "Membre" : "ⴰⵎⵓⵔⴰⵏ")
                  }
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-955 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-450 transition-all cursor-pointer flex items-center justify-center shadow-3xs"
                title={lang === "ar" ? "تسجيل الخروج" : "Se déconnecter"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 pb-16">
        {view === "dashboard" && (
          <Dashboard
            onNavigate={setView}
            notesCount={notes.length}
            reportsCount={reports.length}
            lang={lang}
            reports={reports}
            currentUser={currentUser}
            setNotes={saveAndSetNotes}
            setReports={saveAndSetReports}
          />
        )}

        {view === "chat" && (
          <ChatView onBack={() => setView("dashboard")} lang={lang} />
        )}

        {view === "notes" && (
          <NotesView
            onBack={() => setView("dashboard")}
            notes={notes}
            setNotes={saveAndSetNotes}
            lang={lang}
          />
        )}

        {view === "reports" && (
          <ReportsView
            onBack={() => setView("dashboard")}
            reports={reports}
            setReports={saveAndSetReports}
            lang={lang}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Underline minimal brand credit */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-[10px] text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            {lang === "ar" && "© بلغني - منصة البلاغات والملاحظات الذكية لعام الحداثة ٢٠٢٦."}
            {lang === "fr" && "© Balaghni - Plateforme Intelligente de Signalement & Suivi 2026."}
            {lang === "zgh" && "© ⴱⴰⵍⵖⵏⵉ - ⵜⴰⵡⵔⵉⵇⵜ ⵜⵓⵙⵏⵉⵊⵉⵜ ⵏ ⵉⴱⴰⵍⴰⵖⵏ 2026."}
          </p>
          <div className="flex items-center gap-1 text-slate-300">
            <span>
              {lang === "ar" && "مدعوم بالكامل بتقنيات"}
              {lang === "fr" && "Propulsé intégralement par"}
              {lang === "zgh" && "ⵙ ⵜⵡⵉⵣⵉ ⵏ"}
            </span>
            <span className="text-blue-600 font-bold flex items-center gap-0.5">Gemini AI Model <ExternalLink className="w-2.5 h-2.5" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
