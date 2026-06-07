import { useState } from "react";

const DUFFEL_TOKEN = "duffel_test_HqzqG5wILFg7okQxP5Bcd3GkeQAY1nwUvVXk3mobR98";

const AIRPORTS = [
  { city:"Paris", code:"CDG" },
  { city:"Lyon", code:"LYS" },
  { city:"Nice", code:"NCE" },
  { city:"New York", code:"JFK" },
  { city:"Dubaï", code:"DXB" },
  { city:"Tokyo", code:"NRT" },
  { city:"Londres", code:"LHR" },
  { city:"Miami", code:"MIA" },
];

function formatDuration(iso) {
  const h = iso.match(/(\d+)H/)?.[1] || "0";
  const m = iso.match(/(\d+)M/)?.[1] || "00";
  return h + "h " + m.padStart(2,"0");
}

function parseOffer(offer) {
  const slice = offer.slices[0];
  const seg = slice.segments[0];
  const last = slice.segments[slice.segments.length-1];
  return {
    id: offer.id,
    airline: seg.marketing_carrier.name,
    iata: seg.marketing_carrier.iata_code,
    fromCode: seg.origin.iata_code,
    fromCity: seg.origin.city_name || seg.origin.iata_code,
    toCode: last.destination.iata_code,
    toCity: last.destination.city_name || last.destination.iata_code,
    departure: seg.departing_at?.slice(11,16) || "—",
    arrival: last.arriving_at?.slice(11,16) || "—",
    duration: formatDuration(slice.duration || "PT0H"),
    stops: slice.segments.length - 1,
    price: parseFloat(offer.total_amount),
    currency: offer.total_currency,
  
export default function ICanFly() {
  const [cabin, setCabin] = useState("Business");
  const [origin, setOrigin] = useState("CDG");
  const [dest, setDest] = useState("JFK");
  const [date, setDate] = useState("2026-08-15");
  const [pax, setPax] = useState(1);
  const [offers, setOffers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };
  const doSwap = () => { const t=origin; setOrigin(dest); setDest(t); };

  const searchFlights = async () => {
    if (origin===dest) { showToast("Même départ et destination"); return; }
    setStatus("loading"); setOffers([]); setErrMsg("");
    try {
      const res = await fetch("https://api.duffel.com/air/offer_requests?return_offers=true", {
        method:"POST",
        headers:{ "Content-Type":"application/json","Accept":"application/json","Duffel-Version":"v2","Authorization":"Bearer "+DUFFEL_TOKEN },
        body: JSON.stringify({ data:{ slices:[{origin,destination:dest,departure_date:date}], passengers:Array(pax).fill({type:"adult"}), cabin_class:cabin==="Première"?"first":"business" }})
      });
      const json = await res.json();
      if (!res.ok) { setErrMsg(json?.errors?.[0]?.message||"Erreur"); setStatus("error"); return; }
      const parsed = (json?.data?.offers||[]).map(parseOffer);
      setOffers(parsed); setStatus("done"); showToast(parsed.length+" offres");
    } catch(e) { setErrMsg("Impossible de contacter l'API."); setStatus("error"); }
  };const sorted = [...offers].sort((a,b) => a.price - b.price);
  const cheapId = sorted[0]?.id;

  return (
    <div style={{background:"#04060f",minHeight:"100vh",color:"#eaf4ff",fontFamily:"sans-serif"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:"56px",background:"rgba(4,6,15,0.9)",borderBottom:"1px solid rgba(56,217,245,0.1)",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontFamily:"monospace",fontSize:"18px",fontWeight:"bold",letterSpacing:"0.2em"}}>
          <span style={{color:"#38d9f5"}}>I</span>CANFLY
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"10px",letterSpacing:"0.15em",color:"rgba(56,217,245,0.6)",border:"1px solid rgba(56,217,245,0.1)",borderRadius:"100px",padding:"4px 12px"}}>
          <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#38d9f5",boxShadow:"0 0 8px #38d9f5"}}/>
          DUFFEL LIVE
        </div>
      </nav>

      <div style={{background:"rgba(4,6,15,0.95)",borderBottom:"1px solid rgba(56,217,245,0.1)",padding:"20px 24px"}}>
        <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
          {["Business","Première"].map(c=>(
            <button key={c} onClick={()=>setCabin(c)} style={{padding:"6px 16px",borderRadius:"100px",border:"1px solid",borderColor:cabin===c?"rgba(56,217,245,0.5)":"rgba(56,217,245,0.1)",background:cabin===c?"rgba(56,217,245,0.07)":"transparent",color:cabin===c?"#38d9f5":"rgba(234,244,255,0.5)",cursor:"pointer",fontSize:"11px",letterSpacing:"0.14em"}}>
              {c}
            </button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px",fontSize:"12px",color:"rgba(234,244,255,0.5)"}}>
            <button onClick={()=>setPax(p=>Math.max(1,p-1))} style={{width:"24px",height:"24px",borderRadius:"50%",border:"1px solid rgba(56,217,245,0.2)",background:"transparent",color:"#eaf4ff",cursor:"pointer",fontSize:"14px"}}>−</button>
            <span style={{fontFamily:"monospace",fontSize:"15px",color:"#eaf4ff"}}>{pax}</span>
            <button onClick={()=>setPax(p=>Math.min(9,p+1))} style={{width:"24px",height:"24px",borderRadius:"50%",border:"1px solid rgba(56,217,245,0.2)",background:"transparent",color:"#eaf4ff",cursor:"pointer",fontSize:"14px"}}>+</button>
          </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr 1fr auto",border:"1px solid rgba(56,217,245,0.1)",borderRadius:"10px",overflow:"hidden",background:"rgba(255,255,255,0.03)"}}>
          <div style={{padding:"12px 16px",borderRight:"1px solid rgba(56,217,245,0.1)",display:"flex",flexDirection:"column",gap:"4px",position:"relative"}}>
            <span style={{fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(56,217,245,0.5)"}}>Départ</span>
            <span style={{fontFamily:"monospace",fontSize:"20px",color:"#eaf4ff"}}>{origin}</span>
            <select style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}} value={origin} onChange={e=>setOrigin(e.target.value)}>
              {AIRPORTS.map(a=><option key={a.code} value={a.code}>{a.city} — {a.code}</option>)}
            </select>
          </div>
          <div onClick={doSwap} style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid rgba(56,217,245,0.1)",cursor:"pointer",color:"rgba(56,217,245,0.5)",fontSize:"16px"}}>⇄</div>
          <div style={{padding:"12px 16px",borderRight:"1px solid rgba(56,217,245,0.1)",display:"flex",flexDirection:"column",gap:"4px",position:"relative"}}>
            <span style={{fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(56,217,245,0.5)"}}>Destination</span>
            <span style={{fontFamily:"monospace",fontSize:"20px",color:"#eaf4ff"}}>{dest}</span>
            <select style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}} value={dest} onChange={e=>setDest(e.target.value)}>
              {AIRPORTS.map(a=><option key={a.code} value={a.code}>{a.city} — {a.code}</option>)}
            </select>
          </div>
          <div style={{padding:"12px 16px",borderRight:"1px solid rgba(56,217,245,0.1)",display:"flex",flexDirection:"column",gap:"4px",position:"relative"}}>
            <span style={{fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(56,217,245,0.5)"}}>Date</span>
            <span style={{fontSize:"13px",color:"#eaf4ff"}}>{date}</span>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
          </div>
          <button onClick={searchFlights} disabled={status==="loading"} style={{background:"linear-gradient(135deg,#38d9f5,#5b8fff)",border:"none",color:"#04060f",fontWeight:"bold",fontSize:"11px",letterSpacing:"0.18em",padding:"0 24px",cursor:"pointer"}}>
            {status==="loading"?"...":"Rechercher →"}
          </button>
        </div>
      <div style={{maxWidth:"900px",margin:"0 auto",padding:"24px"}}>
        {status==="idle" && <div style={{textAlign:"center",padding:"60px",color:"rgba(234,244,255,0.3)",fontSize:"16px"}}>Sélectionnez une route et recherchez des vols</div>}
        {status==="loading" && <div style={{textAlign:"center",padding:"60px",color:"#38d9f5",fontSize:"12px",letterSpacing:"0.18em"}}>RECHERCHE EN COURS...</div>}
        {status==="error" && <div style={{padding:"20px",border:"1px solid rgba(255,94,126,0.3)",borderRadius:"10px",color:"#ff5e7e",fontSize:"13px"}}>{errMsg}</div>}
        {status==="done" && sorted.map((f,i)=>(
          <div key={f.id} style={{border:"1px solid",borderColor:f.id===cheapId?"rgba(61,255,160,0.25)":"rgba(56,217,245,0.1)",borderRadius:"10px",background:"rgba(8,12,26,0.75)",marginBottom:"10px",padding:"18px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
              <div style={{minWidth:"120px"}}>
                <div style={{fontFamily:"monospace",fontSize:"14px",fontWeight:"bold",color:"#eaf4ff"}}>{f.airline}</div>
                <div style={{fontSize:"9px",letterSpacing:"0.12em",color:"rgba(56,217,245,0.5)",marginTop:"3px",textTransform:"uppercase"}}>{f.iata} · {cabin}</div>
              </div>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:"12px",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"monospace",fontSize:"28px",fontWeight:"bold"}}>{f.fromCode}</div>
                  <div style={{fontSize:"11px",color:"rgba(56,217,245,0.6)"}}>{f.departure}</div>
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
                  <div style={{fontSize:"9px",color:"rgba(234,244,255,0.3)",letterSpacing:"0.1em"}}>{f.duration}</div>
                  <div style={{width:"100%",height:"1px",background:"linear-gradient(90deg,#38d9f5,rgba(91,143,255,0.4))"}}/>
                  <div style={{fontSize:"9px",color:f.stops===0?"#3dffa0":"#ff5e7e"}}>{f.stops===0?"Direct":f.stops+" escale"}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"monospace",fontSize:"28px",fontWeight:"bold"}}>{f.toCode}</div>
                  <div style={{fontSize:"11px",color:"rgba(56,217,245,0.6)"}}>{f.arrival}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                {f.id===cheapId && <div style={{fontSize:"8px",color:"#3dffa0",letterSpacing:"0.15em",marginBottom:"4px"}}>PRIX LE PLUS BAS</div>}
                <div style={{fontFamily:"monospace",fontSize:"28px",fontWeight:"bold",background:"linear-gradient(135deg,#38d9f5,#5b8fff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{Math.round(f.price).toLocaleString()} {f.currency}</div>
                <div style={{fontSize:"9px",color:"rgba(234,244,255,0.3)",marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.1em"}}>par personne</div>
                <button onClick={()=>alert("Réservation : "+f.airline)} style={{marginTop:"8px",border:"1px solid rgba(56,217,245,0.4)",color:"#38d9f5",background:"rgba(56,217,245,0.07)",padding:"7px 18px",borderRadius:"7px",cursor:"pointer",fontSize:"10px",letterSpacing:"0.15em"}}>Sélectionner →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toast && <div style={{position:"fixed",bottom:"24px",right:"24px",background:"rgba(4,6,15,0.96)",border:"1px solid rgba(56,217,245,0.4)",color:"#38d9f5",padding:"12px 20px",borderRadius:"8px",fontSize:"11px",letterSpacing:"0.14em"}}>{toast}</div>}
    </div>
  );<div style={{maxWidth:"900px",margin:"0 auto",padding:"24px"}}>
        {status==="idle" && <div style={{textAlign:"center",padding:"60px",color:"rgba(234,244,255,0.3)",fontSize:"16px"}}>Sélectionnez une route et recherchez des vols</div>}
        {status==="loading" && <div style={{textAlign:"center",padding:"60px",color:"#38d9f5",fontSize:"12px",letterSpacing:"0.18em"}}>RECHERCHE EN COURS...</div>}
        {status==="error" && <div style={{padding:"20px",border:"1px solid rgba(255,94,126,0.3)",borderRadius:"10px",color:"#ff5e7e",fontSize:"13px"}}>{errMsg}</div>}
        {status==="done" && sorted.map((f,i)=>(
          <div key={f.id} style={{border:"1px solid",borderColor:f.id===cheapId?"rgba(61,255,160,0.25)":"rgba(56,217,245,0.1)",borderRadius:"10px",background:"rgba(8,12,26,0.75)",marginBottom:"10px",padding:"18px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
              <div style={{minWidth:"120px"}}>
                <div style={{fontFamily:"monospace",fontSize:"14px",fontWeight:"bold",color:"#eaf4ff"}}>{f.airline}</div>
                <div style={{fontSize:"9px",letterSpacing:"0.12em",color:"rgba(56,217,245,0.5)",marginTop:"3px",textTransform:"uppercase"}}>{f.iata} · {cabin}</div>
              </div>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:"12px",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"monospace",fontSize:"28px",fontWeight:"bold"}}>{f.fromCode}</div>
                  <div style={{fontSize:"11px",color:"rgba(56,217,245,0.6)"}}>{f.departure}</div>
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
                  <div style={{fontSize:"9px",color:"rgba(234,244,255,0.3)",letterSpacing:"0.1em"}}>{f.duration}</div>
                  <div style={{width:"100%",height:"1px",background:"linear-gradient(90deg,#38d9f5,rgba(91,143,255,0.4))"}}/>
                  <div style={{fontSize:"9px",color:f.stops===0?"#3dffa0":"#ff5e7e"}}>{f.stops===0?"Direct":f.stops+" escale"}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"monospace",fontSize:"28px",fontWeight:"bold"}}>{f.toCode}</div>
                  <div style={{fontSize:"11px",color:"rgba(56,217,245,0.6)"}}>{f.arrival}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                {f.id===cheapId && <div style={{fontSize:"8px",color:"#3dffa0",letterSpacing:"0.15em",marginBottom:"4px"}}>PRIX LE PLUS BAS</div>}
                <div style={{fontFamily:"monospace",fontSize:"28px",fontWeight:"bold",background:"linear-gradient(135deg,#38d9f5,#5b8fff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{Math.round(f.price).toLocaleString()} {f.currency}</div>
                <div style={{fontSize:"9px",color:"rgba(234,244,255,0.3)",marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.1em"}}>par personne</div>
                <button onClick={()=>alert("Réservation : "+f.airline)} style={{marginTop:"8px",border:"1px solid rgba(56,217,245,0.4)",color:"#38d9f5",background:"rgba(56,217,245,0.07)",padding:"7px 18px",borderRadius:"7px",cursor:"pointer",fontSize:"10px",letterSpacing:"0.15em"}}>Sélectionner →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toast && <div style={{position:"fixed",bottom:"24px",right:"24px",background:"rgba(4,6,15,0.96)",border:"1px solid rgba(56,217,245,0.4)",color:"#38d9f5",padding:"12px 20px",borderRadius:"8px",fontSize:"11px",letterSpacing:"0.14em"}}>{toast}</div>}
    </div>
  );
}
  
