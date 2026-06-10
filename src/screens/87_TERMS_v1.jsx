import React from 'react';
import { ChevronLeft } from 'lucide-react';
const CORAL='#E85D2A';const CREAM='#F7F5F2';const PEACH='#F3EFEB';const TINT='#FBE7DD';const INK='#111111';const MUTED='#6E6058';const TERT='#9B9B9F';const GREEN='#3F8D63';const DANGER='#E5484D';const LINE='#F1EDE8';const SHADOW='0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const StatusBar=()=>(<div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{height:54}}><span style={{fontSize:15,fontWeight:600,color:INK}}>9:41</span><div className="flex items-center gap-1"><svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={INK}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={INK}/><rect x="9" y="2" width="3" height="10" rx="1" fill={INK}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={INK}/></svg><svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={INK}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={INK} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={INK}/><path d="M23 4.5v4a2 2 0 000-4z" fill={INK} fillOpacity="0.5"/></svg></div></div>);
const SECTIONS=[["What fylos is","fylos connects pet owners with independent walkers, sitters and vets. Providers are not our employees. We verify identities, hold payments safely through our partners and stand behind every booking with insurance."],["Bookings & payment","A request places a hold on your card through Stripe. You are charged only after the service is completed. Cancellation windows are set by each provider and shown before you book."],["Your responsibilities","Keep your pet profile accurate, especially health notes, allergies and behaviour. Providers rely on it to keep your pet safe."],["Credits","fylos credits are a reward balance. They apply to bookings, never expire while your account is active and cannot be exchanged for cash."],["Ending things","You can delete your account at any time from Profile. Open bookings must finish or be cancelled first."]];
const TermsScreen = () => {

  const back=()=>{ if(window.history.length>1) window.history.back(); else window.location.href='/'; };
  return (
    <>
      <style>{'@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");'}</style>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#EDE8E2',padding:20,fontFamily:'Inter, -apple-system, BlinkMacSystemFont, sans-serif'}}>
        <div className="relative" style={{width:390,height:844,borderRadius:50,border:'8px solid #000',overflow:'hidden',backgroundColor:CREAM}}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{top:12,width:120,height:32,backgroundColor:'#000',borderRadius:9999}}/>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{width:134,height:5,backgroundColor:'#000',borderRadius:9999}}/>
          <StatusBar/>
          <div className="absolute inset-0 overflow-y-auto" style={{background:CREAM,scrollbarWidth:'none'}}>
            <div className="pt-14 pb-5 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{background:'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)'}}>
              <button onClick={back} className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto" style={{boxShadow:'0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)'}}><ChevronLeft size={18} strokeWidth={2.2} color="#111"/></button>
              <h1 className="text-[17px] font-bold" style={{color:INK}}>Terms of service</h1>
            </div>
            <div className="px-4 pb-12">

              <p className="text-[11.5px] ml-1.5 mt-1" style={{color:TERT}}>Version 1.2 · February 2026</p>
              {SECTIONS.map(([h,p],i)=>(
                <div key={i} className="bg-white rounded-[18px] px-4 py-4 mt-3" style={{boxShadow:SHADOW}}>
                  <h2 className="text-[14px] font-bold mb-1.5" style={{color:INK}}>{(i+1)+'. '+h}</h2>
                  <p className="text-[12.5px] leading-[1.6]" style={{color:MUTED}}>{p}</p>
                </div>
              ))}
              <p className="text-[11.5px] text-center mt-6" style={{color:TERT}}>Questions? Write to legal@fylos.app</p>

            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};
export default TermsScreen;
