export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  home: string;
  chat: string;
  notes: string;
  reports: string;
  current_date: string;
  current_time: string;
  language: string;
  citizen: string;
  official: string;
  citizen_portal: string;
  official_portal: string;
  select_identity: string;
  change_identity: string;
  code_verification: string;
  code_hint: string;
  error_code: string;
  verify_btn: string;
  closing_portal: string;
  geo_manager: string;
  geo_description: string;
  active_coordinates: string;
  update_coordinates: string;
  health_sector: string;
  admin_sector: string;
  school_sector: string;
  emergency_title: string;
  emergency_subtitle: string;
  fire_btn: string;
  hospital_btn: string;
  locate_high_precision: string;
  satellites_active: string;
  accuracy: string;
  latitude: string;
  longitude: string;
  altitude: string;
  speed: string;
  locating_high: string;
  established_precision: string;
  call_direct: string;
  share_gps: string;
  cancel: string;
  work: string;
  personal: string;
  ideas: string;
  urgent: string;
  health: string;
  admin: string;
  school: string;
  hospital_manager: string;
  school_director: string;
  municipal_director: string;
  beds_status: string;
  attendance_status: string;
  licensing_decisions: string;
  winter_timings: string;
  auth_success: string;
  dashboardDesc: string;
  todayDate: string;
  currentTime: string;
  notesCount: string;
  reportsCount: string;
  emergencyCallTitle: string;
  emergencyCallSub: string;
  emergencyDesc: string;
  fireDept: string;
  ambulance: string;
  chatTitle: string;
  chatDesc: string;
  startChat: string;
  notesTitle: string;
  notesDesc: string;
  openNotes: string;
  reportsTitle: string;
  reportsDesc: string;
  openReports: string;
}

export const TRANSLATIONS: Record<"ar" | "fr" | "zgh", TranslationDict> = {
  ar: {
    appName: "بلغني",
    appSubtitle: "منصة البلاغات الذكية وخدمات المراقبة الجغرافية للدفاع المدني والمستشفيات",
    home: "الرئيسية",
    chat: "الدردشة الذكية",
    notes: "الملاحظات الخرائطية",
    reports: "التبليغ والبلاغات",
    current_date: "تاريخ اليوم",
    current_time: "التوقيت الحالي",
    language: "اللغة / Language",
    citizen: "عضو",
    official: "مسؤول في الدولة",
    citizen_portal: "بوابة الأعضاء العامة",
    official_portal: "لوحة تحكم المسؤول (مراقبة النشاط)",
    select_identity: "هل أنت مسؤول أم عضو مسجل؟ الرجاء اختيار الهوية لتسهيل الخدمة وتوفير الصلاحيات:",
    change_identity: "تغيير نوع الهوية والقطاع",
    code_verification: "تفعيل صلاحيات المسؤول للرقابة والتحليل",
    code_hint: "أدخل رمز التحقق لمؤسستك (مثال: مدير مشفى MED123، بلدية ADM123، مدرسة EDU123)",
    error_code: "رمز التحقق غير صحيح! يرجى الاستعانة برموز التلميح للتسهيل.",
    verify_btn: "تحقق واعتماد للدخول إلى غرفة العمليات والرقابة",
    closing_portal: "إغلاق نافذة الخدمة",
    geo_manager: "مدير الموقع والخِدْمات الجغرافية الشاملة",
    geo_description: "استعن بنظام تحديد المواقع GPS عالي الدقة (High Accuracy GLONASS) لربط إبلاغاتك بالمنصات الخدمية بكفاءة استباقية غايتها سرعة الاستجابة.",
    active_coordinates: "إحداثيات تحديد المواقع النشطة",
    update_coordinates: "تحديث واستدعاء إحداثيات موقعي بدقة فائقة 🛰️",
    health_sector: "مصنف صحي (المستشفى)",
    admin_sector: "مصنف إداري (شؤون بلدية)",
    school_sector: "مصنف مدرسي (إدارة التعليم)",
    emergency_title: "مركز الاتصال الطارئ بالجهات الوصية فورا بلمسة واحدة",
    emergency_subtitle: "عند رصد حريق أو حالة طبية مستعجلة، سيقوم التطبيق بتتبع موقعك الحالي بدقة مليمترية وإعداد قناة اتصال مباشرة مع المسؤولين والمسعفين لنقل الإحداثيات فوراً.",
    fire_btn: "🚨 تبليغ عاجل عن حريق (الدفاع المدني)",
    hospital_btn: "🚑 استدعاء إسعاف فوري (المستشفى)",
    locate_high_precision: "تحديد الموقع بأقصى دقة خدمة (GPS High Accuracy)",
    satellites_active: "الأقمار الصناعية المتصلة للتدقيق الجغرافي",
    accuracy: "نسبة الدقة الخطأ",
    latitude: "خط العرض",
    longitude: "خط الطول",
    altitude: "الارتفاع فوق سطح البحر",
    speed: "سرعة دقة الربط",
    locating_high: "جاري البحث واستقطاب الإحداثيات من الأقمار الصناعية...",
    established_precision: "تم تحديد إحداثيات موقعك بنجاح من مستشعرات الأقمار الصناعية الجاري تعقبها!",
    call_direct: "إجراء اتصال صوتي مباشر مع الدفاع المدني أو المستشفى 📞",
    share_gps: "تصدير الإحداثيات التكتيكية وموقعي بدقة 🛰️",
    cancel: "إلغاء وتراجع",
    work: "شؤون عمل",
    personal: "حياة شخصية",
    ideas: "أفكار ملهمة",
    urgent: "هام وعاجل",
    health: "ملفات صحية",
    admin: "سجلات إدارية",
    school: "شأن تعليمي",
    hospital_manager: "المدير الولائي للصحة والمؤسسات الاستشفائية",
    school_director: "مدير ثانوية الأمير عبد القادر بالجزائر الوسطى",
    municipal_director: "رئيس المجلس الشعبي البلدي (P.C.P)",
    beds_status: "شاغر الأسرة السريرية بالعناية الفائقة بمؤسستك",
    attendance_status: "نسبة حضور ومواظبة المنتسبين وتحديثها",
    licensing_decisions: "قرارات تراخيص المنشآت قيد المراجعة الفورية",
    winter_timings: "تعديل الجدول إلى الأوقات الشتوية في المصلحة",
    auth_success: "مرحباً بالمسؤول. تم التحقق من هويتك بنجاح لتفعيل نظام المراقبة لمؤسستك:",
    dashboardDesc: "مرحباً بك في منصة بلغني للرعاية والاستجابة الذكية.",
    todayDate: "تاريخ اليوم",
    currentTime: "الوقت الحالي",
    notesCount: "ملاحظات",
    reportsCount: "بلاغات نشطة",
    emergencyCallTitle: "مركز الطوارئ السريع (الاتصال المباشر)",
    emergencyCallSub: "هل تحتاج مساعدة عاجلة؟ تواصل فوراً بلمسة زر",
    emergencyDesc: "نظام إنقاذ متطور يربطك مباشرة بالدفاع المدني (الحرائق) أو الإسعاف الطبي (المستشفى) مع استدعاء إحداثيات موقعك الجغرافي ذي الدقة المتناهية تلقائياً وإرسالها إلى مركز التحكم.",
    fireDept: "إبلاغ عن حريق (الدفاع المدني)",
    ambulance: "مستشفى عاجل (إسعاف طبي)",
    chatTitle: "المساعد الذكي للدردشة",
    chatDesc: "تواصل مع المساعد الذكي المدعوم بـ Gemini AI للإجابة عن أسئلتك، ترجمة النصوص وصياغتها وصناعة الاقتراحات السديدة.",
    startChat: "ابدأ المحادثة الفورية",
    notesTitle: "مدونة الملاحظات الجغرافية",
    notesDesc: "سجل أفكارك، مهامك اليومية وملاحظاتك الشخصية في بيئة آمنة للمتابعة والتنظيم الفعال.",
    openNotes: "افتح لوحة الملاحظات",
    reportsTitle: "نظام البلاغات والاتصال",
    reportsDesc: "أرسل بلاغات الصيانة، الدعم التقني وأعطال الحريق أو الصحة، وحدد موقعك بدقة فائقة ليتم تتبعها.",
    openReports: "تقديم ومتابعة البلاغات",
  },
  fr: {
    appName: "Balaghni (بلغني)",
    appSubtitle: "Plateforme intelligente de signalement de sécurité, de géolocalisation haute précision et de contrôle pour Protection Civile et Hôpitaux",
    home: "Accueil",
    chat: "Chat Intelligent",
    notes: "Notes Cartographiques",
    reports: "Déclaration de Risques",
    current_date: "Date d'aujourd'hui",
    current_time: "Heure actuelle",
    language: "Langue / Language",
    citizen: "Citoyen",
    official: "Responsable / Officiel",
    citizen_portal: "Portail Citoyen Public",
    official_portal: "Panneau d'administration d'institution (Suivi en direct)",
    select_identity: "Êtes-vous responsable institutionnel ou citoyen ? Choisissez votre rôle pour activer les droits d'accès correspondants :",
    change_identity: "Modifier l'identité et le secteur",
    code_verification: "Validation de Niveau d'Habilitation Responsable",
    code_hint: "Entrez le code d'établissement (ex: Directeur Hôpital MED123, Municipalité ADM123, Éducation EDU123)",
    error_code: "Code de vérification invalide ! Veuillez vous référer aux codes d'aide indiqués ci-dessous.",
    verify_btn: "Valider le code et accéder à la salle de supervision",
    closing_portal: "Fermer le portail de service",
    geo_manager: "Gestionnaire de Localisation et Géomatique",
    geo_description: "Activez le système GPS de haute précision pour synchroniser vos rapports de dommages avec l'état-major secours.",
    active_coordinates: "Coordonnées GPS Actives",
    update_coordinates: "Actualiser ma position (Haute Précision GPS) 🛰️",
    health_sector: "Secteur Hospitalier",
    admin_sector: "Secteur Municipalité",
    school_sector: "Secteur Scolaire / Éducation",
    emergency_title: "Centre d'Alerte d’Urgence Directe aux Autorités",
    emergency_subtitle: "En cas d'incendie ou de détresse médicale, l'application établit une géo-triangulation satellite fine à 3 mètres de précision et prépare la communication directe pour guider les secours.",
    fire_btn: "🚨 Signaler un Incendie (Protection Civile)",
    hospital_btn: "🚑 Alerte Médicale (Service Ambulancier)",
    locate_high_precision: "Activer la géolocalisation de haute précision (GPS/GLONASS)",
    satellites_active: "Satellites connectés pour le repérage géo-précis",
    accuracy: "Marge d'erreur / Précision",
    latitude: "Latitude",
    longitude: "Longitude",
    altitude: "Altitude géoïde",
    speed: "Vitesse d'alignement",
    locating_high: "Recherche de signaux et synchronisation des éphémérides satellites...",
    established_precision: "Coordonnées de haute précision acquises avec succès auprès de la constellation de satellites active !",
    call_direct: "Passer un appel d’urgence immédiat aux secours officiels 📞",
    share_gps: "Partager mes coordonnées tactiques de secours 🛰️",
    cancel: "Annuler le transfert",
    work: "Travail & Projets",
    personal: "Vie Personnelle",
    ideas: "Idées & Inspirations",
    urgent: "Urgent & Critique",
    health: "Santé & Fitness",
    admin: "Administration",
    school: "Études & Écoles",
    hospital_manager: "Directeur de l'Hôpital Militaire (M. Al-Salman)",
    school_director: "Directeur du Lycée d'Excellence El-Andalous",
    municipal_director: "Secrétaire Général de l'Aménagement Urbain",
    beds_status: "Lits de Réanimation Libres en Temps Réel dans votre Clinique",
    attendance_status: "Taux d'assiduité global des effectifs élèves",
    licensing_decisions: "Demandes de permis d'aménagement public en attente",
    winter_timings: "Bascule des horaires de classe en mode hivernal",
    auth_success: "Accès autorisé. Identité confirmée pour diriger et surveiller votre établissement d'affection:",
    dashboardDesc: "Bienvenue sur Balaghni, plateforme intelligente d'assistance et d'intervention d'urgence.",
    todayDate: "Date d'aujourd'hui",
    currentTime: "Heure actuelle",
    notesCount: "Notes actives",
    reportsCount: "Rapports actifs",
    emergencyCallTitle: "Centre d'Urgence Rapide (Appel Direct)",
    emergencyCallSub: "Besoin d'aide immédiate? Contactez en un clic",
    emergencyDesc: "Système de secours reliant votre appareil à la Protection Civile ou aux d'Ambulances, transmettant automatiquement vos coordonnées gps de précision.",
    fireDept: "Signaler un Incendie (Pompiers)",
    ambulance: "Appeler une Ambulance",
    chatTitle: "Assistant IA Conversationnel",
    chatDesc: "Discutez avec l'IA Gemini pour obtenir des conseils, traduire des messages, ou formuler des requêtes logistiques.",
    startChat: "Démarrer le Chat Intelligent",
    notesTitle: "Notes Personnelles de Terrain",
    notesDesc: "Enregistrez vos rapports d'observations, vos listes de tâches quotidiennes et vos analyses de manière sécurisée.",
    openNotes: "Ouvrir l'Espace Notes",
    reportsTitle: "Plaintes & Signalements",
    reportsDesc: "Soumettez vos plaintes de voiries, rapports d'incidents administratifs ou sanitaires avec coordonnées précises.",
    openReports: "Accéder aux Signalements",
  },
  zgh: {
    appName: "ⴱⴰⵍⵖⵏⵉ (Balaghni)",
    appSubtitle: "ⵜⴰⵡⵔⵉⵇⵜ ⵜⵓⵙⵏⵉⵊⵉⵜ ⵏ ⵉⴱⴰⵍⴰⵖⵏ, ⵜⵓⵙⵏⴰ ⵏ GPS ⴷ ⵓⴼⵔⴰⴳ ⵏ ⵜⵎⵙⵙⵓⵔⵉⵏ",
    home: "🏠 ⴰⵙⵓⵔ",
    chat: "💬 ⴰⵎⵙⴰⵡⴰⵍ",
    notes: "📝 ⵜⵉⵔⵔⴰ",
    reports: "⚠️ ⵉⴱⴰⵍⴰⵖⵏ",
    current_date: "ⴰⵣⴻⵎⵣ ⵏ ⴰⵙⵙ",
    current_time: "ⵜⵉⵣⵉ ⵜⵓⵔⵎⵉⵏ",
    language: "ⵜⵓⵜⵍⴰⵢⵜ / Language",
    citizen: "ⴰⵎⵓⵔⴰⵏ (Citoyen)",
    official: "ⴰⵎⵙⵡⵓⵔ (Responsable)",
    citizen_portal: "ⵜⴰⴱⵓⵔⵜ ⵏ ⵓⵎⵓⵔⴰⵏ",
    official_portal: "ⵜⴰⵏⴱⴰⴹⵜ ⵏ ⵓⵎⵙⵡⵓⵔ (ⵙⵓⵉⵠⵉ)",
    select_identity: "ⵉⴳⴻⵜ ⴰⴼⵔⴰⵏ ⵏ ⵡⵓⴷⴻⵎ ⵏ ⵓⴽⴰⵔⴷ ( المسؤول أم المواطن) :",
    change_identity: "ⵙⴻⵏⴼⴻⵍ ⵜⵓⵜⵍⴰⵢⵜ",
    code_verification: "ⵙⴻⴷⴷⴻⴷ ⴰⴽⵓⴷ ⵏ ⵓⵎⵙⵡⵓⵔ",
    code_hint: "ⵙⴻⴽⵛⴻⵎ ⴰⴽⵓⴷ ( directeur d'hôpital : MED123, mairie : ADM123, ecole : EDU123)",
    error_code: "ⴰⴽⵓⴷ ⵓⵔ ⵢⴻⴳⵉⴷ ⵢⴻⵥⵉⵍⵏ! ⵙⴻⴽⵛⴻⵎ ⵎⴻⴷ123, ⴰⴷⵎ123.",
    verify_btn: "ⵙⴻⴷⴷⴻⴷ ⴷ ⵓⵏⴻⴽⴽⵓⵎ",
    closing_portal: "ⵇⴻⵏ ⵜⴰⴱⵓⵔⵜ",
    geo_manager: "ⵜⴰⵏⴱⴰⴹⵜ ⵏ ⵜⵓⵙⵏⴰ ⴷ ⵜⵉⵏⵉⴳⵉ (GPS)",
    geo_description: "ⵙⴻⴽⵔⴻⴷ ⵉⵎⵙⴻⵍⵢⴰⵏ ⵏ GPS ⴰⴼⴰⴷ ⴰⴷ ⵜⴻⴽⵙⴻⵎ ⵜⵉⴳⴳⵉⵢⵉⵏ ⵏ ⵜⵓⵙⵏⴰ.",
    active_coordinates: "ⵜⵉⴳⴳⵉⵢⵉⵏ ⵜⵉⵔⵎⴰⵏⵉⵏ GPS",
    update_coordinates: "ⵙⴻⵏⴼⴻل ⵜⵓⵙⵏⴰ ⵉⵏⵓ (GPS) 🛰️",
    health_sector: "🏥 ⵜⴻⴷⵡⴰⵙⵜ (Santé)",
    admin_sector: "🏢 ⵜⵉⵎⵙⵙⵓⴳⵓⵔⵜ (Admin)",
    school_sector: "🎓 ⴰⵙⴻⴳⵎⵉ (Education)",
    emergency_title: "ⴰⵍⴰⵔⵎ ⵏ ⵡⴰⴼⴰ ⴷ ⵜⴻⴷⵡⴰⵙⵜ (Emergency)",
    emergency_subtitle: "ⵙⴻⴽⵓⵢⴻⵎ  ⴰⴹⴰⵔ ⵏ ⵜⵓⵙⵏⴰ ⵏ GPS ⵃⵎⴰ ⴰⴷ ⵜⴻⵙⵙⵏ ⵉⵎⵙⴻⵍⵡⴰⵏ ⵏ ⵜⴻⵏⴼⵔⵓⵜ, ⴷ ⵓⵎⵙⴰⵡⴰⵍ ⴷ ⵍⴱⵓⵎⴱⵢⴰ ⴷ ⵓⵙⴳⵏⴰⴼ.",
    fire_btn: "🔥 ⴰⵎⵛⵓⵇ ⵏ ⵡⴰⴼⴰ (Pompiers)",
    hospital_btn: "🚑 ⴰⵍⴰⵔⵎ ⵏ ⵓⵙⴳⵏⴰⴼ (Ambulance)",
    locate_high_precision: "ⵜⵓⵙⵏⴰ ⵜⵓⵔⵎⵉⵏ ⵜⴰⵎⴻⵥⵍⵓⵜ (GPS High Accuracy)",
    satellites_active: "satellite-ⵟ ⵉⵍⵍⴰⵏ",
    accuracy: "ⵜⴰⵎⵖⵓⵔⵜ - accuracy",
    latitude: "Latitude (ⵜⵓⵙⵏⴰ)",
    longitude: "Longitude (ⵜⵓⵙⵏⴰ)",
    altitude: "Altitude",
    speed: "Vitesse",
    locating_high: "ⵙⴻⴽⵛⴻⵎ ⵉⵙⵎⴰⵡⴰⵏ ⵏ satellite ⵇⵇⴰⵃ...",
    established_precision: "ⵜⵓⵙⵏⴰ ⵜⵓⵔⵎⵉⵏ ⵜⴻⴳⴰ ⵎⵓⴼⵉⴷ ⵙ ⵓⵙⵉⵡⴻⴹ !",
    call_direct: "📞 ⵙⴻⵡⵡⴻⵍ ⴷ ⵍⴱⵓⵎⴱⵢⴰ ⵏⴻⵖ ⴰⵙⴳⵏⴰⴼ",
    share_gps: "🛰️ ⵙⴻⴼⵙⴻⵔ ⵜⵓⵙⵏⴰ GPS",
    cancel: "ⵙⴻⵏⴼⴻⵍ (Annuler)",
    work: "🖥️ ⵜⴰⵡⵓⵔⵉ (Travail)",
    personal: "🏡 ⵜⵓⴷⴻⵔⵜ (Perso)",
    ideas: "💡 ⵜⵉⵡⴻⵏⴳⵉⵎⵉⵏ",
    urgent: "🚨 ⵜⵉⵏⵉⴳⵉ (Urgent)",
    health: "🩺 ⵜⴻⴷⵡⴰⵙⵜ (Santé)",
    admin: "🏢 ⴰⵎⵙⵙⵓⴳⵓⵔ",
    school: "🎓 ⴰⵙⴻⴳⵎⵉ",
    hospital_manager: "Directeur de l'Hôpital ⵏ ⵜⴻⴷⵡⴰⵙⵜ",
    school_director: "Directeur du Lycée / ⴰⵙⴻⴳⵎⵉ",
    municipal_director: "Secrétaire de la Mairie",
    beds_status: "Lits de réanimation ⵉⵍⵍⴰⵏ ⴼⵔⵉ",
    attendance_status: "Attendance ⵏ ⵓⵍⵎⴰⴷⵏ",
    licensing_decisions: "Permis ⵉⵍⵍⴰⵏ ⴳ ⵓⵙⴳⵉⴳⴳⴻⵍ",
    winter_timings: "ⵊⴻⵔⵉ ⴰⵣⴻⵎⵣ ⵏ ⵜⴳⵔⴻⵙⵜ (❄️)",
    auth_success: "ⴰⵣⵓⵍ ⴰⵎⵙⵡⵓⵔ. ⵜⵓⵙⵏⴰ ⵜⴻⴳⴰ ⵎⵓⴼⵉⴷ ⵇⵇⴰⵃ :",
    dashboardDesc: "ⴰⵏⵙⵓⴼ ⵢⵉⵙⵡⴰⵏ ⴳ ⴱⴰⵍⵖⵏⵉ, - ⵜⴰⵡⵔⵉⵇⵜ ⵜⵓⵙⵏⵉⵊⵉⵜ ⵏ ⵉⴱⴰⵍⴰⵖⵏ.",
    todayDate: "ⴰⵣⴻⵎⵣ ⵏ ⴰⵙⵙ",
    currentTime: "ⵜⵉⵣⵉ ⵜⵓⵔⵎⵉⵏ",
    notesCount: "ⵜⵉⵔⵔⴰ",
    reportsCount: "ⵉⴱⴰⵍⴰⵖⵏ",
    emergencyCallTitle: "ⵜⴰⵡⵔⵉⵇⵜ ⵜⵓⵙⵏⵉⵊⵉⵜ ⵏ ⵓⴽⴰⵔⴷ",
    emergencyCallSub: "ⵜⵓⵙⵏⴰ ⵏ GPS ⴷ ⵓⴼⵔⴰⴳ",
    emergencyDesc: "ⵙⴻⴽⵓⵢⴻⵎ  ⴰⴹⴰⵔ ⵏ ⵜⵓⵙⵏⴰ ⵏ GPS ⵃⵎⴰ ⴰⴷ ⵜⴻⵙⵙⵏ ⵉⵎⵙⴻⵍⵡⴰⵏ ⵏ ⵜⴻⵏⴼⵔⵓⵜ ⴷ ⵓⵙⴳⵏⴰⴼ.",
    fireDept: "🔥 ⵍⴱⵓⵎⴱⵢⴰ (Protection Civile)",
    ambulance: "🚑 ⴰⵙⴳⵏⴰⴼ (Ambulance)",
    chatTitle: "💬 ⴰⵎⵙⴰⵡⴰⵍ ⴷ ⵊⵉⵎⵉⵏⵉ",
    chatDesc: "ⴰⵎⵙⴰⵡⴰⵍ ⴷ ⵊⵉⵎⵉⵏⵉ - ⵜⴰⵡⵔⵉⵇⵜ ⵜⵓⵙⵏⵉⵊⵉⵜ AI ⵏ ⵉⴱⴰⵍⴰⵖⵏ.",
    startChat: "💬 ⵙⴻⵡⵡⴻⵍ ⴷ ⵍⴱⵓⵎⴱⵢⴰ",
    notesTitle: "📝 ⵜⵉⵔⵔⴰ",
    notesDesc: "📝 ⵜⵉⵔⵔⴰ ⵏ ⵓⵡⵡⵓⵔ - ⵙⴻⴽⵔⴻⴷ ⵉⵎⵙⴻⵍⵢⴰⵏ ⵏ ⵜⵓⵙⵏⴰ.",
    openNotes: "📝 ⵜⵉⵔⵔⴰ ⵏ ⵓⵍⵎⴰⴷⵏ",
    reportsTitle: "⚠️ ⵉⴱⴰⵍⴰⵖⵏ ⵇⵇⴰⵃ",
    reportsDesc: "⚠️ ⵉⴱⴰⵍⴰⵖⵏ ⵏ ⵜⴻⴷⵡⴰⵙⵜ ⴷ ⵜⵉⵎⵙⵙⵓⴳⵓⵔⵜ.",
    openReports: "⚠️ ⵉⴱⴰⵍⴰⵖⵏ ⵏ ⵓⵡⵡⵓⵔ",
  }
};
