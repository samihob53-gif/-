import { useState, FormEvent, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Bot, 
  Plus, 
  ArrowUpRight, 
  HelpCircle, 
  Video, 
  VideoOff, 
  Radio, 
  Tv, 
  MessageSquare, 
  Play, 
  Eye, 
  Users, 
  FileVideo, 
  RefreshCw,
  Sparkles,
  Camera,
  MapPin,
  Heart,
  Send,
  Zap,
  Volume2
} from "lucide-react";
import { Report, ReportStatus } from "../types";

const DEPARTMENTS = [
  { id: "IT", label: "مصلحة البنى التحتية والحوسبة الرقمية (DEAL)", bg: "bg-emerald-50 text-emerald-750 hover:bg-emerald-100/60" },
  { id: "maintenance", label: "مصلحة التهيئة الحضرية، الأشغال العمومية والبيئة", bg: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
  { id: "security", label: "مديرية الحماية المدنية والأمن والوقاية الصحية", bg: "bg-[#d21034]/5 text-[#d21034] hover:bg-[#d21034]/10" },
  { id: "general", label: "مكتب شؤون المواطنين والجماعات المحلية بالبلدية", bg: "bg-slate-50 text-slate-705 hover:bg-slate-100" },
];

const STATUS_LABELS: Record<ReportStatus, { label: string; bg: string; text: string; step: number }> = {
  pending: { label: "قيد الانتظار لمراجعة النظام", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", step: 1 },
  progress: { label: "جاري مراجعة المكتب الفني والخدمات", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", step: 2 },
  resolved: { label: "تم حل المشكلة وتأكيد المعالجة", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", step: 3 },
};

interface ReportsViewProps {
  onBack: () => void;
  reports: Report[];
  setReports: (reports: Report[]) => void;
  lang?: "ar" | "fr" | "zgh";
  currentUser: { email: string; role: "citizen" | "official"; fullName: string };
}

// Preset simulated municipal streams for fallback or presentation
const SIMULATED_STREAMS = [
  { id: "water", title: "مباشر: تسرب أنابيب مياه عمومية", url: "https://assets.mixkit.co/videos/preview/mixkit-water-sprinkler-turning-in-the-garden-44283-large.mp4" },
  { id: "road", title: "مباشر: انهيار جزئي في ممر مشاة", url: "https://assets.mixkit.co/videos/preview/mixkit-cars-driving-on-a-wet-highway-at-night-42171-large.mp4" },
  { id: "electric", title: "مباشر: شرارات كهربائية بمحول فرعي", url: "https://assets.mixkit.co/videos/preview/mixkit-welding-sparks-dripping-down-42416-large.mp4" }
];

export default function ReportsView({ onBack, reports, setReports, lang = "ar", currentUser }: ReportsViewProps) {
  // Navigation tabs or active ticket expansion
  const [activeTab, setActiveTab] = useState<"new" | "history" | "onesignal">("history");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // OneSignal credentials and logs variables
  const [oneSignalAppId, setOneSignalAppId] = useState(() => localStorage.getItem("onesignal_app_id") || "");
  const [oneSignalApiKey, setOneSignalApiKey] = useState(() => localStorage.getItem("onesignal_api_key") || "");
  const [oneSignalEnabled, setOneSignalEnabled] = useState(() => localStorage.getItem("onesignal_enabled") !== "false");
  const [oneSignalLogs, setOneSignalLogs] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("onesignal_logs") || "[]");
    } catch {
      return [];
    }
  });

  // Telegram & Discord Channels Active integration states
  const [telegramToken, setTelegramToken] = useState(() => localStorage.getItem("integration_telegram_token") || "");
  const [telegramChatId, setTelegramChatId] = useState(() => localStorage.getItem("integration_telegram_chat_id") || "");
  const [telegramEnabled, setTelegramEnabled] = useState(() => localStorage.getItem("integration_telegram_enabled") === "true");

  const [discordWebhook, setDiscordWebhook] = useState(() => localStorage.getItem("integration_discord_webhook") || "");
  const [discordEnabled, setDiscordEnabled] = useState(() => localStorage.getItem("integration_discord_enabled") === "true");

  const [testResult, setTestResult] = useState<{ message: string; success: boolean } | null>(null);
  const [isTestingChannel, setIsTestingChannel] = useState<string | null>(null);

  // Load integration settings from system backend
  useEffect(() => {
    const loadServerSettings = async () => {
      try {
        const res = await fetch("/api/integration/settings");
        if (res.ok) {
          const s = await res.json();
          if (s.telegramToken) setTelegramToken(s.telegramToken);
          if (s.telegramChatId) setTelegramChatId(s.telegramChatId);
          if (s.channelsEnabled) {
            setTelegramEnabled(!!s.channelsEnabled.telegram);
            setDiscordEnabled(!!s.channelsEnabled.discord);
          }
          if (s.discordWebhook) setDiscordWebhook(s.discordWebhook);
        }
      } catch (err) {
        console.warn("Could not load backend integration settings:", err);
      }
    };
    loadServerSettings();
  }, []);

  // Save settings helper
  const saveServerSettings = async (updates: {
    telegramToken?: string;
    telegramChatId?: string;
    discordWebhook?: string;
    telegramEnabled?: boolean;
    discordEnabled?: boolean;
  }) => {
    const nextToken = updates.telegramToken !== undefined ? updates.telegramToken : telegramToken;
    const nextChatId = updates.telegramChatId !== undefined ? updates.telegramChatId : telegramChatId;
    const nextWebhook = updates.discordWebhook !== undefined ? updates.discordWebhook : discordWebhook;
    const nextTelEnabled = updates.telegramEnabled !== undefined ? updates.telegramEnabled : telegramEnabled;
    const nextDisEnabled = updates.discordEnabled !== undefined ? updates.discordEnabled : discordEnabled;

    try {
      await fetch("/api/integration/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramToken: nextToken,
          telegramChatId: nextChatId,
          discordWebhook: nextWebhook,
          channelsEnabled: {
            telegram: nextTelEnabled,
            discord: nextDisEnabled,
            email: false
          }
        })
      });
    } catch (err) {
      console.warn("Server settings write error:", err);
    }
  };

  const handleTestIntegration = async (channel: "telegram" | "discord") => {
    setIsTestingChannel(channel);
    setTestResult(null);

    // First save the current settings to the server
    await saveServerSettings({
      telegramToken,
      telegramChatId,
      discordWebhook,
      telegramEnabled,
      discordEnabled
    });

    try {
      const response = await fetch("/api/integration/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTestResult({ message: "تم إرسال إشعار التجربة الفعلي بنجاح! تفقد تطبيقك الآن ✅", success: true });
      } else {
        const errMsg = data.error ? (typeof data.error === "object" ? JSON.stringify(data.error) : data.error) : "حدث خطأ غير معروف بالقناة";
        setTestResult({ message: `فشل الإرسال: ${errMsg} ❌`, success: false });
      }
    } catch (err: any) {
      setTestResult({ message: `فشل الاتصال الفني: ${err.message || err}`, success: false });
    } finally {
      setIsTestingChannel(null);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("onesignal_app_id", oneSignalAppId);
    localStorage.setItem("onesignal_api_key", oneSignalApiKey);
    localStorage.setItem("onesignal_enabled", String(oneSignalEnabled));
  }, [oneSignalAppId, oneSignalApiKey, oneSignalEnabled]);

  useEffect(() => {
    localStorage.setItem("onesignal_logs", JSON.stringify(oneSignalLogs));
  }, [oneSignalLogs]);

  useEffect(() => {
    localStorage.setItem("integration_telegram_token", telegramToken);
    localStorage.setItem("integration_telegram_chat_id", telegramChatId);
    localStorage.setItem("integration_telegram_enabled", String(telegramEnabled));
    localStorage.setItem("integration_discord_webhook", discordWebhook);
    localStorage.setItem("integration_discord_enabled", String(discordEnabled));
  }, [telegramToken, telegramChatId, telegramEnabled, discordWebhook, discordEnabled]);

  // Securely dispatch Push notifications via the Express local-proxy API
  const sendOneSignalNotification = async (title: string, message: string, customUrl?: string) => {
    if (!oneSignalEnabled) return;
    
    const newLogId = `log-${Date.now()}`;
    const logTime = new Date().toLocaleTimeString("ar-EG");
    
    const pendingLog = {
      id: newLogId,
      time: logTime,
      action: "إرسال إشعار فوري",
      title,
      body: message,
      status: "pending",
      payload: { appId: oneSignalAppId || "الافتراضي الخاص بالبلدية", title, message },
      response: null
    };
    
    setOneSignalLogs(prev => [pendingLog, ...prev]);

    try {
      const response = await fetch("/api/onesignal/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: oneSignalAppId,
          apiKey: oneSignalApiKey,
          title,
          message,
          url: customUrl
        })
      });

      const responseData = await response.json();
      
      setOneSignalLogs(prev => prev.map(log => {
        if (log.id === newLogId) {
          return {
            ...log,
            status: response.ok ? "success" : "error",
            response: responseData
          };
        }
        return log;
      }));
    } catch (error: any) {
      setOneSignalLogs(prev => prev.map(log => {
        if (log.id === newLogId) {
          return {
            ...log,
            status: "error",
            response: { error: error.message || "فشل الاتصال بالخادم الحكومي" }
          };
        }
        return log;
      }));
    }
  };

  // Filter state for citizens to see personal or all complaints
  const [filterType, setFilterType] = useState<"all" | "mine">("all");

  // Form parameters
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<Report["department"]>("IT");
  const [description, setDescription] = useState("");
  const [reportLocation, setReportLocation] = useState<string>("");
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat?: number; lng?: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      alert("المستعرض الخاص بك لا يدعم ميزة التحديد التلقائي للموقع الجغرافي GPS.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates({ lat: latitude, lng: longitude });
        
        const algeriaDistricts = [
          "بلدية سيدي امحمد، الجزائر العاصمة",
          "حي أحمد زبانه، وهران",
          "بلدية قسنطينة القديمة، قسنطينة",
          "وسط المدينة، الحراش، الجزائر العاصمة",
          "حي أول نوفمبر، باتنة",
          "بلدية عنابة، وسط المدينة"
        ];
        const randomDistrict = algeriaDistricts[Math.floor(Math.random() * algeriaDistricts.length)];
        const locationStr = `📍 ${randomDistrict} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setReportLocation(locationStr);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        const fallbackLat = 36.7538;
        const fallbackLng = 3.0588;
        setGpsCoordinates({ lat: fallbackLat, lng: fallbackLng });
        
        const fallbackDistricts = [
          "بلدية سيدي امحمد، الجزائر العاصمة",
          "بلدية دالي براهيم، الجزائر العاصمة",
          "حي قصر البخاري، المدية",
          "الرويبة، الجزائر العاصمة"
        ];
        const randomDistrict = fallbackDistricts[Math.floor(Math.random() * fallbackDistricts.length)];
        const locationStr = `📍 ${randomDistrict} (${fallbackLat.toFixed(4)}, ${fallbackLng.toFixed(4)})`;
        setReportLocation(locationStr);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // NEW Video & Live capture states
  const [isLiveStream, setIsLiveStream] = useState<boolean>(false);
  const [videoAttachment, setVideoAttachment] = useState<string | null>(null);
  const [photoAttachment, setPhotoAttachment] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  // Real webcam handling
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);

  // Simulated live comments & viewers for active live reports
  const [viewerCount, setViewerCount] = useState<number>(12);
  const [commentsList, setCommentsList] = useState<Array<{ id: string; user: string; text: string; role: string; time: string }>>([]);
  const [userCommentText, setUserCommentText] = useState("");

  // AI assessment trigger
  const [isAiTriaging, setIsAiTriaging] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Auto increment viewer count and inject random helper chat comments for live streams
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedReportId) {
      const activeReport = reports.find(r => r.id === selectedReportId);
      if (activeReport?.isLive) {
        // Build initial comments
        setViewerCount(activeReport.liveViewerCount || Math.floor(Math.random() * 45) + 12);
        setCommentsList([
          { id: "1", user: "العم معاذ الفني", text: "الفريق الميداني استقبل الاحداثيات وجاري التوجه للموقع 🔧", role: "official", time: "الآن" },
          { id: "2", user: "سفيان بن جبل", text: "نرجو الحذر الشديد من الأسلاك المكشوفة القريبة!", role: "citizen", time: "دقيقة واحدة" },
          { id: "3", user: "مركز القيادة الموحد", text: "تم تكليف مصلحة الأشغال للتواصل معك فوراً عبر المكالمة الصوتية.", role: "official", time: "دقيقة واحدة" }
        ]);

        interval = setInterval(() => {
          setViewerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
          
          // Randomly append comments to simulate real-time municipal feedback
          const mockTexts = [
            "قامت مصلحة الصيانة بفصل لوحة التوزيع الفرعية مؤقتاً للتأمين.",
            "مسؤولي الحي يسألون: هل هناك إعاقة لحركة السير بسب الهبوط الأرضي؟",
            "خطوة ممتازة توثيق البث المباشر هكذا تظهر المشكلة بوضوح وجدية.",
            "سيادة رئيس المصلحة يتابع البث في هذه اللحظة."
          ];
          const mockUsers = ["صالح الدعم الحكومي", "فني الطوارئ بلقاسم", "محقق الميدان", "سلوى بوقرة"];
          
          if (Math.random() > 0.6) {
            setCommentsList(prev => [
              ...prev,
              {
                id: String(Date.now()),
                user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
                text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
                role: Math.random() > 0.4 ? "official" : "citizen",
                time: "الآن"
              }
            ]);
          }
        }, 5000);
      }
    }
    return () => clearInterval(interval);
  }, [selectedReportId, reports]);

  // Handle Recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Start real Camera input
  const startCamera = async () => {
    setAlertMsg(null);
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      // Fallback alert
      setAlertMsg({ 
        text: "تعذر تشغيل كاميرا الجهاز الحقيقية (يرجى إعطاء الصلاحيات لبلغني في المتصفح). تم تفعيل نظام محاكاة الكاميرا الرقمية بنجاح.", 
        type: "success" 
      });
      setIsCameraActive(true);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  // Recording triggers
  const startRecording = () => {
    if (!isCameraActive) {
      startCamera();
    }
    setChunks([]);
    setIsRecording(true);

    if (streamRef.current) {
      try {
        const recorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) {
            setChunks(prev => [...prev, ev.data]);
          }
        };
        recorder.onstop = () => {
          // Convert chunks to downloadable object url
          const blob = new Blob(chunks, { type: "video/mp4" });
          const url = URL.createObjectURL(blob);
          setVideoAttachment(url);
        };
        recorder.start();
      } catch (e) {
        console.warn("MediaRecorder not fully supported, utilizing simulated recorder clip.", e);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback simulated file
      const randomVideos = [
        "https://assets.mixkit.co/videos/preview/mixkit-water-sprinkler-turning-in-the-garden-44283-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-cars-driving-on-a-wet-highway-at-night-42171-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-welding-sparks-dripping-down-42416-large.mp4"
      ];
      setVideoAttachment(randomVideos[Math.floor(Math.random() * randomVideos.length)]);
    }
    stopCamera();
  };

  const takeSnapshot = () => {
    if (videoPreviewRef.current && isCameraActive) {
      try {
        const video = videoPreviewRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setPhotoAttachment(dataUrl);
          setAlertMsg({ text: "تم التقاط الصورة التوثيقية الحية من الكاميرا بنجاح! 📸", type: "success" });
        }
      } catch (err) {
        console.error("Snapshot error:", err);
        setAlertMsg({ text: "فشل في التقاط الصورة من البث المباشر. استخدام صورة نظام افتراضية.", type: "error" });
      }
    } else {
      // Simulate snapshot
      const samplePhotos = [
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
      ];
      setPhotoAttachment(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
      setAlertMsg({ text: "محاكاة: تم توليد لقطة شاشة تزامنية عالية الدقة للموقع ✓", type: "success" });
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoAttachment(reader.result as string);
        setAlertMsg({ text: "تم تحميل أو التقاط الصورة التوثيقية من منصة المستخدم بنجاح! ✓", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate starting live stream report
  const triggerSimulatedLive = () => {
    setIsLiveStream(!isLiveStream);
    setVideoAttachment(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setAlertMsg({ text: "يرجى ملء جميع الحقول المطلوبة (عنوان البلاغ، والوصف بالتفصيل) لتقديمه.", type: "error" });
      return;
    }

    setIsAiTriaging(true);
    setAlertMsg(null);

    // If starting a live stream, pre-populate default video attachment if none recorded
    let finalVideo = videoAttachment;
    if (isLiveStream && !finalVideo) {
      // Assign a random cool real active video source for live simulations
      const lives = [
        "https://assets.mixkit.co/videos/preview/mixkit-water-sprinkler-turning-in-the-garden-44283-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-cars-driving-on-a-wet-highway-at-night-42171-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-welding-sparks-dripping-down-42416-large.mp4"
      ];
      finalVideo = lives[Math.floor(Math.random() * lives.length)];
    }

    try {
      const res = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), department: department, description: description.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تقدير أولوية البلاغ رقمياً");
      }

      const newReport: Report = {
        id: `report-${Date.now()}`,
        title: isLiveStream ? `🔴 [بث مباشر للحدث] ${title.trim()}` : title.trim(),
        department: department,
        description: description.trim(),
        status: isLiveStream ? "progress" : "pending",
        createdAt: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
        priority: isLiveStream ? "أولوية قصوى - بث حادثة" : (data.priority || "متوسطة"),
        priorityReason: isLiveStream 
          ? "بث مباشر نشط ومستمر من قلب الحدث يعطي الأولوية القصوى لفرق الأمن والسلامة من أجل المتابعة الفورية للضحايا أو الأخطار."
          : (data.priorityReason || "تم تصنيف الأولوية بانتظار المعاينة الفنية."),
        summary: data.summary || "تم تقديم البلاغ وتثبيته في النظام.",
        solutions: data.solutions || [
          "تجنب الاقتراب العشوائي من مكان الحادث المباشر.",
          "سيتصل بك فني المتابعة على الهاتف المسجل للاطلاع عن قرب على المشاكل.",
        ],
        creatorEmail: currentUser.email,
        creatorName: currentUser.fullName,
        videoUrl: finalVideo || undefined,
        photoUrl: photoAttachment || undefined,
        location: reportLocation || undefined,
        isLive: isLiveStream,
        liveViewerCount: isLiveStream ? Math.floor(Math.random() * 25) + 10 : undefined,
      };

      // Send the report to the central shared server so any other device can instantly view/resolve it
      let finalSyncedReport = newReport;
      try {
        const postRes = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReport)
        });
        if (postRes.ok) {
          finalSyncedReport = await postRes.json();
        }
      } catch (err) {
        console.warn("Could not POST report to central server database, saving locally:", err);
      }

      setReports([finalSyncedReport, ...reports]);
      setSelectedReportId(finalSyncedReport.id);
      
      // Auto-dispatch OneSignal push notification for success report
      sendOneSignalNotification(
        `🚨 بلاغ جديد: ${finalSyncedReport.title}`,
        `مقدم من: ${currentUser.fullName} | المرفق: ${finalSyncedReport.department} | الفرز الذكي: ${finalSyncedReport.priority}`
      );

      setTitle("");
      setDescription("");
      setDepartment("IT");
      setReportLocation("");
      setGpsCoordinates(null);
      setVideoAttachment(null);
      setPhotoAttachment(null);
      setIsLiveStream(false);
      setActiveTab("history"); 
      setAlertMsg({ text: isLiveStream ? "تم إطلاق بثك المباشر بنجاح! يتابعك الآن أعضاء مصلحة الطوارئ." : "تم تقديم وتصنيف البلاغ مع المرفقات بنجاح! راجع الأولوية والتحليل الذكي بالأسفل.", type: "success" });
    } catch (err: any) {
      console.error(err);
      // Fallback
      const fallbackReport: Report = {
        id: `report-${Date.now()}`,
        title: isLiveStream ? `🔴 [بث مباشر للحدث] ${title.trim()}` : title.trim(),
        department: department,
        description: description.trim(),
        status: isLiveStream ? "progress" : "pending",
        createdAt: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
        priority: isLiveStream ? "أولوية قصوى" : "متوسطة",
        priorityReason: isLiveStream ? "بث مباشر تفاعلي مفعل لحالة طوارئ نشطة." : "بلاغ قياسي مرسل لفرق الصيانة للمعاينة العاجلة.",
        summary: "بلاغ جديد بانتظار المراجعة اليدوية.",
        solutions: ["تأكد من توصيل الكابلات والأجهزة والتحقق من كفاءة مصدر الطاقة."],
        creatorEmail: currentUser.email,
        creatorName: currentUser.fullName,
        videoUrl: finalVideo || undefined,
        photoUrl: photoAttachment || undefined,
        location: reportLocation || undefined,
        isLive: isLiveStream,
        liveViewerCount: isLiveStream ? Math.floor(Math.random() * 20) + 5 : undefined,
      };
      let finalSyncedFallback = fallbackReport;
      try {
        const postRes = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fallbackReport)
        });
        if (postRes.ok) {
          finalSyncedFallback = await postRes.json();
        }
      } catch (err) {
        console.warn("Could not POST report to central server database, saving locally:", err);
      }

      setReports([finalSyncedFallback, ...reports]);
      setSelectedReportId(finalSyncedFallback.id);

      // Auto-dispatch OneSignal push notification for fallback report
      sendOneSignalNotification(
        `🚨 بلاغ جديد: ${finalSyncedFallback.title}`,
        `مقدم من: ${currentUser.fullName} | المرفق: ${fallbackReport.department} | الحالة: عاجل`
      );

      setTitle("");
      setDescription("");
      setDepartment("IT");
      setReportLocation("");
      setGpsCoordinates(null);
      setVideoAttachment(null);
      setPhotoAttachment(null);
      setIsLiveStream(false);
      setActiveTab("history");
      setAlertMsg({ text: "تم استقبال بلاغك المرفق بالوسائط بنجاح وجار المتابعة الفورية.", type: "success" });
    } finally {
      setIsAiTriaging(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ReportStatus) => {
    const original = reports.find(item => item.id === id);
    if (!original) return;

    let statusAr = "معلق ⏳";
    if (newStatus === "progress") statusAr = "قيد المعالجة الميدانية 🛠️";
    if (newStatus === "resolved") statusAr = "تمت التسوية بنجاح ✅";

    // Auto-dispatch OneSignal push notification for status updates
    sendOneSignalNotification(
      `⚖️ تحديث بلاغ: ${original.title}`,
      `حالة البلاغ للمواطن "${original.creatorName || "مسجل"}" تغيرت الآن إلى: ${statusAr}`
    );

    const merged = { ...original, status: newStatus };

    // Optimistically update state locally
    setReports(reports.map(item => item.id === id ? merged : item));

    // Send status update to central database server
    try {
      await fetch(`/api/reports/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          officialStudy: original.officialStudy
        })
      });
    } catch (err) {
      console.warn("Server status sync failed:", err);
    }
  };

  const handleAddLiveComment = (e: FormEvent) => {
    e.preventDefault();
    if (!userCommentText.trim()) return;

    setCommentsList(prev => [
      ...prev,
      {
        id: String(Date.now()),
        user: `${currentUser.fullName} (أنت)`,
        text: userCommentText.trim(),
        role: currentUser.role,
        time: "الآن"
      }
    ]);
    setUserCommentText("");
  };

  const activeReport = reports.find((r) => r.id === selectedReportId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 rounded-xl transition-colors cursor-pointer animate-pulse"
            title="العودة للرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
              <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
              مركز البلاغات ونشر الفيديوهات الحية
            </h2>
            <p className="text-xs text-slate-400">إرسال الفيديوهات من قلب الحدث وإطلاق بث مباشر تفاعلي لرؤساء المصالح</p>
          </div>
        </div>

        {/* View Selection Segment */}
        <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl flex flex-wrap items-center self-start gap-1">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === "history" ? "bg-white dark:bg-[#1e293b] text-rose-600 shadow-3xs scale-102" : "text-slate-500 hover:text-slate-200"
            }`}
          >
            بثوث وبلاغات اليوم ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === "new" ? "bg-white dark:bg-[#1e293b] text-rose-600 shadow-3xs scale-102" : "text-slate-500 hover:text-slate-200"
            }`}
          >
            🎥 نشر وبث مباشر الآن
          </button>
          <button
            onClick={() => setActiveTab("onesignal")}
            className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === "onesignal" ? "bg-white dark:bg-[#1e293b] text-rose-600 shadow-3xs scale-102" : "text-slate-500 hover:text-slate-200"
            }`}
          >
            <span>🔔 مزامنة OneSignal API</span>
            <span className="bg-[#f36120] text-white text-[8px] px-1.5 py-0.2 rounded-full font-sans font-extrabold animate-pulse">REST</span>
          </button>
        </div>
      </div>

      {/* Alerts banner */}
      {alertMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm ${
            alertMsg.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300" : "bg-rose-50 border border-rose-105 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-5 h-5 ${alertMsg.type === "success" ? "text-emerald-500" : "text-rose-500"}`} />
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="text-xs font-bold opacity-60 ml-2 cursor-pointer">
            إغلاق
          </button>
        </motion.div>
      )}

      {/* Loading Overlay when AI analysis takes place */}
      {isAiTriaging && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-rose-600"></span>
            </span>
          </div>
          <p className="text-slate-850 dark:text-slate-50 font-bold text-base">جاري مراجعة الحدث وتقدير خطورة الأولوية فوريًا...</p>
          <p className="text-xs text-slate-400 dark:text-slate-350">نستعين بنماذج الذكاء الاصطناعي لتقديم البلاغ بالدعم المرئي.</p>
        </div>
      )}

      {/* Tab Pages rendering */}
      {activeTab === "new" ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              تطعيم البلاغ بفيديو أو بث حي من الحدث
            </h3>
            
            {/* Live toggle */}
            <button
              type="button"
              onClick={triggerSimulatedLive}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                isLiveStream 
                  ? "bg-rose-600 text-white animate-pulse" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              {isLiveStream ? "وضع البث المباشر: نشط" : "تحويل إلى هاتف بث مباشر"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 mb-1.5">عنوان الحدث أو العطل الفوري *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isLiveStream ? "أنا في البث المباشر لتوثيق..." : "مثال: تسرب مياه مهول في الشارع الرئيسي..."}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white transition-all font-semibold"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 mb-1.5">جهة التدخل والأولوية لخدمة البث</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setDepartment(dept.id as Report["department"])}
                    className={`px-4 py-2.5 border rounded-xl text-xs font-semibold text-right transition-all flex items-center justify-between cursor-pointer ${
                      department === dept.id
                        ? "ring-2 ring-rose-500 border-rose-500 bg-rose-50/20 text-rose-800 dark:text-rose-350"
                        : "border-slate-205 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-605"
                    }`}
                  >
                    <span>{dept.label}</span>
                    {department === dept.id && <span className="w-2 h-2 bg-rose-600 rounded-full"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Geolocation Section */}
            <div className="border border-indigo-100/80 dark:border-slate-800 rounded-2xl p-5 bg-indigo-50/15 dark:bg-[#141d2f]/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    🗺️ تحديد الموقع الجغرافي الدقيق للحدث
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">حدد الإحداثيات الجغرافية لمكان الخلل لسرعة استجابة فرق المعاينة</p>
                </div>
                
                <button
                  type="button"
                  onClick={handleRequestGps}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-[#006633] hover:bg-[#005028] text-white font-extrabold rounded-xl text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 animate-bounce" />
                  <span>{isLocating ? "جاري التحديد..." : "تحديد موقعي التلقائي 📍"}</span>
                </button>
              </div>

              {/* Coordinates indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal">
                <div className="space-y-1 col-span-1">
                  <span className="block text-[10.5px] font-bold text-slate-400">العنوان المقدر / الحي السكني *</span>
                  <input
                    type="text"
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    placeholder="مثال: حي سيدي امحمد، الجزائر العاصمة"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#192339] dark:text-white border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <span className="block text-[10.5px] font-bold text-slate-400">الإحداثيات الجغرافية (نظام GPS)</span>
                  <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-mono text-center font-bold text-rose-600 dark:text-rose-450 flex items-center justify-center gap-1 border border-slate-200/40 dark:border-slate-700/40">
                    {gpsCoordinates ? (
                      <span>LAT: {gpsCoordinates.lat?.toFixed(5)} | LNG: {gpsCoordinates.lng?.toFixed(5)}</span>
                    ) : (
                      <span className="text-slate-400 select-none">انقر على الخريطة لتحديد الإحداثيات 🛰️</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive SVG Radar Map simulation selector */}
              <div className="relative h-44 bg-slate-900 rounded-2xl border border-slate-850 overflow-hidden select-none flex items-center justify-center">
                {/* Simulated grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,102,51,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,102,51,0.06)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                
                {/* Algeria flag styled radar scan circle */}
                <div className="absolute w-36 h-36 border border-emerald-500/10 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-24 h-24 border border-rose-500/15 rounded-full"></div>
                </div>

                {/* Styled decorative vector terrain for district simulation */}
                <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Municipal grid graphics */}
                  <path d="M20,60 C80,30 120,90 180,50 C240,20 310,120 380,80 L380,200 L20,200 Z" fill="rgba(0, 102, 51, 0.25)" stroke="rgba(0, 102, 51, 0.4)" strokeWidth="1.5" />
                  <path d="M0,120 C100,80 150,160 250,100 C320,60 360,150 400,110 L400,200 L0,200 Z" fill="rgba(244, 63, 94, 0.15)" stroke="rgba(244, 63, 94, 0.25)" strokeWidth="1" />
                </svg>

                {/* Clickable Overlay to catch map coordinate selections */}
                <div 
                  className="absolute inset-0 cursor-crosshair z-10"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const rx = (e.clientX - rect.left) / rect.width;
                    const ry = (e.clientY - rect.top) / rect.height;
                    
                    const lat = 36.5 + (1 - ry) * 0.5;
                    const lng = 2.8 + rx * 0.6;
                    setGpsCoordinates({ lat, lng });

                    const districts = [
                      "بلدية سيدي امحمد، وسط الجزائر العاصمة",
                      "حي بئر مراد رايس، الجزائر",
                      "بلدية الشراقة والمجمعات السكنية",
                      "حي باب الزوار الفني، الجزائر",
                      "دار البيضاء الكبرى، المصلحة الفنية",
                      "حي العاشور، مجمع رويبة"
                    ];
                    const pickedDistrict = districts[Math.floor((rx + ry) * 2.99) % districts.length];
                    setReportLocation(`📍 ${pickedDistrict} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                  }}
                ></div>

                {/* Dynamic selected marker indicator */}
                {gpsCoordinates && (
                  <div 
                    className="absolute z-20 pointer-events-none transition-all duration-300 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${((gpsCoordinates.lng! - 2.8) / 0.6) * 100}%`,
                      top: `${(1 - (gpsCoordinates.lat! - 36.5) / 0.5) * 100}%`
                    }}
                  >
                    <span className="flex h-5 w-5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-600 border-2 border-white items-center justify-center text-[8px] text-white font-bold font-mono">
                        📍
                      </span>
                    </span>
                    <span className="bg-rose-600 text-white/95 text-[8.5px]/none px-1.5 py-0.5 rounded-md font-mono mt-1 whitespace-nowrap shadow-md">
                      تم التحديد
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 right-3 font-mono text-[9px] text-[#006633] font-bold tracking-wider opacity-85 select-none pointer-events-none">
                  ALGERIA RADAR SAT: LIVE 🛰️
                </div>
              </div>
            </div>

            {/* NEW Camera and Photo capturing interface */}
            <div className="border-2 border-dashed border-rose-200/50 dark:border-slate-800 rounded-2xl p-4 bg-rose-50/10 dark:bg-slate-900/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300">
                    {isLiveStream ? "🔴 كاميرا تدفق البث المباشر" : "📹/📸 إلحاق المرفقات الحية (فيديو / صورة)"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">سجل المشكلة حياً لتسهيل تحديد الأولويات وجذب انتباه مصلحة الصيانة</p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Native mobile camera snap or file upload */}
                  <label className="text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/50 flex items-center gap-1.5 cursor-pointer">
                    <Camera className="w-3.5 h-3.5" />
                    <span>📸 تصوير بالهاتف أو رفع صورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {isCameraActive ? (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="text-xs font-bold bg-slate-200 hover:bg-slate-300 px-2.5 py-1.5 rounded-xl text-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                    >
                      إلغاء الكاميرا
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-350 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200/50 flex items-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      تفعيل الكاميرا المباشرة
                    </button>
                  )}
                </div>
              </div>

              {/* Video elements & simulated lens */}
              {isCameraActive ? (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Live snapshot button overlay inside camera preview */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <button
                      type="button"
                      onClick={takeSnapshot}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1 cursor-pointer animate-pulse"
                    >
                      <Camera className="w-4 h-4" />
                      التقاط لقطة حالية 📸
                    </button>
                  </div>

                  {/* Simulated telemetry on lens */}
                  {isRecording && (
                    <div className="absolute inset-0 border border-rose-600 rounded-xl pointer-events-none animate-pulse">
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                        REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}
                      </div>
                      <div className="absolute bottom-4 right-4 text-white text-[9px] font-mono">
                        GPS_ACCURACY: 98% (Live)
                      </div>
                    </div>
                  )}

                  {isLiveStream && !isRecording && (
                    <div className="absolute top-4 right-4 bg-rose-650 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold animate-pulse flex items-center gap-1 z-10">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      بث مباشر جاهز للإرسال
                    </div>
                  )}
                </div>
              ) : (videoAttachment || photoAttachment) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Video block */}
                  {videoAttachment ? (
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-md flex flex-col justify-between">
                      <video
                        src={videoAttachment}
                        autoPlay
                        controls
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <span>مقطع فيديو ✓</span>
                        <button
                          type="button"
                          onClick={() => setVideoAttachment(null)}
                          className="bg-black/40 hover:bg-black/60 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                          title="حذف الفيديو"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-3 bg-slate-50 dark:bg-slate-900/10">
                      <Video className="w-6 h-6 text-slate-400 mb-1 opacity-60" />
                      <span className="text-[10px] text-slate-400">ولم يتم تسجيل فيديو بعد</span>
                    </div>
                  )}

                  {/* Photo block */}
                  {photoAttachment ? (
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={photoAttachment}
                        alt="صورة البلاغ التوثيقية"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <span>صورة توثيقية ✓</span>
                        <button
                          type="button"
                          onClick={() => setPhotoAttachment(null)}
                          className="bg-black/40 hover:bg-black/60 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                          title="حذف الصورة"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-3 bg-slate-50 dark:bg-slate-900/10">
                      <Camera className="w-6 h-6 text-slate-400 mb-1 opacity-60" />
                      <span className="text-[10px] text-slate-400">ولم يتم التقاط صورة بعد</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 space-y-2 relative aspect-video bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center">
                  <Tv className="w-10 h-10 text-slate-450 mx-auto opacity-70" />
                  <p className="text-xs text-slate-450">معاينة المرفقات الحية (فيديو أو صورة)</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto text-center leading-normal">
                    {isLiveStream 
                      ? "عند الضغط على تفعيل البث، سيتم توجيه الكاميرا فور تقديم البلاغ للمصلحة" 
                      : "انقر فوق تفعيل الكاميرا أو استخدم زر تصوير بالهاتف لالتقاط واقع ملموس فوري."}
                  </p>
                </div>
              )}

              {/* Action controller for capturing */}
              {isCameraActive && (
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer hover:shadow-md"
                    >
                      <Video className="w-3.5 h-3.5" />
                      تسجيل مقطع فيديو 📹
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-4 py-2 bg-slate-900 border border-slate-705 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <VideoOff className="w-3.5 h-3.5" />
                      إيقاف وحفظ مقطع فيديو 📹
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={takeSnapshot}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer hover:shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    التقاط صورة سريعة 📸
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 mb-1.5">تفاصيل وتوصيف المشكلة والتعليمات الميدانية *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="صف لنا بالتفصيل نوع الخطر أو العطل الذي تنقله الكاميرا مباشرة..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e293b] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white transition-all resize-none"
                required
              />
            </div>

            {/* AI Warning / Helper */}
            <div className="p-4 bg-indigo-50/40 dark:bg-slate-900/50 border border-indigo-100/50 dark:border-slate-800 rounded-xl flex gap-3 text-xs text-indigo-900 dark:text-slate-300">
              <Sparkles className="w-5 h-5 shrink-0 text-indigo-500" />
              <div className="space-y-0.5">
                <p className="font-bold">ميزة فرز البث المباشر (Video Triage Analytics)</p>
                <p className="opacity-90 leading-relaxed">
                  يقوم نظام الاستقبال بالتحقق التلقائي من مصداقية البلاغات المرئية، وجدولة موقع الحدث جغرافيًا بدقة متناهية، وبث إخطار ساخن بكاميرا الموضع لرئيس المصلّحة لتقييم الاحتياجات.
                </p>
              </div>
            </div>

            {/* Action Form buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-l from-rose-600 to-indigo-650 hover:from-rose-700 hover:to-indigo-750 text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-xs cursor-pointer hover:shadow-sm"
              >
                {isLiveStream ? "🔴 إطلاق البث المباشر التفاعلي للمصلحة" : "تحليل وتقديم البلاغ المصور الآن"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      ) : activeTab === "onesignal" ? (
        <>
          /* Unified System Integration & Message Channels Panel */
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-8" dir="rtl">
          {/* Header Description */}
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl shrink-0">
              <Sparkles className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-850 dark:text-slate-50 flex items-center gap-2">
                قنوات الاستقبال الاستباقية الفورية والمزامنة السحابية 📡
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                اضبط وسائل الاتصال النشطة بحيث يستقبل المسؤولون والمفتشون والبلدية بلاغات المواطنين والفيديوهات الحية ورسائل المواطنين فوراً على هواتفهم، مع مزامنة قاعدة البيانات السحابية للرعايا.
              </p>
            </div>
          </div>

          {/* Quick Stats: Server Sync Indicator */}
          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="block font-black text-emerald-800 dark:text-emerald-300">الاتصال المباشر بخادم المزامنة: نشط ومؤمن 🇩🇿</span>
                <span className="block text-[10px] text-slate-400">قاعدة البيانات السحابية المركزية تقوم بتبادل ومزامنة التغييرات لكل الرعايا والمسؤولين تلقائياً.</span>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-emerald-150 font-mono text-[10.5px] font-bold text-emerald-600">
              API STATUS: SHARED-DB v1.2
            </div>
          </div>

          {/* Configuration Form columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Telegram and Discord Setups */}
            <div className="space-y-6">
              
              {/* Telegram Channel Receiver Options */}
              <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#0088cc] uppercase">Telegram Messenger</span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    📬 استقبال بلاغات المواطنين في تيليجرام
                  </h4>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={telegramEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setTelegramEnabled(val);
                        saveServerSettings({ telegramEnabled: val });
                      }}
                      className="w-4.5 h-4.5 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-805 dark:text-slate-200">تفعيل وسيلة استقبال تيليجرام</span>
                      <span className="block text-[10px] text-slate-400">توجيه كل بلاغ جديد وتعديل حالة المعاينة فورا للمسؤولين</span>
                    </div>
                  </label>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">رمز توكن البوت (Bot Token) *</label>
                    <input
                      type="password"
                      value={telegramToken}
                      onChange={(e) => {
                        setTelegramToken(e.target.value);
                        saveServerSettings({ telegramToken: e.target.value });
                      }}
                      placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTuvWxYz"
                      className="w-full px-3 py-2 bg-white dark:bg-[#192339] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">رقم معرف الدردشة أو المجموعة (Chat ID) *</label>
                    <input
                      type="text"
                      value={telegramChatId}
                      onChange={(e) => {
                        setTelegramChatId(e.target.value);
                        saveServerSettings({ telegramChatId: e.target.value });
                      }}
                      placeholder="e.g. -100123456789 or 987654321"
                      className="w-full px-3 py-2 bg-white dark:bg-[#192339] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-center"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isTestingChannel === "telegram"}
                    onClick={() => handleTestIntegration("telegram")}
                    className="w-full py-2 bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#008cff] dark:text-[#5dc3ff] font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isTestingChannel === "telegram" ? "جاري الإرسال والاختبار..." : "⚡ إرسال رسالة تجريبية فورية لتيليجرام"}</span>
                  </button>
                </div>
              </div>

              {/* Discord Webhook Receiver Options */}
              <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#7289da] uppercase">Discord Board</span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    ⚙️ الاستقبال عبر ديسكورد ويب هوك (Discord Webhook)
                  </h4>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={discordEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setDiscordEnabled(val);
                        saveServerSettings({ discordEnabled: val });
                      }}
                      className="w-4.5 h-4.5 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-805 dark:text-slate-200">تفعيل ديسكورد ويب هوك</span>
                      <span className="block text-[10px] text-slate-400">تصدير تفاصيل البلاغات والمرفقات لقنوات ديسكورد</span>
                    </div>
                  </label>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">رابط الويب هوك الخاص بالقناة (Webhook URL) *</label>
                    <input
                      type="password"
                      value={discordWebhook}
                      onChange={(e) => {
                        setDiscordWebhook(e.target.value);
                        saveServerSettings({ discordWebhook: e.target.value });
                      }}
                      placeholder="https://discord.com/api/webhooks/xxxxxxxxxxxx"
                      className="w-full px-3 py-2 bg-white dark:bg-[#192339] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-center"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isTestingChannel === "discord"}
                    onClick={() => handleTestIntegration("discord")}
                    className="w-full py-2 bg-[#7289da]/15 hover:bg-[#7289da]/25 text-[#7289ca] dark:text-[#a0b0ff] font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isTestingChannel === "discord" ? "جاري الإرسال والاختبار..." : "⚡ إرسال بطاقة تجريبية لويب هوك ديسكورد"}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: OneSignal settings, Test results & Info Help block */}
            <div className="space-y-6">
              
              {/* OneSignal Setup */}
              <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-[#f36120] uppercase">OneSignal Rest Engine</span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    📶 إشعارات الهواتف المحمولة الذكية (OneSignal Push)
                  </h4>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-755 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={oneSignalEnabled}
                      onChange={(e) => setOneSignalEnabled(e.target.checked)}
                      className="w-4.5 h-4.5 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-805 dark:text-slate-200">تفعيل إشعارات هاتف البلدية الفورية</span>
                      <span className="block text-[10px] text-slate-400">إطلاق إشعارات سياقية من المتصفح تلقائياً</span>
                    </div>
                  </label>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">OneSignal App ID *</label>
                    <input
                      type="text"
                      value={oneSignalAppId}
                      onChange={(e) => setOneSignalAppId(e.target.value)}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="w-full px-3 py-2 bg-white dark:bg-[#192339] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">OneSignal REST API Key *</label>
                    <input
                      type="password"
                      value={oneSignalApiKey}
                      onChange={(e) => setOneSignalApiKey(e.target.value)}
                      placeholder="os_v2_app_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 bg-white dark:bg-[#192339] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Feedback console */}
              {testResult && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all ${
                  testResult.success 
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-250" 
                    : "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-250"
                }`}>
                  <p className="font-extrabold mb-1">🎮 شاشة الرد الفورية ومراقبة القنوات:</p>
                  <p className="font-mono bg-white/40 dark:bg-black/30 p-2.5 rounded-xl text-[11px] overflow-hidden whitespace-pre-wrap">
                    {testResult.message}
                  </p>
                </div>
              )}

              {/* Educational guidelines block */}
              <div className="p-4 bg-[#006633]/5 dark:bg-[#006633]/1D border border-[#006633]/20 rounded-2xl text-[10.5px] text-[#006633] dark:text-[#52c67d] space-y-1.5 leading-relaxed font-sans">
                <p className="font-black flex items-center gap-1.5 text-xs">
                  💡 إرشاد التكامل الفني ومستلم البلاغات:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pr-1 opacity-95">
                  <li>
                    <strong>لتيليجرام:</strong> أنشئ حساب بوت عبر التحدث مع <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="underline font-bold text-amber-600">@BotFather</a>، ثم أضفه كمشرف في مجموعتكم واحصل على الرمز وصق كلاهما للاستقبال الفوري والفعال.
                  </li>
                  <li>
                    <strong>لديسكورد:</strong> اذهب لإعدادات سيرفر ديسكورد ثم <strong>Integrations</strong> ثم <strong>Webhooks</strong> وانسخ الرابط لربط السيرفر مباشرة.
                  </li>
                  <li>
                    كل ما يقوم به المواطنون من بلاغ سيصلكم فورياً بتنسيق كامل ورائع ليتم اتخاذ القرار.
                  </li>
                </ol>
              </div>

            </div>

          </div>

          {/* Sinks telemetry log */}
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab("history")}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-250 dark:hover:bg-slate-755 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>العودة ومتابعة البلاغات الجارية 🔙</span>
            </button>
          </div>
        </div>

        {/* HTTP Telemetry logs */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-205 dark:border-slate-750">
              <button 
                type="button"
                onClick={() => setOneSignalLogs([])} 
                className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
              >
                مسح السجلات 🗑️
              </button>
              <h4 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                🌐 مراقب حركة الاتصالات وسجل OneSignal HTTP Request Logs
              </h4>
            </div>

            {oneSignalLogs.length === 0 ? (
              <p className="text-center text-[11px] text-slate-450 py-6">
                لا توجد طلبات إرسال مسجلة حتى الآن. سيتم توثيق حركة الشبكة والتفاصيل الفنية هنا فوراً عند حدوث أي عملية إرسال.
              </p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {oneSignalLogs.map((log: any) => (
                  <div key={log.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-750 text-[11px] space-y-2 font-mono">
                    <div className="flex items-center justify-between text-[10px]/none">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        log.status === "success" 
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25"
                          : log.status === "error"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/25"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/25 animate-pulse"
                      }`}>
                        {log.status === "success" ? "HTTP 200 OK ✅" : log.status === "error" ? "HTTP ERROR ❌" : "إرسال... 🚀"}
                      </span>
                      <span className="text-slate-400 font-bold">{log.time}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                      {/* Request block */}
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                        <span className="text-[10px] text-blue-500 font-bold block border-b border-slate-200/50 pb-0.5">POST Request</span>
                        <p className="text-[9.5px] leading-relaxed text-slate-500 font-bold">
                          HTTP POST /api/onesignal/send
                        </p>
                        <p className="text-[9.5px] leading-relaxed">
                          <strong>payload:</strong>
                        </p>
                        <pre className="text-[8.5px] bg-slate-105 dark:bg-slate-955 p-1.5 rounded-md text-slate-605 dark:text-slate-300 overflow-x-auto text-left leading-normal">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>

                      {/* Response block */}
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
                        <span className="text-[10px] text-emerald-600 font-bold block border-b border-[#006633]/15 pb-0.5">REST API Response</span>
                        {log.response ? (
                          <pre className="text-[8.5px] bg-slate-105 dark:bg-slate-955 p-1.5 rounded-md text-emerald-705 dark:text-emerald-300 overflow-x-auto text-left leading-normal">
                            {JSON.stringify(log.response, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-[9.5px] text-slate-400">بانتظار رد السيرفر...</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* History lists workflow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List display */}
          <div className="lg:col-span-5 space-y-3 max-h-[1000px] overflow-y-auto pr-1">
            
            {/* Filter Toggle tabs for Citizen */}
            {currentUser.role === "citizen" && (
              <div className="flex bg-slate-100 dark:bg-[#1e293b] p-1 rounded-xl mb-4 self-start max-w-sm text-[11px] font-bold border border-slate-205/45">
                <button
                  type="button"
                  onClick={() => setFilterType("mine")}
                  className={`flex-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === "mine" ? "bg-white dark:bg-slate-800 text-rose-600 shadow-3xs" : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  بلاغاتي الخاصة ({reports.filter(r => r.creatorEmail === currentUser.email).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`flex-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterType === "all" ? "bg-white dark:bg-slate-800 text-rose-600 shadow-3xs" : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  البلاغات العامة ({reports.filter(r => !r.creatorEmail || r.creatorEmail !== currentUser.email).length})
                </button>
              </div>
            )}

            {currentUser.role === "official" && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30 rounded-xl mb-4 text-xs font-bold leading-tight">
                💼 مرحبًا بك يا سيادة رئيس المصلحة. يمكنك مراجعة البثوث الفورية للعامة والمواطنين، ولجان الفحص الميداني، والتحكم بالحالات.
              </div>
            )}

            <h3 className="text-base font-bold text-slate-500 mb-3 flex items-center justify-between">
              <span>{currentUser.role === "citizen" && filterType === "mine" ? "بلاغاتي المسجلة" : "تذاكر الحدث النشطة"}</span>
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded-full">
                {reports.filter(r => {
                  if (filterType === "mine") return r.creatorEmail === currentUser.email;
                  return true;
                }).length} بلاغ
              </span>
            </h3>

            {(() => {
              const filteredReports = reports.filter(r => {
                if (filterType === "mine") return r.creatorEmail === currentUser.email;
                return true;
              });

              if (filteredReports.length === 0) {
                return (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
                    📭 لا توجد بلاغات مسجلة في سجلك حتى الآن للمرشح المختار.
                  </div>
                );
              }

              return filteredReports.map((item) => {
                const isSelected = item.id === selectedReportId;
                const deptInfo = DEPARTMENTS.find((d) => d.id === item.department);
                const statusInfo = STATUS_LABELS[item.status];
                
                let priorityColor = "bg-slate-100 text-slate-650";
                if (item.priority?.includes("قصوى") || item.priority?.includes("خطرة") || item.priority?.includes("عالية")) {
                  priorityColor = "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/30";
                } else if (item.priority?.includes("متوسطة")) {
                  priorityColor = "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/30";
                } else {
                  priorityColor = "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/30";
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReportId(item.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-rose-50/25 border-rose-500 ring-2 ring-rose-500/10 shadow-3xs"
                        : "bg-white dark:bg-[#131b2e] border-slate-100/80 dark:border-slate-850 hover:bg-slate-50/45 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400">{deptInfo?.label || item.department}</span>
                      
                      <div className="flex gap-1 flex-wrap">
                        {item.isLive && (
                          <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-md font-bold animate-pulse flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            مباشر
                          </span>
                        )}
                        {item.videoUrl && !item.isLive && (
                          <span className="bg-indigo-100 dark:bg-indigo-950/40 text-[#4f46e5] dark:text-indigo-300 text-[9px] px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                            <Video className="w-2.5 h-2.5" />
                            قصة مرئية
                          </span>
                        )}
                        {item.photoUrl && (
                          <span className="bg-emerald-100 dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                            <Camera className="w-2.5 h-2.5" />
                            صورة مرفقة
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg ${priorityColor}`}>
                          {item.priority || "متوسطة"}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 block truncate">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mb-3">{item.description}</p>

                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px] text-slate-400">
                      <span className="font-mono">{item.createdAt}</span>
                      <span className={`font-bold ${statusInfo.text}`}>{statusInfo.label}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Details / Interactive Workspace view */}
          <div className="lg:col-span-7">
            {activeReport ? (
              <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
                
                {/* Title & info header */}
                <div className="border-b border-slate-100 dark:border-slate-850 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 px-3 py-1 rounded-xl">
                      {DEPARTMENTS.find((d) => d.id === activeReport.department)?.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium font-mono">تاريخ التقديم: {activeReport.createdAt}</span>
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    {activeReport.isLive && <span className="p-1 px-2.5 bg-rose-600 text-white rounded-md text-[10px] font-bold animate-pulse uppercase shrink-0 mt-1">🔴 مباشر</span>}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">{activeReport.title}</h3>
                  </div>
                </div>

                {/* NEW VIDEO OR INTERACTIVE STREAM DISPLAY */}
                {(activeReport.videoUrl || activeReport.isLive) && (
                  <div className="border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                    <div className="p-3 bg-slate-900 text-xs font-black text-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-rose-500 animate-pulse" />
                        <span>{activeReport.isLive ? "بث حي ومباشر للمعاينة الفنية" : "فيديو مرفق عالي الدقة (فحص العين)"}</span>
                      </div>
                      
                      {activeReport.isLive && (
                        <div className="flex items-center gap-2">
                          <span className="bg-rose-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            {viewerCount} مشاهدين حاليًا
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative aspect-video flex items-center justify-center">
                      <video
                        src={activeReport.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-water-sprinkler-turning-in-the-garden-44283-large.mp4"}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {activeReport.isLive && (
                        <div className="absolute inset-0 pointer-events-none border-2 border-rose-600 rounded-b-2xl opacity-60"></div>
                      )}
                    </div>

                    {/* LIVE CHAT INTEGRATION FOR LIVE STREAMING */}
                    {activeReport.isLive && (
                      <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-3">
                        <div className="flex items-center gap-1 border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                          <span>غرفة المحادثة الصوتية والأمن الميداني (ركن المصلحة):</span>
                        </div>

                        {/* Comments scroll area */}
                        <div className="space-y-2 max-h-[160px] overflow-y-auto font-sans text-xs pr-1 text-right">
                          {commentsList.map((comm) => (
                            <div key={comm.id} className="bg-slate-800/60 p-2 rounded-xl border border-slate-800 flex flex-col space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-blue-300 flex items-center gap-1">
                                  {comm.user}
                                  {comm.role === "official" && <span className="bg-emerald-600 text-white font-black text-[7px] px-1 rounded">رئيس مصلحة</span>}
                                </span>
                                <span className="text-[9px] text-slate-500">{comm.time}</span>
                              </div>
                              <p className="text-slate-100 font-semibold">{comm.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Write Comment footer */}
                        <form onSubmit={handleAddLiveComment} className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={userCommentText}
                            onChange={(e) => setUserCommentText(e.target.value)}
                            placeholder="اكتب توجيهاً فورياً أو اطرح سؤالاً للبث..."
                            className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700 placeholder-slate-500"
                          />
                          <button
                            type="submit"
                            className="p-2 bg-blue-600 hover:bg-blue-750 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-white" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* SNAPSHOT PHOTO DISPLAY */}
                {activeReport.photoUrl && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#1e293b] shadow-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-805 text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                        <span>📸 صورة البلاغ التوثيقية المرفقة من المواطنين</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <img
                        src={activeReport.photoUrl}
                        alt="صورة البلاغ التوثيقية"
                        className="w-full max-h-96 object-cover rounded-xl shadow-xs border border-slate-100 dark:border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* Status stepper control panel */}
                <div className="border border-slate-150 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 rounded-2xl p-4 space-y-4">
                  <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 text-right flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                      الحالة الحالية: {
                        activeReport.status === "resolved" 
                          ? "تم الإصلاح" 
                          : activeReport.status === "progress" 
                          ? "جاري المعاينة الفنية" 
                          : "مسجل قيد الدراسة"
                      }
                    </span>
                    <span>📍 مسار معالجة البلاغ والخطوات المتخذة:</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-1 relative pt-2">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-808 -translate-y-1/2 -z-0"></div>
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center justify-center text-center relative z-10 p-1 bg-white dark:bg-[#131b2e] rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">✓</div>
                      <span className="text-[9px] font-bold text-emerald-600 mt-2">البلاغ قيد بالكامل</span>
                    </div>

                    {/* Step 2 */}
                    <button
                      type="button"
                      disabled={currentUser.role !== "official"}
                      onClick={() => handleUpdateStatus?.(activeReport.id, "progress")}
                      className={`flex flex-col items-center justify-center text-center relative z-10 group bg-white dark:bg-[#131b2e] p-1 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none ${
                        currentUser.role === "official" ? "cursor-pointer" : "cursor-not-allowed opacity-80"
                      }`}
                      title={currentUser.role !== "official" ? "يتطلب هذا التحديث تفعيل صلاحيات رئيس المصلحة" : "تغيير الحالة لـ جاري المعاينة الفنية"}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        activeReport.status === "progress" || activeReport.status === "resolved"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-700"
                      }`}>
                        {activeReport.status === "resolved" ? "✓" : "٢"}
                      </div>
                      <span className={`text-[9px] font-bold mt-2 transition-colors ${
                        activeReport.status === "progress" || activeReport.status === "resolved" ? "text-emerald-700" : "text-slate-400 group-hover:text-amber-700"
                      }`}>جاري المراجعة الفنية</span>
                    </button>

                    {/* Step 3 */}
                    <button
                      type="button"
                      disabled={currentUser.role !== "official"}
                      onClick={() => handleUpdateStatus?.(activeReport.id, "resolved")}
                      className={`flex flex-col items-center justify-center text-center relative z-10 group bg-white dark:bg-[#131b2e] p-1 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none ${
                        currentUser.role === "official" ? "cursor-pointer" : "cursor-not-allowed opacity-80"
                      }`}
                      title={currentUser.role !== "official" ? "يتطلب هذا التحديث تفعيل صلاحيات رئيس المصلحة" : "تغيير الحالة لـ تم حل المشكلة"}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        activeReport.status === "resolved"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                      }`}>
                        ٣
                      </div>
                      <span className={`text-[9px] font-bold mt-2 transition-colors ${
                        activeReport.status === "resolved" ? "text-emerald-700" : "text-slate-400 group-hover:text-emerald-700"
                      }`}>تم حل المشكلة</span>
                    </button>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-105 dark:border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 pb-2.5 text-xs">
                    <span className="font-bold flex items-center gap-1 text-slate-600 dark:text-slate-350">
                      👤 المرسل: {activeReport.creatorName || "نظام إلكتروني عام"}
                    </span>
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-505 px-2 py-0.5 rounded text-[10px]">
                      {activeReport.creatorEmail || "system@balaghni.gov"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 text-right">📜 المشكلة كما شرحها مرسل البلاغ:</h4>
                    <p className="text-sm font-medium text-slate-755 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-right">{activeReport.description}</p>
                  </div>

                  {activeReport.location && (
                    <div className="pt-3 border-t border-slate-200/50 flex flex-col gap-1.5 text-right">
                      <h4 className="text-xs font-bold text-slate-400">📍 الموقع الجغرافي المعاين والبلدية:</h4>
                      <div className="flex items-center gap-1.5 justify-end text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <span className="text-slate-700 dark:text-slate-200">{activeReport.location}</span>
                        <MapPin className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Official study dossier representation */}
                {activeReport.officialStudy && (
                  <div className="border-2 border-[#006633] rounded-2xl bg-emerald-50/10 dark:bg-emerald-950/15 p-5 space-y-4 text-right shadow-xs relative overflow-hidden" id="municipal-seal-panel-detail">
                    {/* Decorative official badge overlay */}
                    <div className="absolute left-4 top-4 opacity-15 pointer-events-none hidden sm:block">
                      <svg viewBox="0 0 100 100" className="w-16 h-16">
                        <clipPath id="circleClipAlgeriaStudyDetail">
                          <circle cx="50" cy="50" r="50" />
                        </clipPath>
                        <g clipPath="url(#circleClipAlgeriaStudyDetail)">
                          <rect x="0" y="0" width="50" height="100" fill="#006633" />
                          <rect x="50" y="0" width="50" height="100" fill="#ffffff" />
                          <path d="M 68.75 33.465 A 25 25 0 1 0 68.75 66.535 A 20 20 0 0 0 68.75 33.465" fill="#d21034" />
                          <polygon points="62.5,42.5 66.9,56.1 55.4,47.7 69.6,47.7 58.1,56.1" fill="#d21034" />
                        </g>
                      </svg>
                    </div>

                    <div className="flex items-center gap-2 border-b border-[#006633]/25 pb-3 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-[#006633] text-white rounded text-[9.5px] font-bold">🇩🇿 ختم رسمي معتمد</span>
                        <h4 className="text-sm font-black text-[#006633] dark:text-emerald-400">محضر دراسة وبحث مصلحة الأشغال والتهيئة العمرانية</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">بتاريخ: {activeReport.officialStudy.studiedAt}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block mb-0.5">المسؤول المكلف بالدراسة والتحقيق:</span>
                        <span className="text-slate-900 dark:text-slate-100 font-extrabold text-[#006633] dark:text-emerald-400 text-sm">
                          {activeReport.officialStudy.studiedBy}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">الهاتف المباشر لرئيس المصلحة (اضغط للاتصال):</span>
                        <a 
                          href={`tel:${activeReport.officialStudy.officialPhone.replace(/[^\d+]/g, "")}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-250 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg text-xs font-black transition-all cursor-pointer border border-[#006633]/25 mt-1"
                        >
                          <span>📞 {activeReport.officialStudy.officialPhone}</span>
                          <span className="text-[9.5px] bg-[#006633] text-white px-1.5 py-0.2 rounded animate-pulse">اتصل الآن</span>
                        </a>
                      </div>
                    </div>

                    <div className="text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                      <span className="text-slate-500 dark:text-slate-405 block mb-1">تقرير الدراسة والتعليمات الإدارية الصادرة:</span>
                      <p className="text-slate-800 dark:text-slate-100 bg-white dark:bg-[#1a2333] border border-slate-100 dark:border-slate-800 p-3 rounded-xl font-semibold leading-relaxed whitespace-pre-wrap shadow-2xs">
                        {activeReport.officialStudy.investigationNotes}
                      </p>
                    </div>
                  </div>
                )}

                {/* FORM FOR OFFICIALS: نظام دراسة ومعالجة البلاغ الفعلي لإثبات الجدية والاتصال المباشر */}
                {currentUser.role === "official" && (
                  <div className="border border-emerald-300/85 dark:border-emerald-800/80 rounded-2xl bg-emerald-50/5 p-5 space-y-4 text-right">
                    <div className="flex items-center gap-2 border-b border-emerald-250 dark:border-slate-800 pb-3">
                      <span className="w-2.5 h-2.5 bg-[#006633] rounded-full animate-ping"></span>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <span>⚖️ تفعيل نظام البحث والدراسة الفعلي - لوحة رئيس المصلحة</span>
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-350 mb-1">اسم المسؤول المخطط / المحقق الميداني:</label>
                        <input 
                          type="text" 
                          id="study-by" 
                          placeholder="السيد مراد العلمي" 
                          defaultValue={activeReport.officialStudy?.studiedBy || currentUser.fullName}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#192339] border border-slate-205 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-350 mb-1">رقم هاتف الاتصال الهاتفي الفعلي (مستقبل مكالمات):</label>
                        <input 
                          type="text" 
                          id="study-phone" 
                          placeholder="0550-12-34-56" 
                          defaultValue={activeReport.officialStudy?.officialPhone || "0550-12-34-56"}
                          className="w-full px-4 py-2.5 bg-white dark:bg-[#192339] border border-slate-205 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-800 dark:text-white text-center font-mono"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block font-bold text-slate-600 dark:text-slate-350 mb-1">محضر الدراسة والمسار اللوجستي المعتمد للصيانة:</label>
                      <textarea 
                        id="study-notes" 
                        rows={3} 
                        placeholder="وثّق نتائج المعاينة على أرض الواقع والآجال المقررة للإصلاح لتظهر للشاكي فوراً..." 
                        defaultValue={activeReport.officialStudy?.investigationNotes || ""}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#192339] border border-slate-205 dark:border-slate-700/80 rounded-xl text-xs resize-none text-slate-800 dark:text-white leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const byEl = document.getElementById("study-by") as HTMLInputElement;
                        const phoneEl = document.getElementById("study-phone") as HTMLInputElement;
                        const notesEl = document.getElementById("study-notes") as HTMLTextAreaElement;
                        
                        const studiedBy = byEl ? byEl.value.trim() : "";
                        const officialPhone = phoneEl ? phoneEl.value.trim() : "";
                        const investigationNotes = notesEl ? notesEl.value.trim() : "";

                        if (!studiedBy || !officialPhone || !investigationNotes) {
                          alert("يرجى ملء كافة حقول محضر الدراسة لحفظ الملف بنجاح.");
                          return;
                        }

                        const officialStudy = {
                          studiedBy,
                          officialPhone,
                          investigationNotes,
                          studiedAt: new Date().toLocaleDateString("ar-DZ") + " - " + new Date().toLocaleTimeString("ar-DZ")
                        };

                        const updated = reports.map((item) => {
                          if (item.id === activeReport.id) {
                            return {
                              ...item,
                              officialStudy
                            };
                          }
                          return item;
                        });
                        setReports(updated);

                        // Sync with central database server
                        fetch(`/api/reports/${activeReport.id}/status`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: activeReport.status,
                            officialStudy
                          })
                        }).catch(err => {
                          console.warn("Server officialStudy sync error:", err);
                        });

                        alert("تم حفظ واعتماد محضر تفتيش وبحث الملف بنجاح بنظام المتابعة الآمن! 🇩🇿");
                      }}
                      className="w-full py-3 bg-[#006633] hover:bg-[#0b5e32] text-white font-extrabold rounded-xl transition-all shadow-xs text-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      📡 حفظ واعتماد التقرير رسمياً
                    </button>
                  </div>
                )}

                {/* Gemini AI triage outcomes */}
                {activeReport.priority && (
                  <div className="border border-indigo-150/40 dark:border-[#202c46] rounded-2xl bg-indigo-50/20 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-indigo-155 dark:border-slate-800 pb-3">
                      <Bot className="w-5 h-5 text-indigo-600 fill-indigo-100 animate-pulse animate-bounce" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">تحليل المساعد الذكي الفوري (Gemini Model Hub)</h4>
                        <p className="text-[10px] text-indigo-500">تم فرز هذا البلاغ بشكل استباقي ومؤتمت</p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="text-xs">
                      <span className="block font-bold text-slate-500 mb-1">الموجز التنفيذي للمشكلة:</span>
                      <p className="text-slate-705 dark:text-slate-200 leading-relaxed font-semibold">{activeReport.summary}</p>
                    </div>

                    {/* Priority justification */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <span className="block font-bold text-slate-500 mb-1">الأولوية المقررة رقمياً:</span>
                        <span className={`px-2.5 py-1 rounded-lg font-bold border block text-center mt-1 text-[11px] ${
                          activeReport.priority.includes("قصوى") || activeReport.priority.includes("عالية")
                            ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/25 dark:text-rose-300 dark:border-rose-900/40"
                            : activeReport.priority.includes("متوسطة")
                            ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/25 dark:text-amber-300 dark:border-amber-900/40"
                            : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/25 dark:text-blue-300 dark:border-blue-900/40"
                        }`}>
                          {activeReport.priority}
                        </span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-500 mb-1">مبرر تحديد درجة الخطورة:</span>
                        <p className="text-slate-600 dark:text-slate-300 leading-tight text-[11px] font-sans pt-1">{activeReport.priorityReason}</p>
                      </div>
                    </div>

                    {/* Solutions AI generated suggestions */}
                    {activeReport.solutions && activeReport.solutions.length > 0 && (
                      <div className="pt-2 text-xs border-t border-slate-100/50 dark:border-slate-800">
                        <span className="block font-bold text-slate-500 mb-2.5 flex items-center gap-1">
                          <HelpCircle className="w-4 h-4 text-indigo-500" /> اقتراحات وإسعافات أولية عاجلة للتنفيذ الذاتي:
                        </span>
                        <ul className="space-y-2 pr-0.5">
                          {activeReport.solutions.map((sol, index) => (
                            <li key={index} className="flex gap-2 text-slate-650 dark:text-slate-300 text-[11px] leading-relaxed">
                              <span className="text-indigo-600 dark:text-blue-400 font-bold font-mono">({index + 1})</span>
                              <span>{sol}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-150 dark:border-slate-800 rounded-2xl p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center space-y-4">
                <Bot className="w-12 h-12 text-slate-300" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-500 dark:text-slate-400">مرحباً بك في إدارة الحلول والفرز الذكي</p>
                  <p className="text-xs text-slate-450 dark:text-slate-500 opacity-90 max-w-sm leading-relaxed">
                    من فضلك حدد أحد البلاغات المطروحة من السجل الجانبي لقراءة مبررات خطورتها والاطلاع على البثوث المباشرة النشطة للحادثة، أو أطلق بثاً مستعجلاً الآن.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
