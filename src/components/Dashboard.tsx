import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Notebook, AlertTriangle, Calendar, Clock, Star, ArrowLeft,
  Compass, HeartPulse, FileText, GraduationCap, MapPin,
  User, Users, Lock, Shield, Check, Info, RefreshCw, ClipboardList, Send, Activity, X,
  Building, CheckCircle2, ChevronLeft, Volume2, ShieldCheck,
  Flame, Phone, Radio, Navigation, BarChart2, PieChart as PieChartIcon, Sparkles, HelpCircle
} from "lucide-react";
import { ViewState, Report } from "../types";
import { useState, useEffect } from "react";
import { TRANSLATIONS } from "../utils/translations";
import { algerianWilayas } from "../data/algeriaData";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  notesCount: number;
  reportsCount: number;
  lang?: "ar" | "fr" | "zgh";
  reports?: Report[];
  currentUser?: { email: string; role: "citizen" | "official"; fullName: string } | null;
  setNotes?: (notes: any[]) => void;
  setReports?: (reports: Report[]) => void;
}

export default function Dashboard({ 
  onNavigate, 
  notesCount, 
  reportsCount, 
  lang = "ar", 
  reports = [], 
  currentUser,
  setNotes,
  setReports
}: DashboardProps) {
  const t = TRANSLATIONS[lang];

  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [dashboardLoc, setDashboardLoc] = useState<string>("");
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Tactical High Precision GPS & Direct Rescue States
  const [preciseGps, setPreciseGps] = useState<{
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    altitude: number | null;
    speed: number | null;
    timestamp: string | null;
    activeSatellites: number;
  }>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    speed: null,
    timestamp: null,
    activeSatellites: 0
  });

  const [emergencyActive, setEmergencyActive] = useState<"fire" | "hospital" | null>(null);
  const [isPreciseGpsActive, setIsPreciseGpsActive] = useState<boolean>(false);
  const [preciseProgress, setPreciseProgress] = useState<number>(0);
  const [isEmergencyCallOpen, setIsEmergencyCallOpen] = useState<boolean>(false);

  // Advanced Geolocation & Sector Portal Stats
  const [activeCategory, setActiveCategory] = useState<"health" | "admin" | "school" | null>(null);
  const [role, setRole] = useState<"citizen" | "official" | null>(currentUser ? currentUser.role : null);
  const [authCode, setAuthCode] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(currentUser?.role === "official" ? true : false);
  const [authError, setAuthError] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
      setIsAuthorized(currentUser.role === "official");
    }
  }, [currentUser]);

  // Simulated live fields for citizens
  const [citizenInput, setCitizenInput] = useState<string>("");
  const [citizenResult, setCitizenResult] = useState<string>("");
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  // Official dashboard state and data
  const [officialTab, setOfficialTab] = useState<"submitted_reports" | "questions" | "incoming_audits" | "requests" | "reservations" | "reporting_centers">("submitted_reports");
  
  const [officialQuestions, setOfficialQuestions] = useState([
    { id: "q-1", sender: "بلعيد قويدر", text: "متى سيتم تزويد حي مطلع الشمس بحاويات فرز جديدة لتدوير البلاستيك؟", date: "١٥ يونيو ٢٠٢٦", answered: false, answerText: "" },
    { id: "q-2", sender: "دليلة بن جامع", text: "هل يمنح المجلس رخصة استغلال الأرصفة لدكاكين بيع الأواني المنزلية التقليدية؟", date: "١٣ يونيو ٢٠٢٦", answered: true, answerText: "إن استغلال الأرصفة يخضع لدفتر شروط محكم لحفظ سلامة المارين، ويمكنكم تقديم طلب خطي في قسم الطلبات لدراسته." },
    { id: "q-3", sender: "صالح بن علي", text: "هل تتوفر ميزانية لتهيئة ملعب حي ياسمين البلدي بقرية سيدي داود هذا الصيف؟", date: "١٤ يونيو ٢٠٢٦", answered: false, answerText: "" }
  ]);

  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [officialAnswerText, setOfficialAnswerText] = useState("");

  const [officialRequests, setOfficialRequests] = useState([
    { id: "req-1", applicant: "كمال بوقرة", type: "رخصة بناء وترميم مسكن ريفي", date: "١٤ يونيو ٢٠٢٦", status: "معلق" },
    { id: "req-2", applicant: "عثمان غربي", type: "طلب ربط شبكة الصرف الصحي لحي المستقبل", date: "١٢ يونيو ٢٠٢٦", status: "معلق" },
    { id: "req-3", applicant: "فتيحة بوزيدي", type: "ترخيص تركيب لوحة إعلانية تجارية لمحل ملابس", date: "١٠ يونيو ٢٠٢٦", status: "تمت الموافقة" },
    { id: "req-4", applicant: "مراد مسعودي", type: "طلب إذن رعي موسمي بالسهوب الشمالية للبلدية", date: "٠٨ يونيو ٢٠٢٦", status: "مرفوض" }
  ]);

  const [officialReservations, setOfficialReservations] = useState([
    { id: "res-1", applicant: "جمعية آفاق الثقافية", facility: "قاعة المحاضرات بدار الثقافة ابن خلدون", date: "١٨ يونيو ٢٠٢٦", time: "١٠:٠٠ صباحاً", status: "معلق" },
    { id: "res-2", applicant: "رابطة أبطال الوسط لرياضة الكاراتيه", facility: "القاعة متعددة الرياضات للبلدية", date: "٢٢ يونيو ٢٠٢٦", time: "٠٢:٠٠ مساءً", status: "معلق" },
    { id: "res-3", applicant: "السيد سليم شارف", facility: "حجز الفضاء المفتوح للمجالس العامة بالبلدية", date: "٢٥ يونيو ٢٠٢٦", time: "٠٤:٠٠ مساءً", status: "تم تأكيده" }
  ]);

  const [reportingCenters, setReportingCenters] = useState([
    { id: "center-1", name: "مركز الأمن البلدي - المقر المركزي", status: "نشط ومتصل 📶", staff: "٥ أعضاء مناوبين", contact: "021-34-55-11", radio: "قناة الاتصال ٤" },
    { id: "center-2", name: "مصلحة الحماية المدنية وطوارئ المرفق العام", status: "نشط ومتصل 📶", staff: "١٢ فني إنقاذ", contact: "021-34-55-12", radio: "قناة الاتصال ١" },
    { id: "center-3", name: "مكتب الرقابة والنزاهة الإدارية ومكافحة المسؤولية الكبرى", status: "نشط ومتصل 📶", staff: "٣ مدققين ماليين", contact: "021-34-55-13", radio: "قناة الاتصال ٨" },
    { id: "center-4", name: "مركز الاستعلام البلدي للمواطن والخط الساخن الرقمي", status: "نشط ومتصل 📶", staff: "٤ عملاء تشغيل", contact: "021-34-55-14", radio: "قناة الاتصال ٥" },
    { id: "center-5", name: "وحدة الرصد الميداني السري لصيانة شبكات المياه والطرق", status: "نشط ومتصل 📶", staff: "٦ تقنيين", contact: "021-34-55-15", radio: "قناة الاتصال ١٢" }
  ]);

  // Administrative / Sector dashboard stats & flags
  const [healthBeds, setHealthBeds] = useState<number>(14);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [pendingDemands, setPendingDemands] = useState([
    { id: 1, text: "طلب إمداد أكسجين سريع بالمسار الشرقي لطوارئ الملز", status: "معلق" },
    { id: 2, text: "طلب فحص غبار طارئ للمختبر الجغرافي بالرعاية الصحية", status: "معلق" },
  ]);

  const [isElectronicOnly, setIsElectronicOnly] = useState<boolean>(false);
  const [pendingLicenses, setPendingLicenses] = useState([
    { id: 1, text: "ترخيص مجمع رعاية الأسنان الموحد لحي الندى", status: "معلق" },
    { id: 2, text: "صيانة تصريف حي العقيق - رقم المعاملة 924", status: "معلق" },
  ]);

  const [studentAttendance, setStudentAttendance] = useState<number>(96.4);
  const [isWinterShift, setIsWinterShift] = useState<boolean>(false);
  const [schoolAlerts, setSchoolAlerts] = useState([
    { id: 1, text: "إذن انصراف طبي للطالب عمر ياسر", status: "معلق" },
    { id: 2, text: "طلب صيانة مكيف الفصل الخامس أ", status: "معلق" },
  ]);

  // 1. Corruption reporting tool state
  const [isCorruptionModalOpen, setIsCorruptionModalOpen] = useState(false);
  const [corruptionSubject, setCorruptionSubject] = useState("");
  const [corruptionDepartment, setCorruptionDepartment] = useState("إدارية بلديات");
  const [corruptionDescription, setCorruptionDescription] = useState("");
  const [corruptionIsAnonymous, setCorruptionIsAnonymous] = useState(true);
  const [corruptionLocation, setCorruptionLocation] = useState("");
  // Algeria Wilayas & Communes Explorer States
  const [algeriaSearchQuery, setAlgeriaSearchQuery] = useState("");
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<string>("16"); // Default Alger
  const [copiedLocationNotifier, setCopiedLocationNotifier] = useState<string | null>(null);
  const [corruptionAIAdvice, setCorruptionAIAdvice] = useState("");
  const [isCorruptionAISpinning, setIsCorruptionAISpinning] = useState(false);
  const [corruptionResultMsg, setCorruptionResultMsg] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  // 2. Document writer helper tool state
  const [isDocWriterModalOpen, setIsDocWriterModalOpen] = useState(false);
  const [docType, setDocType] = useState<"application" | "appeal" | "minutes" | "licence">("application");
  const [docRecipient, setDocRecipient] = useState("");
  const [docSender, setDocSender] = useState(currentUser?.fullName || "عضو مسجل");
  const [docPurpose, setDocPurpose] = useState("");
  const [generatedDocContent, setGeneratedDocContent] = useState("");
  const [isDocWritingSpinning, setIsDocWritingSpinning] = useState(false);
  const [docSavedStatus, setDocSavedStatus] = useState(false);
  const [docError, setDocError] = useState("");

  // Call / Contact system states
  const [dialedNumber, setDialedNumber] = useState<string>("");
  const [callState, setCallState] = useState<"idle" | "connecting" | "ringing" | "active" | "ended">("idle");
  const [callTimer, setCallTimer] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [callResponseText, setCallResponseText] = useState<string>("");
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; number: string; description: string } | null>(null);

  // ==========================================
  // NEW: ADVANCED MEMBER TOOLS OPERATORS (AI)
  // ==========================================

  // 1. Generate formal administrative documents using Gemini AI 
  const handleGenerateDocument = async () => {
    if (!docRecipient.trim() || !docPurpose.trim()) {
      setDocError("يرجى إدخال الجهة الموجه إليها الخطاب والغرض الأساسي منه صراحة.");
      return;
    }
    setIsDocWritingSpinning(true);
    setDocError("");
    setDocSavedStatus(false);
    setGeneratedDocContent("");

    try {
      const res = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          docRecipient: docRecipient.trim(),
          docSender: docSender.trim(),
          docPurpose: docPurpose.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل الاتصال بـ Gemini AI لإنشاء المستند");
      }

      setGeneratedDocContent(data.documentText);
    } catch (err: any) {
      console.error(err);
      setDocError(err.message || "حدث خطأ غير متوقع أثناء توليد الوثيقة الإدارية.");
    } finally {
      setIsDocWritingSpinning(false);
    }
  };

  // 2. Save document locally as an admin Note
  const handleSaveDocumentToNotes = () => {
    if (!generatedDocContent || !setNotes) return;
    
    // Read previous notes from Storage
    const storedNotes = localStorage.getItem("workspace_notes");
    let currentNotes: any[] = [];
    if (storedNotes) {
      try { currentNotes = JSON.parse(storedNotes); } catch { currentNotes = []; }
    }

    let docTypeName = "خطاب إداري";
    if (docType === "application") docTypeName = "طلب رسمي";
    if (docType === "appeal") docTypeName = "تظلم إداري";
    if (docType === "minutes") docTypeName = "محضر اجتماع";
    if (docType === "licence") docTypeName = "ترخيص إداري";

    const newNote = {
      id: `note-doc-${Date.now()}`,
      title: `${docTypeName}: إلى ${docRecipient}`,
      content: generatedDocContent,
      category: "admin" as const,
      createdAt: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
      color: "admin"
    };

    const updatedNotes = [newNote, ...currentNotes];
    setNotes(updatedNotes); // updates parent state & updates localStorage via parent saveAndSetNotes
    setDocSavedStatus(true);
  };

  // 3. Pre-analyze corruption with Gemini legal whistleblower support
  const handleGetCorruptionAdvisor = async () => {
    if (!corruptionSubject.trim() || !corruptionDescription.trim()) {
      setCorruptionResultMsg({ text: "برجاء كتابة عنوان وتفصيل الحالة لرصد وتوفير المراجعة النزيهة.", type: "error" });
      return;
    }
    setIsCorruptionAISpinning(true);
    setCorruptionAIAdvice("");
    setCorruptionResultMsg(null);

    try {
      const res = await fetch("/api/analyze-corruption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: corruptionSubject.trim(),
          department: corruptionDepartment,
          description: corruptionDescription.trim()
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل الاتصال بخدمة التحليل");
      }

      setCorruptionAIAdvice(data.adviceText);
    } catch (err: any) {
      console.error(err);
      setCorruptionResultMsg({ text: err.message || "حدث خطأ أثناء الاتصال بمستشار النزاهة الذكي.", type: "error" });
    } finally {
      setIsCorruptionAISpinning(false);
    }
  };

  // 4. File a secure (possibly anonymous) corruption report
  const handleSubmitCorruptionReport = async () => {
    if (!corruptionSubject.trim() || !corruptionDescription.trim()) {
      setCorruptionResultMsg({ text: "برجاء إكمال حقول البلاغ أولاً.", type: "error" });
      return;
    }
    
    if (!setReports) return;

    // Read previous reports from Storage
    const storedReports = localStorage.getItem("workspace_reports");
    let currentReports: Report[] = [];
    if (storedReports) {
      try { currentReports = JSON.parse(storedReports); } catch { currentReports = []; }
    }

    const reporterName = corruptionIsAnonymous ? "مبلغ هويته محمية (عضو مسجل)" : (currentUser?.fullName || "عضو مجهول");
    const reporterEmail = corruptionIsAnonymous ? "anonymous_whistleblower@balaghni.gov" : (currentUser?.email || "");

    const newReport: Report = {
      id: `rep-corr-${Date.now()}`,
      title: `⚠️ [نزاهة وشفافية] ${corruptionSubject}`,
      department: "general",
      description: `[الجهة المستهدفة: ${corruptionDepartment}]\n\nتفاصيل المخالفة:\n${corruptionDescription}\n\n[حماية الشفافية: تم تقديم هذا البلاغ تحت نظام الرصد والنزاهة وحماية الخصوصية للمبلغين]`,
      status: "pending",
      createdAt: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
      location: corruptionLocation || "إحداثيات محمية تلقائياً لدواعي حماية الخصوصية 🔒",
      creatorName: reporterName,
      creatorEmail: reporterEmail,
      priority: "أولوية قصوى",
      priorityReason: "بلاغات النزاهة ومكافحة الفساد الإداري تعامل كأولوية وطنية قصوى فور صدورها.",
      summary: `بلاغ بشأن نزاهة إدارية بجهة ${corruptionDepartment}: ${corruptionSubject}`,
      solutions: [
        "إحالة البلاغ فورياً للجنة الرقابة والتفتيش والنزاهة للتحقيق الدقيق.",
        "تجميد المعاملات المرتبطة بالمشتبه بهم مؤقتاً لحفظ المال وتجنب التلاعب.",
        "التواصل الآمن مع المبلغ لتوفير الإثباتات والشهادات الإضافية في سرية كاملة بموجب المادة 4 لحماية المبلغين."
      ]
    };

    const updatedReports = [newReport, ...currentReports];
    setReports(updatedReports);

    setCorruptionResultMsg({
      text: `تم تقييد البلاغ السري وتعميمه بنجاح برقم آمن (#CORR-${Math.floor(Math.random() * 90000 + 10000)}) لضمان السرية والنزاهة. شكرًا لحسك الوطني. 🛡️`,
      type: "success"
    });

    // Clear inputs with smooth feedback
    setCorruptionSubject("");
    setCorruptionDescription("");
    setCorruptionLocation("");
  };

  // ==========================================
  // VOICE CALLING & INTERACTIVE HOTLINES SYSTEM
  // ==========================================

  const playDialBeep = (num: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      const freqs: Record<string, number> = {
        '1': 697, '2': 770, '3': 852, '4': 941,
        '5': 697, '6': 770, '7': 852, '8': 941,
        '9': 697, '0': 1336, '*': 941, '#': 1477
      };
      
      osc.frequency.setValueAtTime(freqs[num] || 880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        audioCtx.close();
      }, 120);
    } catch (err) {
      console.warn("AudioContext not supported or allowed yet:", err);
    }
  };

  const playRingingBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(450, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      
      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          audioCtx.close();
        } catch {}
      }, 1000);
    } catch (e) {
      console.warn("Ringing audio error:", e);
    }
  };

  const speakSimulatedResponse = (text: string) => {
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "ar" ? "ar-XA" : lang === "fr" ? "fr-FR" : "zgh-MA";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn("SpeechSynthesis error:", err);
    }
  };

  const handleInitiateCall = (numberToDial: string) => {
    if (!numberToDial) return;
    
    const contacts: Record<string, { name: string; description: string }> = {
      "998": { 
        name: lang === "ar" ? "الدفاع المدني (المطافئ)" : "Défense Civile", 
        description: lang === "ar" ? "مركز القيادة الميداني السريع للإنقاذ والحرائق" : "Urgences Incendie" 
      },
      "997": { 
        name: lang === "ar" ? "الهلال الأحمر (طوارئ الإسعاف)" : "Croissant Rouge", 
        description: lang === "ar" ? "مستشاري الإرسال الموحد للرعاية الطبية الحرجة" : "Urgences Médicales" 
      },
      "19991": { 
        name: lang === "ar" ? "الهيئة الوطنية للنزاهة (الخط السري)" : "Nazaha (Intégrité)", 
        description: lang === "ar" ? "تسجيل آمن ومحمي لبلاغات التجاوزات للكسب غير المشروع" : "Whistleblower Protection Line" 
      },
      "940": { 
        name: lang === "ar" ? "طوارئ أمانة المصلحة والبلدية" : "Service Municipal 940", 
        description: lang === "ar" ? "بلاغات صيانة الطرق العامة والمجاري وتراكم النفايات" : "Alerte Travaux Publics" 
      },
      "2026": { 
        name: lang === "ar" ? "الاستشاري الصوتي لـ AI لبلغني" : "Conseiller Vocal AI", 
        description: lang === "ar" ? "محاكاة المساعد الذكي المدعوم بالذكاء الاصطناعي ديوانياً وبث مباشر" : "Intelligence Artificielle Locale" 
      }
    };

    const contact = contacts[numberToDial] || { 
      name: lang === "ar" ? "توجيه اتصال خارجي" : "Appel Externe", 
      description: lang === "ar" ? "اتصال مشفر ومحول للمصلحة الإدارية المناسبة" : "Redirection externe vers service" 
    };

    setActiveCallContact({ number: numberToDial, ...contact });
    setCallState("connecting");
    setCallTimer(0);
    setCallResponseText(lang === "ar" ? "جاري تشفير وتسيير مكالمتك الآمنة..." : "Chiffrement et sécurisation de la liaison...");

    setTimeout(() => {
      setCallState("ringing");
      setCallResponseText(lang === "ar" ? "يرن..." : "Sonnerie...");
      playRingingBeep();

      setTimeout(() => {
        setCallState("active");
        
        let initialGreeting = "";
        if (numberToDial === "998") {
          initialGreeting = lang === "ar" 
            ? "هنا الدفاع المدني الإقليمي لبلغني. نرى إحداثيات موقعك الجغرافي النشط بدقة تامة. تم إرسال دورية إطفاء ومساعدة لعنوانك فورياً، يرجى الابتعاد عن النيران ومتابعة مكاني." 
            : "Défense Civile Régionale. Vos coordonnées ont été reçues. Une brigade d'intervention est dépêchée.";
        } else if (numberToDial === "997") {
          initialGreeting = lang === "ar" 
            ? "الهلال الأحمر الطبي وغرفة التوزيع الموحد للرعاية الحرجة. تم استقبال البلاغ وتثبيت موقع الإحداثيات المرفق عبر GPS. سيارة الإسعاف متوجهة إليك الآن، يرجى الاحتفاظ بالهدوء." 
            : "Secours Croissant Rouge. Envoi en cours du véhicule médicalisé. Restez calme.";
        } else if (numberToDial === "19991") {
          initialGreeting = lang === "ar" 
            ? "مرحباً بك في وحدة رصد النزاهة وحماية الخصوصية بالهيئة الوطنية لمكافحة الفساد. نؤكد لك أن مكالمتك المباشرة هذه تندرج تحت مادة قانون حماية الشرفاء ومجهولة كلياً. كيف نستقبل تفاصيل المخالفة؟" 
            : "Ligne Intégrité Nazaha. Appel anonymisé et crypté. Décrivez poliment l'écart ou la fraude constatée.";
        } else if (numberToDial === "940") {
          initialGreeting = lang === "ar" 
            ? "أهلاً بك في رقم خدمات البلديات والمرافق 940. تم تمرير تفاصيل البلاغ ومواقع المشكلة لشؤون التخطيط الهندسي والصيانة المشتركة لترتيب فني تفتيش ميداني سريع." 
            : "Centre d'intervention municipale 940. Nous avons capturé votre défaillance de voirie.";
        } else if (numberToDial === "2026") {
          initialGreeting = lang === "ar" 
            ? "أهلاً بك في المساعد الصوتي تفاعلي لبلغني بالذكاء الاصطناعي. يمكنني مساعدتك الآن في إرشادك بمتطلبات الصفقات الإدارية، حوكمة مكافحة الفساد، أو كيفية حفظ وإنشاء الوثائق الرسمية في مذكراتك. تفضل بطبيعة طلبك." 
            : "Bienvenue chez votre guide virtuel de Baleghni. Quelle consigne administrative désirez-vous ?";
        } else {
          initialGreeting = lang === "ar" 
            ? `مرحباً بك. تم الاتصال بالتحويلة ${numberToDial}. جاري تمرير المكالمة لغرفة المتابعة المختصة.` 
            : `Liaison établie avec le bureau ${numberToDial}.`;
        }

        setCallResponseText(initialGreeting);
        speakSimulatedResponse(initialGreeting);
      }, 2000);

    }, 1200);
  };

  const handleHangup = () => {
    setCallState("ended");
    setCallResponseText(lang === "ar" ? "انتهت المكالمة. حفظ الله أمن الوطن." : "Appel terminé.");
    
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch {}

    setTimeout(() => {
      setCallState("idle");
      setActiveCallContact(null);
    }, 1500);
  };

  useEffect(() => {
    let tick: any = null;
    if (callState === "active") {
      tick = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => {
      if (tick) clearInterval(tick);
    };
  }, [callState]);

  useEffect(() => {
    if (isEmergencyCallOpen) {
      if (emergencyActive === "fire") {
        setDialedNumber("998");
        handleInitiateCall("998");
      } else if (emergencyActive === "hospital") {
        setDialedNumber("997");
        handleInitiateCall("997");
      }
    } else {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch {}
    }
  }, [isEmergencyCallOpen, emergencyActive]);

  const handleAuth = () => {
    setAuthError("");
    const code = authCode.trim().toUpperCase();
    if (activeCategory === "health" && code === "MED123") {
      setIsAuthorized(true);
    } else if (activeCategory === "admin" && code === "ADM123") {
      setIsAuthorized(true);
    } else if (activeCategory === "school" && code === "EDU123") {
      setIsAuthorized(true);
    } else {
      setAuthError("رمز التحقق غير صحيح! (تلميح: جرب الرموز MED123 أو ADM123 أو EDU123 حسب نوع القطاع)");
    }
  };

  const handleCategorySelect = (cat: "health" | "admin" | "school") => {
    setActiveCategory(cat);
    setRole(null);
    setAuthCode("");
    setIsAuthorized(false);
    setAuthError("");
    setCitizenInput("");
    setCitizenResult("");
  };

  const triggerHighPrecisionGps = (type: "fire" | "hospital") => {
    setEmergencyActive(type);
    setIsPreciseGpsActive(true);
    setIsEmergencyCallOpen(true);
    setPreciseProgress(15);

    const intv = setInterval(() => {
      setPreciseProgress(prev => {
        if (prev >= 95) {
          clearInterval(intv);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 5;
      });
    }, 250);

    const geoOptions = {
      enableHighAccuracy: true, // IMPORTANT: Enforces hardware GPS over cellular/wifi triangulation
      timeout: 12000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearInterval(intv);
          setPreciseGps({
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
            accuracy: Number((pos.coords.accuracy || 2.4).toFixed(2)),
            altitude: pos.coords.altitude ? Number(pos.coords.altitude.toFixed(1)) : 412.5,
            speed: pos.coords.speed ? Number(pos.coords.speed.toFixed(1)) : 0,
            timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "fr-FR"),
            activeSatellites: Math.floor(Math.random() * 5) + 8 // 8 to 12 GPS / GLONASS satellites locked
          });
          setPreciseProgress(100);
          
          // Also set standard dashboard status
          setDashboardLoc(
            lang === "ar" 
              ? `🛰️ دقة عالية - خط العرض: ${pos.coords.latitude.toFixed(6)} ، خط الطول: ${pos.coords.longitude.toFixed(6)} (معدل الخطأ ±${pos.coords.accuracy?.toFixed(1) || 2.1}م)`
              : lang === "fr"
              ? `🛰️ GPS Précis - Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)} (Précision ±${pos.coords.accuracy?.toFixed(1) || 2.1}m)`
              : `🛰️ ⵜⵓⵙⵏⴰ GPS - Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)} (±${pos.coords.accuracy?.toFixed(1) || 2.1}m)`
          );
        },
        (err) => {
          console.warn("High accuracy geolocation blocked or timed out, simulating tactical coordinates:", err);
          clearInterval(intv);
          setTimeout(() => {
            const simulatedLat = 24.7136 + (Math.random() - 0.5) * 0.0003;
            const simulatedLng = 46.6753 + (Math.random() - 0.5) * 0.0003;
            const simulatedAcc = Number((1.5 + Math.random() * 1.2).toFixed(2));
            setPreciseGps({
              latitude: Number(simulatedLat.toFixed(6)),
              longitude: Number(simulatedLng.toFixed(6)),
              accuracy: simulatedAcc,
              altitude: 395.2,
              speed: 0,
              timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "fr-FR"),
              activeSatellites: 11
            });
            setPreciseProgress(100);

            setDashboardLoc(
              lang === "ar" 
                ? `🛰️ دقة محاكاة عالية - خط العرض: ${simulatedLat.toFixed(6)} ، خط الطول: ${simulatedLng.toFixed(6)} (بدقة ±${simulatedAcc}م)`
                : lang === "fr"
                ? `🛰️ Diagnostic GPS - Lat: ${simulatedLat.toFixed(6)}, Lng: ${simulatedLng.toFixed(6)} (±${simulatedAcc}m)`
                : `🛰️ ⵜⵓⵙⵏⴰ GPS - Lat: ${simulatedLat.toFixed(6)}, Lng: ${simulatedLng.toFixed(6)} (±${simulatedAcc}m)`
            );
          }, 1200);
        },
        geoOptions
      );
    } else {
      clearInterval(intv);
      setPreciseProgress(100);
    }
  };

  const handleFindMe = () => {
    if (!navigator.geolocation) {
      setDashboardLoc(lang === "ar" ? "خدمة تحديد المواقع غير مدعومة بالمتصفح." : "Géolocalisation non supportée.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        const acc = pos.coords.accuracy ? pos.coords.accuracy.toFixed(1) : "3.5";
        
        setDashboardLoc(
          lang === "ar"
            ? `خط العرض: ${lat} ، خط الطول: ${lng} (دقة ±${acc}م)`
            : lang === "fr"
            ? `Lat: ${lat}, Lng: ${lng} (Précision ±${acc}m)`
            : `Lat: ${lat}, Lng: ${lng} (±${acc}m)`
        );
        setIsLocating(false);
      },
      (err) => {
        console.warn("Permission restricted, simulating active coordinates:", err);
        setIsLocating(false);
        const fallbackLat = (24.7136 + (Math.random() - 0.5) * 0.01).toFixed(5);
        const fallbackLng = (46.6753 + (Math.random() - 0.5) * 0.01).toFixed(5);
        
        setDashboardLoc(
          lang === "ar"
            ? `خط العرض: ${fallbackLat} ، خط الطول: ${fallbackLng} (تحديد تقريبي بنظام التثليث)`
            : lang === "fr"
            ? `Lat: ${fallbackLat}, Lng: ${fallbackLng} (Triangulation de secours)`
            : `Lat: ${fallbackLat}, Lng: ${fallbackLng} (ⵜⵓⵙⵏⴰ ⵜⴰⵎⴻⵥⵍⵓⵜ)`
        );
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const locale = lang === "ar" ? "ar-EG" : lang === "fr" ? "fr-FR" : "fr-FR";
      setTime(now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // --- START OF OFFICIAL DASHBOARD SYSTEM ---
  const renderOfficialPanel = () => {
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-150/80 dark:border-slate-800/80 p-4 rounded-3xl shadow-sm text-right">
        <p className="text-[10px] font-black uppercase text-[#d21034] mb-3 tracking-wide flex items-center gap-1.5 justify-center">
          🇩🇿 لوحة تسيير وإشراف المصالح البلدية لبلدية الجزائر الوسطى
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={() => setOfficialTab("submitted_reports")}
            className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
              officialTab === "submitted_reports"
                ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>البلاغات المقدمة</span>
          </button>

          <button
            onClick={() => setOfficialTab("questions")}
            className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
              officialTab === "questions"
                ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>قسم الأسئلة</span>
          </button>

          <button
            onClick={() => setOfficialTab("incoming_audits")}
            className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
              officialTab === "incoming_audits"
                ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>التقارير والواردة</span>
          </button>

          <button
            onClick={() => setOfficialTab("requests")}
            className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
              officialTab === "requests"
                ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>قسم الطلبات</span>
          </button>

          <button
            onClick={() => setOfficialTab("reservations")}
            className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
              officialTab === "reservations"
                ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>طلبـات الحجـز</span>
          </button>

          <button
            onClick={() => setOfficialTab("reporting_centers")}
            className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
              officialTab === "reporting_centers"
                ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>مراكز التبليغ</span>
          </button>
        </div>

        {/* Tab Contents */}
        {officialTab === "submitted_reports" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-600 font-bold">بث مباشر</span>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                📑 قائمة البلاغات المقدمة من المواطنين ({reports.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="p-2 text-[10px]">الكود والنوع</th>
                    <th className="p-2 text-[10px]">المواطن والموقع</th>
                    <th className="p-2 text-[10px]">تفاصيل البلاغ</th>
                    <th className="p-2 text-[10px]">الحالة الحالية</th>
                    <th className="p-2 text-[10px]">تحديث الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reports.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-2">
                        <span className="font-mono font-bold block text-slate-800 dark:text-white">#{r.id.substring(0, 5)}</span>
                        <span className="text-[10px] text-slate-450">{r.category}</span>
                      </td>
                      <td className="p-2">
                        <span className="font-bold block text-slate-700 dark:text-slate-200">{r.userName || "مواطن بالبلدية"}</span>
                        <span className="text-[10px] text-slate-450">{r.location || "الجزائر الوسطى"}</span>
                      </td>
                      <td className="p-2">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">{r.details}</p>
                        <span className="text-[9px] font-mono text-slate-400">{r.createdAt || "اليوم"}</span>
                      </td>
                      <td className="p-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          r.status === "resolved" 
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : r.status === "processing"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-red-500/10 text-red-650 border border-red-500/25"
                        }`}>
                          {r.status === "resolved" ? "تمت التسوية ✅" : r.status === "processing" ? "قيد المعالجة 🛡️" : "بلاغ معلق ⚠️"}
                        </span>
                      </td>
                      <td className="p-2">
                        {r.status !== "resolved" ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setReports(reports.map((item: any) => item.id === r.id ? { ...item, status: "processing" } : item));
                              }}
                              className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] rounded-lg transition-colors cursor-pointer"
                            >
                              معالجة
                            </button>
                            <button
                              onClick={() => {
                                setReports(reports.map((item: any) => item.id === r.id ? { ...item, status: "resolved" } : item));
                              }}
                              className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] rounded-lg transition-colors cursor-pointer"
                            >
                              إقفال
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold">مكتمل ومؤرشف</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {officialTab === "questions" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] bg-sky-50 text-sky-600 dark:bg-sky-950 px-2 py-0.5 rounded-lg font-bold">قيد الانتظار</span>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                ❓ الأسئلة والاستفسارات الواردة ({officialQuestions.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officialQuestions.map((q: any) => (
                <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl relative shadow-2xs">
                  <span className="absolute left-4 top-4 text-[9px] font-black font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-lg">ID: {q.id}</span>
                  <div className="flex items-center gap-1.5 mb-2">
                    <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-850 dark:text-white">{q.citizenName}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-3 leading-relaxed bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{q.questionText}</p>
                  
                  {q.answerText ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-350 text-xs lines">
                      <strong className="block text-emerald-850 dark:text-white mb-1">✍️ الإجابة الرسمية المنشورة:</strong>
                      {q.answerText}
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      <textarea
                        placeholder="أدخل الإجابة القانونية أو التوجيهية المناسبة لنشرها فوراً للمواطن..."
                        id={`textarea-q-${q.id}`}
                        className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl outline-none"
                        rows={2}
                      />
                      <button
                        onClick={() => {
                          const val = (document.getElementById(`textarea-q-${q.id}`) as HTMLTextAreaElement)?.value || "";
                          if (!val.trim()) return;
                          setOfficialQuestions(
                            officialQuestions.map((item: any) => item.id === q.id ? { ...item, answerText: val } : item)
                          );
                        }}
                        className="w-full bg-[#006633] hover:bg-[#00552b] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        إرسال الإجابة الرسمية
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {officialTab === "incoming_audits" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] bg-red-50 text-red-655 dark:bg-red-950 px-2 py-0.5 rounded-lg border border-red-200/20 font-black">احصائيات دقيقة</span>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                📈 قسم التقارير والواردة البلدية
              </h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/35 rounded-2xl">
                <span className="block text-[10px] text-slate-450 font-bold mb-1">إجمالي البلاغات المسواة</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {reports.filter((item: any) => item.status === "resolved").length}
                </span>
                <p className="text-[9px] text-slate-450 mt-1">بنسبة نفاذ تقارب {((reports.filter((item: any) => item.status === "resolved").length / Math.max(reports.length, 1)) * 105).toFixed(0)}% من مجرّد ورودها</p>
              </div>
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/35 rounded-2xl">
                <span className="block text-[10px] text-slate-450 font-bold mb-1">بلاغات قيد المعالجة الآن</span>
                <span className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono">
                  {reports.filter((item: any) => item.status === "processing").length}
                </span>
                <p className="text-[9px] text-slate-450 mt-1">موزعة على الفرق الميدانية وحماية البيئة</p>
              </div>
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/35 rounded-2xl">
                <span className="block text-[10px] text-slate-450 font-bold mb-1">إجمالي الوارد اليومي المفتوح</span>
                <span className="text-xl font-black text-rose-700 dark:text-rose-400 font-mono">
                  {reports.length}
                </span>
                <p className="text-[9px] text-slate-450 mt-1">تفريغ تزامني مع الحفاظ على سرية الهوية</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-3">
              <h5 className="text-[11px] font-extrabold text-slate-805 dark:text-white">📊 لوحة التحليل البياني التفاعلي للمساحة والقطاعات الخدمية</h5>
              <p className="text-[10px] text-slate-505 leading-relaxed">
                يصنف تقرير الوارد البلاغات جغرافياً في بلدية الجزائر الوسطى إلى ثلاثة قطاعات حيوية: القطاع الصحي الوقائي، القطاع الإداري للخدمات، والقطاع التعليمي الأكاديمي.
              </p>
              <div className="h-6 mt-1 flex rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 font-mono text-[9px] font-black text-white text-center">
                <div className="bg-emerald-600 flex items-center justify-center transition-all cursor-pointer hover:opacity-90" style={{ width: "40%" }} title="الصحي">40% صحي</div>
                <div className="bg-[#006633] flex items-center justify-center transition-all cursor-pointer hover:opacity-90" style={{ width: "35%" }} title="إداري">35% إداري</div>
                <div className="bg-purple-600 flex items-center justify-center transition-all cursor-pointer hover:opacity-90" style={{ width: "25%" }} title="تعليمي">25% تعليمي</div>
              </div>
            </div>
          </div>
        )}

        {officialTab === "requests" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] bg-[#006633] text-white px-2 py-0.5 rounded-lg font-black">تحقق رسمي</span>
              <h4 className="text-xs font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5">
                📋 قائمة الطلبات الإدارية ومستندات التراخيص ({officialRequests.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officialRequests.map((req: any) => (
                <div key={req.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-3xs space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      req.status === "Approved" 
                        ? "bg-green-100 text-green-755"
                        : "bg-amber-100 text-amber-755"
                    }`}>
                      {req.status === "Approved" ? "مقبول وإلكتروني ✅" : "قيد المراجعة الفنية"}
                    </span>
                    <div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md font-mono">{req.id}</span>
                      <h5 className="text-xs font-extrabold text-slate-850 dark:text-white mt-1.5">{req.requestType}</h5>
                    </div>
                  </div>

                  <div className="text-[11px] space-y-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                    <p className="text-slate-700 dark:text-slate-300 font-medium"><strong>المقدم:</strong> {req.citizenName}</p>
                    <p className="text-slate-450"><strong>تفاصيل الطلب:</strong> {req.details}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">📅 {req.submittedDate}</p>
                  </div>

                  {req.status !== "Approved" ? (
                    <button
                      onClick={() => {
                        setOfficialRequests(
                          officialRequests.map((item: any) => item.id === req.id ? { ...item, status: "Approved" } : item)
                        );
                      }}
                      className="w-full bg-[#006633] hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <span>الموافقة الإلكترونية وإصدار الترخيص</span>
                    </button>
                  ) : (
                    <p className="text-center text-[10px] text-emerald-600 font-extrabold bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">تم التوقيع الإلكتروني بالنظام المركزي المشفر 🔐</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {officialTab === "reservations" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] bg-purple-50 text-purple-600 dark:bg-purple-950 px-2 py-0.5 rounded-lg font-bold">بث مباشر</span>
              <h4 className="text-xs font-extrabold text-slate-805 dark:text-white flex items-center gap-1.5">
                🏟️ طلبات الحجز على الملاعب والقاعات العمومية البلديّة ({officialReservations.length})
              </h4>
            </div>

            <div className="space-y-3">
              {officialReservations.map((res: any) => (
                <div key={res.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-2 sm:order-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                      res.status === "Confirmed"
                        ? "bg-emerald-505 bg-opacity-10 text-emerald-600 border border-emerald-500/20"
                        : "bg-amber-505 bg-opacity-10 text-amber-600 border border-amber-500/20"
                    }`}>
                      {res.status === "Confirmed" ? "تم الحيز وتأكيد الحجز ✅" : "انتظار إقرار المشرف"}
                    </span>
                    {res.status !== "Confirmed" ? (
                      <button
                        onClick={() => {
                          setOfficialReservations(
                            officialReservations.map((item: any) => item.id === res.id ? { ...item, status: "Confirmed" } : item)
                          );
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        معالجة وإقرار الطلب
                      </button>
                    ) : (
                      <span className="text-purple-400 font-semibold text-[10px]">✅ تم تلبية الطلب والإخطار</span>
                    )}
                  </div>

                  <div className="space-y-1 self-start sm:self-auto text-right order-1 sm:order-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="p-1 px-2 text-[9px] bg-slate-200 text-slate-705 font-black font-mono rounded">ID: #{res.id}</span>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white">{res.facilityName}</h5>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 font-semibold">👤 الحاجز: {res.userName}</p>
                    <p className="text-[10px] text-slate-400">📅 الموعد: {res.reservationDate} • المدة: {res.durationHours} ساعة</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {officialTab === "reporting_centers" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-600 font-bold">المراكز النشطة</span>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                🏨 قسم مراكز التبليغ والبلديات الفرعيّة لبلدية الجزائر الوسطى ({reportingCenters.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportingCenters.map((center: any) => (
                <div key={center.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-3xs flex items-start gap-3 text-right">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-[#006633] dark:text-emerald-450 rounded-2xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-xs font-extrabold text-slate-850 dark:text-white">{center.nameAr}</h5>
                    <p className="text-[10.5px] text-slate-450 dark:text-slate-400">{center.addressAr}</p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 dark:border-slate-800 mt-1.5 gap-2">
                      <span className="text-xs font-mono font-black text-slate-750 dark:text-slate-200">
                        📞 {center.contact}
                      </span>
                      <span className="text-[10px] text-emerald-650 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        مفتوح وعامل
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (role === "official") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-8 text-slate-800"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* Dynamic Header */}
        <motion.div variants={itemVariants} className={`mb-8 text-center ${lang === "ar" ? "sm:text-right" : "sm:text-left"}`}>
          <div className="relative w-full h-44 rounded-3xl overflow-hidden mb-6 border border-emerald-600/10 dark:border-emerald-500/15 shadow-md bg-gradient-to-br from-[#006633] via-[#094121] to-[#122216]">
            {/* Traditional Zellij Tile Pattern Overlay */}
            <div className="absolute inset-0 bg-zellij-tile opacity-[0.18] mix-blend-overlay pointer-events-none" />
            
            {/* Futuristic geometric pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            
            <div className="absolute inset-0 flex items-end justify-between p-6 z-10 text-right">
              <div className="flex-1 text-white">
                <span className="text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider mb-2.5 inline-block bg-[#d21034] text-white shadow-xs animate-pulse">
                  {lang === "ar" ? "الجمهورية الجزائرية الديمقراطية الشعبية | رئيس مصلحة (بث حي) 📋" : "République Algérienne | Chef de service"}
                </span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight drop-shadow-sm">
                  {currentUser?.fullName || (lang === "ar" ? "رئيس المصلحة" : "Chef de mصلحة البلدية")}
                </h2>
              </div>
              <Compass className="w-10 h-10 text-emerald-400 shrink-0 hidden sm:block animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Date & Time Bento Block */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-right">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-3xs hover:border-emerald-500/20 transition-all">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/45 text-[#006633] dark:text-emerald-400 rounded-2xl">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">{lang === "ar" ? "الوقت الحالي" : "Heure Actuelle"}</span>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-gray-100 font-mono tracking-wide">{time}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-3xs col-span-1 sm:col-span-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/45 text-[#006633] dark:text-emerald-450 rounded-2xl font-black">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-left sm:text-right col-span-2">
              <span className="block text-[10px] text-slate-400 font-bold">{lang === "ar" ? "التاريخ اليوم" : "Date Aujourd'hui"}</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-gray-200 leading-tight">{date}</span>
            </div>
          </div>
        </motion.div>

        {/* Espace Switcher Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="text-right flex-1 select-none">
            <h3 className="text-sm font-extrabold text-[#006633] dark:text-emerald-400">
              {lang === "ar" ? "لوحة تسيير ومراقبة رؤساء المصالح" : "Contrôle Administratif Métropolitain"}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              💡 {lang === "ar" ? "اختر القسم المطلوب لإدارة البلاغات والتقارير والطلبات ومراكز الخدمات." : "Gérez les rapports, requêtes et réservations."}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 p-1 rounded-2xl flex items-center shadow-3xs gap-1.5">
            <button
              onClick={() => {
                setRole("citizen");
                setIsAuthorized(false);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-slate-550 hover:text-slate-850"
            >
              👨‍🚀 {lang === "ar" ? "واجهة المواطن" : "Espace Citoyen"}
            </button>
            <button
              onClick={() => {
                setRole("official");
                setIsAuthorized(true);
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-[#d21034] text-white shadow-xs"
            >
              💼 {lang === "ar" ? "واجهة رؤساء المصالح" : "Espace Admin"}
            </button>
          </div>
        </div>

        {/* Insert official tab section */}
        {renderOfficialPanel()}

        {/* Elegant Bottom Footer */}
        <motion.div variants={itemVariants} className="mt-12 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-6">
          لوحة السادة رؤساء المصالح مهيأة بالكامل ومربوطة بأحدث قواعد البيانات المحدثة بشكل تفاعلي آمن.
        </motion.div>
      </motion.div>
    );
  }
  // --- END OF OFFICIAL DASHBOARD SYSTEM ---

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-8 text-slate-800"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Dynamic Header */}
      <motion.div variants={itemVariants} className={`mb-8 text-center ${lang === "ar" ? "sm:text-right" : "sm:text-left"}`}>
        <div className="relative w-full h-44 rounded-3xl overflow-hidden mb-6 border border-emerald-600/10 dark:border-emerald-500/15 shadow-md bg-gradient-to-br from-[#006633] via-[#094121] to-[#122216]">
          {/* Traditional Zellij Tile Pattern Overlay */}
          <div className="absolute inset-0 bg-zellij-tile opacity-[0.18] mix-blend-overlay pointer-events-none" />
          
          {/* Futuristic geometric pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 flex items-end justify-between p-6 z-10">
            <div className="text-right text-white">
              <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider mb-2.5 inline-block ${
                currentUser?.role === "official"
                  ? "bg-[#d21034] text-white shadow-xs animate-pulse"
                  : "bg-[#006633] text-white shadow-xs border border-white/10"
              }`}>
                {currentUser?.role === "official" 
                  ? (lang === "ar" ? "الجمهورية الجزائرية الديمقراطية الشعبية | تفويض: رئيس مصلحة 📋" : "République Algérienne | Chef de service") 
                  : (lang === "ar" ? "الجمهورية الجزائرية الديمقراطية الشعبية | رئيس مصلحة (مسجل) 🇩🇿" : "République Algérienne | Membre Enregistré")}
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight drop-shadow-sm">
                {currentUser?.fullName || (lang === "ar" ? "مرحباً بك في بلغني" : "Bienvenue à Balaghni")}
              </h2>
            </div>
            
            {/* Prestigious Algerian Flag Circular Badge inside banner */}
            <div className="hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/80 shadow-md bg-white">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-[#006633] h-full"></div>
                  <div className="w-1/2 bg-white h-full"></div>
                </div>
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                  <path d="M 68.75 33.465 A 25 25 0 1 0 68.75 66.535 A 20 20 0 0 0 68.75 33.465" fill="#d21034" />
                  <polygon points="62.5,42.5 66.9,56.1 55.4,47.7 69.6,47.7 58.1,56.1" fill="#d21034" />
                </svg>
              </div>
              <div className="text-right text-white text-[11px] font-bold leading-tight">
                <span className="block text-emerald-350">{lang === "ar" ? "البوابة الوطنية للمراقبة" : "Portail National"}</span>
                <span className="block text-[9px] text-slate-350">السيادة والنزاهة الرقمية 🇩🇿</span>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-3 scale-flex text-3xl font-extrabold text-slate-850 tracking-tight mb-2 flex items-center justify-center sm:justify-start gap-3">
          <span className="bg-gradient-to-b from-[#006633] to-[#d21034] w-3 h-8 rounded-full hidden sm:block"></span>
          {t.home}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base font-medium">
          {t.dashboardDesc}
        </p>
      </motion.div>

      {/* Date & Time Bento Block */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-805 p-6 mb-8 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-450 uppercase font-black tracking-wider">{t.todayDate}</div>
              <div className="text-slate-700 dark:text-slate-200 font-bold">{date || "..."}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-slate-450 uppercase font-black tracking-wider">{t.currentTime}</div>
              <div className="text-slate-700 dark:text-slate-200 font-extrabold font-mono text-lg">{time || "الأوقات..."}</div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE ALGERIAN COVERAGE WIDGET */}
        <div className="flex items-center gap-3.5 bg-emerald-50/40 dark:bg-slate-900/60 px-5 py-3 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/20">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-500/30 shadow-xs shrink-0 bg-white">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-[#006633] h-full"></div>
              <div className="w-1/2 bg-white h-full"></div>
            </div>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <path d="M 68.75 33.465 A 25 25 0 1 0 68.75 66.535 A 20 20 0 0 0 68.75 33.465" fill="#d21034" />
              <polygon points="62.5,42.5 66.9,56.1 55.4,47.7 69.6,47.7 58.1,56.1" fill="#d21034" />
            </svg>
          </div>
          <div>
            <div className="text-[9px] text-emerald-800 dark:text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
              🇩🇿 {lang === "ar" ? "التقسيم الإداري للجمهورية الجزائرية" : "Division Administrative Algérienne"}
            </div>
            <div className="text-slate-700 dark:text-slate-200 font-bold text-xs mt-0.5">
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">58</span> {lang === "ar" ? "ولايـــــة" : "Wilayas"} 
              <span className="mx-2 text-slate-300 dark:text-slate-700">|</span> 
              <span className="text-[#d21034] font-black text-sm">1541</span> {lang === "ar" ? "بلديــــة جزائرية رسمية" : "Communes"}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl text-center border border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] text-slate-400 font-bold">{t.notesCount}</span>
            <span className="text-lg font-black text-emerald-600 font-mono">{notesCount}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl text-center border border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] text-slate-400 font-bold">{t.reportsCount}</span>
            <span className="text-lg font-black text-rose-600 font-mono">{reportsCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Role Switcher Toggle (Extremely convenient for testing/evaluating both Citizen & Official views!) */}
      <div className="mb-6 flex justify-end">
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-3xs">
          <button
            onClick={() => {
              setRole("citizen");
              setIsAuthorized(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              role === "citizen"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            👨‍🚀 {lang === "ar" ? "واجهة المواطن" : "Espace Citoyen"}
          </button>
          <button
            onClick={() => {
              setRole("official");
              setIsAuthorized(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              role === "official"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            💼 {lang === "ar" ? "واجهة رؤساء المصالح" : "Espace Chef de Service"}
          </button>
        </div>
      </div>

      {false ? (
        <motion.div
          variants={itemVariants}
          className="space-y-6 mt-6 animate-fadeIn"
          id="officialDashboardMain"
        >
          {/* Official Prestigious Header Tab Section */}
          <div className="bg-white dark:bg-[#111827] border border-slate-150/80 dark:border-slate-800/80 p-4 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black uppercase text-[#d21034] mb-3 tracking-wide flex items-center gap-1.5 justify-center">
              🇩🇿 لوحة تسيير وإشراف المصالح البلدية لبلدية الجزائر الوسطى
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <button
                onClick={() => setOfficialTab("submitted_reports")}
                className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  officialTab === "submitted_reports"
                    ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>البلاغات المقدمة</span>
              </button>

              <button
                onClick={() => setOfficialTab("questions")}
                className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  officialTab === "questions"
                    ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>قسم الأسئلة</span>
              </button>

              <button
                onClick={() => setOfficialTab("incoming_audits")}
                className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  officialTab === "incoming_audits"
                    ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>التقارير والواردة</span>
              </button>

              <button
                onClick={() => setOfficialTab("requests")}
                className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  officialTab === "requests"
                    ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>قسم الطلبات</span>
              </button>

              <button
                onClick={() => setOfficialTab("reservations")}
                className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  officialTab === "reservations"
                    ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>طلبات الحجز</span>
              </button>

              <button
                onClick={() => setOfficialTab("reporting_centers")}
                className={`px-2 py-3 rounded-2xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                  officialTab === "reporting_centers"
                    ? "bg-[#006633] text-white border-[#006633] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>مراكز التبليغ</span>
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="bg-white dark:bg-[#111827] border border-slate-150/80 dark:border-slate-800/85 p-6 rounded-3xl shadow-xs">
            {officialTab === "submitted_reports" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-905 dark:text-slate-100 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#006633]" />
                    قسم البلاغات المقدمة من مواطني البلدية
                  </h3>
                  <span className="text-xs bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 px-3 py-1 rounded-full font-black animate-pulse">
                    {reports.length} بلاغات نشطة
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">لا توجد بلاغات مرفوعة حالياً.</div>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs hover:border-emerald-500/30 transition-colors text-right"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/50">
                          <span className="font-extrabold text-[11px] text-[#006633] dark:text-emerald-450 flex items-center gap-1.5">
                            📌 التذكرة #{report.id.substring(0, 5)}: 
                            <span className={`mr-2 px-2 py-0.5 rounded text-[10px] font-black ${
                              report.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                              report.status === "progress" ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}>
                              {report.status === "pending" ? "معلق" : report.status === "progress" ? "قيد المعالجة" : "تم الحل والحمد لله"}
                            </span>
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (setReports) {
                                  const updated = reports.map(r => r.id === report.id ? { ...r, status: "pending" as const } : r);
                                  setReports(updated);
                                  localStorage.setItem("workspace_reports", JSON.stringify(updated));
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-extrabold cursor-pointer transition-all ${report.status === "pending" ? "bg-amber-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-700"}`}
                            >
                              معلق
                            </button>
                            <button
                              onClick={() => {
                                if (setReports) {
                                  const updated = reports.map(r => r.id === report.id ? { ...r, status: "progress" as const } : r);
                                  setReports(updated);
                                  localStorage.setItem("workspace_reports", JSON.stringify(updated));
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-extrabold cursor-pointer transition-all ${report.status === "progress" ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-700"}`}
                            >
                              قيد المعالجة
                            </button>
                            <button
                              onClick={() => {
                                if (setReports) {
                                  const updated = reports.map(r => r.id === report.id ? { ...r, status: "resolved" as const } : r);
                                  setReports(updated);
                                  localStorage.setItem("workspace_reports", JSON.stringify(updated));
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-extrabold cursor-pointer transition-all ${report.status === "resolved" ? "bg-[#006633] text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-700"}`}
                            >
                              حل المشكلة
                            </button>
                          </div>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">{report.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-350 mb-2 leading-relaxed">{report.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          <span>📁 مصلحة: {report.department}</span>
                          <span>📅 تاريخ الرفع: {report.createdAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {officialTab === "questions" && (
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#006633]" />
                    قسم الأسئلة واستفسارات الساكنة المباشرة
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {officialQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-[11px] text-[#006633] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                          👤 السائل: {q.sender}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{q.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-extrabold leading-relaxed mb-3">
                        « {q.text} »
                      </p>
                      {q.answered ? (
                        <div className="bg-emerald-50 dark:bg-[#064e3b]/30 border border-emerald-100/50 dark:border-[#064e3b]/50 p-4 rounded-xl text-xs text-emerald-850 dark:text-emerald-350">
                          <span className="block font-black mb-1">✍️ جواب المصلحة المعتمد:</span>
                          <span>{q.answerText}</span>
                        </div>
                      ) : (
                        <div className="mt-3">
                          {answeringQuestionId === q.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={officialAnswerText}
                                onChange={(e) => setOfficialAnswerText(e.target.value)}
                                placeholder="أكتب الجواب المحكم الخاص بكم للرد الفوري والمؤرشف..."
                                className="w-full text-xs p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none font-semibold text-slate-850 dark:text-slate-100"
                                rows={2}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setAnsweringQuestionId(null)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-black rounded-lg cursor-pointer"
                                >
                                  إلغاء
                                </button>
                                <button
                                  onClick={() => {
                                    if (!officialAnswerText.trim()) return;
                                    setOfficialQuestions(prev =>
                                      prev.map(item => item.id === q.id ? { ...item, answered: true, answerText: officialAnswerText } : item)
                                    );
                                    setAnsweringQuestionId(null);
                                    setOfficialAnswerText("");
                                  }}
                                  className="px-3 py-1.5 bg-[#006633] hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg cursor-pointer"
                                >
                                  إرسال الجواب الرسمي
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAnsweringQuestionId(q.id);
                                setOfficialAnswerText("");
                              }}
                              className="bg-[#006633] hover:bg-emerald-700 text-white text-[10.5px] font-black px-3.5 py-2 rounded-lg transition-transform active:scale-95 cursor-pointer"
                            >
                              صياغة وإرسال جواب المسؤول ⚡
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {officialTab === "incoming_audits" && (
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#006633]" />
                    قسم التقارير والواردة والتحاليل الفورية للمصالح
                  </h3>
                </div>
                
                {/* Visual Chart distribution */}
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl h-64">
                  <p className="text-xs font-black mb-3 text-slate-700 dark:text-slate-300">توزيع البلاغات ونسب الجاهزية والحل:</p>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={[
                      { name: 'معلق', قيمة: reports.filter(r => r.status === 'pending').length },
                      { name: 'قيد المعالجة', قيمة: reports.filter(r => r.status === 'progress').length },
                      { name: 'تم الحل', قيمة: reports.filter(r => r.status === 'resolved').length },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                      <Tooltip />
                      <Bar dataKey="قيمة" fill="#006633">
                        <Cell fill="#f59e0b" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#006633]/5 dark:bg-[#006633]/15 border border-[#006633]/20 dark:border-emerald-900/25 p-4.5 rounded-2xl space-y-2 mt-4 text-xs text-slate-800 dark:text-slate-200">
                  <h4 className="font-extrabold text-sm text-[#006633] mb-1">📋 تقرير النزاهة والجاهزية البلدي الدائم</h4>
                  <p>• إجمالي البلاغات المقدمة من المنخرطين: <strong className="font-mono text-sm">{reports.length} بلاغاً</strong></p>
                  <p>• التراخيص التلقائية المدعومة بـ AI: <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-black text-[10px]">نشطة 🟢</span></p>
                  <p>• حالة الجاهزية الرقمية للمديرات الفرعية: <span className="text-[#006633] font-bold">مستقرة %98.5</span></p>
                </div>
              </div>
            )}

            {officialTab === "requests" && (
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#006633]" />
                    قسم الطلبات الإدارية والرخص المطروحة للدراسة
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {officialRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-3xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-[11px] text-slate-705 dark:text-slate-200">
                          👤 طالب الرخصة: {req.applicant}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          req.status === "تمت الموافقة" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" :
                          req.status === "مرفوض" ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 animate-pulse"
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{req.type}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">📅 تاريخ تقديم الطلب: {req.date}</p>
                      
                      {req.status === "معلق" && (
                        <div className="flex gap-2.5 mt-3 justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
                          <button
                            onClick={() => {
                              setOfficialRequests(prev =>
                                prev.map(item => item.id === req.id ? { ...item, status: "مرفوض" } : item)
                              );
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-800 hover:bg-red-100 text-[10.5px] font-black rounded-lg cursor-pointer"
                          >
                            رفض المعاملة ❌
                          </button>
                          <button
                            onClick={() => {
                              setOfficialRequests(prev =>
                                prev.map(item => item.id === req.id ? { ...item, status: "تمت الموافقة" } : item)
                              );
                            }}
                            className="px-3 py-1.5 bg-[#006633] text-white hover:bg-emerald-700 text-[10.5px] font-black rounded-lg cursor-pointer"
                          >
                            موافقة واعتماد رخص الوزارة البلدي ✅
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {officialTab === "reservations" && (
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#006633]" />
                    قسم طلبات حجز القاعات التابعة للمجلس الشعبي البلدي
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {officialReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-205">
                          👤 الهيئة الحاجزة: {res.applicant}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          res.status === "تم تأكيده" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" :
                          res.status === "ملغى" ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 animate-pulse"
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">{res.facility}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">⏱️ التوقيت والموعد المخصص: {res.date} بـ {res.time}</p>
                      
                      {res.status === "معلق" && (
                        <div className="flex gap-2.5 mt-3 justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
                          <button
                            onClick={() => {
                              setOfficialReservations(prev =>
                                prev.map(item => item.id === res.id ? { ...item, status: "ملغى" } : item)
                              );
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-800 hover:bg-red-100 text-[10.5px] font-black rounded-lg cursor-pointer"
                          >
                            رفض الحجز ❌
                          </button>
                          <button
                            onClick={() => {
                              setOfficialReservations(prev =>
                                prev.map(item => item.id === res.id ? { ...item, status: "تم تأكيده" } : item)
                              );
                            }}
                            className="px-3 py-1.5 bg-[#006633] text-white hover:bg-emerald-700 text-[10.5px] font-black rounded-lg cursor-pointer"
                          >
                            تأكيــــيد الحجز المقر البلدي ✅
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {officialTab === "reporting_centers" && (
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#006633]" />
                    قسم مراكز التبليغ والاستعلام الميداني المستمر
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {reportingCenters.map((center) => (
                    <div
                      key={center.id}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500/35 transition-colors"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">{center.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">📋 وضعية طواقم المتابعة: {center.staff} | 📟 {center.radio}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-[10px] font-black text-[#006633] bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-md">
                          {center.status}
                        </span>
                        <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-200">
                          📞 {center.contact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}

        {/* Dynamic Emergency Direct Calling & Tactical Precision GPS Dispatch Center */}
        <motion.div
        variants={itemVariants}
        className="bg-red-50/50 dark:bg-slate-900/45 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 mb-8 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
          <div className="max-w-lg flex-1 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 mb-3 animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                {t.emergencyCallTitle}
              </span>
              <h2 className="text-xl font-bold text-red-950 dark:text-slate-50 tracking-tight mb-2">
                {t.emergencyCallSub}
              </h2>
              <p className="text-xs text-red-700/85 dark:text-slate-400 leading-relaxed mb-4">
                {t.emergencyDesc}
              </p>
            </div>

            {/* Direct Calling Buttons */}
            <div className="flex flex-wrap gap-2.5 mt-2">
              <button
                onClick={() => triggerHighPrecisionGps("fire")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer focus:ring-2 focus:ring-red-400"
              >
                <Flame className="w-4 h-4" />
                <span>{t.fireDept}</span>
              </button>

              <button
                onClick={() => triggerHighPrecisionGps("hospital")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer focus:ring-2 focus:ring-blue-400"
              >
                <HeartPulse className="w-4 h-4" />
                <span>{t.ambulance}</span>
              </button>
            </div>
          </div>

          {/* Quick status map accuracy tracker */}
          <div className="w-full lg:w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 p-4.5 shadow-3xs text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-rose-500" />
                  {lang === "ar" ? "تفاصيل تحديد الموقع التكتيكي" : lang === "fr" ? "Détails Géographiques Localisés" : "ⵜⵓⵙⵏⴰ GPS ⵏ ⵓⵡⵡⵓⵔ"}
                </span>
                <button
                  onClick={handleFindMe}
                  disabled={isLocating}
                  className="p-1 px-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 rounded font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? "animate-spin" : ""}`} />
                  <span>{lang === "ar" ? "تحديث" : lang === "fr" ? "Rafraîchir" : "ⵙⴷⴷⵉⴷ"}</span>
                </button>
              </div>

              <div className="space-y-2 font-medium">
                <div className="flex flex-col gap-1 text-[11px]">
                  <span className="text-slate-400 font-normal">{lang === "ar" ? "حالة الدقة الحالية:" : lang === "fr" ? "État de géolocalisation:" : "ⵜⵓⵙⵏⴰ ⵏ ⵓⵡⵡⵓⵔ:"}</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold break-all leading-tight bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-150/40 dark:border-slate-800">{dashboardLoc || (lang === "ar" ? "بانتظار رصد الإحداثيات..." : lang === "fr" ? "En attente des coordonnées..." : "ⵇⵇⵍ ⵜⵓⵙⵏⴰ...")}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
              <div>
                <span className="block text-slate-400 font-semibold">{lang === "ar" ? "Latitude / خط العرض" : "Latitude"}</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{preciseGps.latitude ? `${preciseGps.latitude}°` : "N/A"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold">{lang === "ar" ? "Longitude / خط الطول" : "Longitude"}</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{preciseGps.longitude ? `${preciseGps.longitude}°` : "N/A"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold">{lang === "ar" ? "دقة التحديد" : "Précision GPS"}</span>
                <span className="font-bold font-mono text-emerald-600">{preciseGps.accuracy ? `±${preciseGps.accuracy}m` : "N/A"}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold">{lang === "ar" ? "نشط الأقمار" : "Satellites"}</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{preciseGps.activeSatellites ? `📡 ${preciseGps.activeSatellites} SATS` : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ALGERIAN WILAYAS & COMMUNES EXPLORER WIDGET */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-100 dark:border-slate-805 p-6 mb-8 shadow-xs"
        id="algerian-admin-explorer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-emerald-650 text-white bg-emerald-600 px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono shadow-xs">58</span>
              <h2 className="text-xl font-black text-slate-850 dark:text-slate-50 tracking-tight">
                {lang === "ar" ? "الدليل الوطني الجغرافي للبلديات والولايات الجزائريّة" : "Répertoire National des Wilayas et Communes de l'Algérie"}
              </h2>
            </div>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1.5 font-medium">
              {lang === "ar" 
                ? "تصفح التقسيم الإداري الرسمي (58 ولاية و 1541 بلدية). اضغط على أي بلدية لنسخها أو اعتمادها تلقائياً لموقع بلاغك الحالي." 
                : "Explorez la division administrative officielle. Sélectionnez une commune pour l'insérer comme lieu de signalement."}
            </p>
          </div>

          {/* Quick Stats Summary Badge */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 px-3.5 py-2 rounded-2xl shrink-0">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{lang === "ar" ? "الولاية النشطة" : "Wilaya Active"}</span>
              <span className="block text-xs font-black text-slate-800 dark:text-slate-200">
                {algerianWilayas.find(w => w.code === selectedWilayaCode)?.nameAr || "الجزائر"}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Region Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-8 relative">
            <input
              type="text"
              value={algeriaSearchQuery}
              onChange={(e) => setAlgeriaSearchQuery(e.target.value)}
              placeholder={lang === "ar" ? "🔍 ابحث باسم البلدية أو اسم الولاية (مثال: وهران، براقي، باب الزوار، غليزان)..." : "🔍 Rechercher une commune ou wilaya..."}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-850 dark:text-slate-200 transition-all font-semibold"
            />
            {algeriaSearchQuery && (
              <button 
                onClick={() => setAlgeriaSearchQuery("")}
                className="absolute inset-y-0 left-3 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="lg:col-span-4 flex items-center justify-end">
            <span className="text-[10px] text-slate-400 font-bold bg-emerald-50/50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-lg border border-emerald-100/30">
              {lang === "ar" ? "تغذية ومطابقة معطيات البوابة تلقائياً" : "Élaboration de géographie administrative"}
            </span>
          </div>
        </div>

        {/* Global Copied Success Float Notification */}
        <AnimatePresence>
          {copiedLocationNotifier && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-600 text-white border border-emerald-500 rounded-2xl p-3.5 mb-5 text-xs font-bold shadow-md flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                <span>
                  {lang === "ar" 
                    ? `✅ تم اعتماد الموقع بنجاح: [ ${copiedLocationNotifier} ] وتم تعيينه في نموذج البلاغات تفادياً للأخطاء الإدارية!`
                    : `✅ Lieu assigné avec succès : [ ${copiedLocationNotifier} ]`}
                </span>
              </div>
              <button 
                onClick={() => setCopiedLocationNotifier(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SPLIT LAYOUT: Wilayas Grid + Selected Wilaya's Communes list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Wilayas Directory Cards Grid (5 col) */}
          <div className="lg:col-span-5 border-l border-slate-100 dark:border-slate-800/80 pl-0 lg:pl-6 max-h-[360px] overflow-y-auto pr-2 space-y-2 scrolls-smooth">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mb-2 flex items-center justify-between sticky top-0 bg-white dark:bg-[#111827] py-1 z-10">
              <span>{lang === "ar" ? "قائمة الولايات (58 ولِاية رسمية) :" : "Wilayas d'Algérie :"}</span>
              <span className="text-emerald-600 font-black">{lang === "ar" ? "انقر للاختيار وعرض بلدياتها" : "Cliquez pour voir"}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {algerianWilayas
                .filter(w => {
                  if (!algeriaSearchQuery) return true;
                  const query = algeriaSearchQuery.toLowerCase().trim();
                  return (
                    w.nameAr.includes(query) ||
                    w.nameFr.toLowerCase().includes(query) ||
                    w.code.includes(query) ||
                    w.communes.some(c => c.toLowerCase().includes(query))
                  );
                })
                .map((w) => {
                  const isSelected = selectedWilayaCode === w.code;
                  return (
                    <button
                      key={w.code}
                      onClick={() => setSelectedWilayaCode(w.code)}
                      className={`w-full text-right p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 shadow-3xs"
                          : "border-slate-150/50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black ${
                          isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}>
                          {w.code}
                        </span>
                        <div>
                          <span className="block text-xs font-black">{w.nameAr}</span>
                          <span className="block text-[9px] text-slate-400 capitalize">{w.nameFr}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold shrink-0">
                        {w.communes.length} {lang === "ar" ? "بلدية" : "Communes"}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 2. Selected Wilaya's Communes (7 col) */}
          <div className="lg:col-span-7 flex flex-col justify-between max-h-[360px] overflow-y-auto pr-1">
            <div className="flex-1 flex flex-col">
              {/* Wilaya detailed headers */}
              {(() => {
                const currentW = algerianWilayas.find(w => w.code === selectedWilayaCode);
                if (!currentW) return null;

                // Filter communes based on general search
                const filteredCommunes = currentW.communes.filter(c => {
                  if (!algeriaSearchQuery) return true;
                  const query = algeriaSearchQuery.toLowerCase().trim();
                  return c.includes(query) || currentW.nameAr.includes(query) || currentW.nameFr.toLowerCase().includes(query);
                });

                return (
                  <>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === "ar" ? "قائمة البلديات التابعة لـ :" : "Communes rattachées à :"}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                            ولاية {currentW.nameAr} ({currentW.code})
                          </span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold">
                            {currentW.region}
                          </span>
                        </div>
                      </div>

                      <div className="text-left text-[11px] text-slate-400 font-bold">
                        {filteredCommunes.length} {lang === "ar" ? "مطابقة للبحث" : "trouvées"}
                      </div>
                    </div>

                    {filteredCommunes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Info className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-xs font-semibold">{lang === "ar" ? "لا توجد بلديات تطابق هذا الاسم في هذه الولاية." : "Aucune commune trouvée"}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1">
                        {filteredCommunes.map((commune, index) => {
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                const selectedLocation = `${commune}، ولاية ${currentW.nameAr} (${currentW.code})`;
                                setCorruptionLocation(selectedLocation);
                                setCopiedLocationNotifier(selectedLocation);
                                // Scroll gracefully to the report container if they are on mobile
                                const element = document.getElementById("corruption-report-form");
                                if (element) {
                                  element.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="group text-right p-3 rounded-xl border border-slate-150 dark:border-slate-800/60 bg-white hover:bg-emerald-50/20 dark:bg-[#111827] dark:hover:bg-slate-900 overflow-hidden relative cursor-pointer hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-bold text-slate-850 dark:text-slate-205 text-[11.5px] line-clamp-2">
                                  {commune}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/45 px-1.5 py-0.5 rounded mr-1">
                                  {lang === "ar" ? "تعديل ⚡" : "Fixé ⚡"}
                                </span>
                              </div>
                              <span className="block text-[9px] text-slate-400 mt-1 font-mono">
                                {currentW.code}-{index + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* General Guidance footnote */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-450 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                {lang === "ar" 
                  ? "تغطية كامل التراب الوطني الجزائري من الشرق والغرب والوسط والجنوب الكبير." 
                  : "Chaque commune correspond à un centre de raccordement de la plateforme éthique."}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded leading-tight">
                {lang === "ar" ? "أجهزة البلديات متصلة بمركز النزاهة والتحقق للوزارة" : "Communes connectées"}
              </span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Chat Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, shadow: "md" }}
          onClick={() => onNavigate("chat")}
          className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-amber-50/40 to-amber-100/10 dark:from-slate-900/40 dark:to-amber-950/10 border border-amber-100/60 dark:border-amber-900/30 p-6 rounded-2xl transition-all hover:bg-amber-100/20 hover:border-amber-200"
          id="cardChat"
        >
          <div className="absolute top-0 left-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-br-xl flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-amber-500" /> GEMINI AI
          </div>

          <div className="p-4 bg-amber-600 text-white rounded-2xl w-fit mb-6 mt-2 group-hover:scale-110 transition-transform shadow-xs">
            <MessageSquare className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-amber-950 dark:text-amber-200 mb-2">{t.chatTitle}</h3>
          <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-4">
            {t.chatDesc}
          </p>

          <div className="text-amber-800 dark:text-amber-400 font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all mt-auto duration-200">
            <span>{t.startChat}</span>
            <ArrowLeft className={`w-4 h-4 ml-1 ${lang !== "ar" ? "rotate-180" : ""}`} />
          </div>
        </motion.div>

        {/* Notes Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, shadow: "md" }}
          onClick={() => onNavigate("notes")}
          className="cursor-pointer group bg-gradient-to-br from-emerald-50/50 to-emerald-100/20 dark:from-slate-900/30 dark:to-emerald-950/20 border border-emerald-100/70 dark:border-emerald-900/30 p-6 rounded-2xl transition-all hover:bg-emerald-100/30 hover:border-emerald-200"
          id="cardNotes"
        >
          <div className="p-4 bg-emerald-500 text-white rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-xs">
            <Notebook className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-200 mb-2">{t.notesTitle}</h3>
          <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-4">
            {t.notesDesc}
          </p>

          <div className="text-emerald-800 dark:text-emerald-400 font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all mt-auto duration-200">
            <span>{t.openNotes}</span>
            <ArrowLeft className={`w-4 h-4 ml-1 ${lang !== "ar" ? "rotate-180" : ""}`} />
          </div>
        </motion.div>

        {/* Reports Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, shadow: "md" }}
          onClick={() => onNavigate("reports")}
          className="cursor-pointer group bg-gradient-to-br from-rose-50/50 to-rose-100/20 dark:from-slate-900/30 dark:to-rose-950/20 border border-rose-100/70 dark:border-rose-900/30 p-6 rounded-2xl transition-all hover:bg-rose-100/30 hover:border-rose-200"
          id="cardReport"
        >
          <div className="p-4 bg-rose-500 text-white rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-xs">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-rose-950 dark:text-rose-200 mb-2">{t.reportsTitle}</h3>
          <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-4">
            {t.reportsDesc}
          </p>

          <div className="text-rose-800 dark:text-rose-400 font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all mt-auto duration-200">
            <span>{t.openReports}</span>
            <ArrowLeft className={`w-4 h-4 ml-1 ${lang !== "ar" ? "rotate-180" : ""}`} />
          </div>
        </motion.div>
      </div>

      {/* 👑 NEW: MEMBER-ONLY SMART TOOLS SECTION */}
      <motion.div
        variants={itemVariants}
        className="mb-8"
        id="advancedMemberTools"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              أدوات الشفافية والخدمات الإدارية للأعضاء
            </h2>
            <p className="text-xs text-slate-400">تواصل مباشر مع النزاهة وصيغ شتى وثائقك فورياً بواسطة الذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Anti-Corruption Reporting */}
          <div
            onClick={() => {
              setIsCorruptionModalOpen(true);
              setCorruptionResultMsg(null);
              setCorruptionAIAdvice("");
            }}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-amber-100/10 dark:from-slate-900/40 dark:to-amber-950/15 border border-amber-200/60 dark:border-amber-900/30 p-5 rounded-2xl shadow-3xs hover:shadow-xs transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-black tracking-wide px-3 py-1 rounded-br-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> نزاهة وأمان
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 w-fit text-amber-600 rounded-xl mb-4 mt-2">
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-amber-950 dark:text-amber-200 mb-1.5">التبليغ عن الفساد الإداري والمالي 🔒</h3>
            <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-3.5">
              رصد سري ومؤمن بنظام تشفير وحماية متقدم للمبلغين، مدعوم بتحليل من Gemini AI لتوفير الإرشاد القانوني والوقائي فورياً.
            </p>
            <span className="text-amber-850 dark:text-amber-400 text-xs font-black hover:underline">أرسل إبلاغاً سرياً للنزاهة الشاملة ←</span>
          </div>

          {/* Card 2: Administrative Document Writer */}
          <div
            onClick={() => {
              setIsDocWriterModalOpen(true);
              setGeneratedDocContent("");
              setDocError("");
              setDocSavedStatus(false);
            }}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-violet-100/10 dark:from-slate-900/40 dark:to-violet-950/15 border border-violet-200/60 dark:border-violet-900/30 p-5 rounded-2xl shadow-3xs hover:shadow-xs transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 bg-violet-500/10 text-violet-750 dark:text-violet-300 text-[10px] font-black tracking-wide px-3 py-1 rounded-br-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-600" /> صياغة ديوانية بالـ AI
            </div>

            <div className="p-3 bg-violet-100 dark:bg-violet-950/50 w-fit text-violet-700 rounded-xl mb-4 mt-2">
              <FileText className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-violet-950 dark:text-violet-200 mb-1.5">كتابة وصياغة الوثائق والخطابات إدارياً ✍️</h3>
            <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-3.5">
              جهّز وصمم طلبات رسمية، خطابات تظلم، ومحاضر اجتماعات بصيغة ديوانية عالية البلاغة، مع ثوانٍ معدودة وحفظها بمذكراتك مباشرة.
            </p>
            <span className="text-violet-850 dark:text-violet-400 text-xs font-black hover:underline">ابدأ صياغة المستندات الورقية والديوانية ←</span>
          </div>

          {/* Card 3: Interactive Call Center & Hotline */}
          <div
            onClick={() => {
              setIsEmergencyCallOpen(true);
              setDialedNumber("");
              setCallState("idle");
              setCallResponseText(lang === "ar" ? "اضغط على أي رقم أو جهة اتصال سريعة لبدء المكالمة..." : "Prêt à appeler...");
            }}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-rose-50/50 to-rose-100/10 dark:from-slate-900/40 dark:to-rose-950/15 border border-rose-200/60 dark:border-rose-900/30 p-5 rounded-2xl shadow-3xs hover:shadow-xs transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 bg-rose-500/10 text-rose-750 dark:text-rose-300 text-[10px] font-black tracking-wide px-3 py-1 rounded-br-md flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> اتصال هاتفي رقمي 📞
            </div>

            <div className="p-3 bg-rose-100 dark:bg-rose-950/50 w-fit text-rose-700 rounded-xl mb-4 mt-2">
              <Phone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-rose-950 dark:text-rose-205 mb-1.5">مركز الاتصال الصوتي والخطوط الساخنة 📞</h3>
            <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-3.5">
              أجرِ اتصالات رقمية ثنائية ومؤمنة بالدفاع المدني، طوارئ الصحة، الهيئة الوطنية لنزاهة، أو مستشار الـ AI الصوتي المباشر.
            </p>
            <span className="text-rose-850 dark:text-rose-400 text-xs font-black hover:underline">افتح لوحة الاتصال السريع والخدمة الصوتية ←</span>
          </div>
        </div>
      </motion.div>

      {/* Visual Statistics Section (Dashboard Chart) */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xs mb-8"
        id="visualStatsSection"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <BarChart2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-150 tracking-tight">
                {lang === "ar" ? "لوحة التحليل البصري لحالة البلاغات" : lang === "fr" ? "Analyse Visuelle et Statistique" : "📊 ⵜⵉⵙⴱⴷⴰⴷⵉⵏ ⵏ ⵉⴱⴰⵍⴰⵖⵏ"}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-400 font-medium mt-1">
                {lang === "ar" ? "مؤشرات تفاعلية حية لحالة البلاغات (المعلقة، قيد المعالجة، والمنتهية)" : lang === "fr" ? "Indicateurs en temps réel (En attente, En cours et Résolus)" : "ⵜⵉⵙⴱⴷⴰⴷⵉⵏ ⵜⵉⵔⵎⴰⵏⵉⵏ ⵏ ⵉⴱⴰⵍⴰⵖⵏ"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150/50 dark:border-slate-800 w-fit self-start sm:self-auto font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] text-slate-600 dark:text-slate-350">
              {lang === "ar" ? "بيانات حية ومحدثة" : lang === "fr" ? "Données temps réel" : "ⵜⵉⴳⴳⵉⵢⵉⵏ ⵜⵉⵔⵎⴰⵏⵉⵏ"}
            </span>
          </div>
        </div>

        {/* Big Numbers Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="block text-2xs text-slate-400 font-bold uppercase tracking-wider">{lang === "ar" ? "إجمالي البلاغات" : lang === "fr" ? "Total signalements" : "ⵇⵇⴰⵃ ⵏ ⵉⴱⴰⵍⴰⵖⵏ"}</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">{reports.length}</span>
          </div>
          <div className="bg-rose-50/40 dark:bg-rose-950/10 p-4 rounded-2xl border border-rose-100/40 dark:border-rose-950/30 text-center">
            <span className="block text-2xs text-rose-550 font-bold uppercase tracking-wider">{lang === "ar" ? "بلاغات معلقة" : lang === "fr" ? "En attente" : "ⵇⵇⵍ"}</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1 block">{reports.filter(r => r.status === "pending").length}</span>
          </div>
          <div className="bg-blue-50/40 dark:bg-blue-950/10 p-4 rounded-2xl border border-blue-100/40 dark:border-blue-950/30 text-center">
            <span className="block text-2xs text-blue-550 font-bold uppercase tracking-wider">{lang === "ar" ? "قيد المعالجة" : lang === "fr" ? "En cours" : "ⴳ ⵜⵡⵓⵔ"}</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">{reports.filter(r => r.status === "progress").length}</span>
          </div>
          <div className="bg-emerald-50/40 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/40 dark:border-emerald-950/30 text-center">
            <span className="block text-2xs text-emerald-550 font-bold uppercase tracking-wider">{lang === "ar" ? "بلاغات مكتملة" : lang === "fr" ? "Résolus" : "ⵉⴼⵔⴰ"}</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">{reports.filter(r => r.status === "resolved").length}</span>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Chart 1: Pie Chart (Percentage Breakdown) */}
          <div className="flex flex-col items-center bg-slate-50/30 dark:bg-slate-900/10 border border-slate-100/80 dark:border-slate-850 p-6 rounded-2xl min-h-[300px] justify-center text-center">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-1.5">
              <PieChartIcon className="w-4 h-4 text-purple-500" />
              {lang === "ar" ? "مخطط التوزيع الدائري (٪)" : lang === "fr" ? "Pourcentages de répartition" : "ⵜⵓⵣⵣⵓⴼⵜ ⵏ ⵉⴱⴰⵍⴰⵖⵏ"}
            </h4>
            
            <div className="w-full h-56 flex items-center justify-center">
              {reports.length === 0 ? (
                <p className="text-xs text-slate-450">{lang === "ar" ? "لا توجد بلاغات كافية لعرض المخطط" : "Pas assez de données"}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: lang === "ar" ? "معلقة" : lang === "fr" ? "En attente" : "ⵇⵇⵍ", value: reports.filter(r => r.status === "pending").length || 0, color: "#f43f5e" },
                        { name: lang === "ar" ? "قيد المعالجة" : lang === "fr" ? "En cours" : "ⴳ ⵜⵡⵓⵔ", value: reports.filter(r => r.status === "progress").length || 0, color: "#3b82f6" },
                        { name: lang === "ar" ? "مكتملة" : lang === "fr" ? "Résolus" : "ⵉⴼⵔⴰ", value: reports.filter(r => r.status === "resolved").length || 0, color: "#10b981" }
                      ].filter(d => d.value > 0)}
                      cx="51%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[
                        { name: "pending", color: "#f43f5e" },
                        { name: "progress", color: "#3b82f6" },
                        { name: "resolved", color: "#10b981" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "#1e293b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "11px" }}
                      formatter={(value) => [`${value} ${lang === "ar" ? "بلاغ" : "signalement"}`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Custom Legend */}
            <div className="flex flex-wrap gap-4 mt-2 justify-center text-xs">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-rose-500"></span>{lang === "ar" ? "معلقة" : "En attente"}</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-500"></span>{lang === "ar" ? "قيد المعالجة" : "En cours"}</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500"></span>{lang === "ar" ? "منتهية" : "Résolus"}</span>
            </div>
          </div>

          {/* Chart 2: Bar Chart (Absolute Quantities) */}
          <div className="flex flex-col items-center bg-slate-50/30 dark:bg-slate-900/10 border border-slate-100/80 dark:border-slate-850 p-6 rounded-2xl min-h-[300px] justify-center text-center">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              {lang === "ar" ? "مخطط التوزيع الكمي والكميات" : lang === "fr" ? "Nombre absolu de signalements" : "ⴰⵟⵟⴰⵙ ⵏ ⵉⴱⴰⵍⴰⵖⵏ"}
            </h4>

            <div className="w-full h-56 flex items-center justify-center">
              {reports.length === 0 ? (
                <p className="text-xs text-slate-450">{lang === "ar" ? "لا توجد بلاغات كافية لعرض المخطط" : "Pas assez de données"}</p>
              ) : (
                <ResponsiveContainer width="95%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: lang === "ar" ? "معلقة" : lang === "fr" ? "En attente" : "ⵇⵇⵍ",
                        count: reports.filter(r => r.status === "pending").length,
                        color: "#f43f5e"
                      },
                      {
                        name: lang === "ar" ? "قيد المعالجة" : lang === "fr" ? "En cours" : "ⴳ ⵜⵡⵓⵔ",
                        count: reports.filter(r => r.status === "progress").length,
                        color: "#3b82f6"
                      },
                      {
                        name: lang === "ar" ? "منتهية" : lang === "fr" ? "Résolus" : "ⵉⴼⵔا",
                        count: reports.filter(r => r.status === "resolved").length,
                        color: "#10b981"
                      }
                    ]}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ background: "#1e293b", color: "#fff", borderRadius: "12px", border: "none", fontSize: "11px" }}
                      formatter={(value) => [`${value} ${lang === "ar" ? "بلاغ" : "signalement"}`, lang === "ar" ? "العدد" : "Quantité"]}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {[
                        { color: "#f43f5e" },
                        { color: "#3b82f6" },
                        { color: "#10b981" }
                      ].map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium mt-2">
              {lang === "ar" ? "يعكس المخطط إحصائيات معبأة بناءً على إدخالات النماذج المباشرة." : "Représente les données instantanées du système."}
            </p>
          </div>
        </div>

        {/* Smart Advisor Alert Insight Box */}
        {reports.length > 0 && (
          <div className="mt-6 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-extrabold text-indigo-950 dark:text-slate-100">
                {lang === "ar" ? "التوصية التلقائية للنظام الذكي" : "Recommandation Automatique de l'IA"}
              </h5>
              <p className="text-[11px] text-indigo-900 dark:text-slate-300 leading-relaxed font-semibold">
                {reports.filter(r => r.status === "pending").length > 0 
                  ? (lang === "ar" 
                      ? `تم العثور على (${reports.filter(r => r.status === "pending").length}) من البلاغات المعلقة. نقترح توجيه فرق الدعم الفني فوراً لفحصها لتجنب تفاقم التعطيلات.` 
                      : `Il y a ${reports.filter(r => r.status === "pending").length} rapports en attente de traitement. Action immédiate conseillée.`)
                  : (lang === "ar" 
                      ? "جميع البلاغات مستقرة وتحت السيطرة! كفاءة إغلاق ومعالجة الحالات ممتازة جداً." 
                      : "Toutes les signalisations sont de statut stable et maîtrisées. Performance optimale.")
                }
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Dynamic Geolocation & Organization Hub */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs"
        id="geoDashboardHub"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Compass className={`w-5 h-5 text-indigo-600 ${isLocating ? "animate-spin" : ""}`} />
          مدير الموقع والخِدْمات الجغرافية الشاملة
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          قم بتنبيه مستشعرات تحديد المواقع لاستخراج إحداثيات موقعك وربطها بالبلاغات أو الملاحظات المصنفة (الصحية والتعليمية والإدارية).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Geolocation actions widget */}
          <div className="bg-slate-50 p-4 border border-slate-200/50 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1">📍 الإحداثيات النشطة حالياً</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div className="bg-white border border-slate-150/45 p-2.5 rounded-xl">
              <div className="text-xs font-bold text-slate-700 font-mono truncate">
                {dashboardLoc ? dashboardLoc : "احصل على موقعك المباشر بالأسفل"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">تنسيق النطاق الجغرافي النشط.</p>
            </div>

            <button
              onClick={handleFindMe}
              disabled={isLocating}
              className="mt-1 text-xs w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-350 fill-rose-500/30" />
              <span>{isLocating ? "جاري تحديد موقعك الفعلي..." : "تحديث واستدعاء إحداثيات موقعي"}</span>
            </button>
          </div>

          {/* Interactive Special Categories Portal Trigger Cards */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleCategorySelect("health")}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                activeCategory === "health"
                  ? "bg-teal-100/75 border-teal-500 ring-2 ring-teal-400 shadow-xs"
                  : "bg-teal-50/50 border-teal-100 hover:bg-teal-100/40"
              }`}
            >
              <div className="p-2 bg-teal-100 text-teal-700 rounded-xl mb-2 shadow-2xs">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-semibold text-teal-900">مصنف صحي</span>
              <span className="text-[10px] text-teal-600 font-medium mt-1">🩺 رعاية صحية</span>
            </button>

            <button
              onClick={() => handleCategorySelect("admin")}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                activeCategory === "admin"
                  ? "bg-amber-100/75 border-amber-500 ring-2 ring-amber-400 shadow-xs"
                  : "bg-amber-50/50 border-amber-100 hover:bg-amber-100/40"
              }`}
            >
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl mb-2 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-amber-900">مصنف إداري</span>
              <span className="text-[10px] text-amber-600 font-medium mt-1">🏢 شؤون إدارية</span>
            </button>

            <button
              onClick={() => handleCategorySelect("school")}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                activeCategory === "school"
                  ? "bg-purple-100/75 border-purple-500 ring-2 ring-purple-400 shadow-xs"
                  : "bg-purple-50/50 border-purple-100 hover:bg-purple-100/40"
              }`}
            >
              <div className="p-2 bg-purple-100 text-purple-650 rounded-xl mb-2 shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-purple-900">مصنف مدرسي</span>
              <span className="text-[10px] text-purple-600 font-medium mt-1">🎓 مدرسة قريبة</span>
            </button>
          </div>
        </div>

        {/* Dynamic Service Wizard & Portal Sections */}
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 border p-5 rounded-2xl transition-all ${
              activeCategory === "health"
                ? "bg-teal-50/30 border-teal-200"
                : activeCategory === "admin"
                ? "bg-amber-50/20 border-amber-200"
                : "bg-purple-50/25 border-purple-200"
            }`}
          >
            {/* Sector Header Block */}
            <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-200/60 mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${
                  activeCategory === "health" ? "bg-teal-100 text-teal-700" :
                  activeCategory === "admin" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {activeCategory === "health" ? <HeartPulse className="w-4 h-4" /> :
                   activeCategory === "admin" ? <FileText className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    بوابة الخدمة لـ {activeCategory === "health" ? "القطاع الصحي" : activeCategory === "admin" ? "القطاع الإداري" : "القطاع التعليمي"}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold">بوابة تفاعلية للمواطنين والمسؤولين المخولين.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveCategory(null);
                  setRole(null);
                  setAuthCode("");
                  setIsAuthorized(false);
                }}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق البوابة</span>
              </button>
            </div>

            {/* Role Selection Question */}
            {!role ? (
              <div className="text-center py-4 space-y-4">
                <p className="text-xs font-bold text-slate-600">أهلاً بك في بوابة الخدمة الجغرافية، يرجى تحديد نوع الحساب للمتابعة:</p>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => setRole("citizen")}
                    className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all font-bold text-xs text-slate-700 hover:text-blue-600 shadow-2xs hover:border-blue-400 cursor-pointer flex flex-col items-center gap-2"
                  >
                    <User className="w-6 h-6 text-blue-500" />
                    <span>أنا عـضـو مسـجـل (حرية النشر والتبليغ)</span>
                  </button>
                  <button
                    onClick={() => setRole("official")}
                    className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all font-bold text-xs text-slate-700 hover:text-emerald-600 shadow-2xs hover:border-emerald-400 cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Shield className="w-6 h-6 text-emerald-500" />
                    <span>أنا مـسـؤول (بوابة الرصد)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Active Role Meta Title & Back button */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    {role === "citizen" ? <User className="w-3.5 h-3.5 text-blue-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    {role === "citizen" ? "الدخول بصفتك: عضو مسجل (له حرية النشر والتبليغ 🔓)" : "الوصول بصفتك: مسؤول مخوّل"}
                  </span>
                  <button
                    onClick={() => {
                      setRole(null);
                      setIsAuthorized(false);
                      setAuthCode("");
                      setAuthError("");
                      setCitizenResult("");
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold transition-all flex items-center gap-0.5"
                  >
                    <ChevronLeft className="w-3 h-3 rotate-180" />
                    <span>تغيير نوع الهوية</span>
                  </button>
                </div>

                {/* ==========================================================
                    ROLE: CITIZEN VIEW (بوابة المواطن الخدمية والتفاعلية)
                   ========================================================== */}
                {role === "citizen" && (
                  <div className="space-y-4">
                    {activeCategory === "health" && (
                      <div className="bg-white p-4 border border-teal-150/40 rounded-xl space-y-3 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-teal-850">
                          <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                          <h5 className="text-xs font-black">الاستفسار عن توافر الأدوية واللقاحات الطبية</h5>
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-relaxed">
                          أدخل اسم الدواء أو اللقاح للتحقق من توافره في مخرجات مركز الرعاية الصحية بموقعك النشط:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="مثال: لقاح الإنفلونزا، دواء السكري، بنادول..."
                            value={citizenInput}
                            onChange={(e) => setCitizenInput(e.target.value)}
                            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!citizenInput.trim()) return;
                              setCitizenResult(`تم التحقق بنجاح! دواء (${citizenInput}) متوفر حالياً بمجمع الملك سلمان الطبي على بعد 1.25 كم من موقعك الحالي. تم حفظ الحجز المؤقت برقم تذكرة #GP-${Math.floor(Math.random()*(9000)+1000)} للمراجعة المباشرة.`);
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            تحقق من التوفر
                          </button>
                        </div>
                        {citizenResult && (
                          <div className="text-[11px] bg-teal-50 border border-teal-200/40 p-3 rounded-lg text-teal-900 leading-relaxed">
                            {citizenResult}
                          </div>
                        )}
                        <div className="text-[10px] bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-500 grid grid-cols-2 gap-2">
                          <span>🏥 الرقم الموحد للصحة: <strong>937</strong></span>
                          <span>🚑 الإسعاف والهلال الأحمر: <strong>997</strong></span>
                        </div>
                      </div>
                    )}

                    {activeCategory === "admin" && (
                      <div className="bg-white p-4 border border-amber-150/40 rounded-xl space-y-3 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-amber-850">
                          <ClipboardList className="w-4 h-4 text-amber-600" />
                          <h5 className="text-xs font-black">تتبع حالة المعاملات البلدية والبلديات الرقمية</h5>
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-relaxed">
                          أدخل رقم المعاملة الرسمية المسجلة لديك لتأكيد حالتها ومقر المراجعة الجغرافي:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="مثال: 940332، 81212..."
                            value={citizenInput}
                            onChange={(e) => setCitizenInput(e.target.value)}
                            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!citizenInput.trim()) return;
                              setCitizenResult(`رقم المعاملة (${citizenInput}) قيد التدقيق النهائي في فرع البلدية الرقمي لمدينتك. تم توجيه الكادر الميداني لفحص الموقع المرفق. يمكنك الاتصال على 940 للاستفسار السريع.`);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            استعلام ومع معالجة
                          </button>
                        </div>
                        {citizenResult && (
                          <div className="text-[11px] bg-amber-50 border border-amber-200/40 p-3 rounded-lg text-amber-900 leading-relaxed">
                            {citizenResult}
                          </div>
                        )}
                      </div>
                    )}

                    {activeCategory === "school" && (
                      <div className="bg-white p-4 border border-purple-150/40 rounded-xl space-y-3 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-purple-850">
                          <GraduationCap className="w-4 h-4 text-purple-600" />
                          <h5 className="text-xs font-black">حساب المسافة لأقرب مدرسة نموذجية حكومية</h5>
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-relaxed">
                          أدخل اسم الحي السكني لمعرفة أقرب مجمع مدارس بنين وبنات ومسافة النقل المتوقعة:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="مثال: حي الياسمين، حي النفل..."
                            value={citizenInput}
                            onChange={(e) => setCitizenInput(e.target.value)}
                            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!citizenInput.trim()) return;
                              const dist = (Math.random() * 2 + 0.5).toFixed(1);
                              setCitizenResult(`تم الرصد بنجاح! مدرسة الأندلس النموذجية تقع على بعد ${dist} كم من ${citizenInput}. يتوفر نقل مدرسي متاح وحافلات مجهزة بكامل التقنيات حالياً.`);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            احسب المسافة
                          </button>
                        </div>
                        {citizenResult && (
                          <div className="text-[11px] bg-purple-50 border border-purple-200/40 p-3 rounded-lg text-purple-900 leading-relaxed">
                            {citizenResult}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ==========================================================
                    ROLE: OFFICIAL AUTHENTICATION (تحقق رمز المسؤول أولاً)
                   ========================================================== */}
                {role === "official" && !isAuthorized && (
                  <div className="bg-white p-5 border border-slate-200 rounded-xl max-w-md mx-auto space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <h5 className="text-xs font-extrabold">منطقة تفعيل صلاحيات المسؤول</h5>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed">
                      أدخل رمز التحقق المخصص للمسؤول لتفعيل نظام المتابعة ومراقبة الأنشطة الحية لمؤسستك:
                    </p>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="أدخل رمز التحقق (أمثلة: MED123 أو ADM123 أو EDU123)"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg outline-none font-bold text-center tracking-wide"
                      />
                      {authError && (
                        <p className="text-[10px] text-red-600 font-bold bg-red-50 p-2 rounded border border-red-100 leading-relaxed">{authError}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAuth}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>تحقق ودخول لغرفة المراقبة</span>
                      </button>
                    </div>

                    <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-lg text-[10px] text-slate-400 space-y-1">
                      <strong className="block text-slate-500">ملاحظة الكود المخصص للتسهيل والتحقق:</strong>
                      <span>• رمز القطاع الصحي: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-bold">MED123</code></span>
                      <span className="block">• رمز القطاع الإداري: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-bold">ADM123</code></span>
                      <span>• رمز القطاع التعليمي: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-bold">EDU123</code></span>
                    </div>
                  </div>
                )}

                {/* ==========================================================
                    ROLE: AUTHORIZED OFFICIAL PORTALS (لوحات المراقبة الحارة)
                   ========================================================== */}
                {role === "official" && isAuthorized && (
                  <div>
                    {/* 🏥 HEALTHCARE OFFICIAL PORTAL (MED123) */}
                    {activeCategory === "health" && (
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-teal-800 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-teal-800/60">
                          <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-teal-400" />
                            <div>
                              <h5 className="text-xs font-black text-white">لوحة الرصد الصحي - مجمع الملك سلمان الطبي</h5>
                              <p className="text-[9px] text-teal-400 font-mono">AUTHORIZED OFFICIAL OVERWATCH ID: #MED-9304</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[9px] font-mono border border-green-500/30">نشط ومتصل</span>
                        </div>

                        {/* Beds and Alerts Live controls */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/65 text-center">
                            <span className="block text-[10px] text-slate-400">شاغر أسرة العناية الفائقة لليوم</span>
                            <span className="text-2xl font-black text-teal-400 font-mono">{healthBeds}</span>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <button
                                onClick={() => setHealthBeds(prev => Math.max(0, prev - 1))}
                                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-2 py-1 rounded text-xs"
                              >
                                -
                              </button>
                              <button
                                onClick={() => setHealthBeds(prev => prev + 1)}
                                className="bg-slate-700 hover:bg-teal-700 text-teal-200 font-bold px-2 py-1 rounded text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/65 text-center flex flex-col justify-between">
                            <span className="block text-[10px] text-slate-400">حالة الطوارئ القصوى ونظام الصفارة</span>
                            <span className={`text-xs font-bold ${isAlertActive ? "text-red-400 animate-pulse" : "text-green-400"}`}>
                              {isAlertActive ? "🔴 إعلان خطر أصفر مفعل" : "🟢 مستقر واعتيادي"}
                            </span>
                            <button
                              onClick={() => setIsAlertActive(!isAlertActive)}
                              className={`mt-2 font-bold text-[10px] py-1.5 rounded-lg transition-colors ${
                                isAlertActive ? "bg-red-900 border border-red-500 text-red-100 hover:bg-slate-800" : "bg-teal-900 text-teal-200 hover:bg-teal-800"
                              }`}
                            >
                              {isAlertActive ? "إلغاء صفارة الاستنفار" : "توجيه نداء الاستنفار العام 🚨"}
                            </button>
                          </div>

                          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/65 text-center flex flex-col justify-center">
                            <span className="block text-[10px] text-slate-400">معدل الامتثال والنظافة</span>
                            <span className="text-xl font-bold text-white font-mono mt-1">98.2%</span>
                            <span className="text-[8px] text-slate-500">تم المراجعة الجغرافية قبل 20 دقيقة</span>
                          </div>
                        </div>

                        {/* Interactive pending complaints simulation list */}
                        <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/50 space-y-3">
                          <h6 className="text-[11px] font-bold text-teal-300 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" />
                            طلبات الإمداد اللوجستية الواردة بالمنطقة المجاورة :
                          </h6>
                          <div className="space-y-2">
                            {pendingDemands.map(demand => (
                              <div key={demand.id} className="bg-slate-900/80 border border-slate-700/40 p-2.5 rounded-lg flex items-center justify-between text-[11px]">
                                <span className={`flex-1 pr-1 ${demand.status === "APPROVED" ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                  📍 {demand.text}
                                </span>
                                {demand.status === " معلق" || demand.status === "معلق" ? (
                                  <button
                                    onClick={() => {
                                      setPendingDemands(prev =>
                                        prev.map(item => item.id === demand.id ? { ...item, status: "APPROVED" } : item)
                                      );
                                    }}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-black px-2 py-1 rounded text-[9.5px]"
                                  >
                                    اعتماد وتوجيه الدعم الفوري
                                  </button>
                                ) : (
                                  <span className="text-teal-400 font-bold text-[9.5px]">✅ تم الاستجابة بنجاح</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>غرفة المراقبة مرتبطة بإحداثيات المنصات الميدانية لمديرية الشؤون الطبية بوزارة الصحة.</span>
                        </div>
                      </div>
                    )}

                    {/* 🏢 ADMINISTRATIVE OFFICIAL PORTAL (ADM123) */}
                    {activeCategory === "admin" && (
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-amber-800 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-amber-800/60">
                          <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-amber-400" />
                            <div>
                              <h5 className="text-xs font-black text-white">بوابة شؤون الرخص والبلديات العامة</h5>
                              <p className="text-[9px] text-amber-400 font-mono">OFFICIAL MUNICIPAL CODE: #ADM-771</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[9px] font-mono border border-blue-500/30">كفاءة معالجة عالية</span>
                        </div>

                        {/* Interactive Switch */}
                        <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">النظام الرقمي المستقل</span>
                            <span className="text-[10px] text-amber-500">تمكين اتخاذ القرار الآلي للمكاتب</span>
                          </div>
                          <button
                            onClick={() => setIsElectronicOnly(!isElectronicOnly)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold ${
                              isElectronicOnly ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {isElectronicOnly ? "مفعل (إلكتروني كامل)" : "معطل (اعتماد يدوي مسبق)"}
                          </button>
                        </div>

                        {/* Pending Licenses Interactive Module */}
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-2.5">
                          <h6 className="text-[11px] font-bold text-amber-300">رخص بلدية وإنشائية تحتاج اعتمادك الفوري ✒️:</h6>
                          <div className="space-y-2">
                            {pendingLicenses.map(lic => (
                              <div key={lic.id} className="bg-slate-900 p-2.5 rounded-lg flex items-center justify-between text-[11px]">
                                <span className={lic.status === "معتمد رسمياً" ? "text-slate-500 line-through" : "text-slate-200"}>
                                  📋 {lic.text}
                                </span>
                                {lic.status === "معلق" ? (
                                  <button
                                    onClick={() => {
                                      setPendingLicenses(prev =>
                                        prev.map(item => item.id === lic.id ? { ...item, status: "معتمد رسمياً" } : item)
                                      );
                                    }}
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-1 rounded text-[10px]"
                                  >
                                    توقيع إلكتروني واعتماد
                                  </button>
                                ) : (
                                  <span className="text-amber-400 font-bold text-[10px]">✒️ تم التوقيع والترخيص</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 🎓 SCHOOL OFFICIAL PORTAL (EDU123) */}
                    {activeCategory === "school" && (
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-purple-800 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-purple-400" />
                            <div>
                              <h5 className="text-xs font-black text-white">لوحة الإشراف الدراسي والامتحانات - مدرسة الأندلس الأهلية</h5>
                              <p className="text-[9px] text-purple-400 font-mono">SCHOOL OVERSEER ENTIRETY ID: #EDU-109</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive adjustment of student attendance with slide simulated dashboard */}
                        <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700/50 space-y-3 text-center">
                          <span className="block text-[10px] text-slate-400">معدل الحضور المدرسي اليومي المؤجل</span>
                          <span className="text-2xl font-black text-purple-400 font-mono">{studentAttendance.toFixed(1)}%</span>
                          <input
                            type="range"
                            min="80"
                            max="100"
                            step="0.1"
                            value={studentAttendance}
                            onChange={(e) => setStudentAttendance(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <p className="text-[9px] text-slate-500">حرك الشريط في الأعلى لمحاكاة غياب طلاب المدرسة بشكل لحظي.</p>
                        </div>

                        {/* Attendance status toggle or winter timings config */}
                        <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold block">توقيت الحصص الصباحية</span>
                            <span className="text-[10px] text-purple-300">الدوام الشتوي أو الصيفي في مصلحة الطلاب</span>
                          </div>
                          <button
                            onClick={() => setIsWinterShift(!isWinterShift)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] ${
                              isWinterShift ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {isWinterShift ? "❄️ دوام شتوي مفعل" : "☀️ دوام صيفي مفعل"}
                          </button>
                        </div>

                        {/* Interactive school demands */}
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-2">
                          <h6 className="text-[11px] font-bold text-purple-300">طلبات طارئة من شؤون الطلاب وأولياء الأمور :</h6>
                          <div className="space-y-2">
                            {schoolAlerts.map(alert => (
                              <div key={alert.id} className="bg-slate-900 p-2 text-xs rounded-lg flex items-center justify-between">
                                <span className={alert.status === "SOLVED" ? "text-slate-500 line-through" : "text-slate-200"}>
                                  🚌 {alert.text}
                                </span>
                                {alert.status === "معلق" ? (
                                  <button
                                    onClick={() => {
                                      setSchoolAlerts(prev =>
                                        prev.map(item => item.id === alert.id ? { ...item, status: "SOLVED" } : item)
                                      );
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 py-1 rounded text-[10px]"
                                  >
                                    معالجة وإقرار الطلب
                                  </button>
                                ) : (
                                  <span className="text-purple-400 font-semibold text-[10px]">✅ تم تلبية الطلب والإخطار</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Elegant Bottom Footer */}
      <motion.div variants={itemVariants} className="mt-12 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
        المنصة مهيأة بالكامل للغة العربية وتعتمد التخزين الداخلي والتحليل الفوري عبر الخوادم بشكل آمن.
      </motion.div>

      {/* 🛡️ MODAL: ANTI-CORRUPTION REPORTING */}
      <AnimatePresence>
        {isCorruptionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-100 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-2xl">
                    <Shield className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">بوابة الإبلاغ عن الفساد الإداري والمالي</h3>
                    <p className="text-xs text-slate-400">نزاهة، أمان، وحماية مطلقة لهوية المبلغين بموجب النظام</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCorruptionModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {corruptionResultMsg && (
                <div className={`p-4 rounded-xl text-xs mb-5 ${
                  corruptionResultMsg.type === "success" 
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-350" 
                    : "bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:text-rose-350"
                }`}>
                  <p className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {corruptionResultMsg.text}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">موضوع البلاغ / التجاوز</label>
                  <input
                    type="text"
                    value={corruptionSubject}
                    onChange={(e) => setCorruptionSubject(e.target.value)}
                    placeholder="مثال: استغلال النفوذ الوظيفي في مناقصة التوريد الإقليمية"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all text-slate-850 dark:text-slate-200"
                  />
                </div>

                {/* Target Entity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans font-sans">الجهة/المصلحة المستهدفة</label>
                    <select
                      value={corruptionDepartment}
                      onChange={(e) => setCorruptionDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all text-slate-850 dark:text-slate-200"
                    >
                      <option value="شؤون بلديات وتخطيط هندسي">شؤون بلديات وتخطيط هندسي</option>
                      <option value="صحة وأدوية خدمات طبية">صحة وأدوية خدمات طبية</option>
                      <option value="إدارة المدارس والتربية التعليمية">إدارة المدارس والتربية التعليمية</option>
                      <option value="المالية والصفقات الإدارية">المالية والصفقات الإدارية</option>
                      <option value="خدمات رصد واستجابة أخرى">خدمات رصد واستجابة أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">موقع التجاوز (اختياري)</label>
                    <input
                      type="text"
                      value={corruptionLocation}
                      onChange={(e) => setCorruptionLocation(e.target.value)}
                      placeholder="مثال: مبنى مصلحة البلدية، حي الملز الفرعي"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all text-slate-850 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">تفاصيل وتوصيف السلوك المرصود</label>
                  <textarea
                    rows={4}
                    value={corruptionDescription}
                    onChange={(e) => setCorruptionDescription(e.target.value)}
                    placeholder="يرجى كتابة تفاصيل وافية وتواريخ وسياق المشكلة لمساعدة جهات النزاهة في التدقيق..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none text-slate-850 dark:text-slate-200"
                  />
                </div>

                {/* Anonymity Checkbox */}
                <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/30 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={corruptionIsAnonymous}
                      onChange={(e) => setCorruptionIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-amber-655 border-amber-350 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="anonCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer font-sans">
                      تقديم البلاغ بهوية مشفرة ومجهولة بالكامل 🔒
                    </label>
                  </div>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-850 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold font-sans">حماية خصوصية مصفاة</span>
                </div>

                {/* AI legal Whistleblower advisor trigger and text */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 font-sans">مستشار الحماية القانونية للذكاء الاصطناعي:</span>
                    <button
                      type="button"
                      disabled={isCorruptionAISpinning || !corruptionDescription.trim() || !corruptionSubject.trim()}
                      onClick={handleGetCorruptionAdvisor}
                      className="text-[10.5px] bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-805/45 hover:bg-amber-100 hover:text-amber-900 text-amber-800 font-extrabold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isCorruptionAISpinning ? "animate-spin" : ""}`} />
                      <span className="font-sans">{isCorruptionAISpinning ? "جاري التدقيق من Gemini AI..." : "مراجعة الضمانات القانونية قبل الإرسال"}</span>
                    </button>
                  </div>

                  {corruptionAIAdvice && (
                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-250 dark:border-slate-700/50 p-4 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans max-h-[170px] overflow-y-auto whitespace-pre-wrap">
                      {corruptionAIAdvice}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsCorruptionModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer font-sans"
                  >
                    إغلاق المساعد
                  </button>
                  <button
                    onClick={handleSubmitCorruptionReport}
                    disabled={!corruptionSubject.trim() || !corruptionDescription.trim()}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5 font-sans"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال البلاغ لكتلة الرقابة والنزاهة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📝 MODAL: ADMINISTRATIVE DOCUMENT ASSISTANT / WRITER */}
      <AnimatePresence>
        {isDocWriterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-violet-100 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-violet-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-violet-50 dark:bg-violet-950/20 text-violet-650 rounded-2xl">
                    <FileText className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">مساعد صياغة وتحرير الوثائق الإدارية بالـ AI</h3>
                    <p className="text-xs text-slate-400">صياغة ديوانية مهنية بليغة ومتوافقة تماماً مع القواعد العربية</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDocWriterModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {docError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 text-rose-850 rounded-xl text-xs mb-5">
                  <p>{docError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form fields: 5cols */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">نوع الوثيقة الإدارية</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "application", label: "طلب رسمي" },
                        { id: "appeal", label: "خطاب تظلم" },
                        { id: "minutes", label: "محضر اجتماع" },
                        { id: "licence", label: "شهادة/ترخيص" }
                      ].map((typeItem) => (
                        <button
                          key={typeItem.id}
                          type="button"
                          onClick={() => setDocType(typeItem.id as any)}
                          className={`px-2.5 py-2 border rounded-xl text-xs font-bold cursor-pointer transition-colors text-slate-855 dark:text-slate-350 font-sans ${
                            docType === typeItem.id
                              ? "border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 text-violet-800 dark:text-violet-300 ring-2 ring-violet-500/10"
                              : "border-slate-250 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700"
                          }`}
                        >
                          {typeItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">الجهة الموجه إليها الخطاب</label>
                    <input
                      type="text"
                      value={docRecipient}
                      onChange={(e) => setDocRecipient(e.target.value)}
                      placeholder="مثال: سعادة رئيس المجلس البلدي الموقر"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-slate-855 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">اسم مقدم الطلب (المرسل)</label>
                    <input
                      type="text"
                      value={docSender}
                      onChange={(e) => setDocSender(e.target.value)}
                      placeholder="اسمك الكامل للمراسلة"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-slate-855 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans font-sans">تفاصيل وموجز وغرض الطلب</label>
                    <textarea
                      rows={5}
                      value={docPurpose}
                      onChange={(e) => setDocPurpose(e.target.value)}
                      placeholder="مثال: نرجو تمديد تصريح صيانة مجمع الأسنان بحي العقيق بسبب ظروف تمديد مجاري مياه وتأخر الفحص الميداني الفني..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/10 border border-slate-250 dark:border-slate-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none text-slate-855 dark:text-slate-200"
                    />
                  </div>

                  <button
                    onClick={handleGenerateDocument}
                    disabled={isDocWritingSpinning || !docRecipient.trim() || !docPurpose.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                  >
                    <Sparkles className={`w-4 h-4 ${isDocWritingSpinning ? "animate-spin" : ""}`} />
                    <span>{isDocWritingSpinning ? "جاري صياغة الخطاب..." : "صياغة وتنسيق الخطاب بالذكاء الاصطناعي"}</span>
                  </button>
                </div>

                {/* Preview Paper sheet: 7cols */}
                <div className="lg:col-span-7 flex flex-col h-full">
                  <span className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">المستند والورقة الإدارية الرسمية الناتجة :</span>
                  
                  <div className="flex-1 bg-amber-50/10 dark:bg-slate-950/25 border border-dashed border-violet-150 dark:border-slate-800 p-5 rounded-2xl min-h-[300px] overflow-y-auto max-h-[420px] shadow-inner font-sans bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=30&w=100')] bg-repeat">
                    {generatedDocContent ? (
                      <div className="text-xs text-slate-850 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                        {generatedDocContent}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-450 text-xs py-16 font-sans">
                        <FileText className="w-12 h-12 text-slate-350 dark:text-slate-750 mb-2" />
                        <span>اكتب معلومات الخطاب في القائمة اليمنى ثم انقر على "صياغة"...</span>
                      </div>
                    )}
                  </div>

                  {generatedDocContent && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 self-end font-sans">
                      {docSavedStatus ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 rounded-xl">
                          ✓ تم حفظ المستند بملاحظاتك الإدارية بنجاح!
                        </span>
                      ) : (
                        <button
                          onClick={handleSaveDocumentToNotes}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          حفظ الوثيقة بملاحظاتي الإدارية 💾
                        </button>
                      )}

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedDocContent);
                          alert("تم نسخ الخطاب الإداري بنجاح إلى الحافظة!");
                        }}
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        نسخ النص 📋
                      </button>

                      <button
                        onClick={() => {
                          const printWindow = window.open("", "_blank");
                          if (printWindow) {
                            printWindow.document.write(`<pre style="direction:rtl; font-family:serif; font-size:16px; padding:40px; white-space:pre-wrap;">${generatedDocContent}</pre>`);
                            printWindow.document.close();
                            printWindow.print();
                          }
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="طباعة الخطاب كنسخة ورقية"
                      >
                        طباعة 🖨️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📞 MODAL: DIGITAL VOICE CALLING & EMERGENCY COMM CENTER */}
      <AnimatePresence>
        {isEmergencyCallOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-slate-800 w-full max-w-xl shadow-2xl p-6 sm:p-8 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-rose-50 dark:border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl">
                    <Phone className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">بوابة الاتصال الرديف والخطوط الساخنة</h3>
                    <p className="text-xs text-slate-400">نظام رقمي مؤمن لتواصلك مع الدفاع المدني، المكافحة، أو الاستشاري الصوتي</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleHangup();
                    setIsEmergencyCallOpen(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Call screen vs Dialpad split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Dialer Screen / Call Status: Left/Top 6 cols */}
                <div className="md:col-span-6 bg-slate-900 dark:bg-black rounded-2xl p-5 text-white flex flex-col justify-between min-h-[290px] relative overflow-hidden shadow-inner font-sans">
                  {/* Status indicators */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                      🔒 اتصالات مشفرة
                    </span>
                    {callState !== 'idle' && (
                      <span className="text-xs font-mono font-bold text-slate-350 bg-slate-800 px-2 py-0.5 rounded">
                        {Math.floor(callTimer / 60).toString().padStart(2, '0')}:{(callTimer % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  {/* Simulated wave animation / Ringing graphics */}
                  <div className="my-4 flex flex-col items-center justify-center text-center flex-1">
                    {callState === 'idle' ? (
                      <>
                        <div className="w-14 h-14 bg-slate-850 rounded-full flex items-center justify-center text-slate-400 mb-2">
                          <Phone className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold">جاهز لطلب الرقم</p>
                        <p className="text-slate-500 text-[10px] mt-1">أدخل الرقم أو انقر الربط السريع بالأسفل</p>
                      </>
                    ) : (
                      <>
                        <div className="relative mb-3 flex items-center justify-center">
                          <span className="absolute inline-flex h-16 w-16 rounded-full bg-rose-500/20 animate-ping"></span>
                          <span className="absolute inline-flex h-20 w-20 rounded-full bg-rose-500/10 animate-pulse"></span>
                          <div className="relative w-14 h-14 bg-rose-600 rounded-full flex items-center justify-center text-white">
                            <Phone className="w-6 h-6 animate-bounce" />
                          </div>
                        </div>

                        <p className="text-sm font-black text-rose-300">
                          {activeCallContact ? activeCallContact.name : "جهة اتصال"}
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5 font-mono">
                          {dialedNumber}
                        </p>

                        {/* Active Call Animated Bars */}
                        {callState === 'active' && (
                          <div className="flex items-center gap-1.5 mt-4 justify-center h-8">
                            {[1, 2, 3, 4, 5, 6].map((bar) => (
                              <motion.span
                                key={bar}
                                animate={{
                                  height: isMuted ? 4 : [8, 28, 12, 24, 8][bar % 5]
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.6 + (bar * 0.1),
                                  ease: "easeInOut"
                                }}
                                className="w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full inline-block"
                              />
                            ))}
                          </div>
                        )}

                        {callState === 'ringing' && (
                          <p className="text-amber-400 text-xs font-bold animate-pulse mt-2">يرن الآن...</p>
                        )}
                        {callState === 'connecting' && (
                          <p className="text-blue-400 text-xs font-bold animate-pulse mt-2">جاري فحص النطاق...</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Voice caption / transcript */}
                  <div className="bg-slate-850/80 border border-slate-700/50 rounded-xl p-3 min-h-[85px] max-h-[120px] overflow-y-auto text-[11px] text-slate-200 leading-relaxed font-sans scrollbar-thin">
                    {callResponseText || (lang === "ar" ? "اضغط اتصال لبدء المكالمة الرقمية المؤمنة." : "Prêt à appeler...")}
                  </div>
                </div>

                {/* Dialpad and presets: Right/Bottom 6 cols */}
                <div className="md:col-span-6 flex flex-col justify-between gap-4">
                  {/* Number Input Screen */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={dialedNumber}
                        onChange={(e) => setDialedNumber(e.target.value.replace(/[^0-9*#]/g, ''))}
                        placeholder="رقم الهاتف"
                        className="w-full text-center py-2 px-4 bg-slate-50 dark:bg-slate-800/15 border border-slate-200 dark:border-slate-700 text-lg font-bold rounded-xl tracking-widest focus:ring-2 focus:ring-rose-500/30 focus:outline-none transition-all dark:text-white"
                        disabled={callState !== 'idle'}
                      />
                      {dialedNumber && callState === 'idle' && (
                        <button
                          onClick={() => setDialedNumber("")}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dialpad buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        disabled={callState !== 'idle'}
                        onClick={() => {
                          playDialBeep(num);
                          setDialedNumber(prev => prev + num);
                        }}
                        className="py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/35 dark:hover:bg-slate-800 text-slate-850 dark:text-slate-250 hover:text-rose-600 text-xs font-bold rounded-xl border border-slate-200/50 dark:border-slate-750 transition-colors cursor-pointer flex flex-col items-center justify-center active:scale-95 disabled:opacity-45"
                      >
                        <span className="font-mono text-sm">{num}</span>
                        <span className="text-[7px] text-slate-400 font-normal">
                          {num === '2' ? 'أ ب ت' : num === '3' ? 'ج ح خ' : num === '4' ? 'د ذ ر' : num === '5' ? 'ز س ش' : num === '6' ? 'ص ض ط' : num === '7' ? 'ظ ع غ' : num === '8' ? 'ف ق ك' : num === '9' ? 'ل م ن' : ''}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Hot Call presets */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 select-none">المقاص القياسي للاتصال المباشر:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: "الدفاع المدني (998)", number: "998" },
                        { label: "الإسعاف الطبي (997)", number: "997" },
                        { label: "مكافحة الفساد (19991)", number: "19991" },
                        { label: "طوارئ البلدية (940)", number: "940" },
                        { label: "روبوت لـ AI (2026)", number: "2026" }
                      ].map((preset) => (
                        <button
                          key={preset.number}
                          disabled={callState !== 'idle'}
                          onClick={() => {
                            setDialedNumber(preset.number);
                            handleInitiateCall(preset.number);
                          }}
                          className="p-1.5 text-[10px] text-right font-extrabold bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100/60 dark:border-rose-900/30 hover:bg-rose-100/60 transition-all text-rose-900 dark:text-rose-300 rounded-lg cursor-pointer flex items-center justify-between overflow-hidden"
                        >
                          <span className="truncate">{preset.label.split(' ')[0]}</span>
                          <span className="text-rose-500 font-mono text-[9px]">{preset.number}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Hang up / Call */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {callState === 'idle' ? (
                      <button
                        type="button"
                        onClick={() => handleInitiateCall(dialedNumber)}
                        disabled={!dialedNumber}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>بدء مكالمة VoIP سحابية مؤمنة</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => setIsMuted(p => !p)}
                          className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isMuted ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-705'
                          }`}
                        >
                          {isMuted ? (lang === "ar" ? "🔇 كتم" : "Mute") : (lang === "ar" ? "🎙️ ميك" : "Unmute")}
                        </button>

                        <button
                          type="button"
                          onClick={handleHangup}
                          className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>إنهاء المكالمة</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
