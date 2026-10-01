import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SCENES, TYPE} from './theme';
import {GlassPanel, Grain, Haze, Sparkle, drift} from './FX';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const sceneIds = ['s17Workflow','s18All','s19InOnePlace','s20WorkFaster','s21Stay','s22ClientsHappy','s23Cta'] as const;
const durations = sceneIds.map((id) => SCENES[id].duration);
const offsets = durations.map((_, i) => durations.slice(0, i).reduce((sum, n) => sum + n, 0));
export const ACT4_DURATION = durations.reduce((sum, n) => sum + n, 0);

const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = [
    {label:'New lead',x:170,y:260,color:'#7567D8'},
    {label:'Create project',x:510,y:160,color:'#D99042'},
    {label:'Assign team',x:850,y:300,color:'#2488DB'},
    {label:'Send invoice',x:1190,y:170,color:'#DD6C77'},
  ];
  const enter = spring({frame,fps,config:{damping:22,stiffness:120,mass:1}});
  const dash = -frame * 1.5;
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest3},${C.bg1} 52%,${C.bg0})`,overflow:'hidden'}}>
    <Haze intensity={.55}/>
    <div style={{position:'absolute',left:'50%',top:'50%',width:1450,height:700,transform:`translate(-50%,-50%) scale(${mix(.94,1,Math.max(0,enter))})`,borderRadius:28,boxShadow:'0 35px 90px rgba(0,0,0,.42)'}}>
      <GlassPanel style={{width:'100%',height:'100%',padding:20,boxSizing:'border-box'}}>
        <div style={{height:'100%',background:'#F7FAF8',borderRadius:16,padding:28,boxSizing:'border-box',fontFamily:TYPE.family,color:'#30453a'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}><div><div style={{fontSize:23,fontWeight:700}}>Workflow automation</div><div style={{fontSize:13,color:'#7C8A82',marginTop:5}}>When a lead is created, keep work moving</div></div><div style={{padding:'10px 18px',borderRadius:9,background:C.uiAccent,color:'#fff',fontSize:13,fontWeight:700}}>Publish workflow</div></div>
          <svg viewBox="0 0 1450 470" preserveAspectRatio="none" style={{position:'absolute',inset:'25% 2% 6%',width:'96%',height:'68%',overflow:'visible'}}>
            {[0,1,2].map((i)=><path key={i} d={`M ${nodes[i].x+230} ${nodes[i].y+62} C ${nodes[i].x+300} ${nodes[i].y+62}, ${nodes[i+1].x-65} ${nodes[i+1].y+62}, ${nodes[i+1].x} ${nodes[i+1].y+62}`} fill="none" stroke={C.uiAccent} strokeWidth="4" strokeDasharray="10 9" strokeDashoffset={dash}/>) }
          </svg>
          {nodes.map((node,i)=>{
            const p=spring({frame:frame-i*5,fps,config:{damping:18,stiffness:160,mass:.85}});
            return <div key={node.label} style={{position:'absolute',left:node.x+28,top:node.y+112,transform:`translateY(${(1-p)*30}px) scale(${Math.max(0,p)})`,opacity:Math.max(0,p),width:230,padding:18,boxSizing:'border-box',borderRadius:14,background:'#fff',border:'1px solid #DFEAE3',boxShadow:'0 13px 30px rgba(23,68,47,.13)'}}><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:32,height:32,borderRadius:9,background:node.color,boxShadow:`0 0 18px ${node.color}55`}}/><span style={{fontSize:14,fontWeight:700,color:'#30453a'}}>{node.label}</span></div><div style={{height:8,marginTop:16,borderRadius:8,background:'#EFF4F1'}}/><div style={{height:8,width:'68%',marginTop:8,borderRadius:8,background:'#EFF4F1'}}/></div>;
          })}
        </div>
      </GlassPanel>
    </div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const TitleScene: React.FC<{text:string;accent?:string;fontSize:number;weight?:number;driftY?:number;blurExit?:boolean}> = ({text,accent,fontSize,weight=700,driftY=0,blurExit=false}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const duration=useVideoConfig().durationInFrames;
  const enter=spring({frame,fps,config:{damping:18,stiffness:180,mass:.9}});
  const exit=ease(interpolate(frame,[duration-12,duration],[0,1],clamp));
  const words=text.split(' ');
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest3},${C.bg1} 48%,${C.bg0})`,overflow:'hidden',display:'grid',placeItems:'center'}}>
    <Haze intensity={.62}/>
    <div style={{position:'relative',zIndex:1,display:'flex',gap:'.24em',alignItems:'center',justifyContent:'center',fontFamily:TYPE.family,fontSize,fontWeight:weight,letterSpacing:`${TYPE.tracking}em`,lineHeight:TYPE.lineHeight,color:C.white,transform:`translateY(${(1-enter)*34-driftY*frame}px) scale(${mix(.82,1,Math.max(0,enter))})`,opacity:1-exit,filter:`blur(${blurExit?exit*18:exit*4}px)`,textShadow:'0 0 30px rgba(59,255,199,.2)'}}>
      {words.map((word,i)=><span key={`${word}-${i}`} style={{display:'inline-block',color:accent&&word.toLowerCase().replace(/[.,!?]/g,'')===accent.toLowerCase()?C.mint:C.white,textShadow:accent&&word.toLowerCase().replace(/[.,!?]/g,'')===accent.toLowerCase()?'0 0 28px rgba(59,255,199,.55)':undefined}}>{word}</span>)}
    </div>
    {text==='All'&&<Sparkle size={38} color={C.mintLight} style={{position:'absolute',left:'58%',top:'34%'}}/>}
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const WorkFasterScene: React.FC = () => {
  const frame=useCurrentFrame();
  const resolve=ease(interpolate(frame,[0,18],[0,1],clamp));
  const exit=ease(interpolate(frame,[48,60],[0,1],clamp));
  const x=(1-resolve)*50;
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%,${C.forest3},${C.bg1} 48%,${C.bg0})`,overflow:'hidden',display:'grid',placeItems:'center'}}>
    <Haze intensity={.58}/>
    <div style={{position:'absolute',fontFamily:TYPE.family,fontSize:120,fontWeight:600,color:C.mint,opacity:(1-resolve)*.18,filter:`blur(${(1-resolve)*20}px)`,transform:`translateX(${x+5}px)`,textShadow:'3px 0 #f36, -3px 0 #36f'}}>Work faster</div>
    <div style={{position:'relative',fontFamily:TYPE.family,fontSize:120,fontWeight:600,color:C.white,textShadow:'0 0 32px rgba(59,255,199,.38)',filter:`blur(${(1-resolve)*60+exit*14}px)`,transform:`translateX(${(1-resolve)*-50-exit*24}px) scale(${mix(.92,1,resolve)})`,opacity:1-exit}}>Work faster</div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const MoneySphere: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const pop=spring({frame,fps,config:{damping:9,stiffness:180,mass:.9}});
  const squash=1-.08*Math.exp(-Math.pow((frame-18)/5,2));
  return <div style={{position:'absolute',left:'50%',top:'34%',width:360,height:360,transform:`translate(-50%,-50%) scale(${Math.max(0,pop)}) scaleY(${squash})`,borderRadius:'50%',background:'radial-gradient(circle at 30% 23%,#E8FFF3 0%,#83FFCE 12%,#11DE99 35%,#07573B 78%,#001810 100%)',boxShadow:'inset -30px -35px 55px rgba(0,0,0,.38),inset 18px 15px 25px rgba(255,255,255,.36),0 0 90px rgba(59,255,199,.55)'}}>
    <div style={{position:'absolute',left:'24%',top:'35%',fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:62,color:'#58E08A',textShadow:'0 2px 5px rgba(0,0,0,.24)'}}>$</div>
    <div style={{position:'absolute',right:'23%',top:'35%',fontFamily:'Arial,sans-serif',fontWeight:900,fontSize:62,color:'#58E08A',textShadow:'0 2px 5px rgba(0,0,0,.24)'}}>$</div>
    <div style={{position:'absolute',left:'50%',top:'67%',width:92,height:38,transform:'translateX(-50%)',borderRadius:'8px 8px 42px 42px',background:'linear-gradient(180deg,#165C3B,#073B29)',border:'3px solid rgba(176,254,222,.72)',boxShadow:'0 0 20px rgba(59,255,199,.45)'}}/>
    {[0,1,2,3,4,5].map((i)=>{const a=frame*.045+i*Math.PI/3;return <span key={i} style={{position:'absolute',left:`${50+Math.cos(a)*62}%`,top:`${50+Math.sin(a)*42}%`,fontFamily:TYPE.family,fontSize:18,fontWeight:700,color:C.mintLight,opacity:.8,transform:'translate(-50%,-50%)'}}>$</span>;})}
  </div>;
};

const ClientsScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:22,stiffness:120,mass:1}});
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 48%,${C.forest3},${C.bg1} 50%,${C.bg0})`,overflow:'hidden'}}>
    <Haze intensity={.64}/><MoneySphere/>
    <div style={{position:'absolute',left:'50%',top:'69%',transform:`translate(-50%,-50%) translateY(${(1-enter)*25}px)`,fontFamily:TYPE.family,fontSize:104,fontWeight:700,whiteSpace:'nowrap',textShadow:'0 5px 30px rgba(0,0,0,.36)'}}><span style={{color:C.mint}}>Keep </span><span style={{color:C.white}}>clients</span><span style={{color:C.mint}}> happy</span></div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

const CtaScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const duration=SCENES.s23Cta.duration;
  const text='taskip.net/special-offers';
  const typed=Math.min(text.length,Math.max(0,Math.floor(frame/2)));
  const value=text.slice(0,typed);
  const caret=frame<82&&Math.floor(frame/15)%2===0;
  const enter=spring({frame,fps,config:{damping:22,stiffness:120,mass:1}});
  const zoom=1+0.03*ease(interpolate(frame,[50,duration],[0,1],clamp));
  const borderAngle=(frame*2)%360;
  return <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 48%,${C.forest2},${C.bg1} 55%,${C.bg0})`,overflow:'hidden',display:'grid',placeItems:'center'}}>
    <Haze intensity={.7}/>
    <div style={{position:'absolute',inset:0,opacity:ease(interpolate(frame,[0,45],[0,1],clamp)),backgroundImage:'linear-gradient(rgba(59,255,199,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(59,255,199,.06) 1px,transparent 1px)',backgroundSize:'64px 64px',maskImage:'radial-gradient(ellipse at center,#000 15%,transparent 78%)'}}/>
    <div style={{position:'relative',zIndex:1,width:1000,height:120,transform:`scale(${zoom*mix(.94,1,Math.max(0,enter))})`,borderRadius:80,display:'grid',placeItems:'center',background:'linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.05))',backdropFilter:'blur(22px) saturate(160%)',border:'2px solid rgba(131,255,206,.62)',boxShadow:'0 0 0 1px rgba(59,255,199,.25),0 0 55px rgba(59,255,199,.38),inset 0 1px 0 rgba(255,255,255,.55)'}}>
      <div aria-hidden style={{position:'absolute',inset:-2,borderRadius:80,pointerEvents:'none',background:`conic-gradient(from ${borderAngle}deg,transparent 0 70%,#83FFCE 85%,transparent 100%)`,mask:'linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)',WebkitMask:'linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)',WebkitMaskComposite:'xor',padding:2}}/>
      <div style={{fontFamily:TYPE.family,fontSize:TYPE.cta,fontWeight:600,letterSpacing:'-.02em',color:C.white,textShadow:'0 0 22px rgba(59,255,199,.25)',whiteSpace:'nowrap'}}>{value}<span style={{display:'inline-block',width:3,height:58,marginLeft:5,verticalAlign:'-8px',background:C.mint,opacity:caret?1:0}}/></div>
    </div>
    <div style={{position:'absolute',left:'50%',top:'64%',transform:'translateX(-50%)',fontFamily:TYPE.family,fontSize:18,fontWeight:700,letterSpacing:'.22em',color:C.mintPale,opacity:ease(interpolate(frame,[45,68],[0,.85],clamp))}}>A BETTER WAY TO RUN YOUR AGENCY</div>
    <Grain opacity={.03}/>
  </AbsoluteFill>;
};

export const Act4: React.FC = () => <AbsoluteFill style={{backgroundColor:C.bg0,overflow:'hidden'}}>
  <Sequence from={offsets[0]} durationInFrames={SCENES.s17Workflow.duration} layout="none"><WorkflowScene/></Sequence>
  <Sequence from={offsets[1]} durationInFrames={SCENES.s18All.duration} layout="none"><TitleScene text="All" fontSize={TYPE.all} accent="all"/></Sequence>
  <Sequence from={offsets[2]} durationInFrames={SCENES.s19InOnePlace.duration} layout="none"><TitleScene text="In One Place" fontSize={96} accent="place"/></Sequence>
  <Sequence from={offsets[3]} durationInFrames={SCENES.s20WorkFaster.duration} layout="none"><WorkFasterScene/></Sequence>
  <Sequence from={offsets[4]} durationInFrames={SCENES.s21Stay.duration} layout="none"><TitleScene text="Stay" fontSize={96} accent="stay" driftY={-0.12}/></Sequence>
  <Sequence from={offsets[5]} durationInFrames={SCENES.s22ClientsHappy.duration} layout="none"><ClientsScene/></Sequence>
  <Sequence from={offsets[6]} durationInFrames={SCENES.s23Cta.duration} layout="none"><CtaScene/></Sequence>
</AbsoluteFill>;

export default Act4;
