import { useState, useEffect, createContext, useContext } from "react";

import "./App.css";

import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

import { Toaster, toast } from "sonner";

import { Moon, Sun, Search, Book, BookOpen, Bookmark, BookmarkCheck, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronRight, Menu, Home as HomeIcon, Loader2 } from "lucide-react";


const QURAN_API = "https://api.quran.com/api/v4";

const ALQURAN_API = "https://api.alquran.cloud/v1";

const HADITH_API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";


const SURAHS_DATA = [

  {"number": 1, "name": "الفاتحة", "english_name": "Al-Fatihah", "english_meaning": "The Opening", "ayahs": 7, "revelation": "Meccan"},

  {"number": 2, "name": "البقرة", "english_name": "Al-Baqarah", "english_meaning": "The Cow", "ayahs": 286, "revelation": "Medinan"},

  {"number": 3, "name": "آل عمران", "english_name": "Aal-E-Imran", "english_meaning": "The Family of Imran", "ayahs": 200, "revelation": "Medinan"},

  {"number": 4, "name": "النساء", "english_name": "An-Nisa", "english_meaning": "The Women", "ayahs": 176, "revelation": "Medinan"},

  {"number": 5, "name": "المائدة", "english_name": "Al-Ma'idah", "english_meaning": "The Table Spread", "ayahs": 120, "revelation": "Medinan"},

  {"number": 6, "name": "الأنعام", "english_name": "Al-An'am", "english_meaning": "The Cattle", "ayahs": 165, "revelation": "Meccan"},

  {"number": 7, "name": "الأعراف", "english_name": "Al-A'raf", "english_meaning": "The Heights", "ayahs": 206, "revelation": "Meccan"},

  {"number": 8, "name": "الأنفال", "english_name": "Al-Anfal", "english_meaning": "The Spoils of War", "ayahs": 75, "revelation": "Medinan"},

  {"number": 9, "name": "التوبة", "english_name": "At-Tawbah", "english_meaning": "The Repentance", "ayahs": 129, "revelation": "Medinan"},

  {"number": 10, "name": "يونس", "english_name": "Yunus", "english_meaning": "Jonah", "ayahs": 109, "revelation": "Meccan"},
  {"number": 11, "name": "هود", "english_name": "Hud", "english_meaning": "Hud", "ayahs": 123, "revelation": "Meccan"},
  {"number": 12, "name": "يوسف", "english_name": "Yusuf", "english_meaning": "Joseph", "ayahs": 111, "revelation": "Meccan"},

  {"number": 13, "name": "الرعد", "english_name": "Ar-Ra'd", "english_meaning": "The Thunder", "ayahs": 43, "revelation": "Medinan"},

  {"number": 14, "name": "إبراهيم", "english_name": "Ibrahim", "english_meaning": "Abraham", "ayahs": 52, "revelation": "Meccan"},

  {"number": 15, "name": "الحجر", "english_name": "Al-Hijr", "english_meaning": "The Rocky Tract", "ayahs": 99, "revelation": "Meccan"},

  {"number": 16, "name": "النحل", "english_name": "An-Nahl", "english_meaning": "The Bee", "ayahs": 128, "revelation": "Meccan"},

  {"number": 17, "name": "الإسراء", "english_name": "Al-Isra", "english_meaning": "The Night Journey", "ayahs": 111, "revelation": "Meccan"},

  {"number": 18, "name": "الكهف", "english_name": "Al-Kahf", "english_meaning": "The Cave", "ayahs": 110, "revelation": "Meccan"},

  {"number": 19, "name": "مريم", "english_name": "Maryam", "english_meaning": "Mary", "ayahs": 98, "revelation": "Meccan"},

  {"number": 20, "name": "طه", "english_name": "Taha", "english_meaning": "Ta-Ha", "ayahs": 135, "revelation": "Meccan"},

  {"number": 21, "name": "الأنبياء", "english_name": "Al-Anbiya", "english_meaning": "The Prophets", "ayahs": 112, "revelation": "Meccan"},

  {"number": 22, "name": "الحج", "english_name": "Al-Hajj", "english_meaning": "The Pilgrimage", "ayahs": 78, "revelation": "Medinan"},

  {"number": 23, "name": "المؤمنون", "english_name": "Al-Mu'minun", "english_meaning": "The Believers", "ayahs": 118, "revelation": "Meccan"},

  {"number": 24, "name": "النور", "english_name": "An-Nur", "english_meaning": "The Light", "ayahs": 64, "revelation": "Medinan"},

  {"number": 25, "name": "الفرقان", "english_name": "Al-Furqan", "english_meaning": "The Criterion", "ayahs": 77, "revelation": "Meccan"},

  {"number": 26, "name": "الشعراء", "english_name": "Ash-Shu'ara", "english_meaning": "The Poets", "ayahs": 227, "revelation": "Meccan"},

  {"number": 27, "name": "النمل", "english_name": "An-Naml", "english_meaning": "The Ant", "ayahs": 93, "revelation": "Meccan"},

  {"number": 28, "name": "القصص", "english_name": "Al-Qasas", "english_meaning": "The Stories", "ayahs": 88, "revelation": "Meccan"},

  {"number": 29, "name": "العنكبوت", "english_name": "Al-Ankabut", "english_meaning": "The Spider", "ayahs": 69, "revelation": "Meccan"},

  {"number": 30, "name": "الروم", "english_name": "Ar-Rum", "english_meaning": "The Romans", "ayahs": 60, "revelation": "Meccan"},

  {"number": 31, "name": "لقمان", "english_name": "Luqman", "english_meaning": "Luqman", "ayahs": 34, "revelation": "Meccan"},

  {"number": 32, "name": "السجدة", "english_name": "As-Sajdah", "english_meaning": "The Prostration", "ayahs": 30, "revelation": "Meccan"},

  {"number": 33, "name": "الأحزاب", "english_name": "Al-Ahzab", "english_meaning": "The Combined Forces", "ayahs": 73, "revelation": "Medinan"},

  {"number": 34, "name": "سبأ", "english_name": "Saba", "english_meaning": "Sheba", "ayahs": 54, "revelation": "Meccan"},

  {"number": 35, "name": "فاطر", "english_name": "Fatir", "english_meaning": "The Originator", "ayahs": 45, "revelation": "Meccan"},

  {"number": 36, "name": "يس", "english_name": "Ya-Sin", "english_meaning": "Ya Sin", "ayahs": 83, "revelation": "Meccan"},

  {"number": 37, "name": "الصافات", "english_name": "As-Saffat", "english_meaning": "Those Ranged in Ranks", "ayahs": 182, "revelation": "Meccan"},

  {"number": 38, "name": "ص", "english_name": "Sad", "english_meaning": "Sad", "ayahs": 88, "revelation": "Meccan"},

  {"number": 39, "name": "الزمر", "english_name": "Az-Zumar", "english_meaning": "The Groups", "ayahs": 75, "revelation": "Meccan"},

  {"number": 40, "name": "غافر", "english_name": "Ghafir", "english_meaning": "The Forgiver", "ayahs": 85, "revelation": "Meccan"},

  {"number": 41, "name": "فصلت", "english_name": "Fussilat", "english_meaning": "Explained in Detail", "ayahs": 54, "revelation": "Meccan"},

  {"number": 42, "name": "الشورى", "english_name": "Ash-Shura", "english_meaning": "The Consultation", "ayahs": 53, "revelation": "Meccan"},

  {"number": 43, "name": "الزخرف", "english_name": "Az-Zukhruf", "english_meaning": "The Gold Adornments", "ayahs": 89, "revelation": "Meccan"},

  {"number": 44, "name": "الدخان", "english_name": "Ad-Dukhan", "english_meaning": "The Smoke", "ayahs": 59, "revelation": "Meccan"},

  {"number": 45, "name": "الجاثية", "english_name": "Al-Jathiya", "english_meaning": "The Kneeling", "ayahs": 37, "revelation": "Meccan"},

  {"number": 46, "name": "الأحقاف", "english_name": "Al-Ahqaf", "english_meaning": "The Wind-Curved Sandhills", "ayahs": 35, "revelation": "Meccan"},

  {"number": 47, "name": "محمد", "english_name": "Muhammad", "english_meaning": "Muhammad", "ayahs": 38, "revelation": "Medinan"},

  {"number": 48, "name": "الفتح", "english_name": "Al-Fath", "english_meaning": "The Victory", "ayahs": 29, "revelation": "Medinan"},

  {"number": 49, "name": "الحجرات", "english_name": "Al-Hujurat", "english_meaning": "The Rooms", "ayahs": 18, "revelation": "Medinan"},

  {"number": 50, "name": "ق", "english_name": "Qaf", "english_meaning": "Qaf", "ayahs": 45, "revelation": "Meccan"},

  {"number": 51, "name": "الذاريات", "english_name": "Adh-Dhariyat", "english_meaning": "The Winnowing Winds", "ayahs": 60, "revelation": "Meccan"},

  {"number": 52, "name": "الطور", "english_name": "At-Tur", "english_meaning": "The Mount", "ayahs":
    49, "revelation": "Meccan"},
  {"number": 53, "name": "النجم", "english_name": "An-Najm", "english_meaning": "The Star", "ayahs": 62, "revelation": "Meccan"},

  {"number": 54, "name": "القمر", "english_name": "Al-Qamar", "english_meaning": "The Moon", "ayahs": 55, "revelation": "Meccan"},

  {"number": 55, "name": "الرحمن", "english_name": "Ar-Rahman", "english_meaning": "The Beneficent", "ayahs": 78, "revelation": "Medinan"},

  {"number": 56, "name": "الواقعة", "english_name": "Al-Waqi'ah", "english_meaning": "The Inevitable", "ayahs": 96, "revelation": "Meccan"},

  {"number": 57, "name": "الحديد", "english_name": "Al-Hadid", "english_meaning": "The Iron", "ayahs": 29, "revelation": "Medinan"},

  {"number": 58, "name": "المجادلة", "english_name": "Al-Mujadila", "english_meaning": "The Pleading Woman", "ayahs": 22, "revelation": "Medinan"},

  {"number": 59, "name": "الحشر", "english_name": "Al-Hashr", "english_meaning": "The Exile", "ayahs": 24, "revelation": "Medinan"},

  {"number": 60, "name": "الممتحنة", "english_name": "Al-Mumtahanah", "english_meaning": "She That is Examined", "ayahs": 13, "revelation": "Medinan"},

  {"number": 61, "name": "الصف", "english_name": "As-Saff", "english_meaning": "The Ranks", "ayahs": 14, "revelation": "Medinan"},

  {"number": 62, "name": "الجمعة", "english_name": "Al-Jumu'ah", "english_meaning": "The Friday", "ayahs": 11, "revelation": "Medinan"},

  {"number": 63, "name": "المنافقون", "english_name": "Al-Munafiqun", "english_meaning": "The Hypocrites", "ayahs": 11, "revelation": "Medinan"},

  {"number": 64, "name": "التغابن", "english_name": "At-Taghabun", "english_meaning": "The Mutual Disillusion", "ayahs": 18, "revelation": "Medinan"},

  {"number": 65, "name": "الطلاق", "english_name": "At-Talaq", "english_meaning": "The Divorce", "ayahs": 12, "revelation": "Medinan"},

  {"number": 66, "name": "التحريم", "english_name": "At-Tahrim", "english_meaning": "The Prohibition", "ayahs": 12, "revelation": "Medinan"},

  {"number": 67, "name": "الملك", "english_name": "Al-Mulk", "english_meaning": "The Sovereignty", "ayahs": 30, "revelation": "Meccan"},

  {"number": 68, "name": "القلم", "english_name": "Al-Qalam", "english_meaning": "The Pen", "ayahs": 52, "revelation": "Meccan"},

  {"number": 69, "name": "الحاقة", "english_name": "Al-Haqqah", "english_meaning": "The Reality", "ayahs": 52, "revelation": "Meccan"},

  {"number": 70, "name": "المعارج", "english_name": "Al-Ma'arij", "english_meaning": "The Ascending Stairways", "ayahs": 44, "revelation": "Meccan"},

  {"number": 71, "name": "نوح", "english_name": "Nuh", "english_meaning": "Noah", "ayahs": 28, "revelation": "Meccan"},

  {"number": 72, "name": "الجن", "english_name": "Al-Jinn", "english_meaning": "The Jinn", "ayahs": 28, "revelation": "Meccan"},

  {"number": 73, "name": "المزمل", "english_name": "Al-Muzzammil", "english_meaning": "The Enshrouded One", "ayahs": 20, "revelation": "Meccan"},

  {"number": 74, "name": "المدثر", "english_name": "Al-Muddaththir", "english_meaning": "The Cloaked One", "ayahs": 56, "revelation": "Meccan"},

  {"number": 75, "name": "القيامة", "english_name": "Al-Qiyamah", "english_meaning": "The Resurrection", "ayahs": 40, "revelation": "Meccan"},

  {"number": 76, "name": "الإنسان", "english_name": "Al-Insan", "english_meaning": "The Human", "ayahs": 31, "revelation": "Medinan"},

  {"number": 77, "name": "المرسلات", "english_name": "Al-Mursalat", "english_meaning": "Those Sent Forth", "ayahs": 50, "revelation": "Meccan"},

  {"number": 78, "name": "النبأ", "english_name": "An-Naba", "english_meaning": "The Announcement", "ayahs": 40, "revelation": "Meccan"},

  {"number": 79, "name": "النازعات", "english_name": "An-Nazi'at", "english_meaning": "Those Who Pull Out", "ayahs": 46, "revelation": "Meccan"},

  {"number": 80, "name": "عبس", "english_name": "Abasa", "english_meaning": "He Frowned", "ayahs": 42, "revelation": "Meccan"},

  {"number": 81, "name": "التكوير", "english_name": "At-Takwir", "english_meaning": "The Overthrowing", "ayahs": 29, "revelation": "Meccan"},

  {"number": 82, "name": "الإنفطار", "english_name": "Al-Infitar", "english_meaning": "The Cleaving", "ayahs": 19, "revelation": "Meccan"},

  {"number": 83, "name": "المطففين", "english_name": "Al-Mutaffifin", "english_meaning": "The Defrauding", "ayahs": 36, "revelation": "Meccan"},

  {"number": 84, "name": "الإنشقاق", "english_name": "Al-Inshiqaq", "english_meaning": "The Splitting Open", "ayahs": 25, "revelation": "Meccan"},

  {"number": 85, "name": "البروج", "english_name": "Al-Buruj", "english_meaning": "The Mansions of the Stars", "ayahs": 22, "revelation": "Meccan"},

  {"number": 86, "name": "الطارق", "english_name": "At-Tariq", "english_meaning": "The Morning Star", "ayahs": 17, "revelation": "Meccan"},

  {"number": 87, "name": "الأعلى", "english_name": "Al-A'la", "english_meaning": "The Most High", "ayahs": 19, "revelation": "Meccan"},

  {"number": 88, "name": "الغاشية", "english_name": "Al-Ghashiyah", "english_meaning": "The Overwhelming", "ayahs": 26, "revelation": "Meccan"},

  {"number": 89, "name": "الفجر", "english_name": "Al-Fajr", "english_meaning": "The Dawn", "ayahs": 30, "revelation": "Meccan"},

  {"number": 90, "name": "البلد", "english_name": "Al-Balad", "english_meaning": "The City", "ayahs": 20, "revelation": "Meccan"},

  {"number": 91, "name": "الشمس", "english_name": "Ash-Shams", "english_meaning": "The Sun", "ayahs": 15, "revelation": "Meccan"},

  {"number": 92, "name": "الليل", "english_name": "Al-Layl", "english_meaning": "The Night", "ayahs": 21, "revelation": "Meccan"},

  {"number": 93, "name": "الضحى", "english_name": "Ad-Duhaa", "english_meaning": "The Morning Hours", "ayahs": 11, "revelation": "Meccan"},

  {"number": 94, "name": "الشرح", "english_name": "Ash-Sharh", "english_meaning": "The Relief", "ayahs": 8, "revelation": "Meccan"},

  {"number": 95, "name": "التين", "english_name": "At-Tin", "english_meaning": "The Fig", "ayahs": 8, "revelation": "Meccan"},

  {"number": 96, "name": "العلق", "english_name": "Al-Alaq", "english_meaning": "The Clot", "ayahs": 19, "revelation": "Meccan"},

  {"number": 97, "name": "القدر", "english_name": "Al-Qadr", "english_meaning": "The Power", "ayahs": 5, "revelation": "Meccan"},

  {"number": 98, "name": "البينة", "english_name": "Al-Bayyinah", "english_meaning": "The Clear Proof", "ayahs": 8, "revelation": "Medinan"},

  {"number": 99, "name": "الزلزلة", "english_name": "Az-Zalzalah", 
     "english_meaning": "The Earthquake", "ayahs": 8, "revelation": "Medinan"},
  {"number": 100, "name": "العاديات", "english_name": "Al-Adiyat", "english_meaning": "The Courser", "ayahs": 11, "revelation": "Meccan"},

  {"number": 101, "name": "القارعة", "english_name": "Al-Qari'ah", "english_meaning": "The Calamity", "ayahs": 11, "revelation": "Meccan"},

  {"number": 102, "name": "التكاثر", "english_name": "At-Takathur", "english_meaning": "The Rivalry in World Increase", "ayahs": 8, "revelation": "Meccan"},

  {"number": 103, "name": "العصر", "english_name": "Al-Asr", "english_meaning": "The Declining Day", "ayahs": 3, "revelation": "Meccan"},

  {"number": 104, "name": "الهمزة", "english_name": "Al-Humazah", "english_meaning": "The Traducer", "ayahs": 9, "revelation": "Meccan"},

  {"number": 105, "name": "الفيل", "english_name": "Al-Fil", "english_meaning": "The Elephant", "ayahs": 5, "revelation": "Meccan"},

  {"number": 106, "name": "قريش", "english_name": "Quraysh", "english_meaning": "Quraysh", "ayahs": 4, "revelation": "Meccan"},

  {"number": 107, "name": "الماعون", "english_name": "Al-Ma'un", "english_meaning": "The Small Kindnesses", "ayahs": 7, "revelation": "Meccan"},

  {"number": 108, "name": "الكوثر", "english_name": "Al-Kawthar", "english_meaning": "The Abundance", "ayahs": 3, "revelation": "Meccan"},

  {"number": 109, "name": "الكافرون", "english_name": "Al-Kafirun", "english_meaning": "The Disbelievers", "ayahs": 6, "revelation": "Meccan"},

  {"number": 110, "name": "النصر", "english_name": "An-Nasr", "english_meaning": "The Divine Support", "ayahs": 3, "revelation": "Medinan"},

  {"number": 111, "name": "المسد", "english_name": "Al-Masad", "english_meaning": "The Palm Fiber", "ayahs": 5, "revelation": "Meccan"},

  {"number": 112, "name": "الإخلاص", "english_name": "Al-Ikhlas", "english_meaning": "The Sincerity", "ayahs": 4, "revelation": "Meccan"},

  {"number": 113, "name": "الفلق", "english_name": "Al-Falaq", "english_meaning": "The Daybreak", "ayahs": 5, "revelation": "Meccan"},

  {"number": 114, "name": "الناس", "english_name": "An-Nas", "english_meaning": "Mankind", "ayahs": 6, "revelation": "Meccan"},

];


const SIPARA_DATA = [

  {"number": 1, "name": "Alif Lam Meem", "start_surah": 1, "end_surah": 2},

  {"number": 2, "name": "Sayaqool", "start_surah": 2, "end_surah": 2},

  {"number": 3, "name": "Tilkal Rusul", "start_surah": 2, "end_surah": 3},

  {"number": 4, "name": "Lan Tana Loo", "start_surah": 3, "end_surah": 4},

  {"number": 5, "name": "Wal Mohsanat", "start_surah": 4, "end_surah": 4},

  {"number": 6, "name": "La Yuhibbullah", "start_surah": 4, "end_surah": 5},

  {"number": 7, "name": "Wa Iza Samiu", "start_surah": 5, "end_surah": 6},

  {"number": 8, "name": "Wa Lau Annana", "start_surah": 6, "end_surah": 7},

  {"number": 9, "name": "Qalal Malao", "start_surah": 7, "end_surah": 8},

  {"number": 10, "name": "Wa Alamu", "start_surah": 8, "end_surah": 9},

  {"number": 11, "name": "Yatazeroon", "start_surah": 9, "end_surah": 11},

  {"number": 12, "name": "Wa Mamin Daabbat", "start_surah": 11, "end_surah": 12},

  {"number": 13, "name": "Wa Ma Ubarrio", "start_surah": 12, "end_surah": 14},

  {"number": 14, "name": "Rubama", "start_surah": 15, "end_surah": 16},

  {"number": 15, "name": "Subhanallazi", "start_surah": 17, "end_surah": 18},

  {"number": 16, "name": "Qal Alam", "start_surah": 18, "end_surah": 20},

  {"number": 17, "name": "Iqtarabo", "start_surah": 21, "end_surah": 22},

  {"number": 18, "name": "Qadd Aflaha", "start_surah": 23, "end_surah": 25},

  {"number": 19, "name": "Wa Qalallazina", "start_surah": 25, "end_surah": 27},

  {"number": 20, "name": "Amman Khalaq", "start_surah": 27, "end_surah": 29},

  {"number": 21, "name": "Utlu Ma Oohi", "start_surah": 29, "end_surah": 33},

  {"number": 22, "name": "Wa Manyaqnut", "start_surah": 33, "end_surah": 36},

  {"number": 23, "name": "Wa Mali", "start_surah": 36, "end_surah": 39},

  {"number": 24, "name": "Faman Azlam", "start_surah": 39, "end_surah": 41},

  {"number": 25, "name": "Elahe Yuruddo", "start_surah": 41, "end_surah": 45},

  {"number": 26, "name": "Ha Meem", "start_surah": 46, "end_surah": 51},

  {"number": 27, "name": "Qala Fama Khatbukum", "start_surah": 51, "end_surah": 57},

  {"number": 28, "name": "Qadd Sami Allah", "start_surah": 58, "end_surah": 66},

  {"number": 29, "name": "Tabarakallazi", "start_surah": 67, "end_surah": 77},

  {"number": 30, "name": "Amma Yatasaaloon", "start_surah": 78, "end_surah": 114},

];


const ThemeContext = createContext();

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => localStorage.getItem("quran-theme") || "light");

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); localStorage.setItem("quran-theme", theme); }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === "light" ? "dark" : "light") }}>{children}</ThemeContext.Provider>;

};


const BookmarksContext = createContext();

const useBookmarks = () => useContext(BookmarksContext);

const BookmarksProvider = ({ children }) => {

  const [bookmarks, setBookmarks] = useState(() => { const s = localStorage.getItem("quran-bookmarks"); return s ? JSON.parse(s) : []; });

  useEffect(() => { localStorage.setItem("quran-bookmarks", JSON.stringify(bookmarks)); }, [bookmarks]);

  const toggleBookmark = (surahNumber, verseNumber, surahName) => {

    const key = `${surahNumber}:${verseNumber}`;

    const exists = bookmarks.find(b => b.key === key);

    if (exists) { setBookmarks(bookmarks.filter(b => b.key !== key)); toast.success("Bookmark removed"); }

    else { setBookmarks([...bookmarks, { key, surahNumber, verseNumber, surahName }]); toast.success("Bookmark added"); }

  };

  return <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked: (s, v) => bookmarks.some(b => b.key === `${s}:${v}`) }}>{children}</BookmarksContext.Provider>;

};


const AudioContext = createContext();

const useAudio = () => useContext(AudioContext);

const AudioProvider = ({ children }) => {

  const [state, setState] = useState({ isPlaying: false, currentSurah: null, currentVerse: null, surahName: "", audioUrl: "", audioList: [] });

  const [audio] = useState(new Audio());

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => { audio.onended = () => { const idx = state.audioList.findIndex(a => a.verse_number === state.currentVerse); if (idx < state.audioList.length - 1) { const next = state.audioList[idx + 1]; playVerse(next.verse_number, next.audio_url); } else { setState(p => ({ ...p, isPlaying: false })); } }; return () => audio.pause(); }, [audio, state.audioList, state.currentVerse]);

  const loadSurahAudio = async (surahNumber, surahName) => { try { const res = await fetch(`${ALQURAN_API}/surah/${surahNumber}/ar.alafasy`); const data = await res.json(); if (data.code === 200) { const list = data.data.ayahs.map(a => ({ verse_number: a.numberInSurah, audio_url: a.audio })); setState(p => ({ ...p, currentSurah: surahNumber, surahName, audioList: list })); return list; } } catch (e) { console.error(e); } return []; };

  const playVerse = async (verseNumber, audioUrl) => { try { audio.pause(); audio.src = audioUrl; await audio.play().catch(e => console.log(e)); setState(p => ({ ...p, isPlaying: true, currentVerse: verseNumber, audioUrl })); } catch (e) { console.log(e); } };

  const togglePlay = () => { if (state.isPlaying) { audio.pause(); setState(p => ({ ...p, isPlaying: false })); } else if (state.audioUrl) { audio.play().catch(e => console.log(e)); 
                            setState(p => ({ ...p, isPlaying: true })); } };
  return <AudioContext.Provider value={{ ...state, isMuted, loadSurahAudio, playVerse, togglePlay, toggleMute: () => { audio.muted = !audio.muted; setIsMuted(!isMuted); }, skipPrevious: () => { const idx = state.audioList.findIndex(a => a.verse_number === state.currentVerse); if (idx > 0) playVerse(state.audioList[idx-1].verse_number, state.audioList[idx-1].audio_url); }, skipNext: () => { const idx = state.audioList.findIndex(a => a.verse_number === state.currentVerse); if (idx < state.audioList.length - 1) playVerse(state.audioList[idx+1].verse_number, state.audioList[idx+1].audio_url); } }}>{children}</AudioContext.Provider>;

};

const Header = () => {

  const { theme, toggleTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <>

      <header className="header-blur sticky top-0 z-50">

        <div className="container-main py-4 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}><BookOpen className="w-5 h-5 text-white" /></div>

            <span className="font-heading text-xl font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>Quran Study</span>

          </Link>

          <nav className="hidden md:flex items-center gap-6">

            <Link to="/siparas" className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>Siparas</Link>

            <Link to="/surahs" className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>Surahs</Link>

            <Link to="/hadith" className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>Hadith</Link>

            <Link to="/bookmarks" className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>Bookmarks</Link>

          </nav>

          <div className="flex items-center gap-2">

            <button onClick={() => setSearchOpen(true)} className="btn-icon"><Search className="w-5 h-5" /></button>

            <button onClick={toggleTheme} className="btn-icon">{theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>

            <button onClick={() => setMenuOpen(true)} className="btn-icon md:hidden"><Menu className="w-5 h-5" /></button>

          </div>

        </div>

      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}

    </>

  );

};


const MobileMenu = ({ onClose }) => (

  <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>

    <div className="absolute right-0 top-0 h-full w-64 p-6" style={{ background: 'var(--surface)' }} onClick={e => e.stopPropagation()}>

      <button onClick={onClose} className="absolute top-4 right-4 btn-icon"><span>✕</span></button>

      <nav className="flex flex-col gap-4 mt-12">

        <Link to="/" onClick={onClose} className="flex items-center gap-3 p-3" style={{ color: 'var(--text-primary)' }}><HomeIcon className="w-5 h-5" /><span>Home</span></Link>

        <Link to="/siparas" onClick={onClose} className="flex items-center gap-3 p-3" style={{ color: 'var(--text-primary)' }}><Book className="w-5 h-5" /><span>Siparas</span></Link>

        <Link to="/surahs" onClick={onClose} className="flex items-center gap-3 p-3" style={{ color: 'var(--text-primary)' }}><BookOpen className="w-5 h-5" /><span>Surahs</span></Link>

        <Link to="/hadith" onClick={onClose} className="flex items-center gap-3 p-3" style={{ color: 'var(--text-primary)' }}><Book className="w-5 h-5" /><span>Hadith</span></Link>

        <Link to="/bookmarks" onClick={onClose} className="flex items-center gap-3 p-3" style={{ color: 'var(--text-primary)' }}><Bookmark className="w-5 h-5" /><span>Bookmarks</span></Link>

      </nav>

    </div>

  </div>

);


const SearchModal = ({ onClose }) => {

  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const results = query.length >= 2 ? SURAHS_DATA.filter(s => s.english_name.toLowerCase().includes(query.toLowerCase()) || s.english_meaning.toLowerCase().includes(query.toLowerCase())) : [];

  return (

    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>

      <div className="w-full max-w-lg mx-4 rounded-lg p-4" style={{ background: 'var(--surface)' }} onClick={e => e.stopPropagation()}>

        <input type="text" placeholder="Search surahs..." value={query} onChange={e => setQuery(e.target.value)} className="w-full p-3 rounded-lg mb-4" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} autoFocus />

        <div className="max-h-64 overflow-auto">

          {results.map(s => (

            <button key={s.number} onClick={() => { navigate(`/surah/${s.number}`); onClose(); }} className="w-full text-left p-3 rounded-lg mb-2" style={{ background: 'var(--background)' }}>

              <p style={{ color: 'var(--text-primary)' }}>{s.english_name}</p>

              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.english_meaning}</p>

            </button>

          ))}

        </div>

      </div>

    </div>

  );

};


const AudioPlayer = () => {

  const { isPlaying, currentSurah, currentVerse, surahName, audioUrl, isMuted, togglePlay, toggleMute, skipPrevious, skipNext } = useAudio();

  if (!currentSurah || !audioUrl) return null;

  return (

    <div className="audio-player-floating animate-fade-in">

      <div className="flex items-center gap-3 px-4">

        <button onClick={skipPrevious} className="btn-icon"><SkipBack className="w-4 h-4" /></button>

        <button onClick={togglePlay} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)', color: 'white' }}>{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>

        <button onClick={skipNext} className="btn-icon"><SkipForward className="w-4 h-4" /></button>

        <div className="flex-1"><p className="text-sm" style={{ color: 'var(--text-primary)' }}>{surahName}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Verse {currentVerse}</p></div>

        <button onClick={toggleMute} className="btn-icon">{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>

      </div>

    </div>

  );

};


const HomePage = () => (

  <main className="animate-fade-in">

    <section className="hero-section">

      <div className="hero-bg" />

      <div className="relative z-10 text-center px-4">

        <p className="font-heading text-lg font-bold mb-6" style={{ color: 'var(--accent-primary)' }}>Koshish e Maghfirat Mohammed Siddique bin Mohammed Mukhtar</p>

        <h1 className="heading-1 mb-4" style={{ color: 'var(--text-primary)' }}>The Holy Quran</h1>

        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Read, study, and reflect upon the words of Allah</p>

        <div className="flex flex-wrap justify-center gap-4">

          <Link to="/surahs"><button className="btn-primary">Browse Surahs</button></Link>

          <Link to="/siparas"><button className="btn-secondary">Browse by Sipara</button></Link>

        </div>

      </div>

    </section>

    <section className="container-main py-12">

      <div className="flex justify-between mb-8"><h2 className="heading-2" style={{ color: 'var(--text-primary)' }}>Siparas</h2><Link to="/siparas" style={{ color: 'var(--accent-primary)' }}>View all →</Link></div>

      <div className="grid-sipara">{SIPARA_DATA.slice(0, 10).map(s => (<Link key={s.number} to={`/sipara/${s.number}`}><div className="sipara-card"><div className="flex items-center gap-3"><span className="surah-number text-sm">{s.number}</span><div><p style={{ color: 'var(--text-primary)' }}>Para {s.number}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.name}</p></div></div></div></Link>))}</div>

    </section>

    <section className="py-12" style={{ background: 'var(--surface)' }}>

      <div className="container-main">

        <div className="flex justify-between mb-8"><h2 className="heading-2" style={{ color: 'var(--text-primary)' }}>Popular Surahs</h2><Link to="/surahs" style={{ color: 'var(--accent-primary)' }}>View all →</Link></div>

        <div className="grid-surah">{[1, 36, 67, 55, 18, 112].map(num => { const s = SURAHS_DATA.find(x => x.number === num); return s && (<Link key={s.number} to={`/surah/${s.number}`}><div className="card-flat p-6"><div className="flex justify-between mb-4"><span className="surah-number">{s.number}</span><span className="font-arabic text-2xl" style={{ color: 'var(--text-primary)' }}>{s.name}</span></div><h3 className="font-heading text-lg" style={{ color: 'var(--text-primary)' }}>{s.english_name}</h3><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.english_meaning} • {s.ayahs} verses</p></div></Link>); })}</div>

      </div>

    </section>

  </main>

);


const SiparasPage = () => (

  <main className="container-main py-8 animate-fade-in">

    <h1 className="heading-1 mb-2" style={{ color: 'var(--text-primary)' }}>Siparas (Juz)</h1>

    <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>The Quran divided into 30 parts</p>

    <div className="grid-sipara">{SIPARA_DATA.map(s => (<Link key={s.number} to={`/sipara/${s.number}`}><div className="sipara-card"><div className="flex items-center gap-3"><span className="surah-number text-sm">{s.number}</span><div><p style={{ color: 'var(--text-primary)' }}>Para {s.number}</p><p className="text-xs" 
                                                  style={{ color: 'var(--text-secondary)' }}>{s.name}</p></div></div></div></Link>))}</div>
  </main>

);


const SiparaDetailPage = () => {

  const { number } = useParams();

  const sipara = SIPARA_DATA[parseInt(number) - 1];

  const surahs = sipara ? SURAHS_DATA.filter(s => s.number >= sipara.start_surah && s.number <= sipara.end_surah) : [];

  if (!sipara) return <main className="container-main py-8"><p>Not found</p></main>;

  return (

    <main className="container-main py-8 animate-fade-in">

      <p className="ui-label mb-2">Sipara {sipara.number}</p>

      <h1 className="heading-1 mb-8" style={{ color: 'var(--text-primary)' }}>{sipara.name}</h1>

      <div className="grid-surah">{surahs.map(s => (<Link key={s.number} to={`/surah/${s.number}`}><div className="card-flat p-6"><div className="flex justify-between mb-4"><span className="surah-number">{s.number}</span><span className="font-arabic text-2xl" style={{ color: 'var(--text-primary)' }}>{s.name}</span></div><h3 className="font-heading text-lg" style={{ color: 'var(--text-primary)' }}>{s.english_name}</h3><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.english_meaning}</p></div></Link>))}</div>

    </main>

  );

};


const SurahsPage = () => {

  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? SURAHS_DATA : SURAHS_DATA.filter(s => s.revelation.toLowerCase() === filter);

  return (

    <main className="container-main py-8 animate-fade-in">

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

        <div><h1 className="heading-1 mb-2" style={{ color: 'var(--text-primary)' }}>Surahs</h1><p style={{ color: 'var(--text-secondary)' }}>114 chapters</p></div>

        <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>

          <option value="all">All</option><option value="meccan">Meccan</option><option value="medinan">Medinan</option>

        </select>

      </div>

      <div className="grid-surah">{filtered.map(s => (<Link key={s.number} to={`/surah/${s.number}`}><div className="card-flat p-6"><div className="flex justify-between mb-4"><span className="surah-number">{s.number}</span><span className="font-arabic text-2xl" style={{ color: 'var(--text-primary)' }}>{s.name}</span></div><h3 className="font-heading text-lg" style={{ color: 'var(--text-primary)' }}>{s.english_name}</h3><p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{s.english_meaning}</p><span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-secondary-muted)', color: 'var(--accent-secondary)' }}>{s.ayahs} verses</span></div></Link>))}</div>

    </main>

  );

};

const SurahReaderPage = () => {

  const { number } = useParams();

  const [verses, setVerses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [textMode, setTextMode] = useState("both");

  const { toggleBookmark, isBookmarked } = useBookmarks();

  const { loadSurahAudio, playVerse, currentVerse, isPlaying, audioList } = useAudio();

  const surah = SURAHS_DATA[parseInt(number) - 1];

  useEffect(() => {

    const fetchSurah = async () => {

      setLoading(true);

      try {

        const [indopakRes, transRes] = await Promise.all([fetch(`${QURAN_API}/quran/verses/indopak?chapter_number=${number}`), fetch(`${ALQURAN_API}/surah/${number}/en.sahih`)]);

        const indopakData = await indopakRes.json();

        const transData = await transRes.json();

        const combined = (transData.data?.ayahs || []).map((t, i) => ({ number: t.numberInSurah, arabic: indopakData.verses?.[i]?.text_indopak || "", translation: t.text, juz: t.juz }));

        setVerses(combined);

        loadSurahAudio(parseInt(number), surah?.english_name);

      } catch (e) { console.error(e); toast.error("Failed to load"); }

      setLoading(false);

    };

    fetchSurah();

  }, [number]);

  if (loading) return <main className="reader-container py-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} /></main>;

  if (!surah) return <main className="container-main py-8"><p>Not found</p></main>;

  return (

    <main className="animate-fade-in pb-24">

      <div className="sticky top-16 z-40 py-4" style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>

        <div className="reader-container">

          <div className="toggle-container inline-flex">{["arabic", "both", "english"].map(m => (<button key={m} onClick={() => setTextMode(m)} className={textMode === m ? "toggle-active" : "toggle-inactive"}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>))}</div>

        </div>

      </div>

      <div className="reader-container py-8 text-center" style={{ borderBottom: '1px solid var(--border)' }}>

        <span className="font-arabic text-4xl block mb-4" style={{ color: 'var(--text-primary)' }}>{surah.name}</span>

        <h1 className="heading-2" style={{ color: 'var(--text-primary)' }}
 >{surah.english_name}</h1>

        <p style={{ color: 'var(--text-secondary)' }}>{surah.english_meaning} • {surah.ayahs} verses</p>

      </div>

      {surah.number !== 9 && surah.number !== 1 && (<div className="reader-container py-8 text-center" style={{ borderBottom: '1px solid var(--border)' }}><span className="font-arabic text-3xl" style={{ color: 'var(--text-primary)' }}>بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ</span>{textMode !== "arabic" && <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>In the name of Allah, the Most Gracious, the Most Merciful</p>}</div>)}

      <div className="reader-container">{verses.map(v => (<div key={v.number} className="verse-item"><div className="flex justify-between mb-4"><span className="surah-number text-sm">{v.number}</span><div className="flex gap-2"><button onClick={() => { const a = audioList.find(x => x.verse_number === v.number); if (a) playVerse(v.number, a.audio_url); }} className={`btn-icon ${currentVerse === v.number && isPlaying ? 'play-active' : ''}`}>{currentVerse === v.number && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button><button onClick={() => toggleBookmark(surah.number, v.number, surah.english_name)} className={`btn-icon ${isBookmarked(surah.number, v.number) ? 'bookmark-active' : ''}`}>{isBookmarked(surah.number, v.number) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}</button></div></div>{(textMode === "arabic" || textMode === "both") && <p className="arabic-text mb-6" style={{ color: 'var(--text-primary)' }}>{v.arabic}</p>}{(textMode === "english" || textMode === "both") && <p className="translation-text" style={{ color: textMode === "both" ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{v.translation}</p>}</div>))}</div>

    </main>

  );

};


const HadithHomePage = () => (

  <main className="container-main py-8 animate-fade-in">

    <div className="text-center mb-12"><h1 className="heading-1 mb-4" style={{ color: 'var(--text-primary)' }}>Hadith Collections</h1><p style={{ color: 'var(--text-secondary)' }}>Authentic sayings of Prophet Muhammad (ﷺ)</p></div>

    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">{[{ id: "bukhari", name: "Sahih al-Bukhari", arabic: "صحيح البخاري", author: "Imam al-Bukhari" }, { id: "muslim", name: "Sahih Muslim", arabic: "صحيح مسلم", author: "Imam Muslim" }].map(c => (<Link key={c.id} to={`/hadith/${c.id}`}><div className="card-flat p-8"><span className="font-arabic text-3xl block text-right mb-4" style={{ color: 'var(--text-primary)' }}>{c.arabic}</span><h2 className="heading-2 mb-2" style={{ color: 'var(--text-primary)' }}>{c.name}</h2><p style={{ color: 'var(--accent-secondary)' }}>{c.author}</p></div></Link>))}</div>

  </main>

);


const HadithCollectionPage = () => {

  const { collection } = useParams();

  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const names = { bukhari: { name: "Sahih al-Bukhari", arabic: "صحيح البخاري" }, muslim: { name: "Sahih Muslim", arabic: "صحيح مسلم" } };

  const info = names[collection] || { name: collection, arabic: "" };

  useEffect(() => {

    const fetchBooks = async () => {

      setLoading(true);

      try {

        const res = await fetch(`${HADITH_API}/editions/eng-${collection}.min.json`);

        const data = await res.json();

        const sections = data.metadata?.sections || {};

        const hadiths = data.hadiths || [];

        const counts = {};

        hadiths.forEach(h => { const b = h.reference?.book || 1; counts[b] = (counts[b] || 0) + 1; });

        setBooks(Object.entries(sections).filter(([k, v]) => k !== "0" && v).map(([k, v]) => ({ book_number: k, book_name: v, hadith_count: counts[parseInt(k)] || 0 })).sort((a, b) => parseInt(a.book_number) - parseInt(b.book_number)));

      } catch (e) { console.error(e); }

      setLoading(false);

    };

    fetchBooks();

  }, [collection]);

  return (

    <main className="container-main py-8 animate-fade-in">

      <Link to="/hadith" style={{ color: 'var(--accent-primary)' }}>← Back</Link>

      <span className="font-arabic text-2xl block mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>{info.arabic}</span>

      <h1 className="heading-1 mb-8" style={{ color: 'var(--text-primary)' }}>{info.name}</h1>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} /></div> : <div className="grid-surah">{books.map(b => (<Link key={b.book_number} to={`/hadith/${collection}/book/${b.book_number}`}><div className="card-flat p-6"><div className="flex justify-between mb-3"><span className="surah-number text-sm">{b.book_number}</span><span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-secondary-muted)', color: 'var(--accent-secondary)' }}>{b.hadith_count}</span></div><h3 className="font-heading" style={{ color: 'var(--text-primary)' }}>{b.book_name}</h3></div></Link>))}</div>}

    </main>

  );

};


const HadithBookPage = () => {

  const { collection, bookNumber } = useParams();

  const [hadiths, setHadiths] = useState([]);

  const [bookName, setBookName] = useState("");

  const [loading, setLoading] = useState(true);

  const names = { bukhari: "Sahih al-Bukhari", muslim: "Sahih Muslim" };

  useEffect(() => {

    const fetchHadiths = async () => {

      setLoading(true);

      try {

        const res = await fetch(`${HADITH_API}/editions/eng-${collection}.min.json`);

        const data = await res.json();

        setBookName(data.metadata?.sections?.[bookNumber] || `Book ${bookNumber}`);

        setHadiths((data.hadiths || []).filter(h => h.reference?.book === parseInt(bookNumber)).map(h => ({ hadith_number: h.hadithnumber, text: h.text, grade: h.grades?.[0]?.grade || "Sahih" })));

      } catch (e) { console.error(e); }

      setLoading(false);

    };

    fetchHadiths();

  }, [collection, bookNumber]);

  return (

    <main className="reader-container py-8 animate-fade-in pb-24">

      <Link to={`/hadith/${collection}`} style={{ color: 'var(--accent-primary)' }}>← Back to {names[collection]}</Link>

      <p className="ui-label mt-4 mb-2">{names[collection]} • Book {bookNumber}</p>

      <h1 className="heading-2 mb-8" style={{ color: 'var(--text-primary)' }}>{bookName}</h1>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} /></div> : <div className="space-y-6">{hadiths.map((h, i) => (<div key={i} className="card-flat p-6"><div className="flex items-center gap-3 mb-4"><span className="surah-number text-sm">{h.hadith_number}</span><span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-primary)', color: 'white' }}>{h.grade}</span></div><p className="translation-text" style={{ color: 'var(--text-primary)' }}>{h.text}</p></div>))}</div>}

    </main>

  );

};


const BookmarksPage = () => {

  const { bookmarks, toggleBookmark } = useBookmarks();

  const navigate = useNavigate();

  return (

    <main className="container-main py-8 animate-fade-in">

      <h1 className="heading-1 mb-2" style={{ color: 'var(--text-primary)' }}>Bookmarks</h1>

      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Your saved verses</p>

      {bookmarks.length === 0 ? (<div className="empty-state"><Bookmark className="w-16 h-16 mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} /><p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No bookmarks yet</p><Link to="/surahs"><button className="btn-primary">Browse Surahs</button></Link></div>) : (<div className="space-y-4">{bookmarks.map(b => (<div key={b.key} className="card-flat p-6 flex justify-between items-center"><button onClick={() => navigate(`/surah/${b.surahNumber}`)} className="text-left"><p className="font-heading text-lg" style={{ color: 'var(--text-primary)' }}>{b.surahName}</p><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Verse {b.verseNumber}</p></button><button onClick={() => toggleBookmark(b.surahNumber, b.verseNumber, b.surahName)} className="btn-icon bookmark-active"><BookmarkCheck className="w-5 h-5" /></button></div>))}</div>)}

    </main>

  );

};


const Footer = () => (<footer className="py-8 mt-12" style={{ borderTop: '1px solid var(--border)' }}><div className="container-main text-center"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quran & Hadith Study App</p></div></footer>);


function App() {

  return (

    <ThemeProvider>

      <BookmarksProvider>

        <AudioProvider>

          <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

            <BrowserRouter>

              <Header />

              <Routes>

                <Route path="/" element={<HomePage />} />

                <Route path="/siparas" element={<SiparasPage />} />

                <Route path="/sipara/:number" element={<SiparaDetailPage />} />

                <Route path="/surahs" element={<SurahsPage />} />

                <Route path="/surah/:number" element={<SurahReaderPage />} />

                <Route path="/hadith" element={<HadithHomePage />} />

                <Route path="/hadith/:collection" element={<HadithCollectionPage />} />

                <Route path="/hadith/:collection/book/:bookNumber" element={<HadithBookPage />} />

                <Route path="/bookmarks" element={<BookmarksPage />} />

              </Routes>

              <AudioPlayer />

              <Footer />

            </BrowserRouter>

            <Toaster position="bottom-right" />

          </div>

        </AudioProvider>

      </BookmarksProvider>

    </ThemeProvider>

  );

}


export default App;
