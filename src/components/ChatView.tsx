import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Send, AlertCircle, Bot, User, Sparkles, Trash2 } from "lucide-react";
import { Message } from "../types";

import { TRANSLATIONS } from "../utils/translations";

interface ChatViewProps {
  onBack: () => void;
  lang?: "ar" | "fr" | "zgh";
}

export default function ChatView({ onBack, lang = "ar" }: ChatViewProps) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS["ar"];

  // Language specific welcome message
  const getWelcomeMessage = () => {
    if (lang === "fr") {
      return "Bienvenue ! Je suis votre assistant intelligent alimenté par le modèle Gemini. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur la gestion du temps, la rédaction, ou l'analyse logistique.";
    }
    if (lang === "zgh") {
      return "ⴰⵣⵓⵍ ⴰⵎⵙⵡⵓⵔ ! ⵏⵛⵉⵏ ⴰⵎⵙⴰⵡⴰⵍ ⴷ ⵊⵉⵎⵉⵏⵉ ! ⵎⴰⵏⵉⴽ ⴰⵙ ⵏⵣⵎⵔ ⴰⴷ ⴽ ⵏⴰⵡⵙ ⴰⵙⵙⴰ ? ⵙⴽⵛⴻⵎ ⵜⵉⴱⴰⵍⴰⵖⵏ ⵏ ⵜⴻⴷⵡⴰⵙⵜ.";
    }
    return "مرحباً بك! أنا مساعدك الذكي المدعوم بنموذج Gemini. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن تنظيم وقتك، صياغة النصوص، أو تحليل المعلومات ماليًا وإداريًا.";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "model",
      content: getWelcomeMessage(),
      timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const getQuickPrompts = () => {
    if (lang === "fr") {
      return [
        "Suggère un plan de gestion des tâches pour l'hôpital 🩺",
        "Rédige un message d'appel d'urgence pour la protection civile 🚨",
        "Donne-moi 3 conseils pour la gestion de crise publique 🏢",
        "Explique le rôle de l'IA dans l'intervention d'urgence 💡",
      ];
    }
    if (lang === "zgh") {
      return [
        "🛡️ ⵜⴰⵡⵔⵉⵇⵜ ⵜⵓⵙⵏⵉⵊⵉⵜ ⵏ ⵊⵉⵎⵉⵏⵉ",
        "🔥 ⵍⴱⵓⵎⴱⵢⴰ ⵏ ⵜⵓⵙⵏⴰ GPS",
        "🏥 ⵜⴻⴷⵡⴰⵙⵜ ⴷ ⵓⵙⴳⵏⴰⴼ",
        "💡 ⵜⵉⵡⴻⵏⴳⵉⵎⵉⵏ ⵏ ⵜⵓⵙⵏⴰ",
      ];
    }
    return [
      "اقترح خطة يومية لتنظيم المهام في المستشفى 🩺",
      "اكتب رسالة طلب دعم عاجل للدفاع المدني بخصوص حريق وموقع 🚨",
      "اعطني 3 نصائح لإدارة الأزمات في المؤسسات الحكومية 🏢",
      "لخص أهمية تتبع المواقع بالذكاء الاصطناعي في الاستجابة الذكية 💡",
    ];
  };

  const quickPrompts = getQuickPrompts();

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    setErrorMsg(null);
    if (!textToSend) setInput("");

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: queryText,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation payload
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الاتصال بالخادم الذكي");
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: data.text,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء إرسال الرسالة.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const getClearConfirmation = () => {
      if (lang === "fr") return "La session a été réinitialisée avec succès. Comment puis-je vous aider à présent ?";
      if (lang === "zgh") return "ⵜⵓⵙⵏⴰ ⵜⴻⴳⴰ ⵎⵓⴼⵉⴷ ⵇⵇⴰⵃ. ⵎⴰⵏⵉⴽ ⴰⵙ ⵏⵣⵎⵔ ⴰⴷ ⴽ ⵏⴰⵡⵙ ⴰⵙⵙⴰ ?";
      return "تمت إعادة تشغيل الجلسة بنجاح. كيف يمكنني مساعدتك الآن؟";
    };

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        content: getClearConfirmation(),
        timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "fr-FR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors cursor-pointer"
            title={lang === "ar" ? "العودة للرئيسية" : lang === "fr" ? "Retour à l'accueil" : "ⴰⵙⵓⵔ"}
          >
            <ArrowRight className={`w-5 h-5 transform ${lang !== "ar" ? "rotate-180" : ""}`} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              {t.chat}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === "ar" ? "متصل بنموذج المساعد الذكي" : lang === "fr" ? "Connecté au modèle Assistant IA" : "ⵊⴻⵔⵉ ⴰⵎⵙⴰⵡⴰⵍ ⴷ ⵊⵉⵎⵉⵏⵉ"}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title={lang === "ar" ? "مسح المحادثة" : lang === "fr" ? "Effacer le chat" : "ⵙⴼⵙⵔ"}
        >
          <Trash2 className="w-4 h-4" />
          <span>{lang === "ar" ? "مسح الشات" : lang === "fr" ? "Effacer" : "ⵙⴼⵙⵔ"}</span>
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2 rounded-2xl bg-slate-50 border border-slate-100/50 p-4 mb-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "user"
                  ? lang === "ar"
                    ? "mr-auto flex-row-reverse"
                    : "ml-auto flex-row-reverse"
                  : lang === "ar"
                  ? "ml-auto"
                  : "mr-auto"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl flex items-center justify-center self-end shadow-xs ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />}
              </div>

              <div className="flex flex-col space-y-1">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-xs"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 font-mono px-2 self-start">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex gap-3 max-w-[80%] ${lang === "ar" ? "ml-auto" : "mr-auto"}`}>
            <div className="p-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 flex items-center justify-center self-end shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-100 shadow-xs px-5 py-3.5 rounded-2xl rounded-bl-none flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </motion.div>
        )}

        {/* Informative Error Bubble */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <div className="space-y-1">
              <p className="font-bold">{lang === "ar" ? "فشل إرسال الطلب" : lang === "fr" ? "Échec de l'envoi" : "ⴽⵛⵛⵓⵎ"}</p>
              <p className="text-xs leading-relaxed opacity-90">{errorMsg}</p>
              {errorMsg.includes("Secrets") && (
                <div className="mt-2 text-xs text-rose-700 font-medium">
                  {lang === "ar" ? (
                    <span>💡 تلميح: توجه إلى القائمة الجانبية في AI Studio وانقر على <b>Settings</b> ثم اضف مفتاح <b>GEMINI_API_KEY</b> الخاص بك ليتم تفعيل الذكاء الاصطناعي بشكل كامل.</span>
                  ) : (
                    <span>💡 Indice: Allez dans <b>Settings</b> puis ajoutez votre clé <b>GEMINI_API_KEY</b> dans vos secrets pour activer pleinement l'IA.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick starters on empty/initial states */}
      {messages.length <= 1 && !isLoading && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 mb-2">
            {lang === "ar" ? "💡 جرب الأسئلة السريعة المقترحة:" : lang === "fr" ? "💡 Suggestions de requêtes rapides:" : "💡 ⵜⵉⵡⴻⵏⴳⵉⵎⵉⵏ:"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPrompts.map((prom, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prom)}
                className={`text-xs bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-slate-600 p-2.5 rounded-xl transition-all cursor-pointer shadow-2xs ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {prom}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isLoading
              ? lang === "ar"
                ? "يرجى الانتظار حتى استكمال الرد..."
                : "Veuillez patienter..."
              : lang === "ar"
              ? "اكتب رسالتك للمساعد الذكي هنا..."
              : "Écrivez votre message ici..."
          }
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-xs transition-shadow"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:shadow-sm"
        >
          <Send className={`w-5 h-5 transform ${lang === "ar" ? "rotate-180" : ""}`} />
        </button>
      </form>
    </div>
  );
}
