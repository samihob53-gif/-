import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, User, ShieldCheck, UserCheck, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { TRANSLATIONS } from "../utils/translations";

interface LoginViewProps {
  onLogin: (user: { email: string; role: "citizen" | "official"; fullName: string }) => void;
  lang: "ar" | "fr" | "zgh";
  isDarkMode: boolean;
}

interface StoredUser {
  email: string;
  passwordHash: string; // Plain text or simple encoding since it's client-side standard persistence
  role: "citizen" | "official";
  fullName: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

export default function LoginView({ onLogin, lang, isDarkMode }: LoginViewProps) {
  const t = TRANSLATIONS[lang];
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [role, setRole] = useState<"citizen" | "official">("citizen");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Seed default test accounts if workspace_registered_users doesn't exist
  useEffect(() => {
    const existingUsers = localStorage.getItem("workspace_registered_users");
    if (!existingUsers) {
      const defaultUsers: StoredUser[] = [
        {
          email: "admin@balaghni.gov",
          passwordHash: "admin123",
          role: "official",
          fullName: "الأستاذ أحمد فؤاد (رئيس المصلحة)"
        },
        {
          email: "citizen@balaghni.gov",
          passwordHash: "citizen123",
          role: "citizen",
          fullName: "صالح بن علي (عضو مسجل)"
        }
      ];
      localStorage.setItem("workspace_registered_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg(lang === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة." : "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Get all registered users from localStorage
    const usersStr = localStorage.getItem("workspace_registered_users") || "[]";
    let usersList: StoredUser[] = [];
    try {
      usersList = JSON.parse(usersStr);
    } catch {
      usersList = [];
    }

    if (isRegister) {
      // REGISTRATION FLOW
      if (!firstName.trim() || !lastName.trim() || !birthDate.trim()) {
        setErrorMsg(
          lang === "ar" 
            ? "يرجى تعبئة الاسم واللقب وتاريخ الميلاد بشكل صحيح." 
            : "Veuillez remplir le nom, le prénom et la date de naissance."
        );
        return;
      }

      // Check if email already registered
      const userExists = usersList.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (userExists) {
        setErrorMsg(lang === "ar" ? "هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول مباشرة." : "Cet email est déjà enregistré.");
        return;
      }

      const finalFullName = `${firstName.trim()} ${lastName.trim()}`;

      const newUser: StoredUser = {
        email: email.trim().toLowerCase(),
        passwordHash: password, // simple storage for localized demonstration
        role: role,
        fullName: finalFullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: birthDate.trim()
      };

      usersList.push(newUser);
      localStorage.setItem("workspace_registered_users", JSON.stringify(usersList));

      setSuccessMsg(lang === "ar" ? "تم تسجيل حسابك بنجاح! جاري تسجيل الدخول التلقائي..." : "Compte créé! Connexion en cours...");
      
      setTimeout(() => {
        onLogin({
          email: newUser.email,
          role: newUser.role,
          fullName: newUser.fullName
        });
      }, 1500);

    } else {
      // LOGIN FLOW
      const matchedUser = usersList.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === password);
      
      if (matchedUser) {
        setSuccessMsg(lang === "ar" ? "مرحباً بك! تم التحقق بنجاح وجاري إعداد جلستك الآمنة..." : "Connexion réussie! Préparation de votre session...");
        
        setTimeout(() => {
          onLogin({
            email: matchedUser.email,
            role: matchedUser.role,
            fullName: matchedUser.fullName
          });
        }, 1200);
      } else {
        setErrorMsg(
          lang === "ar" 
            ? "البريد الإلكتروني أو الرقم السري غير صحيح في سجلاتنا. جرب الحساب التجريبي admin@balaghni.gov بكلمة مرور admin123"
            : "Email ou mot de passe incorrect. Essayez le compte démo admin@balaghni.gov / admin123"
        );
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-zellij-tile transition-colors duration-200 ${isDarkMode ? "dark" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,51,0.1),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(210,16,52,0.08),transparent_45%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-slate-805 rounded-3xl p-6 sm:p-10 shadow-xl relative z-10"
      >
        {/* App Logo Emblem */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-full rounded-2xl overflow-hidden mb-5 border border-emerald-600/10 dark:border-slate-800 shadow-sm">
            <img 
              src="/src/assets/images/baleghni_blue_logo_1781494403562.jpg" 
              alt="Baleghni Logo" 
              className="w-full h-36 object-cover hover:scale-105 transition-transform duration-500 opacity-90"
              referrerPolicy="no-referrer"
            />
            {/* Absolute overlay for prestigious Algerian look */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/10 to-transparent pointer-events-none" />
            
            {/* Algerian rotating circular Flag in Center Header */}
            <div className="absolute top-4 left-4 relative w-12 h-12 rounded-full overflow-hidden border border-white/95 shadow-lg shrink-0 animate-[spin_25s_linear_infinite] hidden sm:block">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <clipPath id="circleClipAlgeriaLogin">
                  <circle cx="50" cy="50" r="50" />
                </clipPath>
                <g clipPath="url(#circleClipAlgeriaLogin)">
                  <rect x="0" y="0" width="50" height="100" fill="#006633" />
                  <rect x="50" y="0" width="50" height="100" fill="#ffffff" />
                  <path d="M 50 25 A 25 25 0 0 0 50 75 A 32 32 0 0 0 50 25" fill="#d21034" />
                  <polygon points="56,39.5 58.4,46.8 66,46.8 59.8,51.2 62.2,58.5 56,54 49.8,58.5 52.2,51.2 46,46.8 53.7,46.8" fill="#d21034" />
                </g>
              </svg>
            </div>
            
            <div className="absolute bottom-3 right-3 text-right text-white">
              <span className="text-[9px] bg-[#d21034] text-white px-2 py-0.5 rounded-md font-bold block w-fit">الموقع الرسمي للدولة</span>
              <span className="text-[10px] text-emerald-305 font-bold block mt-0.5">الجمهورية الجزائرية الديمقراطية الشعبية 🇩🇿</span>
            </div>
          </div>
          
          {/* Circular rotating flag on mobile / small screen fallback */}
          <div className="block sm:hidden relative w-12 h-12 rounded-full overflow-hidden border border-emerald-600/30 shadow-md mb-3 animate-[spin_25s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <clipPath id="circleClipAlgeriaLoginMobile">
                <circle cx="50" cy="50" r="50" />
              </clipPath>
              <g clipPath="url(#circleClipAlgeriaLoginMobile)">
                <rect x="0" y="0" width="50" height="100" fill="#006633" />
                <rect x="50" y="0" width="50" height="100" fill="#ffffff" />
                <path d="M 50 25 A 25 25 0 0 0 50 75 A 32 32 0 0 0 50 25" fill="#d21034" />
                <polygon points="56,39.5 58.4,46.8 66,46.8 59.8,51.2 62.2,58.5 56,54 49.8,58.5 52.2,51.2 46,46.8 53.7,46.8" fill="#d21034" />
              </g>
            </svg>
          </div>

          <div className="p-2.5 bg-gradient-to-tr from-[#006633] via-[#006633] to-[#d21034] rounded-xl text-white shadow-md mb-3 scale-102 hover:rotate-6 transition-transform duration-300">
            <ShieldCheck className="w-5 h-5 animate-pulse text-amber-250" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-905 dark:text-slate-50 tracking-tight">
            {isRegister ? (lang === "ar" ? "بوابة التسجيل الموحدة للجمهورية" : "S'enregistrer sur Balaghni") : (lang === "ar" ? "بوابة الدخول الحكومية الموحدة" : "Connexion à Balaghni")}
          </h1>
          <p className="text-slate-450 dark:text-slate-400 text-xs sm:text-sm font-semibold mt-1.5 max-w-sm">
            {lang === "ar" 
              ? "منصة بلدي وبلغني للمراقبة الحية والنزاهة وصيانة المرافق ببلديات الوطن"
              : "Suivi réactif et transmission instantanée des signalements d'urgence aux services habilités."}
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        {!isRegister && (
          <div className="bg-emerald-50/40 dark:bg-slate-900/40 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl p-4 mb-6 text-xs text-emerald-850 dark:text-emerald-300">
            <span className="font-bold flex items-center gap-1 mb-1">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              {lang === "ar" ? "الحسابات الديمو الرسمية المتوفرة للفحص الفوري:" : "Identifiants de démonstration instantanés :"}
            </span>
            <div className="space-y-1 mt-1 font-mono leading-relaxed">
              <p>📍 <strong className="text-slate-700 dark:text-slate-200">{lang === "ar" ? "رئيس مصلحة:" : "Chef de service :"}</strong> admin@balaghni.gov | <span className="underline select-all bg-emerald-100/60 dark:bg-emerald-950/50 px-1 py-0.5 rounded text-[11px] text-emerald-900 dark:text-emerald-250">admin123</span></p>
              <p>📍 <strong className="text-slate-700 dark:text-slate-200">{lang === "ar" ? "عضو مسجل:" : "Membre :"}</strong> citizen@balaghni.gov | <span className="underline select-all bg-emerald-100/60 dark:bg-emerald-950/50 px-1 py-0.5 rounded text-[11px] text-emerald-900 dark:text-emerald-250">citizen123</span></p>
            </div>
          </div>
        )}

        {/* Warnings & Success banners */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 rounded-xl flex items-start gap-2.5 text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2.5 text-xs font-semibold"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-500 text-white rounded-full font-black text-[10px]">✓</span>
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* First Name, Last Name & Date of Birth (Only for Registration) */}
          {isRegister && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    {lang === "ar" ? "الاسم الأول *" : "Prénom *"}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={lang === "ar" ? "الاسم الشخصي" : "Prénom"}
                      className="w-full pr-10 pl-3 py-2.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-[#131b2e] dark:text-white transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    {lang === "ar" ? "اللقب (العائلة) *" : "Nom de famille *"}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={lang === "ar" ? "اللقب العائلي" : "Nom"}
                      className="w-full pr-10 pl-3 py-2.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-[#131b2e] dark:text-white transition-all font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth Field */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  {lang === "ar" ? "تاريخ الميلاد المعتمد *" : "Date de naissance *"}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-[#131b2e] dark:text-white transition-all font-semibold text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-extrabold text-slate-550 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {lang === "ar" ? "البريد الإلكتروني التابع للحساب *" : "Adresse Email *"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: user@balaghni.gov"
                className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-205 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-[#131b2e] dark:text-white transition-all font-semibold font-mono"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide">
                {lang === "ar" ? "الرقم السري الخاص بك *" : "Mot de passe *"}
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full pr-10 pl-11 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-205 dark:border-slate-705 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-[#131b2e] dark:text-white transition-all font-bold font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* CRITICAL USER REQUIREMENT: Profile selector / "خانتين رئيس مصلحة او مواطن" */}
          {isRegister && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-extrabold text-slate-555 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                {lang === "ar" ? "اختر نوع الصلاحية لمطابقتها بالبوابة *" : "Sélectionnez votre type de profil *"}
              </label>
              
              <div className="grid grid-cols-2 gap-3.5">
                {/* 1. CITIZEN (مواطن) */}
                <button
                  type="button"
                  onClick={() => setRole("citizen")}
                  className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between relative cursor-pointer group ${
                    role === "citizen"
                      ? "border-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10 ring-2 ring-emerald-500/10"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-2 rounded-lg ${role === "citizen" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                      <User className="w-4 h-4" />
                    </div>
                    {role === "citizen" && <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>}
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-slate-805 dark:text-slate-100">
                      {lang === "ar" ? "عضو مسجل (مواطن)" : "Membre"}
                    </span>
                    <span className="block text-[10px] text-slate-405 mt-0.5 leading-tight">
                      {lang === "ar" ? "حرية تامة في النشر والتبليغ وإضافة الملاحظات والمحادثة مع الذكاء الاصطناعي" : "Liberté totale de publication, de signalement et d'échange avec l'IA"}
                    </span>
                  </div>
                </button>

                {/* 2. DEPARTMENT HEAD / SERVICE CHIEF (رئيس مصلحة) */}
                <button
                  type="button"
                  onClick={() => setRole("official")}
                  className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between relative cursor-pointer group ${
                    role === "official"
                      ? "border-rose-600 bg-rose-50/30 dark:bg-rose-900/10 ring-2 ring-rose-500/10"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-2 rounded-lg ${role === "official" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    {role === "official" && <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span>}
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-slate-850 dark:text-slate-100">
                      {lang === "ar" ? "رئيس مصلحة (مسؤول)" : "Chef de service"}
                    </span>
                    <span className="block text-[10px] text-slate-405 mt-0.5 leading-tight">
                      {lang === "ar" ? "مراجعة وتغيير وضع الحالات وإدارة الصيانة للمرافق" : "Superviser les risques et clore les dossiers"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form Action submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#006633] to-[#d21034] hover:from-emerald-800 hover:to-rose-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-98 cursor-pointer mt-2"
          >
            {isRegister 
              ? (lang === "ar" ? "تأكيد التسجيل بالمجلس البلدي 🇩🇿" : "Confirmer l'inscription") 
              : (lang === "ar" ? "تسجيل الدخول الحكومي الآمن" : "Connexion sécurisée")}
          </button>
        </form>

        {/* Modal footer switcher link */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          {isRegister ? (
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {lang === "ar" ? "لديك حساب بالفعل في المنصة؟ " : "Vous possédez déjà un compte? "}
              <button
                onClick={() => {
                  setErrorMsg("");
                  setIsRegister(false);
                }}
                className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 font-bold underline focus:outline-none cursor-pointer"
              >
                {lang === "ar" ? "سجل دخولك هنا" : "Connectez-vous"}
              </button>
            </p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 font-medium font-semibold">
              {lang === "ar" ? "ليس لديك حساب مسجل حتى الآن؟ " : "Nouveau sur la plateforme? "}
              <button
                onClick={() => {
                  setErrorMsg("");
                  setIsRegister(true);
                }}
                className="text-emerald-700 hover:text-[#d21034] dark:text-emerald-400 font-extrabold underline focus:outline-none cursor-pointer"
              >
                {lang === "ar" ? "قم بإنشاء حساب جديد هنا" : "Créez un compte gratuitement"}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
