import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to lazy-initialize GoogleGenAI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. API Route: Chat with Gemini in Arabic
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "يجب إرسال مصفوفة الرسائل 'messages'" });
    }

    const ai = getGeminiClient();

    // Map the client message roles to 'user' and 'model' as required by @google/genai SDK
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const systemInstruction = 
      "أنت 'مساعدي الشامل'، مساعد شخصي ذكي وودود تتحدث باللغة العربية بطلاقة وأسلوب مهني دافئ. " +
      "أجب باختصار ووضوح، وقدم الدعم للمستخدم في تنظيم المهام وحل المشكلات والاستفسارات المتنوعة.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    if (error.message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "مفتاح Gemini API غير متاح. يرجى إضافته في لوحة Secrets في AI Studio ليتمكن التطبيق من العمل الذكي.",
        code: "NO_API_KEY",
      });
    }
    res.status(500).json({ error: "حدث خطأ أثناء معالجة طلبك: " + error.message });
  }
});

// 2. API Route: Optimize Note in Arabic
app.post("/api/improve-note", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "محتوى الملاحظة مطلوب لتطويرها" });
    }

    const ai = getGeminiClient();

    const prompt = 
      `قم بتحسين وتنسيق هذه الملاحظة باللغة العربية وصحح أي أخطاء إملائية فيها، وقسمها لفقرات واضحة مع إعطائها عنواناً منسقاً.\n\n` +
      `العنوان الحالي: ${title || "غير محدد"}\n` +
      `المحتوى الحالي:\n${content}`;

    const systemInstruction = 
      "أنت خبير صياغة نصوص وتنظيم ملاحظات. أصلح الأخطاء اللغوية واجعل التنسيق جميلاً ومريحاً للقراءة باستخدام علامات الترقيم والقوائم النقطية إذا لزم الأمر. أرجع الإجابة بصيغة JSON نظيفة تحت مفاتيح: title و content.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    try {
      const resultObj = JSON.parse(response.text || "{}");
      res.json(resultObj);
    } catch {
      // Fallback if formatting was not perfect json
      res.json({ title: title, content: response.text });
    }
  } catch (error: any) {
    console.error("Improve Note Error:", error);
    if (error.message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "مفتاح Gemini API غير متاح لتطوير الملاحظة.",
        code: "NO_API_KEY",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// 3. API Route: Analyze Report & Suggest Solutions
app.post("/api/analyze-report", async (req, res) => {
  try {
    const { title, department, description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "وصف البلاغ مطلوب لتحليله" });
    }

    const ai = getGeminiClient();

    const prompt = 
      `قم بتحليل البلاغ التالي الموجه إلى قسم: ${department}\n` +
      `عنوان البلاغ: ${title}\n` +
      `تفاصيل المشكلة:\n${description}`;

    const systemInstruction = 
      "أنت نظام ذكي موجه لمراجعي وصانعي القرار في المؤسسات. قم بتحليل المشكلة الموصوفة وصياغة: " +
      "1. تلخيص للمشكلة في سطر واحد خالي من التعقيد.\n" +
      "2. توصيات وحلول عملية مقترحة فورية يمكن تنفيذها لحل المشكلة.\n" +
      "3. تقدير لمستوى الأولوية (أولوية قصوى، متوسطة، منخفضة) مع ذكر السبب باختصار.\n" +
      "أرجع الإجابة حصراً بصيغة JSON بالهيكل التالي:\n" +
      "{\n" +
      '  "summary": "تلخيص المشكلة هنا",\n' +
      '  "solutions": ["الحل الأول", "الحل الثاني", ...],\n' +
      '  "priority": "مستوى الأولوية",\n' +
      '  "priorityReason": "سبب تقدير هذه الأولوية"\n' +
      "}";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    try {
      const resultObj = JSON.parse(response.text || "{}");
      res.json(resultObj);
    } catch {
      res.json({
        summary: "تحليل البلاغ قيد المراجعة الفنية.",
        solutions: ["يرجى مراجعة البلاغ يدوياً والتواصل مع القسم المختص للحصول على التوجيهات."],
        priority: "متوسطة",
        priorityReason: "لم يتسن تحليل الأولوية آليًا بسبب خطأ في تنسيق الاستجابة."
      });
    }
  } catch (error: any) {
    console.error("Analyze Report Error:", error);
    if (error.message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "مفتاح Gemini API غير متاح لتحليل البلاغات.",
        code: "NO_API_KEY",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// 4. API Route: Generate Formal Administrative Document
app.post("/api/generate-document", async (req, res) => {
  try {
    const { docType, docRecipient, docSender, docPurpose } = req.body;
    if (!docType || !docRecipient || !docPurpose) {
      return res.status(400).json({ error: "جميع المعلومات (نوع الوثيقة، الجهة المرسل إليها، الغرض) مطلوبة" });
    }

    const ai = getGeminiClient();

    let docTypeName = "طلب رسمي";
    if (docType === "application") docTypeName = "طلب خطي رسمي";
    if (docType === "appeal") docTypeName = "خطاب تظلم إداري رسمي";
    if (docType === "minutes") docTypeName = "محضر اجتماع رسمي المضمون";
    if (docType === "licence") docTypeName = "طلب شهادة / ترخيص إداري";

    const prompt = 
      `أنت خبير صياغة وثائق خطية ومراسلات إدارية حكومية وخاصة بليغ باللغة العربية.\n` +
      `المطلوب: صياغة ${docTypeName} رسمي بأسلوب إداري متميز ورفيع المستوى.\n\n` +
      `البيانات المدخلة:\n` +
      `- الجهة المرسل إليها الخطاب: ${docRecipient}\n` +
      `- اسم مقدم الطلب/ المرسل: ${docSender || "عضو مسجل بالمنصة"}\n` +
      `- الغرض والتفاصيل الأساسية:\n${docPurpose}\n\n` +
      `التعليمات الفنية المحتمة:\n` +
      `1. ابدأ بـ "بسم الله الرحمن الرحيم" في منتصف السطر العلوي.\n` +
      `2. وجه تحية تقدير وإعظام بليغة تليق بمقام المرسل إليه (مثال: "السلام عليكم ورحمة الله وبركاته... أما بعد،").\n` +
      `3. ادخل في صلب الموضوع مباشرة بصياغة لغوية خالية من الحشو وذات حجة قانونية وإدارية قوية.\n` +
      `4. استخدم تنظيم الفقرات وعلامات الترقيم بشكل دقيق جداً.\n` +
      `5. اختم بعبارة رجاء وأمل رفيعة المستوى يليها الشكر الوافر (مثال: "وتفضلوا بقبول وافر الاحترام والامتنان والتقدير").\n` +
      `6. أضف تذييل للخطاب مخصص للتوقيع والتاريخ، منسق بالجهة اليسرى السفلى.\n` +
      `7. صغ الخطاب كاملاً باللغة العربية الفصحى الرصينة والجميلة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت كاتب ديواني محترف ومترجم شؤون عامة. صغ الخطابات الإدارية ببراعة لغوية متناهية وتنسيق ورقي احترافي للغاية.",
        temperature: 0.6,
      },
    });

    res.json({ documentText: response.text });
  } catch (error: any) {
    console.error("Generate Document Error:", error);
    if (error.message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "مفتاح Gemini API غير متاح لإنشاء الوثائق الإدارية.",
        code: "NO_API_KEY",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// 5. API Route: Analyze Corruption Complaint & Whistleblower Guidance
app.post("/api/analyze-corruption", async (req, res) => {
  try {
    const { subject, department, description } = req.body;
    if (!description || !subject) {
      return res.status(400).json({ error: "عنوان البلاغ والوصف مطلوبان للتحليل والوقاية" });
    }

    const ai = getGeminiClient();

    const prompt = 
      `التصنيف الجاري: تبليغ عن فساد إداري ومراجعة وقائية بالذكاء الاصطناعي.\n` +
      `تفاصيل القضية المدخلة:\n` +
      `- الموضوع الرئيس: ${subject}\n` +
      `- الجهة الإدارية المعنية: ${department}\n` +
      `- مذكرات وتفاصيل التجاوز:\n${description}\n\n` +
      `الرجاء صياغة استجابة رصينة وهادئة للمبلغ تغطي المحاور التالية وبشكل واضح من خلال خط مميز وعناوين نقطية:\n` +
      `1. 🛡️ التقييم القانوني الأولي لأثر المخالفة (بشكل عام، كيف يوصف هذا التجاوز إدارياً).\n` +
      `2. 📑 وسائل الإثبات اللوجستية المطلوبة (تنصح المبلغ بالبحث عن أي مستندات، وثائق، أو شهادات تدعم صحة البلاغ لسلامة الإجراء).\n` +
      `3. 🔒 إرشادات الحماية والسرية للهوية الشخصية (توجيهات هامة للمبلغ لحماية حقوقه القانونية وسرية معلوماته بموجب قوانين حماية المبلغين والنزاهة ومكافحة الفساد).\n` +
      `اجعل الخطاب يفيض بالثقة والمصداقية والتشجيع على النزاهة وحماية المصلحة الوطنية العامة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت مستشار قانوني مالي وإداري وقائي مختص بشؤون النزاهة والشفافية وحوكمة القطاعات. قدم إرشادات دقيقة ووقائية باللغة العربية الفصحى الهادئة والمهنية.",
        temperature: 0.5,
      },
    });

    res.json({ adviceText: response.text });
  } catch (error: any) {
    console.error("Analyze Corruption Error:", error);
    if (error.message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "مفتاح Gemini API غير متاح لتحليل شكاوى النزاهة والفساد.",
        code: "NO_API_KEY",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// 6. API Route: Send Push Notification via OneSignal REST API securely
app.post("/api/onesignal/send", async (req, res) => {
  try {
    const { appId, apiKey, title, message, url } = req.body;

    const finalAppId = appId || process.env.ONESIGNAL_APP_ID;
    const finalApiKey = apiKey || process.env.ONESIGNAL_API_KEY;

    if (!finalAppId || !finalApiKey) {
      return res.status(400).json({
        error: "لم يتم تكوين معلمات OneSignal بشكل كافٍ. يرجى توفير App ID و API key الصالحين في الإعدادات أو المتغيرات البيئية لـ OneSignal."
      });
    }

    if (!title || !message) {
      return res.status(400).json({ error: "عنوان الإشعار ومحتوى الرسالة مطلوبان للإرسال" });
    }

    const payload = {
      app_id: finalAppId,
      included_segments: ["Subscribers"],
      headings: {
        en: title,
        ar: title
      },
      contents: {
        en: message,
        ar: message
      },
      url: url || undefined
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${finalApiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Check if response status is OK
    if (response.status >= 200 && response.status < 300) {
      res.json({ success: true, response: data });
    } else {
      res.status(response.status).json({ success: false, error: data });
    }
  } catch (error: any) {
    console.error("OneSignal Send Api Error:", error);
    res.status(500).json({ error: "حدث خطأ غير متوقع أثناء إرسال الإشعار عبر OneSignal: " + error.message });
  }
});

// Serve static assets in production, and delegate to Vite in development
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
