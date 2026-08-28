import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, CheckCircle2, ChevronDown, Droplets, Filter, Gauge, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { carRecords, makes, years, type CarRecord } from "./data/cars";
import "./index.css";

function App() {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("الكل");
  const [year, setYear] = useState("الكل");
  const [selected, setSelected] = useState<CarRecord | null>(null);

  const filtered = useMemo(() => carRecords.filter((car) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${car.make} ${car.makeEn} ${car.model}`.toLowerCase().includes(q);
    const matchesMake = make === "الكل" || car.make === make;
    const selectedYear = year === "الكل" ? null : Number(year);
    const matchesYear = selectedYear === null || (selectedYear >= car.yearFrom && selectedYear <= car.yearTo);
    return matchesQuery && matchesMake && matchesYear;
  }), [query, make, year]);

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark"><Wrench size={20} /></div><div><div className="brand-name">مِرآب</div><div className="brand-sub">دليل السيارة الذكي</div></div></div>
      <nav><a className="nav-active" href="#catalog">الكتالوج</a><a href="#how">كيف نستخدمه</a><a href="#sources">المصادر</a></nav>
      <div className="top-status"><span className="status-dot" />تحديث 2026</div>
    </header>

    <main>
      <section className="hero" id="catalog">
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> مرجع الصيانة اليومي</div><h1>المعلومة الصح<br /><em>قبل تبديل الزيت.</em></h1><p>اختَر سيارتك واعرف نوع وكمية زيت المحرك والقير، مع تنبيه واضح لاختلاف المواصفات حسب المحرك والسوق.</p><div className="hero-meta"><span><ShieldCheck size={16} /> بيانات منظمة</span><span><BookOpen size={16} /> مصدر لكل سجل</span></div></div>
        <div className="hero-card"><div className="hero-card-top"><div className="hero-icon"><Droplets size={24} /></div><span>دليل السوائل</span></div><div className="hero-card-number">2005 <span>—</span> 2026</div><div className="hero-card-label">سنوات التغطية في الكتالوج</div><div className="mini-lines"><div><span>زيت المحرك</span><b>حسب المحرك</b></div><div><span>زيت الجير</span><b>حسب الناقل</b></div></div></div>
      </section>

      <section className="search-panel"><div className="search-panel-head"><div><div className="section-kicker">ابحث في الكتالوج</div><h2>ما هي سيارتك؟</h2></div><div className="record-count"><strong>{filtered.length}</strong> سجلات ظاهرة</div></div><div className="filters"><label className="search-input"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="اكتب الشركة أو الموديل..." /></label><label className="select-wrap"><span>الشركة</span><select value={make} onChange={(e) => setMake(e.target.value)}>{makes.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label><label className="select-wrap year-select"><span>السنة</span><select value={year} onChange={(e) => setYear(e.target.value)}><option>الكل</option>{years.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label><button className="filter-button" onClick={() => { setQuery(""); setMake("الكل"); setYear("الكل"); }}><Filter size={17} /> تصفير</button></div></section>

      <section className="catalog-section"><div className="catalog-heading"><div><div className="section-kicker">نتائج البحث</div><h2>سجلات السيارات</h2></div><span className="small-note">اضغط على السجل لعرض التفاصيل</span></div><div className="car-grid">{filtered.map((car) => <button className="car-card" key={car.id} onClick={() => setSelected(car)}><div className="car-card-head"><span className={`confidence ${car.confidence === "موثق" ? "verified" : "review"}`}>{car.confidence === "موثق" ? <CheckCircle2 size={14} /> : <span className="review-dot" />} {car.confidence}</span><span className="car-years">{car.yearFrom} — {car.yearTo}</span></div><div className="car-title"><span className="make-badge">{car.makeEn.slice(0, 2).toUpperCase()}</span><div><h3>{car.make} {car.model}</h3><p>{car.engine} · {car.transmission}</p></div></div><div className="car-divider" /><div className="car-facts"><div><span>زيت المحرك</span><b>{car.engineOil.type}</b></div><div><span>زيت الجير</span><b>{car.transmissionOil.type}</b></div></div><div className="card-arrow">عرض التفاصيل <span>←</span></div></button>)}</div>{filtered.length === 0 && <div className="empty"><Search size={30} /><h3>لم نجد سجلاً مطابقاً</h3><p>جرّب اسم شركة أو موديل مختلف.</p></div>}</section>

      <section className="trust-strip" id="how"><div className="trust-item"><div className="trust-icon"><Gauge size={20} /></div><div><b>حسب المحرك والناقل</b><span>لا نعتمد على اسم الموديل وحده</span></div></div><div className="trust-item"><div className="trust-icon"><ShieldCheck size={20} /></div><div><b>مصدر ظاهر</b><span>كل سجل مرتبط بمرجع المالك</span></div></div><div className="trust-item"><div className="trust-icon"><Wrench size={20} /></div><div><b>للاستخدام العملي</b><span>معلومة مرتبة قبل زيارة الورشة</span></div></div></section>
    </main>

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><article className="detail-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><div className="detail-overline">{selected.makeEn} · {selected.yearFrom}—{selected.yearTo}</div><h2>{selected.make} {selected.model}</h2><p className="detail-engine">{selected.engine} <span>•</span> {selected.transmission}</p><div className="oil-grid"><div className="oil-card"><Droplets size={19} /><span>زيت المحرك</span><strong>{selected.engineOil.type}</strong><b>{selected.engineOil.capacity}</b><p>{selected.engineOil.note}</p></div><div className="oil-card transmission"><Droplets size={19} /><span>زيت الجير</span><strong>{selected.transmissionOil.type}</strong><b>{selected.transmissionOil.capacity}</b><p>{selected.transmissionOil.note}</p></div></div><div className="source-box"><BookOpen size={17} /><div><b>المصدر: {selected.sourceLabel}</b><a href={selected.sourceUrl} target="_blank" rel="noreferrer">فتح المرجع الرسمي ↗</a></div></div><div className="warning"><span>تنبيه مهم</span> راجع كتيب سيارتك ورمز المحرك قبل التعبئة. السعة قد تختلف بين التفريغ الكامل والتغيير العادي وبين الأسواق.</div></article></div>}
    <footer id="sources"><span>مِرآب · دليل صيانة عربي</span><span>المواصفات الأولية لا تغني عن كتيب المالك</span></footer>
  </div>
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
