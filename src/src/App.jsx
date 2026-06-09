import { useState } from "react";import { useState } from "react";

// ⚠️ SÉCURITÉ : Dans une vraie app, cette clé doit être côté serveur uniquement
// Ne jamais exposer une clé API dans le code front en production
const DUFFEL_TOKEN = "duffel_test_HqzqG5wILFg7okQxP5Bcd3GkeQAY1nwUvVXk3mobR98";

const AIRPORTS = [
  { city:"Paris",     code:"CDG", country:"France" },
  { city:"Lyon",      code:"LYS", country:"France" },
  { city:"Nice",      code:"NCE", country:"France" },
  { city:"New York",  code:"JFK", country:"États-Unis" },
  { city:"Dubaï",     code:"DXB", country:"Émirats" },
  { city:"Tokyo",     code:"NRT", country:"Japon" },
  { city:"Londres",   code:"LHR", country:"Royaume-Uni" },
  { city:"Miami",     code:"MIA", country:"États-Unis" },
  { city:"Singapour", code:"SIN", country:"Singapour" },
  { city:"Los Angeles",code:"LAX",country:"États-Unis" },
];

const CABIN_MAP = { "Tous":"business", "Business":"business", "Première":"first" };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#04060f; --s1:rgba(255,255,255,0.03); --s2:rgba(255,255,255,0.06);
    --b:rgba(56,217,245,0.1); --bh:rgba(56,217,245,0.32);
    --cyan:#38d9f5; --cd:rgba(56,217,245,0.55); --cf:rgba(56,217,245,0.07);
    --blue:#5b8fff; --green:#3dffa0; --red:#ff5e7e;
    --w:#eaf4ff; --dim:rgba(234,244,255,0.5); --dimmer:rgba(234,244,255,0.22); --dimmest:rgba(234,244,255,0.1);
  }
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--w);font-family:'DM Sans',sans-serif;font-weight:300;min-height:100vh;overflow-x:hidden}
  ::selection{background:rgba(56,217,245,0.18)}
  ::-webkit-scrollbar{width:2px}
  ::-webkit-scrollbar-thumb{background:var(--cd);border-radius:2px}

  .bg-wrap{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
  .bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(56,217,245,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(56,217,245,0.022) 1px,transparent 1px);background-size:72px 72px}
  .bg-orb{position:absolute;border-radius:50%;filter:blur(140px)}
  .orb-a{width:700px;height:700px;background:#1a3a8f;opacity:.09;top:-300px;left:-200px}
  .orb-b{width:500px;height:500px;background:#0e9bab;opacity:.08;top:30%;right:-150px;animation:drift 14s ease-in-out infinite alternate}
  .orb-c{width:350px;height:350px;background:#4a1f8f;opacity:.07;bottom:-80px;left:35%}
  @keyframes drift{to{transform:translateY(-50px) scale(1.1)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}

  .scanline{position:fixed;left:0;right:0;height:2px;z-index:9999;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(56,217,245,0.12),transparent);animation:scanline 10s linear infinite;opacity:.5}
  .app{position:relative;z-index:1;min-height:100vh}

  /* NAV */
  .nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:60px;background:rgba(4,6,15,0.88);backdrop-filter:blur(32px);border-bottom:1px solid var(--b);position:sticky;top:0;z-index:200}
  .nav-logo{font-family:'Oxanium',sans-serif;font-size:17px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}
  .logo-i{color:var(--cyan);text-shadow:0 0 16px rgba(56,217,245,0.6)}
  .nav-r{display:flex;align-items:center;gap:12px}
  .live-badge{display:flex;align-items:center;gap:6px;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--cd);border:1px solid var(--b);border-radius:100px;padding:4px 12px;background:var(--cf)}
  .live-dot{width:5px;height:5px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);animation:pulse 1.5s infinite}

  /* SEARCH */
  .search-panel{background:rgba(4,6,15,0.92);border-bottom:1px solid var(--b);padding:28px 40px 24px;animation:fadeIn .6s ease both}
  .sp-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
  .cabin-tabs{display:flex;gap:4px}
  .ctab{padding:6px 16px;border-radius:100px;border:1px solid var(--b);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
  .ctab.on{border-color:var(--cd);color:var(--cyan);background:var(--cf);box-shadow:0 0 12px rgba(56,217,245,0.1)}
  .pax-ctrl{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--dim)}
  .pax-btn{width:26px;height:26px;border-radius:50%;border:1px solid var(--b);background:var(--s1);color:var(--w);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .2s}
  .pax-btn:hover{border-color:var(--cd);color:var(--cyan)}
  .pax-num{font-family:'Oxanium',sans-serif;font-size:16px;font-weight:600;color:var(--w);min-width:16px;text-align:center}

  .sp-fields{display:grid;grid-template-columns:1fr 44px 1fr 180px auto;gap:0;border:1px solid var(--b);border-radius:12px;overflow:hidden;background:var(--s1)}
  .sf{display:flex;flex-direction:column;padding:14px 20px;border-right:1px solid var(--b);cursor:pointer;position:relative}
  .sf:hover{background:var(--s2)}
  .sf-label{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--cd);margin-bottom:5px}
  .sf-val{font-family:'Oxanium',sans-serif;font-size:18px;font-weight:500;color:var(--w);line-height:1.1}
  .sf-sub{font-size:10px;color:var(--dimmer);margin-top:2px}
  .sf-select{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;background:transparent;border:none;outline:none}
  .sf-select option{background:#080c1a;font-size:13px}
  .sf-date{border:none;background:transparent;color:transparent;position:absolute;inset:0;width:100%;height:100%;cursor:pointer;outline:none}
  .sf-date::-webkit-calendar-picker-indicator{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
  .swap-col{display:flex;align-items:center;justify-content:center;border-right:1px solid var(--b);background:var(--s1);cursor:pointer;color:var(--cd);font-size:18px;transition:all .2s}
  .swap-col:hover{color:var(--cyan);background:var(--cf)}
  .search-go{background:linear-gradient(135deg,var(--cyan),var(--blue));border:none;color:#04060f;font-family:'Oxanium',sans-serif;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:0 32px;cursor:pointer;transition:all .25s;min-width:140px}
  .search-go:hover{filter:brightness(1.12);box-shadow:0 0 32px rgba(56,217,245,0.3)}
  .search-go:disabled{opacity:.5;cursor:not-allowed}

  /* RESULTS */
  .results-wrap{max-width:1000px;margin:0 auto;padding:24px 24px 80px;animation:fadeUp .5s ease both}
  .results-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}
  .results-info{display:flex;align-items:baseline;gap:12px}
  .results-count{font-family:'Oxanium',sans-serif;font-size:22px;font-weight:600}
  .results-label{font-size:12px;color:var(--dim)}
  .sort-wrap{display:flex;align-items:center;gap:8px}
  .sort-label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--dimmer)}
  .sort-sel{background:var(--s1);border:1px solid var(--b);border-radius:8px;color:var(--w);padding:7px 14px;font-size:11px;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:border-color .2s}
  .sort-sel:focus{border-color:var(--cd)}
  .sort-sel option{background:#080c1a}

  /* CARD */
  .fcard{border:1px solid var(--b);border-radius:12px;background:rgba(8,12,26,0.75);backdrop-filter:blur(28px);margin-bottom:10px;overflow:hidden;cursor:pointer;transition:all .28s;animation:fadeUp .4s ease both;position:relative}
  .fcard:hover{border-color:var(--bh);transform:translateY(-2px);box-shadow:0 12px 48px rgba(0,0,0,0.5)}
  .fcard-best{border-color:rgba(56,217,245,0.22)}
  .top-badge{position:absolute;top:0;right:20px;font-family:'Oxanium',sans-serif;font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:4px 14px;border-radius:0 0 8px 8px}
  .badge-best{background:linear-gradient(135deg,var(--cyan),var(--blue));color:#04060f}
  .badge-cheap{background:rgba(61,255,160,0.12);border:1px solid rgba(61,255,160,0.3);border-top:none;color:var(--green)}

  .fcard-inner{padding:20px 24px}
  .card-row1{display:flex;align-items:center;gap:0}

  .airline-col{width:160px;flex-shrink:0;display:flex;align-items:center;gap:10px}
  .airline-logo{width:38px;height:38px;border-radius:8px;border:1px solid var(--b);background:var(--s1);display:flex;align-items:center;justify-content:center;font-family:'Oxanium',sans-serif;font-size:10px;font-weight:700;color:var(--cyan);flex-shrink:0;text-align:center;line-height:1.1}
  .airline-name{font-size:12px;font-weight:500;color:var(--w);line-height:1.3}
  .airline-cabin{display:inline-block;margin-top:3px;padding:2px 7px;border-radius:100px;font-size:8px;letter-spacing:.12em;text-transform:uppercase;border:1px solid rgba(56,217,245,0.25);color:var(--cd)}

  .route-col{flex:1;display:flex;align-items:center;gap:12px;padding:0 20px}
  .rc{text-align:center}
  .rc-code{font-family:'Oxanium',sans-serif;font-size:30px;font-weight:600;color:var(--w);line-height:1}
  .rc-city{font-size:10px;color:var(--dimmer);margin-top:2px}
  .rc-time{font-family:'Oxanium',sans-serif;font-size:13px;color:var(--cd);margin-top:3px}
  .rc-r{text-align:right}
  .route-mid{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px}
  .route-dur{font-size:10px;letter-spacing:.1em;color:var(--dimmer);text-transform:uppercase}
  .route-bar{position:relative;width:100%;height:1px;background:linear-gradient(90deg,var(--cd),rgba(91,143,255,0.4))}
  .route-bar::before,.route-bar::after{content:'';position:absolute;top:50%;transform:translateY(-50%);width:5px;height:5px;border-radius:50%}
  .route-bar::before{left:0;background:var(--cyan);box-shadow:0 0 6px var(--cyan)}
  .route-bar::after{right:0;background:var(--blue);box-shadow:0 0 6px var(--blue)}
  .route-stops{font-size:9px;color:var(--dimmer)}
  .direct{color:var(--green)}

  .price-col{text-align:right;min-width:140px;flex-shrink:0}
  .price-val{font-family:'Oxanium',sans-serif;font-size:32px;font-weight:600;line-height:1;background:linear-gradient(135deg,var(--cyan),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .price-sub{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--dimmer);margin-top:3px}

  .card-row2{display:flex;align-items:center;justify-content:space-between;padding:12px 24px 14px;border-top:1px solid rgba(56,217,245,0.05);flex-wrap:wrap;gap:10px}
  .perks{display:flex;gap:12px;flex-wrap:wrap}
  .perk{font-size:11px;color:var(--dim);display:flex;align-items:center;gap:5px}
  .perk-dot{width:4px;height:4px;border-radius:50%;background:var(--cd);flex-shrink:0}
  .card-actions{display:flex;align-items:center;gap:12px;flex-shrink:0}
  .card-rating{font-family:'Oxanium',sans-serif;font-size:11px;color:var(--cd)}
  .book-btn{padding:9px 22px;border-radius:8px;font-family:'Oxanium',sans-serif;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:all .22s;border:1px solid var(--cd);color:var(--cyan);background:var(--cf)}
  .book-btn:hover{background:rgba(56,217,245,0.15);box-shadow:0 0 20px rgba(56,217,245,0.2)}

  /* STATES */
  .loading{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:80px;color:var(--cd)}
  .spinner{width:36px;height:36px;border:2px solid var(--b);border-top-color:var(--cyan);border-radius:50%;animation:spin .8s linear infinite}
  .loading-text{font-family:'Oxanium',sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;animation:pulse 1.5s infinite}
  .empty{padding:60px;text-align:center;font-family:'Oxanium',sans-serif;font-size:16px;color:var(--dimmer);line-height:1.8}
  .error-box{margin:24px;padding:20px 24px;border:1px solid rgba(255,94,126,0.3);border-radius:12px;background:rgba(255,94,126,0.06);color:var(--red);font-size:13px;line-height:1.7}
  .error-box strong{font-family:'Oxanium',sans-serif;letter-spacing:.1em}

  .welcome{padding:60px 40px;text-align:center;animation:fadeUp .8s ease both}
  .welcome-icon{font-size:48px;margin-bottom:20px;animation:pulse 3s infinite}
  .welcome-h{font-family:'Oxanium',sans-serif;font-size:clamp(28px,4vw,52px);font-weight:600;margin-bottom:14px}
  .welcome-h span{background:linear-gradient(135deg,var(--cyan),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .welcome-p{font-size:14px;color:var(--dim);max-width:460px;margin:0 auto;line-height:1.8}

  .toast{position:fixed;bottom:28px;right:28px;z-index:9999;border:1px solid var(--cd);border-radius:10px;background:rgba(4,6,15,0.96);backdrop-filter:blur(24px);color:var(--cyan);padding:13px 22px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-family:'Oxanium',sans-serif;box-shadow:0 0 20px rgba(56,217,245,0.2);animation:fadeUp .3s ease}

  @media(max-width:800px){
    .nav{padding:0 20px}
    .sp-fields{grid-template-columns:1fr 1fr}
    .swap-col{display:none}
    .sf{border-bottom:1px solid var(--b);border-right:none}
    .search-go{grid-column:span 2;padding:14px}
    .card-row1{flex-wrap:wrap;gap:16px}
    .route-col{padding:0;width:100%;order:3}
    .price-col{text-align:left}
  }
`;

/* ── Formater la durée ISO 8601 (ex: PT8H30M) ── */
function formatDuration(iso) {
  const h = iso.match(/(\d+)H/)?.[1] || "0";
  const m = iso.match(/(\d+)M/)?.[1] || "00";
  return `${h}h ${m.padStart(2,"0")}`;
}

/* ── Extraire les infos d'un slice Duffel ── */
function parseOffer(offer) {
  const slice   = offer.slices[0];
  const seg     = slice.segments[0];
  const lastSeg = slice.segments[slice.segments.length - 1];
  const stops   = slice.segments.length - 1;

  return {
    id:          offer.id,
    airline:     seg.marketing_carrier.name,
    iata:        seg.marketing_carrier.iata_code,
    fromCode:    seg.origin.iata_code,
    fromCity:    seg.origin.city_name || seg.origin.iata_code,
    toCode:      lastSeg.destination.iata_code,
    toCity:      lastSeg.destination.city_name || lastSeg.destination.iata_code,
    departure:   seg.departing_at?.slice(11,16) || "—",
    arrival:     lastSeg.arriving_at?.slice(11,16) || "—",
    duration:    formatDuration(slice.duration || "PT0H"),
    stops,
    price:       parseFloat(offer.total_amount),
    currency:    offer.total_currency,
    cabin:       seg.passengers?.[0]?.cabin_class_marketing_name || "Business",
    baggage:     offer.passengers?.[0]?.baggages?.map(b=>`${b.quantity} bagage${b.quantity>1?"s":""} ${b.type}`).join(", ") || null,
  };
}

export default function ICanFly() {
  const [cabin,    setCabin]    = useState("Business");
  const [origin,   setOrigin]   = useState("CDG");
  const [dest,     setDest]     = useState("JFK");
  const [date,     setDate]     = useState("2026-08-15");
  const [pax,      setPax]      = useState(1);
  const [sortBy,   setSortBy]   = useState("price");
  const [offers,   setOffers]   = useState([]);
  const [status,   setStatus]   = useState("idle"); // idle | loading | done | error
  const [errMsg,   setErrMsg]   = useState("");
  const [toast,    setToast]    = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const doSwap = () => { const t=origin; setOrigin(dest); setDest(t); };

  /* ── APPEL API DUFFEL ── */
  const searchFlights = async () => {
    if (origin === dest) { showToast("Départ et destination identiques"); return; }
    setStatus("loading");
    setOffers([]);
    setErrMsg("");

    const cabinClass = CABIN_MAP[cabin] || "business";

    const body = {
      data: {
        slices: [{ origin, destination: dest, departure_date: date }],
        passengers: Array(pax).fill({ type:"adult" }),
        cabin_class: cabinClass,
      }
    };

    try {
      const res = await fetch("https://api.duffel.com/air/offer_requests?return_offers=true", {
        method: "POST",
        headers: {
          "Content-Type":    "application/json",
          "Accept":          "application/json",
          "Duffel-Version":  "v2",
          "Authorization":   `Bearer ${DUFFEL_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.errors?.[0]?.message || json?.errors?.[0]?.title || "Erreur API Duffel";
        setErrMsg(msg);
        setStatus("error");
        return;
      }

      const raw = json?.data?.offers || [];
      const parsed = raw.map(parseOffer);
      setOffers(parsed);
      setStatus("done");
      showToast(`${parsed.length} offre${parsed.length!==1?"s":""} trouvée${parsed.length!==1?"s":""}`);

    } catch (e) {
      setErrMsg("Impossible de contacter l'API. Vérifiez votre connexion.");
      setStatus("error");
    }
  };

  /* ── TRI ── */
  const sorted = [...offers].sort((a,b) => {
    if (sortBy==="price")    return a.price - b.price;
    if (sortBy==="duration") {
      const dur = s => { const [h,m]=s.replace("h","").split(" "); return +h*60+(+m||0); };
      return dur(a.duration) - dur(b.duration);
    }
    if (sortBy==="stops") return a.stops - b.stops;
    return a.price - b.price;
  });

  const cheapId = sorted[0]?.id;
  const bestId  = sorted.length > 1 ? sorted[1]?.id : null;

  const originAirport = AIRPORTS.find(a=>a.code===origin);
  const destAirport   = AIRPORTS.find(a=>a.code===dest);

  return (
    <>
      <style>{CSS}</style>
      <div className="scanline"/>
      <div className="bg-wrap">
        <div className="bg-grid"/>
        <div className="bg-orb orb-a"/>
        <div className="bg-orb orb-b"/>
        <div className="bg-orb orb-c"/>
      </div>

      <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo"><span className="logo-i">I</span>CANFLY</div>
          <div className="nav-r">
            <div className="live-badge"><div className="live-dot"/>Duffel · Live</div>
          </div>
        </nav>

        {/* SEARCH */}
        <div className="search-panel">
          <div className="sp-top">
            <div className="cabin-tabs">
              {["Business","Première"].map(c=>(
                <button key={c} className={`ctab ${cabin===c?"on":""}`} onClick={()=>setCabin(c)}>{c}</button>
              ))}
            </div>
            <div className="pax-ctrl">
              <span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--dimmer)"}}>Passagers</span>
              <button className="pax-btn" onClick={()=>setPax(p=>Math.max(1,p-1))}>−</button>
              <span className="pax-num">{pax}</span>
              <button className="pax-btn" onClick={()=>setPax(p=>Math.min(9,p+1))}>+</button>
            </div>
          </div>

          <div className="sp-fields">
            {/* Origine */}
            <div className="sf">
              <span className="sf-label">Départ</span>
              <span className="sf-val">{origin}</span>
              <span className="sf-sub">{originAirport?.city}</span>
              <select className="sf-select" value={origin} onChange={e=>setOrigin(e.target.value)}>
                {AIRPORTS.map(a=><option key={a.code} value={a.code}>{a.city} — {a.code}</option>)}
              </select>
            </div>
            {/* Swap */}
            <div className="swap-col" onClick={doSwap}>⇄</div>
            {/* Dest */}
            <div className="sf">
              <span className="sf-label">Destination</span>
              <span className="sf-val">{dest}</span>
              <span className="sf-sub">{destAirport?.city}</span>
              <select className="sf-select" value={dest} onChange={e=>setDest(e.target.value)}>
                {AIRPORTS.map(a=><option key={a.code} value={a.code}>{a.city} — {a.code}</option>)}
              </select>
            </div>
            {/* Date */}
            <div className="sf" style={{position:"relative"}}>
              <span className="sf-label">Date</span>
              <span className="sf-val" style={{fontSize:14}}>{new Date(date+"T00:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}</span>
              <input type="date" className="sf-date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e=>setDate(e.target.value)}/>
            </div>
            {/* Go */}
            <button className="search-go" onClick={searchFlights} disabled={status==="loading"}>
              {status==="loading" ? "…" : "Rechercher →"}
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div className="results-wrap">

          {/* ÉTAT INITIAL */}
          {status==="idle" && (
            <div className="welcome">
              <div className="welcome-icon">✈</div>
              <h1 className="welcome-h">Volez <span>business class</span><br/>au meilleur prix</h1>
              <p className="welcome-p">Sélectionnez votre départ, votre destination et votre date. ICANFLY interroge Duffel en temps réel pour vous trouver les meilleures offres.</p>
            </div>
          )}

          {/* CHARGEMENT */}
          {status==="loading" && (
            <div className="loading">
              <div className="spinner"/>
              <div className="loading-text">Recherche des vols en cours…</div>
            </div>
          )}

          {/* ERREUR */}
          {status==="error" && (
            <div className="error-box">
              <strong>Erreur API</strong><br/>{errMsg}<br/><br/>
              <span style={{color:"var(--dimmer)",fontSize:12}}>
                En mode test Duffel, certaines routes ou dates peuvent ne pas retourner de résultats. Essayez CDG → JFK ou LHR avec une date dans les 3 prochains mois.
              </span>
            </div>
          )}

          {/* RÉSULTATS */}
          {status==="done" && (
            <>
              <div className="results-bar">
                <div className="results-info">
                  <span className="results-count">{sorted.length}</span>
                  <span className="results-label">
                    vol{sorted.length!==1?"s":""} · {origin} → {dest} · {pax} pax · {cabin}
                  </span>
                </div>
                {sorted.length > 1 && (
                  <div className="sort-wrap">
                    <span className="sort-label">Trier</span>
                    <select className="sort-sel" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                      <option value="price">Prix</option>
                      <option value="duration">Durée</option>
                      <option value="stops">Escales</option>
                    </select>
                  </div>
                )}
              </div>

              {sorted.length===0 && (
                <div className="empty">
                  Aucun vol trouvé sur cette route en mode test.<br/>
                  <span style={{fontSize:12,color:"var(--dimmer)"}}>Essayez CDG → JFK, CDG → LHR, ou LHR → JFK avec une date proche.</span>
                </div>
              )}

              {sorted.map((f,i) => {
                const isCheap = f.id===cheapId;
                const isBest  = f.id===bestId;
                return (
                  <div key={f.id} className={`fcard ${isCheap?"fcard-best":""}`}
                    style={{animationDelay:`${i*0.06}s`}}>

                    {isCheap && <div className="top-badge badge-cheap">Prix le plus bas</div>}
                    {isBest  && <div className="top-badge badge-best">Meilleur rapport</div>}

                    <div className="fcard-inner">
                      <div className="card-row1">
                        <div className="airline-col">
                          <div className="airline-logo">{f.iata}</div>
                          <div>
                            <div className="airline-name">{f.airline}</div>
                            <div className="airline-cabin">{f.cabin}</div>
                          </div>
                        </div>

                        <div className="route-col">
                          <div className="rc">
                            <div className="rc-code">{f.fromCode}</div>
                            <div className="rc-city">{f.fromCity}</div>
                            <div className="rc-time">{f.departure}</div>
                          </div>
                          <div className="route-mid">
                            <div className="route-dur">{f.duration}</div>
                            <div className="route-bar"/>
                            <div className="route-stops">
                              {f.stops===0
                                ? <span className="direct">Direct</span>
                                : <span style={{color:"var(--red)"}}>{f.stops} escale{f.stops>1?"s":""}</span>
                              }
                            </div>
                          </div>
                          <div className="rc rc-r">
                            <div className="rc-code">{f.toCode}</div>
                            <div className="rc-city">{f.toCity}</div>
                            <div className="rc-time">{f.arrival}</div>
                          </div>
                        </div>

                        <div className="price-col">
                          <div className="price-val">
                            {f.price.toLocaleString("fr-FR",{minimumFractionDigits:0,maximumFractionDigits:0})} {f.currency}
                          </div>
                          <div className="price-sub">{pax>1?`${pax} passagers`:"par personne"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="card-row2">
                      <div className="perks">
                        {f.stops===0 && <span className="perk"><span className="perk-dot"/>Vol direct</span>}
                        {f.baggage  && <span className="perk"><span className="perk-dot"/>{f.baggage}</span>}
                        <span className="perk"><span className="perk-dot"/>Classe {f.cabin}</span>}
                      </div>
                      <div className="card-actions">
                        <button className="book-btn"
                          onClick={()=>showToast("Réservation initiée · " + f.airline)}>
                          Sélectionner →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
