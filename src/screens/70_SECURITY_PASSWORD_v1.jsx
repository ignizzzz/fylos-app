import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
const CORAL='#E85D2A';const CREAM='#F7F5F2';const PEACH='#F3EFEB';const TINT='#FBE7DD';const INK='#111111';const MUTED='#6E6058';const TERT='#9B9B9F';const GREEN='#3F8D63';const DANGER='#E5484D';const LINE='#F1EDE8';const SHADOW='0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const StatusBar=()=>(<div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{height:54}}><span style={{fontSize:15,fontWeight:600,color:INK}}>9:41</span><div className="flex items-center gap-1"><svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={INK}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={INK}/><rect x="9" y="2" width="3" height="10" rx="1" fill={INK}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={INK}/></svg><svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={INK}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={INK} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={INK}/><path d="M23 4.5v4a2 2 0 000-4z" fill={INK} fillOpacity="0.5"/></svg></div></div>);

const SectionLabel=({children})=>(<div className="text-[10.5px] font-bold uppercase tracking-[0.12em] mb-2 ml-1.5 mt-6" style={{color:'#A8A29C'}}>{children}</div>);
const Card=({children,className=''})=>(<div className={'bg-white rounded-[18px] overflow-hidden '+className} style={{boxShadow:SHADOW}}>{children}</div>);
const Row=({icon:Icon,title,subtitle,rightValue,trailing,onClick,last,danger,iconBg,iconColor})=>(
  <div className="relative">
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3.5 py-[11px] active:bg-black/[0.02] transition-colors text-left">
      {Icon && <span className="w-9 h-9 rounded-[12px] shrink-0 flex items-center justify-center" style={{background:iconBg||(danger?'#FEE8E7':TINT)}}><Icon size={16} color={iconColor||(danger?DANGER:CORAL)} strokeWidth={2}/></span>}
      <span className="flex-1 min-w-0"><span className="block text-[14px] font-semibold truncate leading-tight" style={{color:INK}}>{title}</span>{subtitle && <span className="block text-[11.5px] truncate mt-[3px] leading-tight" style={{color:TERT}}>{subtitle}</span>}</span>
      {rightValue && <span className="text-[11.5px] font-semibold mr-1 shrink-0 px-2.5 py-[3px] rounded-full" style={{background:'#F4EFE9',color:'#9A8F84'}}>{rightValue}</span>}
      {trailing!==undefined?trailing:<ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} className="shrink-0"/>}
    </button>
    {!last && <div className="absolute bottom-0 left-[62px] right-0 h-px" style={{background:LINE}}/>}
  </div>);
const Toggle=({value,onChange})=>(
  <span onClick={(e)=>{e.stopPropagation();onChange(!value);}} className="shrink-0 cursor-pointer inline-block" style={{width:38,height:22,borderRadius:9999,backgroundColor:value?CORAL:'#E5E1DC',transition:'background-color 200ms ease',position:'relative'}}>
    <span style={{position:'absolute',top:2,left:2,width:18,height:18,borderRadius:'50%',background:'white',transform:value?'translateX(16px)':'translateX(0)',transition:'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}}/>
  </span>);
const Seg=({options,value,onChange})=>(<div className="flex gap-2">{options.map((o)=>{const on=value===o;return(<button key={o} onClick={()=>onChange(o)} className="flex-1 h-[42px] rounded-[12px] text-[13px] font-bold active:scale-[0.97] transition-all" style={{background:on?'#FFF3EC':'#fff',color:on?CORAL:MUTED,boxShadow:on?'inset 0 0 0 1.6px '+CORAL:SHADOW}}>{o}</button>);})}</div>);
const Field=({label,value,onChange,placeholder})=>(
  <div className="mb-4"><div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5 ml-0.5" style={{color:TERT}}>{label}</div>
  <input type="password" value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white rounded-[12px] px-4 h-[50px] outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{boxShadow:SHADOW}}/></div>);
const SecurityPasswordScreen = () => {
  const [cur,setCur]=useState(''); const [nw,setNw]=useState(''); const [conf,setConf]=useState('');
  const [toast,setToast]=useState('');
  const strong=nw.length>=10;
  const valid=cur.length>0 && strong && nw===conf;

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
              <h1 className="text-[17px] font-bold" style={{color:INK}}>Password</h1>
            </div>
            <div className="px-4 pb-12">

              <div className="mt-1">
                <Field label="Current password" value={cur} onChange={setCur} placeholder="Your current password"/>
                <Field label="New password" value={nw} onChange={setNw} placeholder="At least 10 characters"/>
                <Field label="Repeat new password" value={conf} onChange={setConf} placeholder="Same again"/>
                <div className="text-[11.5px] ml-0.5 -mt-1" style={{color:nw.length===0?TERT:strong?GREEN:'#B07A3A'}}>{nw.length===0?'Use 10 or more characters. A short sentence works best.':strong?(nw===conf||conf.length===0?'Strong password':'The two passwords do not match yet'):String(10-nw.length)+' more characters'}</div>
                <button onClick={()=>{ if(valid){ setToast('Password updated'); setTimeout(()=>setToast(''),1700); setCur(''); setNw(''); setConf(''); } }} disabled={!valid} className="w-full mt-6 py-4 rounded-[18px] transition-all active:scale-[0.98]" style={{background:valid?CORAL:'#EAE3DB',boxShadow:valid?'0 8px 22px rgba(232,93,42,0.28)':'none'}}><span className="text-[15px] font-bold" style={{color:valid?'#fff':TERT}}>Save changes</span></button>
                <button onClick={()=>{ setToast('Reset link sent to alex@fylos.app'); setTimeout(()=>setToast(''),1700); }} className="w-full mt-3 py-2.5"><span className="text-[13.5px] font-bold" style={{color:MUTED}}>Forgot your password?</span></button>
              </div>

            </div>
          </div>
          {toast && <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{bottom:38,transform:'translateX(-50%)',background:INK}}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast}</span></div>}
        </div>
      </div>
    </>
  );
};
export default SecurityPasswordScreen;
