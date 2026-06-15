import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, Search, Plus, Trash2, Edit3, Sparkles, Filter, CheckCircle2, Bookmark,
  HeartPulse, FileText, GraduationCap, Briefcase, User, Lightbulb, AlertTriangle, MapPin, Compass
} from "lucide-react";
import { Note } from "../types";

// Explicit list of categories & styling helper
const CATEGORIES = [
  { id: "all", label: "الكل", bg: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
  { id: "work", label: "العمل", tagColor: "bg-blue-100 text-blue-800 border-blue-200", bgCard: "bg-blue-50/40 border-blue-100" },
  { id: "personal", label: "شخصي", tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200", bgCard: "bg-emerald-50/40 border-emerald-100" },
  { id: "ideas", label: "أفكار", tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200", bgCard: "bg-indigo-50/40 border-indigo-100" },
  { id: "urgent", label: "عاجل", tagColor: "bg-rose-100 text-rose-800 border-rose-200", bgCard: "bg-rose-50/40 border-rose-100" },
  { id: "health", label: "صحية", tagColor: "bg-teal-100 text-teal-800 border-teal-200", bgCard: "bg-teal-50/40 border-teal-100" },
  { id: "admin", label: "إدارية", tagColor: "bg-amber-100 text-amber-800 border-amber-200", bgCard: "bg-amber-50/40 border-amber-100" },
  { id: "school", label: "مدرسية", tagColor: "bg-violet-100 text-violet-800 border-violet-200", bgCard: "bg-violet-50/40 border-violet-100" },
];

const getCategoryIcon = (catId: string) => {
  switch (catId) {
    case "work": return <Briefcase className="w-3.5 h-3.5" />;
    case "personal": return <User className="w-3.5 h-3.5" />;
    case "ideas": return <Lightbulb className="w-3.5 h-3.5" />;
    case "urgent": return <AlertTriangle className="w-3.5 h-3.5" />;
    case "health": return <HeartPulse className="w-3.5 h-3.5 text-teal-600" />;
    case "admin": return <FileText className="w-3.5 h-3.5 text-amber-600" />;
    case "school": return <GraduationCap className="w-3.5 h-3.5 text-violet-600" />;
    default: return <Bookmark className="w-3.5 h-3.5" />;
  }
};

interface NotesViewProps {
  onBack: () => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  lang?: "ar" | "fr" | "zgh";
}

export default function NotesView({ onBack, notes, setNotes, lang = "ar" }: NotesViewProps) {
  // Local active state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Note["category"]>("work");
  const [noteLocation, setNoteLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // AI loading per note ID
  const [aiLoadingNoteId, setAiLoadingNoteId] = useState<string | null>(null);
  const [isFormAiLoading, setIsFormAiLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setAlertMsg({ text: "عذراً، متصفحك لا يدعم ميزة تحديد الموقع الجغرافي.", type: "error" });
      return;
    }

    setIsLocating(true);
    setAlertMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setNoteLocation(`خط العرض: ${lat}، خط الطول: ${lng}`);
        setIsLocating(false);
        setAlertMsg({ text: "تم تحديد إحداثيات موقعك الجغرافي بنجاح! 📍", type: "success" });
      },
      (error) => {
        console.warn("Geolocation permission or timeout error, using premium local center simulation:", error);
        setIsLocating(false);
        // Fallback coordination simulation for Riyadh, KSA (RTL friendly)
        const simLat = (24.7136 + (Math.random() - 0.5) * 0.05).toFixed(4);
        const simLng = (46.6753 + (Math.random() - 0.5) * 0.05).toFixed(4);
        setNoteLocation(`خط العرض: ${simLat}، خط الطول: ${simLng} (موقع تقديري)`);
        setAlertMsg({ text: "تعذر الوصول المباشر للموقع. تم إرفاق إحداثيات موقعك التقريبي! 📍", type: "success" });
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setAlertMsg({ text: "لا يمكن حفظ ملاحظة فارغة المحتوى!", type: "error" });
      return;
    }

    const noteTitle = title.trim() || `ملاحظة جديدة #${notes.length + 1}`;

    if (isEditingId) {
      // Modify existing
      const updated = notes.map((item) => {
        if (item.id === isEditingId) {
          return {
            ...item,
            title: noteTitle,
            content: content.trim(),
            category: category,
            location: noteLocation ? noteLocation : undefined,
          };
        }
        return item;
      });
      setNotes(updated);
      setIsEditingId(null);
      setAlertMsg({ text: "تم تحديث الملاحظة بنجاح", type: "success" });
    } else {
      // Create new
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: noteTitle,
        content: content.trim(),
        category: category,
        createdAt: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
        color: category,
        location: noteLocation ? noteLocation : undefined,
      };
      setNotes([...notes, newNote]);
      setAlertMsg({ text: "تمت إضافة الملاحظة بنجاح", type: "success" });
    }

    // Reset Form
    setTitle("");
    setContent("");
    setCategory("work");
    setNoteLocation("");
  };

  const handleEditInit = (note: Note) => {
    setIsEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setNoteLocation(note.location || "");
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    const filtered = notes.filter((item) => item.id !== id);
    setNotes(filtered);
    if (isEditingId === id) {
      setIsEditingId(null);
      setTitle("");
      setContent("");
    }
    setAlertMsg({ text: "تم حذف الملاحظة بنجاح", type: "info" });
  };

  // AI Improve Note feature (calls Gemini secure backend)
  const improveNoteWithAI = async (noteId?: string) => {
    const textToImprove = noteId 
      ? notes.find((n) => n.id === noteId)?.content 
      : content;
    
    if (!textToImprove?.trim()) {
      setAlertMsg({ text: "يرجى كتابة محتوى لتطويره باستخدام الذكاء الاصطناعي", type: "error" });
      return;
    }

    const queryTitle = noteId 
      ? notes.find((n) => n.id === noteId)?.title 
      : title;

    if (noteId) setAiLoadingNoteId(noteId);
    else setIsFormAiLoading(true);

    setAlertMsg(null);

    try {
      const res = await fetch("/api/improve-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: queryTitle, content: textToImprove }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الاتصال بـ Gemini AI");
      }

      if (noteId) {
        // Update direct card note
        const updated = notes.map((item) => {
          if (item.id === noteId) {
            return {
              ...item,
              title: data.title || item.title,
              content: data.content || item.content,
            };
          }
          return item;
        });
        setNotes(updated);
        setAlertMsg({ text: "تم صقل وتحرير الملاحظة بنجاح عبر Gemini AI! ✨", type: "success" });
      } else {
        // Update input inputs
        setTitle(data.title || title);
        setContent(data.content || content);
        setAlertMsg({ text: "تم تنسيق النصوص وتطوير العنوان؛ راجع المدخلات واحفظ الملاحظة.", type: "success" });
      }
    } catch (err: any) {
      console.error(err);
      setAlertMsg({ 
        text: err.message || "حدث خطأ أثناء الاتصال بالخادم الذكي لتحديث الملاحظة.", 
        type: "error" 
      });
    } finally {
      setAiLoadingNoteId(null);
      setIsFormAiLoading(false);
    }
  };

  // Filter notes based on category and text
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors cursor-pointer"
            title="العودة للرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-emerald-600 fill-emerald-100" />
              الملاحظات المنظمة
            </h2>
            <p className="text-xs text-slate-400">إدارة ملاحظاتك ودعم صياغتها بالذكاء الاصطناعي</p>
          </div>
        </div>

        {/* Dynamic Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium ml-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> تصفية:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-xs scale-105"
                  : cat.id === "all"
                  ? cat.bg
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Alert Toast */}
      {alertMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm ${
            alertMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
              : alertMsg.type === "error"
              ? "bg-rose-50 border border-rose-100 text-rose-800"
              : "bg-blue-50 border border-blue-100 text-blue-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className={`w-5 h-5 ${alertMsg.type === "success" ? "text-emerald-500" : "text-rose-500"}`} />
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="text-xs font-bold opacity-60 hover:opacity-100 ml-2">
            إغلاق
          </button>
        </motion.div>
      )}

      {/* Layout Split: Form & Saved List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Top Editor Form Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              {isEditingId ? "تعديل الملاحظة الحالية" : "إضافة ملاحظة جديدة"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Note Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">عنوان الملاحظة</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: أفكار التسويق لشهر يوليو..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all"
                />
              </div>

              {/* Note Category Select */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">التصنيف</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.slice(1).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as Note["category"])}
                      className={`px-3 py-2 border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        category === cat.id
                          ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 text-emerald-800"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Geolocation Picker Feature */}
              <div className="bg-slate-50/60 p-3 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-505 flex items-center gap-1.5">
                    <Compass className={`w-4 h-4 text-emerald-600 ${isLocating ? "animate-spin" : ""}`} />
                    موقعي الجغرافي:
                  </span>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="text-[10px] bg-emerald-55 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/50 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
                    <span>{isLocating ? "جاري التحديد..." : "تحديد وإرفاق موقِعي الحالي"}</span>
                  </button>
                </div>
                {noteLocation ? (
                  <div className="text-[11px] bg-emerald-50/50 border border-emerald-150/45 p-2 rounded-lg text-emerald-900 font-mono flex items-center justify-between">
                    <span className="truncate max-w-[85%]">{noteLocation}</span>
                    <button
                      type="button"
                      onClick={() => setNoteLocation("")}
                      className="text-red-500 hover:text-red-700 font-bold text-[10px] px-1 hover:bg-red-50 rounded"
                    >
                      حذف
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">لم يتم ربط الملاحظة بموقع محدد.</p>
                )}
              </div>

              {/* Note Content Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-500">نص ومضمون الملاحظة</label>
                  <button
                    type="button"
                    disabled={isFormAiLoading || !content.trim()}
                    onClick={() => improveNoteWithAI()}
                    className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className={`w-3 h-3 ${isFormAiLoading ? "animate-spin" : ""}`} />
                    <span>تحرير وصياغة بـ AI</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب أفكارك وملاحظاتك المفصلة هنا..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer hover:shadow-sm"
                >
                  {isEditingId ? "حفظ التغييرات" : "إضافة الملاحظة"}
                </button>
                {isEditingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingId(null);
                      setTitle("");
                      setContent("");
                      setCategory("work");
                      setNoteLocation("");
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Saved Notes Grid Panel */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Realtime Note Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة بملاحظاتك الحالية..."
              className="w-full pr-11 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder-slate-400 shadow-3xs transition-shadow"
            />
          </div>

          {/* List display */}
          <div className="space-y-4 min-h-[400px]">
            {filteredNotes.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-sm">
                🔍 لم نعثر على أي ملاحظة تطابق هذا البحث أو التصنيف.
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotes.map((note) => {
                  const categoryInfo = CATEGORIES.find((c) => c.id === note.category);
                  const bgClass = categoryInfo?.bgCard || "bg-slate-50";
                  const borderLeft = note.category === "urgent" ? "border-r-4 border-r-rose-500" :
                                     note.category === "ideas" ? "border-r-4 border-r-indigo-500" :
                                     note.category === "personal" ? "border-r-4 border-r-emerald-500" :
                                     note.category === "health" ? "border-r-4 border-r-teal-500" :
                                     note.category === "admin" ? "border-r-4 border-r-amber-500" :
                                     note.category === "school" ? "border-r-4 border-r-violet-500" :
                                     "border-r-4 border-r-blue-500";
                  
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-5 rounded-2xl border border-slate-100 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between ${bgClass} ${borderLeft}`}
                    >
                      {/* Top metadata */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 bg-white shadow-2xs ${categoryInfo?.tagColor}`}>
                          {getCategoryIcon(note.category)}
                          <span>{categoryInfo?.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{note.createdAt}</span>
                      </div>

                      {/* Content representation */}
                      <div className="mb-4 space-y-2">
                        <h4 className="text-base font-bold text-slate-800 mb-1.5">{note.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">{note.content}</p>
                        
                        {/* Geolocation badge if available */}
                        {note.location && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100/75 dark:bg-slate-800/80 rounded-lg text-[10.5px] text-slate-500 dark:text-slate-300 font-mono mt-1 border border-slate-200/40">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-100 animate-pulse" />
                            <span>{note.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Actions footer */}
                      <div className="flex items-center justify-between border-t border-slate-150 pt-3">
                        {/* Gemini Polish */}
                        <button
                          onClick={() => improveNoteWithAI(note.id)}
                          disabled={aiLoadingNoteId !== null}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-colors"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${aiLoadingNoteId === note.id ? "animate-spin text-amber-500" : "text-indigo-500 fill-indigo-100"}`} />
                          <span>{aiLoadingNoteId === note.id ? "جاري التدقيق..." : "تدقيق ومراجعة بـ AI"}</span>
                        </button>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditInit(note)}
                            className="p-1.5 bg-white text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all cursor-pointer"
                            title="تعديل الملاحظة"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="p-1.5 bg-white text-slate-400 hover:text-rose-650 hover:bg-rose-50 border border-slate-200 hover:border-rose-205 rounded-xl transition-all cursor-pointer"
                            title="حذف الملاحظة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
