import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FPS, SCENES, TYPE} from './theme';
import {BlurWord, ClipReveal, GlassBubble, GlassPanel, Grain, Haze, Sparkle, drift, fullFrame} from './FX';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const sceneIds = ['s05WomanCard', 's06WomanFullscreen', 's07BetterWay', 's08LogoSphere', 's09DashboardDome', 's10DashboardOrbit'] as const;
const sceneDurations = sceneIds.map((id) => SCENES[id].duration);
const sceneOffsets = sceneDurations.map((_, index) => sceneDurations.slice(0, index).reduce((sum, n) => sum + n, 0));
export const ACT2_DURATION = sceneDurations.reduce((sum, n) => sum + n, 0);

const useEntrance = (duration = 22) => {
  const frame = useCurrentFrame();
  return easeOut(interpolate(frame, [0, duration], [0, 1], clamp));
};

const PersonIllustration: React.FC<{large?: boolean}> = ({large = false}) => (
  <svg aria-label="Illustration of a stressed agency owner" role="img" viewBox="0 0 420 520" style={{width:'100%',height:'100%',overflow:'visible'}}>
    <defs>
      <linearGradient id="person-jacket" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#11DE99"/><stop offset="1" stopColor="#07573B"/></linearGradient>
      <radialGradient id="person-face" cx="35%" cy="25%"><stop stopColor="#FFE2CC"/><stop offset="1" stopColor="#D49B78"/></radialGradient>
      <filter id="person-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <ellipse cx="210" cy="492" rx="144" ry="23" fill="#001810" opacity=".38"/>
    <path d="M85 490c6-107 33-166 91-180h71c63 16 91 73 98 180H85Z" fill="url(#person-jacket)" stroke="#83FFCE" strokeOpacity=".5" strokeWidth="4"/>
    <path d="M163 315c11 28 28 42 48 42s37-14 48-42l-16-35h-63l-17 35Z" fill="#D49B78"/>
    <ellipse cx="211" cy="203" rx="92" ry="112" fill="url(#person-face)"/>
    <path d="M119 194c-4-100 42-147 100-147 70 0 102 52 92 139-11-15-19-32-23-51-48 14-99 4-139-17-3 30-13 55-30 76Z" fill="#17251F"/>
    <path d="M143 185c17-18 37-20 58-8M225 177c19-13 40-11 58 5" fill="none" stroke="#503B35" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="173" cy="203" rx="7" ry="9" fill="#14201B"/><ellipse cx="254" cy="203" rx="7" ry="9" fill="#14201B"/>
    <path d="M207 211c-6 15-10 26-8 32 4 5 11 7 18 4M187 269c16-11 33-12 49-2" fill="none" stroke="#8B5D4D" strokeWidth="5" strokeLinecap="round"/>
    <path d="M103 186c-18-48 1-105 51-133" fill="none" stroke="#3BFFC7" strokeWidth="10" strokeLinecap="round" opacity=".65" filter="url(#person-glow)"/>
    {large && <path d="M112 100c-31-14-44-36-40-62 27 7 47 23 57 48M304 95c25-20 49-21 70-5-13 22-32 36-58 40" fill="#0EC779" opacity=".9"/>}
  </svg>
);

const WomanCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:22,stiffness:105,mass:1.1}});
  const driftY = drift(frame, 180, 9);
  const cardRotate = mix(3.5, 0, Math.max(0, enter));
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 55%, ${C.forest3} 0%, ${C.bg2} 36%, ${C.bg0} 100%)`,overflow:'hidden'}}>
      <Haze intensity={.64}/>
      <div style={{position:'absolute',inset:'10% 20%',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(17,222,153,.2),transparent 68%)',filter:'blur(38px)'}}/>
      <div style={{position:'absolute',left:'50%',top:'51%',width:970,height:610,transform:`translate(-50%,-50%) rotateX(58deg) rotate(${frame*.025}deg)`,border:'1px solid rgba(131,255,206,.18)',borderRadius:'50%'}}/>
      <GlassPanel style={{position:'absolute',left:'50%',top:'50%',width:740,height:700,transform:`translate(-50%,-50%) translateY(${(1-enter)*80+driftY}px) rotate(${cardRotate}deg) scale(${mix(.92,1,Math.max(0,enter))})`,opacity:Math.min(1,Math.max(0,enter)),padding:24,boxSizing:'border-box',background:'linear-gradient(145deg,rgba(239,255,248,.96),rgba(217,250,237,.88))',border:'1px solid rgba(255,255,255,.9)',boxShadow:'0 45px 120px rgba(0,0,0,.46),0 0 55px rgba(59,255,199,.22)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.12fr',height:'100%',gap:22}}>
          <div style={{position:'relative',borderRadius:20,overflow:'hidden',background:'linear-gradient(155deg,#C8F3E0,#EFFCF5 55%,#B8E7D3)'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 42%,rgba(255,255,255,.76),transparent 64%)'}}/>
            <div style={{position:'absolute',inset:'5% 4% 0'}}><PersonIllustration/></div>
            <span style={{position:'absolute',left:18,top:18,padding:'9px 13px',borderRadius:99,background:'rgba(255,255,255,.78)',fontFamily:TYPE.family,fontSize:14,fontWeight:700,color:C.forest3}}>MONDAY, 9:14 AM</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'28px 18px 24px 8px',fontFamily:TYPE.family,color:'#143B2B'}}>
            <div><div style={{fontSize:15,fontWeight:700,letterSpacing:'.13em',color:C.uiAccent}}>A FAMILIAR MORNING</div><div style={{fontSize:36,lineHeight:1.12,fontWeight:700,marginTop:18}}>Too many tabs.<br/>Too little time.</div><p style={{fontSize:18,lineHeight:1.55,color:'#527064',marginTop:20}}>Leads in one tool. Projects in another. Follow-ups everywhere.</p></div>
            <div style={{display:'grid',gap:12}}>{['New lead waiting','3 overdue tasks','Invoice needs review'].map((item,i)=><div key={item} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderRadius:14,background:'rgba(255,255,255,.8)',boxShadow:'0 5px 18px rgba(9,68,47,.08)',fontSize:16,fontWeight:600}}><span style={{width:11,height:11,borderRadius:'50%',background:i===0?'#F3A84B':'#E77970'}}/>{item}</div>)}</div>
          </div>
        </div>
      </GlassPanel>
      <Grain opacity={.026}/>
    </AbsoluteFill>
  );
};

const WomanFullscreenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useEntrance(22);
  const pulse = 1 + .012*Math.sin(frame*.055);
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 48%,#07573B 0%,${C.bg1} 48%,${C.bg0} 100%)`,overflow:'hidden'}}>
      <Haze intensity={.55}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:1000,height:1000,transform:`translate(-50%,-50%) scale(${mix(.94,1,enter)})`,borderRadius:'50%',background:'radial-gradient(circle,rgba(14,199,121,.18),transparent 67%)',filter:'blur(14px)'}}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:740,height:930,transform:`translate(-50%,-48%) scale(${pulse})`,opacity:.92}}><PersonIllustration large/></div>
      <div style={{position:'absolute',left:'8%',top:'50%',width:470,transform:`translateY(-50%) translateX(${(1-enter)*-38}px)`,opacity:enter,fontFamily:TYPE.family,color:C.white}}>
        <div style={{fontSize:16,fontWeight:700,letterSpacing:'.16em',color:C.mintLight}}>WHEN EVERYTHING IS EVERYWHERE</div>
        <div style={{fontSize:54,lineHeight:1.08,fontWeight:600,marginTop:22,textShadow:'0 4px 35px rgba(0,0,0,.3)'}}>The day moves.<br/>Your work gets<br/>scattered.</div>
      </div>
      <div style={{position:'absolute',right:'8%',top:'50%',width:250,transform:'translateY(-50%)',display:'grid',gap:18}}>
        {['CRM','PROJECTS','INVOICES'].map((label,i)=><div key={label} style={{transform:`translateX(${(1-enter)*(i%2?35:-35)}px)`,opacity:enter*.86,padding:'19px 22px',borderRadius:18,border:'1px solid rgba(131,255,206,.36)',background:'rgba(255,255,255,.09)',backdropFilter:'blur(12px)',fontFamily:TYPE.family,fontSize:15,fontWeight:700,letterSpacing:'.08em',color:C.mintPale,boxShadow:'0 14px 36px rgba(0,0,0,.18)'}}>{label}<span style={{float:'right',color:'#FFB276'}}>!</span></div>)}
      </div>
      <Grain opacity={.03}/>
    </AbsoluteFill>
  );
};

const BetterWayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useEntrance(20);
  const glow = .55 + .12*Math.sin(frame*.045);
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 52%,${C.forest3} 0%,${C.bg2} 32%,${C.bg0} 100%)`,overflow:'hidden'}}>
      <Haze intensity={.72}/>
      <div style={{position:'absolute',left:'50%',top:'49%',width:660,height:660,transform:`translate(-50%,-50%) scale(${mix(.92,1,enter)})`,borderRadius:'50%',border:'1px solid rgba(131,255,206,.18)',boxShadow:'0 0 100px rgba(14,199,121,.14)'}}/>
      <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',transform:`translateY(${(1-enter)*28}px)`}}>
        <BlurWord text="The better way" startFrame={0} durationInFrames={SCENES.s07BetterWay.duration} staggerFrames={5} accentWords={['better']} readingFrames={SCENES.s07BetterWay.reading} fontSize={104} fontWeight={700} style={{justifyContent:'center',textAlign:'center',textShadow:`0 0 45px rgba(59,255,199,${glow})`}}/>
      </div>
      <Grain opacity={.03}/>
    </AbsoluteFill>
  );
};

const LogoSphereScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame,fps,config:{damping:22,stiffness:110,mass:1}});
  const rotate = frame*.36;
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 50% 48%,${C.forest3},${C.bg1} 45%,${C.bg0} 100%)`,overflow:'hidden'}}>
      <Haze intensity={.62}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:640,height:640,transform:`translate(-50%,-50%) rotate(${rotate}deg) scale(${mix(.72,1,Math.max(0,enter))})`,border:'1px solid rgba(131,255,206,.22)',borderRadius:'50%',boxShadow:'0 0 85px rgba(17,222,153,.16)'}}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:430,height:430,transform:`translate(-50%,-50%) rotateX(68deg) rotate(${-rotate*1.3}deg)`,border:'1px solid rgba(59,255,199,.32)',borderRadius:'50%'}}/>
      <div style={{position:'absolute',left:'50%',top:'49%',width:330,height:330,transform:`translate(-50%,-50%) scale(${Math.max(0,enter)})`,borderRadius:'50%',background:'radial-gradient(circle at 30% 24%,#B0FEDE 0%,#3BFFC7 9%,#11DE99 26%,#07573B 66%,#001810 100%)',boxShadow:'inset -35px -42px 60px rgba(0,0,0,.46),inset 16px 18px 35px rgba(255,255,255,.26),0 0 100px rgba(17,222,153,.5)'}}>
        <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontFamily:TYPE.family,fontSize:51,fontWeight:700,letterSpacing:'-.055em',color:'#F5FFF9',textShadow:'0 3px 18px rgba(0,24,16,.55)'}}>taskip</div>
        <div style={{position:'absolute',left:'21%',top:'14%',width:'28%',height:'12%',borderRadius:'50%',background:'rgba(255,255,255,.34)',filter:'blur(8px)',transform:'rotate(-28deg)'}}/>
      </div>
      <div style={{position:'absolute',left:'50%',top:'78%',transform:'translate(-50%,-50%)',fontFamily:TYPE.family,fontSize:17,fontWeight:700,letterSpacing:'.24em',color:C.mintPale,opacity:Math.max(0,enter)*.88}}>ONE CONNECTED WORKSPACE</div>
      <Grain opacity={.03}/>
    </AbsoluteFill>
  );
};

const Dashboard: React.FC<{compact?:boolean}> = ({compact=false}) => (
  <div style={{width:'100%',height:'100%',boxSizing:'border-box',padding:24,background:'#F7FAF8',color:'#24392F',fontFamily:TYPE.family,borderRadius:18,overflow:'hidden'}}>
    <div style={{display:'grid',gridTemplateColumns:'158px 1fr',height:'100%',gap:18}}>
      <div style={{borderRadius:13,background:'#EEF4F0',padding:'16px 12px',display:'flex',flexDirection:'column',gap:15}}>
        <div style={{fontSize:17,fontWeight:800,color:C.uiAccent,letterSpacing:'-.04em'}}>taskip</div>
        {['Overview','Leads','Projects','Invoices','Reports'].map((x,i)=><div key={x} style={{fontSize:12,fontWeight:i===0?700:500,color:i===0?C.forest3:'#728279',padding:'8px 9px',borderRadius:8,background:i===0?'#D8F5E8':'transparent'}}>{x}</div>)}
        <div style={{marginTop:'auto',fontSize:11,color:'#819188'}}>Workspace</div>
      </div>
      <div style={{minWidth:0,display:'flex',flexDirection:'column',gap:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:19,fontWeight:700}}>Good morning, Alex</div><div style={{fontSize:11,color:'#819188',marginTop:4}}>Here’s your business at a glance</div></div><div style={{width:34,height:34,borderRadius:'50%',background:'#BFEED8'}}/></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>{[['Open leads','24'],['Active projects','12'],['Revenue','₹48.2k']].map(([label,value],i)=><div key={label} style={{padding:12,borderRadius:11,background:'#fff',border:'1px solid #E7EEE9'}}><div style={{fontSize:10,color:'#819188'}}>{label}</div><div style={{fontSize:19,fontWeight:700,marginTop:8}}>{compact?value:value}</div><div style={{fontSize:9,color:C.uiAccent,marginTop:5}}>↑ {i===2?'12.8':'8.4'}% this month</div></div>)}</div>
        <div style={{flex:1,minHeight:0,display:'grid',gridTemplateColumns:'1.25fr .75fr',gap:10}}>
          <div style={{background:'#fff',border:'1px solid #E7EEE9',borderRadius:11,padding:13}}><div style={{fontSize:12,fontWeight:700}}>Revenue overview</div><svg viewBox="0 0 360 110" preserveAspectRatio="none" style={{width:'100%',height:'78%',marginTop:12}}><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#11DE99" stopOpacity=".32"/><stop offset="1" stopColor="#11DE99" stopOpacity="0"/></linearGradient></defs><path d="M0 92 C40 80 51 64 83 70 S128 83 158 54 S205 69 237 32 S285 45 310 18 S340 34 360 8 L360 110 L0 110Z" fill="url(#chart-fill)"/><path d="M0 92 C40 80 51 64 83 70 S128 83 158 54 S205 69 237 32 S285 45 310 18 S340 34 360 8" fill="none" stroke="#0EC779" strokeWidth="3"/></svg></div>
          <div style={{background:'#fff',border:'1px solid #E7EEE9',borderRadius:11,padding:13}}><div style={{fontSize:12,fontWeight:700}}>Tasks</div>{['Review proposal','Client kickoff','Send invoice'].map((x,i)=><div key={x} style={{display:'flex',gap:7,alignItems:'center',marginTop:14,fontSize:9,color:'#596B61'}}><span style={{width:10,height:10,border:'1px solid #8DC7AA',borderRadius:3,background:i===0?'#D7F5E6':'white'}}/>{x}</div>)}</div>
        </div>
      </div>
    </div>
  </div>
);

const DashboardDomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame,fps,config:{damping:22,stiffness:100,mass:1.15}});
  const y = mix(110,0,Math.max(0,enter)) + drift(frame,210,5);
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 53%,${C.forest3},${C.bg1} 45%,${C.bg0} 100%)`,overflow:'hidden',perspective:1400}}>
      <Haze intensity={.66}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:1120,height:700,transform:`translate(-50%,-50%) rotateX(67deg)`,borderRadius:'50%',border:'1px solid rgba(59,255,199,.25)',boxShadow:'0 0 90px rgba(14,199,121,.2)'}}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:1060,height:610,transform:`translate(-50%,-48%) translateY(${y}px) rotateX(9deg) scale(${mix(.82,1,Math.max(0,enter))})`,opacity:Math.min(1,Math.max(0,enter)),filter:'drop-shadow(0 45px 75px rgba(0,0,0,.48))'}}>
        <GlassPanel borderRadius={24} style={{width:'100%',height:'100%',padding:10,boxSizing:'border-box',background:'rgba(255,255,255,.24)',boxShadow:'0 0 0 1px rgba(131,255,206,.35),0 0 55px rgba(59,255,199,.26)'}}><Dashboard/></GlassPanel>
      </div>
      <div style={{position:'absolute',left:'50%',top:'84%',width:780,height:100,transform:'translate(-50%,-50%)',borderRadius:'50%',background:'rgba(14,199,121,.2)',filter:'blur(35px)'}}/>
      <Grain opacity={.03}/>
    </AbsoluteFill>
  );
};

const DashboardOrbitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame,fps,config:{damping:22,stiffness:95,mass:1.15}});
  const angle = frame*.22;
  const orbitItems = [{label:'LEADS',value:'24',x:-510,y:-185},{label:'PROJECTS',value:'12',x:515,y:-135},{label:'INVOICES',value:'08',x:-490,y:205},{label:'REPORTS',value:'04',x:495,y:205}];
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest3},${C.bg1} 49%,${C.bg0} 100%)`,overflow:'hidden',perspective:1400}}>
      <Haze intensity={.58}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:1280,height:430,transform:`translate(-50%,-50%) rotateX(66deg) rotate(${angle}deg)`,border:'1px solid rgba(59,255,199,.23)',borderRadius:'50%'}}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:980,height:340,transform:`translate(-50%,-50%) rotateX(66deg) rotate(${-angle*1.2}deg)`,border:'1px solid rgba(131,255,206,.13)',borderRadius:'50%'}}/>
      {orbitItems.map((item,i)=>{
        const p=spring({frame:frame-i*7,fps,config:{damping:22,stiffness:110,mass:1}});
        const bob=drift(frame,150+i*11,7,i*.8);
        return <div key={item.label} style={{position:'absolute',left:'50%',top:'50%',transform:`translate(${item.x}px,${item.y+bob}px) scale(${Math.max(0,p)})`,opacity:Math.min(1,Math.max(0,p))}}><GlassBubble size={108} label={item.label} style={{background:'linear-gradient(145deg,#FFFFFF,#DDF8EB)',boxShadow:'0 22px 46px rgba(0,0,0,.38),0 0 30px rgba(59,255,199,.22)'}}><div style={{textAlign:'center',fontFamily:TYPE.family,color:C.forest3}}><div style={{fontSize:25,fontWeight:800}}>{item.value}</div><div style={{fontSize:9,fontWeight:700,letterSpacing:'.08em',marginTop:5}}>{item.label}</div></div></GlassBubble></div>;
      })}
      <div style={{position:'absolute',left:'50%',top:'50%',width:790,height:465,transform:`translate(-50%,-50%) translateY(${drift(frame,200,4)}px) rotateX(8deg) scale(${mix(.76,1,Math.max(0,enter))})`,opacity:Math.min(1,Math.max(0,enter)),filter:'drop-shadow(0 40px 70px rgba(0,0,0,.5))'}}>
        <GlassPanel borderRadius={21} style={{width:'100%',height:'100%',padding:8,boxSizing:'border-box'}}><Dashboard compact/></GlassPanel>
      </div>
      <Grain opacity={.03}/>
    </AbsoluteFill>
  );
};

/**
 * Act 2 is intended to be placed in the master composition at the S5 boundary.
 * Each Sequence creates scene-local frame space so animation cues restart at 0.
 * Scene changes remain hard cuts, matching the supplied cut-based edit.
 */
export const Act2: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:C.bg0,overflow:'hidden'}}>
    <Sequence from={sceneOffsets[0]} durationInFrames={SCENES.s05WomanCard.duration} layout="none"><WomanCardScene/></Sequence>
    <Sequence from={sceneOffsets[1]} durationInFrames={SCENES.s06WomanFullscreen.duration} layout="none"><WomanFullscreenScene/></Sequence>
    <Sequence from={sceneOffsets[2]} durationInFrames={SCENES.s07BetterWay.duration} layout="none"><BetterWayScene/></Sequence>
    <Sequence from={sceneOffsets[3]} durationInFrames={SCENES.s08LogoSphere.duration} layout="none"><LogoSphereScene/></Sequence>
    <Sequence from={sceneOffsets[4]} durationInFrames={SCENES.s09DashboardDome.duration} layout="none"><DashboardDomeScene/></Sequence>
    <Sequence from={sceneOffsets[5]} durationInFrames={SCENES.s10DashboardOrbit.duration} layout="none"><DashboardOrbitScene/></Sequence>
  </AbsoluteFill>
);

export default Act2;
