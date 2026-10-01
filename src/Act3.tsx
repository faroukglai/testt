import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SCENES, TYPE} from './theme';
import {BlurWord, ClipReveal, GlassPanel, Grain, Haze, Sparkle, drift} from './FX';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ids = ['s11WordCloud','s12ServicesSidebar','s13LeadsTable','s14SalesPipeline','s15Kanban','s16FeatureParade'] as const;
const durations = ids.map((id) => SCENES[id].duration);
const offsets = durations.map((_, i) => durations.slice(0, i).reduce((sum, n) => sum + n, 0));
export const ACT3_DURATION = durations.reduce((sum, n) => sum + n, 0);

const WordCloudScene: React.FC = () => {
  const frame = useCurrentFrame();
  const words = [
    {text:'projects and tasks',x:'12%',y:'18%',size:44,delay:0},
    {text:'forms and email',x:'72%',y:'10%',size:34,delay:6},
    {text:'team management',x:'58%',y:'23%',size:39,delay:9},
    {text:'documents',x:'8%',y:'48%',size:30,delay:3},
    {text:'client portals',x:'78%',y:'46%',size:50,delay:12},
    {text:'invoices and quotes',x:'14%',y:'76%',size:38,delay:15},
    {text:'leads',x:'80%',y:'73%',size:43,delay:18},
    {text:'sales pipeline',x:'38%',y:'91%',size:56,delay:21},
  ];
  const exit = ease(interpolate(frame,[SCENES.s11WordCloud.duration-20,SCENES.s11WordCloud.duration],[0,1],clamp));
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest3},${C.bg1} 48%,${C.bg0})`,overflow:'hidden'}}>
    <Haze intensity={.65}/>
    {words.map((word,i)=>{
      const enter=ease(interpolate(frame,[word.delay,word.delay+18],[0,1],clamp));
      const fly=exit*(.25+(i%4)*.08);
      return <div key={word.text} style={{position:'absolute',left:word.x,top:word.y,fontFamily:TYPE.family,fontSize:word.size,fontWeight:600,color:C.white,opacity:enter*(1-exit),filter:`blur(${exit*18}px)`,transform:`translate3d(0,${drift(frame,220,15,i*.7)-exit*80}px,0) scale(${1+fly})`,textShadow:'0 0 24px rgba(59,255,199,.18)',whiteSpace:'nowrap'}}>{word.text}</div>;
    })}
    <div style={{position:'absolute',left:'50%',top:'50%',width:'100%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
      <BlurWord text="Manage your service catalog" durationInFrames={SCENES.s11WordCloud.duration} staggerFrames={3} fontSize={TYPE.catalogHeadline} fontWeight={700} accentWords={['Manage','service','catalog']} style={{justifyContent:'center',color:C.mint,textShadow:'0 0 30px rgba(59,255,199,.58)'}}/>
    </div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const SidebarMockup: React.FC = () => {
  const items=['Dashboard','My Task','Booking Calendar','Sales & CRM','Leads','Sales Pipeline','Project','Clients','Service','Order','Email','Discussion','Quotations','Invoices','Teams & Documents','Teams','Workflows'];
  return <div style={{width:'100%',height:'100%',display:'grid',gridTemplateColumns:'250px 1fr',background:'#fff',color:'#30453a',fontFamily:TYPE.family,borderRadius:18,overflow:'hidden'}}>
    <div style={{padding:20,background:'#F5F7F6',borderRight:'1px solid #e4ece7'}}><div style={{fontSize:21,fontWeight:800,color:C.uiAccent,marginBottom:20}}>taskip</div>{items.map((item,i)=><div key={item} style={{padding:'7px 10px',fontSize:i>3?12:14,fontWeight:item==='Invoices'?700:500,color:item==='Invoices'?C.forest3:'#65756c',background:item==='Invoices'?'#E9F8F2':'transparent',borderRadius:7,marginLeft:i>3?12:0}}>{item}</div>)}</div>
    <div style={{padding:28,background:'#fff'}}><div style={{fontSize:24,fontWeight:700}}>Services overview</div><div style={{marginTop:18,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>{['Active services','Open leads','This month'].map((x,i)=><div key={x} style={{padding:18,border:'1px solid #e7eee9',borderRadius:12}}><div style={{fontSize:13,color:'#7d8c83'}}>{x}</div><strong style={{display:'block',fontSize:28,marginTop:12,color:C.forest3}}>{[12,24,'₹48k'][i]}</strong></div>)}</div><div style={{marginTop:18,height:280,borderRadius:12,background:'linear-gradient(180deg,#f8fbf9,#eef8f2)',border:'1px solid #e7eee9'}}/></div>
  </div>;
};

const ServicesSidebarScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:22,stiffness:110,mass:1}});
  const exit=ease(interpolate(frame,[SCENES.s12ServicesSidebar.duration-20,SCENES.s12ServicesSidebar.duration],[0,1],clamp));
  const menuProgress=ease(interpolate(frame,[14,92],[0,1],clamp));
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest2},${C.bg1} 58%,${C.bg0})`,overflow:'hidden'}}>
    <Haze intensity={.48}/>
    <div style={{position:'absolute',left:'8%',top:'50%',width:570,transform:'translateY(-50%)',fontFamily:TYPE.family,color:C.white,fontSize:68,fontWeight:700,lineHeight:1.12,textShadow:'0 4px 35px rgba(0,0,0,.28)'}}>
      <div>Handle all services</div><div style={{color:C.mint}}>in one place</div>
    </div>
    <div style={{position:'absolute',left:'51%',top:'50%',width:930,height:760,transform:`translate(${(1-Math.max(0,enter))*130-exit*45}px,-50%) scale(${mix(.84,1,Math.max(0,enter))})`,opacity:1-exit*.2,filter:`blur(${exit*7}px)`,boxShadow:'0 35px 90px rgba(0,0,0,.38)',borderRadius:18}}>
      <ClipReveal shape="dome" progress={menuProgress}><SidebarMockup/></ClipReveal>
      <div style={{position:'absolute',left:'18%',top:`${21+menuProgress*51}%`,width:0,height:0,borderTop:'12px solid transparent',borderBottom:'12px solid transparent',borderLeft:'18px solid #0EC779',filter:'drop-shadow(0 0 9px #3BFFC7)',transform:`translateY(${Math.sin(frame*.13)*3}px)`}}/>
    </div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const LeadsTableScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:20,stiffness:120,mass:.9}});
  const rows=[['Mosharaf Hossain','mosharaf@example.com','Google','27-10-2025','New'],['Aisha Rahman','aisha@example.com','Facebook','27-10-2025','Contacted'],['Daniel Kim','daniel@example.com','LinkedIn','27-10-2025','Qualified']];
  return <AbsoluteFill style={{background:`radial-gradient(circle at 50% 50%,${C.forest2},${C.bg1} 52%,${C.bg0})`,overflow:'hidden',perspective:1300}}>
    <Haze intensity={.5}/>
    <div style={{position:'absolute',inset:'12% 10%',transform:`rotateX(8deg) rotateY(-10deg) scale(${mix(.82,1,Math.max(0,enter))})`,filter:'drop-shadow(0 35px 60px rgba(0,0,0,.42))'}}>
      <GlassPanel style={{width:'100%',height:'100%',padding:24,boxSizing:'border-box',background:'rgba(255,255,255,.2)'}}><div style={{width:'100%',height:'100%',padding:24,boxSizing:'border-box',borderRadius:16,background:'#F8FAF9',fontFamily:TYPE.family,color:'#30453a'}}>
        <div style={{fontSize:27,fontWeight:700,marginBottom:24}}>Leads <span style={{fontSize:15,color:'#89978f'}}>All leads · 248 records</span></div>
        <div style={{display:'grid',gridTemplateColumns:'1.3fr 1.5fr .8fr 1fr .8fr',padding:'14px 18px',background:'#edf4f0',fontSize:14,fontWeight:700,color:'#607368'}}>{['Name','Email','Source','Created','Status'].map(x=><span key={x}>{x}</span>)}</div>
        {rows.map((row,i)=>{const p=spring({frame:frame-14-i*9,fps,config:{damping:18,stiffness:190,mass:.8}});return <div key={row[0]} style={{display:'grid',gridTemplateColumns:'1.3fr 1.5fr .8fr 1fr .8fr',alignItems:'center',padding:'22px 18px',marginTop:12,borderRadius:12,background:'#fff',boxShadow:`0 ${Math.max(2,p*12)}px ${Math.max(8,p*28)}px rgba(14,70,48,.12)`,transform:`translateY(${(1-p)*38}px) translateZ(${p*(i+1)*48}px)`,fontSize:14}}>{row.map((cell,j)=><span key={j} style={{fontWeight:j===0?700:500,color:j===4?C.uiAccent:'#52645a'}}>{cell}</span>)}</div>;})}
      </div></GlassPanel>
    </div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const SalesPipelineScene: React.FC = () => {
  const frame=useCurrentFrame();
  const exit=ease(interpolate(frame,[SCENES.s14SalesPipeline.duration-14,SCENES.s14SalesPipeline.duration],[0,1],clamp));
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest3},${C.bg1} 52%,${C.bg0})`,overflow:'hidden',display:'grid',placeItems:'center'}}>
    <Haze intensity={.54}/>
    <div style={{fontFamily:TYPE.family,fontSize:104,fontWeight:800,color:C.mint,textShadow:'0 0 32px rgba(59,255,199,.46)',filter:`blur(${exit*22}px)`,opacity:1-exit*.65,transform:`translateX(${-exit*22}px)`}}>Sales Pipeline</div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const KanbanBoard: React.FC = () => {
  const columns=[{name:'New',items:['Website redesign','Brand refresh','Mobile app']},{name:'In progress',items:['Q3 campaign','Customer portal']},{name:'Review',items:['Pitch deck','Social launch']},{name:'Won',items:['Annual renewal','SEO package']}];
  const colors=['#C8F2DF','#D9E8FF','#FFE7C9','#F3DDF5','#DFF0F5'];
  return <div style={{width:'100%',height:'100%',padding:26,boxSizing:'border-box',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,background:'#F5F8F6',borderRadius:18,fontFamily:TYPE.family,color:'#30453a'}}>
    {columns.map((column,i)=><div key={column.name} style={{padding:13,borderRadius:12,background:'#EAF0EC'}}><div style={{fontSize:15,fontWeight:700,marginBottom:13}}>{column.name}<span style={{float:'right',color:'#87968d'}}>{column.items.length}</span></div>{column.items.map((item,j)=><div key={item} style={{marginTop:10,padding:15,minHeight:75,borderRadius:10,background:'#fff',boxShadow:'0 4px 12px rgba(20,60,43,.08)',borderTop:`4px solid ${colors[(i+j)%colors.length]}`,fontSize:13,fontWeight:600}}>{item}<div style={{marginTop:16,fontSize:10,color:'#87968d'}}>Taskip team · due this week</div></div>)}</div>)}
  </div>;
};

const KanbanScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const unfold=spring({frame:frame-6,fps,config:{damping:28,stiffness:90,mass:1.4}});
  const flash=interpolate(frame,[0,3,8],[.95,.45,0],clamp);
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest2},${C.bg1} 48%,${C.bg0})`,overflow:'hidden',perspective:1800}}>
    <Haze intensity={.52}/>
    <div style={{position:'absolute',inset:'18% 12%',transform:`rotateX(8deg) rotateY(${mix(-70,-8,Math.max(0,unfold))}deg) scale(${mix(.92,1,Math.max(0,unfold))})`,filter:`blur(${mix(10,0,Math.max(0,unfold))}px) drop-shadow(0 35px 65px rgba(0,0,0,.42))`}}>
      <GlassPanel style={{width:'100%',height:'100%',padding:14,boxSizing:'border-box'}}><KanbanBoard/></GlassPanel>
    </div>
    <AbsoluteFill style={{backgroundColor:'#EFFFF8',opacity:flash,pointerEvents:'none'}}/>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const ScreenMockup: React.FC<{index:number}> = ({index}) => {
  const screenNames=['Invoices · Branding','Project detail','Document editor','Email inbox','Team discussions','August 2025','Form builder','Workflow builder'];
  const colors=['#1BB388','#7567D8','#2488DB','#DD6C77','#D99042','#45A891','#BD6BB0','#4B87D1'];
  return <div style={{width:'100%',height:'100%',padding:26,boxSizing:'border-box',background:'#F7FAF8',borderRadius:18,fontFamily:TYPE.family,color:'#30453a'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:20,borderBottom:'1px solid #e5ece8'}}><strong style={{fontSize:23,color:C.uiAccent}}>taskip</strong><span style={{fontSize:13,color:'#718178'}}>Workspace / {screenNames[index]}</span><span style={{width:30,height:30,borderRadius:'50%',background:'#CDEEDD'}}/></div>
    <div style={{display:'grid',gridTemplateColumns:'190px 1fr',height:'calc(100% - 60px)',gap:22,marginTop:18}}>
      <div style={{borderRadius:12,background:'#EDF3EF',padding:16}}>{['Overview','Projects','Leads','Invoices','Documents','Team'].map((x,i)=><div key={x} style={{padding:'11px 9px',fontSize:13,color:i===index%6?colors[index]:'#718178',fontWeight:i===index%6?700:500}}>{x}</div>)}</div>
      <div><div style={{fontSize:24,fontWeight:700,marginBottom:20}}>{screenNames[index]}</div>
        {index===0?<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>{['Primary color','Accent color','Logo','Preview'].map((x,i)=><div key={x} style={{height:130,border:'1px solid #e4ece7',borderRadius:12,padding:12,fontSize:12}}>{x}<div style={{marginTop:22,width:50,height:50,borderRadius:10,background:i<2?colors[i]:'#dcece3'}}/></div>)}</div>:null}
        {index===1||index===2?<div style={{height:'82%',padding:20,border:'1px solid #e4ece7',borderRadius:12,background:'#fff'}}><div style={{width:'70%',height:18,background:'#e9f0ec',borderRadius:8}}/><div style={{marginTop:18,height:18,width:'90%',background:'#f0f4f1',borderRadius:8}}/><div style={{marginTop:16,height:170,borderRadius:12,background:`linear-gradient(120deg,${colors[index]}22,#f6faf7)`}}/><div style={{marginTop:16,width:'82%',height:12,background:'#e9f0ec',borderRadius:8}}/></div>:null}
        {index===3||index===4?<div style={{display:'grid',gridTemplateColumns:'.8fr 1.2fr',height:'80%',gap:12}}><div style={{borderRadius:12,background:'#edf3ef'}}/ ><div style={{border:'1px solid #e6ede8',borderRadius:12,padding:16}}><div style={{height:16,width:'50%',background:colors[index],borderRadius:8,opacity:.65}}/><div style={{marginTop:20,height:100,background:'#f1f5f2',borderRadius:12}}/><div style={{marginTop:12,height:12,width:'80%',background:'#e9f0ec',borderRadius:8}}/></div></div>:null}
        {index===5?<div style={{height:'80%',display:'grid',gridTemplateColumns:'repeat(7,1fr)',gridTemplateRows:'repeat(4,1fr)',gap:7}}>{Array.from({length:28},(_,i)=><div key={i} style={{border:'1px solid #e7eee9',borderRadius:7,padding:6,fontSize:10,color:'#75847b'}}>{i+1}{i%5===0?<div style={{marginTop:5,height:8,borderRadius:4,background:colors[index],opacity:.6}}/>:null}</div>)}</div>:null}
        {index===6||index===7?<div style={{height:'80%',display:'flex',alignItems:'center',justifyContent:'center',gap:18}}>{['Trigger','Action','Condition'].map((x,i)=><React.Fragment key={x}><div style={{padding:'22px 28px',borderRadius:13,background:'#fff',border:`2px solid ${colors[(index+i)%colors.length]}`,fontSize:15,fontWeight:700}}>{x}</div>{i<2?<span style={{color:C.uiAccent,fontSize:28}}>→</span>:null}</React.Fragment>)}</div>:null}
      </div>
    </div>
  </div>;
};

const FeatureParadeScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const duration=SCENES.s16FeatureParade.duration;
  const step=76;
  const active=Math.min(7,Math.floor(frame/step));
  const local=frame-active*step;
  const enter=spring({frame:local,fps,config:{damping:22,stiffness:115,mass:1}});
  const exiting=active<7?ease(interpolate(local,[step-14,step],[0,1],clamp)):0;
  const reveal=ease(interpolate(local,[0,26],[0,1],clamp));
  const y=drift(frame,190,5);
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 52%,${C.forest2},${C.bg1} 50%,${C.bg0})`,overflow:'hidden',perspective:1800}}>
    <Haze intensity={.56}/>
    <div style={{position:'absolute',left:'50%',top:'51%',width:1340,height:610,transform:'translate(-50%,-50%) rotateX(66deg)',border:'1px solid rgba(59,255,199,.18)',borderRadius:'50%'}}/>
    <div style={{position:'absolute',left:'2%',top:'64%',width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#0A724E,#032D1F 70%)',filter:'blur(9px)',opacity:.75,boxShadow:'0 0 80px rgba(14,199,121,.24)'}}/>
    <div style={{position:'absolute',right:'-5%',top:'34%',width:260,height:260,borderRadius:'50%',border:'16px solid rgba(4,68,47,.6)',filter:'blur(8px)',opacity:.8,transform:`rotate(${frame*.16}deg)`}}/>
    <div style={{position:'absolute',left:'50%',top:'50%',width:1260,height:720,transform:`translate(-50%,-50%) translateY(${(1-enter)*115+y-exiting*170}px) rotateX(${mix(55,8,Math.max(0,enter))}deg) rotateY(${active%2===0?-12:12}deg) scale(${mix(.92,1,Math.max(0,enter))*(1+Math.min(local/step,1)*.02)})`,opacity:Math.min(1,Math.max(0,enter))*(1-exiting*.4),filter:`drop-shadow(0 35px 75px rgba(0,0,0,.46))`}}>
      <GlassPanel style={{width:'100%',height:'100%',padding:14,boxSizing:'border-box'}}><ClipReveal shape="dome" progress={reveal}><ScreenMockup index={active}/></ClipReveal></GlassPanel>
    </div>
    <div style={{position:'absolute',bottom:42,left:'50%',transform:'translateX(-50%)',fontFamily:TYPE.family,fontSize:18,letterSpacing:'.14em',fontWeight:700,color:C.mintLight,opacity:.78}}>{['BRANDING','PROJECTS','DOCUMENTS','EMAIL','DISCUSSIONS','CALENDAR','FORMS','WORKFLOWS'][active]}</div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

export const Act3: React.FC = () => <AbsoluteFill style={{backgroundColor:C.bg0,overflow:'hidden'}}>
  <Sequence from={offsets[0]} durationInFrames={SCENES.s11WordCloud.duration} layout="none"><WordCloudScene/></Sequence>
  <Sequence from={offsets[1]} durationInFrames={SCENES.s12ServicesSidebar.duration} layout="none"><ServicesSidebarScene/></Sequence>
  <Sequence from={offsets[2]} durationInFrames={SCENES.s13LeadsTable.duration} layout="none"><LeadsTableScene/></Sequence>
  <Sequence from={offsets[3]} durationInFrames={SCENES.s14SalesPipeline.duration} layout="none"><SalesPipelineScene/></Sequence>
  <Sequence from={offsets[4]} durationInFrames={SCENES.s15Kanban.duration} layout="none"><KanbanScene/></Sequence>
  <Sequence from={offsets[5]} durationInFrames={SCENES.s16FeatureParade.duration} layout="none"><FeatureParadeScene/></Sequence>
</AbsoluteFill>;

export default Act3;
