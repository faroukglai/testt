import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {C, EASE, FPS, HEIGHT, SCENES, TOOL_PHRASES, TYPE, WIDTH} from './theme';
import {BlurWord, ClipReveal, GlassBubble, Grain, Haze, Sparkle, fullFrame} from './FX';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const smooth = Easing.bezier(0.16, 1, 0.3, 1);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const Starfield: React.FC = () => (
  <svg aria-hidden viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.56}}>
    {Array.from({length:38}, (_,i) => {
      const x = (i * 277 + 89) % WIDTH;
      const y = (i * 197 + 41) % HEIGHT;
      const r = 1 + (i % 4) * .55;
      return <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 0 ? C.mintLight : '#D7FFF1'} opacity={.18 + (i % 5) * .07}/>;
    })}
  </svg>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = 'Running an agency today means';
  const entrance = smooth(interpolate(frame,[0,22],[0,1],clamp));
  const orbit = (frame / FPS) * 0.42;
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 58%, ${C.bg3} 0%, ${C.bg1} 55%, ${C.bg0} 100%)`,overflow:'hidden'}}>
      <Haze intensity={.54}/><Starfield/>
      <div style={{position:'absolute',left:'50%',top:'42%',width:650,height:260,transform:`translate(-50%,-50%) rotateX(64deg) rotate(${frame*.12}deg)`,border:'1px solid rgba(59,255,199,.2)',borderRadius:'50%',boxShadow:'0 0 70px rgba(14,199,121,.12)'}}/>
      <div style={{position:'absolute',left:'50%',top:'42%',width:430,height:180,transform:`translate(-50%,-50%) rotateX(64deg) rotate(${-frame*.17}deg)`,border:'1px solid rgba(131,255,206,.14)',borderRadius:'50%'}}/>
      {Array.from({length:5},(_,i)=>{
        const a=orbit+i*(Math.PI*2/5);
        const x=Math.cos(a)*280, y=Math.sin(a)*102;
        return <div key={i} style={{position:'absolute',left:'50%',top:'42%',width:10,height:10,borderRadius:'50%',background:i===1?C.mint:C.mintLight,boxShadow:'0 0 18px #3BFFC7',transform:`translate(${x}px,${y}px)`,opacity:.5+entrance*.5}}/>;
      })}
      <div style={{position:'absolute',left:0,right:0,top:'16%',display:'flex',justifyContent:'center',textAlign:'center'}}>
        <BlurWord text={title} startFrame={0} durationInFrames={120} staggerFrames={4} fontSize={TYPE.headline} fontWeight={TYPE.weightSemibold} readingFrames={70} style={{maxWidth:1500,justifyContent:'center'}}/>
      </div>
      <div style={{position:'absolute',left:'50%',top:'67%',transform:`translate(-50%,-50%) scale(${mix(.94,1,entrance)})`,opacity:entrance*.82,color:C.mintLight,fontFamily:TYPE.family,fontSize:TYPE.orbitCaption,letterSpacing:'-.02em',textShadow:'0 0 24px rgba(59,255,199,.42)',whiteSpace:'nowrap'}}>A better way to run your agency</div>
      <div style={{position:'absolute',left:'50%',top:'42%',width:18,height:18,marginLeft:-9,marginTop:-9,borderRadius:'50%',background:C.mint,boxShadow:'0 0 36px 12px rgba(59,255,199,.42)'}}/>
      <Grain opacity={.025}/>
    </AbsoluteFill>
  );
};

const OrbitScene: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=smooth(interpolate(frame,[0,24],[0,1],clamp));
  const labels=['CRM','Projects','Invoices','Email','Support','Forms'];
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%, ${C.bg3}, ${C.bg1} 62%, ${C.bg0})`,overflow:'hidden'}}>
      <Haze intensity={.42}/>
      <div style={{position:'absolute',left:'50%',top:'49%',width:570,height:570,transform:`translate(-50%,-50%) rotate(${frame*.08}deg)`,border:'1px solid rgba(59,255,199,.17)',borderRadius:'50%'}}/>
      <div style={{position:'absolute',left:'50%',top:'49%',width:390,height:390,transform:`translate(-50%,-50%) rotateX(68deg) rotate(${-frame*.14}deg)`,border:'1px solid rgba(131,255,206,.22)',borderRadius:'50%'}}/>
      <div style={{position:'absolute',left:'50%',top:'49%',width:190,height:190,transform:'translate(-50%,-50%)',borderRadius:'50%',background:'radial-gradient(circle at 32% 26%, #83FFCE 0%, #11DE99 22%, #075E40 65%, #001810 100%)',boxShadow:'0 0 90px rgba(17,222,153,.4), inset -22px -28px 38px rgba(0,0,0,.45)'}}/>
      {labels.map((label,i)=>{
        const a=(frame/fps)*.25+i*Math.PI*2/labels.length;
        const x=Math.cos(a)*420, y=Math.sin(a)*210;
        const delay=i*5;
        const s=spring({frame:frame-delay,fps,config:{damping:18,stiffness:120,mass:.9}});
        return <div key={label} style={{position:'absolute',left:'50%',top:'49%',transform:`translate(${x}px,${y}px) scale(${Math.max(0,s)})`,opacity:Math.min(1,Math.max(0,s)),willChange:'transform'}}>
          <GlassBubble size={112} label={label} style={{background:'radial-gradient(circle at 30% 20%,#fff,#e8fff5 72%,#a4f7d5)',boxShadow:'0 12px 40px rgba(0,0,0,.4),0 0 30px rgba(59,255,199,.22)'}}>
            <span style={{fontFamily:TYPE.family,fontSize:17,fontWeight:700,color:C.forest3,letterSpacing:'.03em'}}>{label}</span>
          </GlassBubble>
        </div>;
      })}
      <div style={{position:'absolute',left:'50%',top:'85%',transform:`translate(-50%,-50%) translateY(${mix(14,0,t)}px)`,opacity:t,textAlign:'center',fontFamily:TYPE.family,fontSize:40,fontWeight:600,color:C.white,textShadow:'0 2px 20px rgba(0,0,0,.55)',whiteSpace:'nowrap'}}>Juggling too many tools?</div>
      <Grain opacity={.025}/>
    </AbsoluteFill>
  );
};

const CollapseScene: React.FC = () => {
  const frame=useCurrentFrame();
  const p=smooth(interpolate(frame,[0,38],[0,1],clamp));
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at center, ${C.forest3} 0%, ${C.bg2} 28%, ${C.bg0} 75%)`,overflow:'hidden'}}>
      <Haze intensity={.65}/>
      {Array.from({length:14},(_,i)=>{
        const a=(i/14)*Math.PI*2+frame*.035;
        const radius=mix(530,62,p);
        const x=Math.cos(a)*radius;
        const y=Math.sin(a)*radius*.62;
        return <div key={i} style={{position:'absolute',left:'50%',top:'50%',width:14+(i%4)*4,height:14+(i%4)*4,marginLeft:-9,marginTop:-9,borderRadius:'50%',background:i%3===0?C.mintLight:C.mint,boxShadow:'0 0 24px rgba(59,255,199,.72)',transform:`translate(${x}px,${y}px) scale(${1-.38*p})`,opacity:.88-p*.32}}/>;
      })}
      <div style={{position:'absolute',left:'50%',top:'50%',width:mix(24,172,p),height:mix(24,172,p),transform:'translate(-50%,-50%)',borderRadius:'50%',background:'radial-gradient(circle at 32% 24%,#B0FEDE,#11DE99 42%,#05442F 77%)',boxShadow:`0 0 ${mix(30,105,p)}px rgba(59,255,199,.7)`}}/>
      <div style={{position:'absolute',left:'50%',top:'82%',transform:'translate(-50%,-50%)',fontFamily:TYPE.family,fontSize:34,letterSpacing:'.18em',color:C.mintLight,opacity:1-p*.65}}>TOO MANY TOOLS</div>
      <Grain opacity={.035}/>
    </AbsoluteFill>
  );
};

const Phrase: React.FC<{text:string;start:number;words:number;duration:number}> = ({text,start,words,duration})=>{
  const frame=useCurrentFrame();
  const local=frame-start;
  const visible=interpolate(local,[0,20,duration-12,duration],[0,1,1,0],clamp);
  const scale=interpolate(local,[0,20],[.92,1],{...clamp,easing:smooth});
  return <div style={{position:'absolute',left:'50%',top:'50%',width:'100%',transform:`translate(-50%,-50%) scale(${scale})`,opacity:visible,textAlign:'center'}}>
    <BlurWord text={text} startFrame={start} durationInFrames={duration} staggerFrames={2} fontSize={56} accentWords={['Sales','Tasks','Invoices','Storage','Meetings','Email','Support','Data','discussions']} readingFrames={Math.ceil((words/3+.5)*FPS)} style={{maxWidth:1500,justifyContent:'center',textShadow:'0 0 40px rgba(59,255,199,.22)'}}/>
  </div>;
};

const ToolListScene: React.FC = () => {
  const frame=useCurrentFrame();
  // Theme cue values are local to S4; convert once to the parent composition frame.
  const s4Start=SCENES.s04ToolList.start;
  const positioned=TOOL_PHRASES.map((phrase)=>({...phrase,start:s4Start+phrase.start}));
  const active=positioned.find((phrase)=>frame>=phrase.start&&frame<phrase.start+phrase.duration);
  const orbit=(frame-s4Start)*.01;
  return (
    <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 50%, ${C.bg3}, ${C.bg1} 56%, ${C.bg0})`,overflow:'hidden'}}>
      <Haze intensity={.5}/>
      <div style={{position:'absolute',left:'50%',top:'52%',width:590,height:590,border:'1px solid rgba(59,255,199,.16)',borderRadius:'50%',transform:`translate(-50%,-50%) rotate(${(frame-s4Start)*.08}deg)`}}/>
      <div style={{position:'absolute',left:'50%',top:'52%',width:410,height:410,border:'1px solid rgba(131,255,206,.14)',borderRadius:'50%',transform:`translate(-50%,-50%) rotateX(66deg) rotate(${-(frame-s4Start)*.1}deg)`}}/>
      <div style={{position:'absolute',left:'50%',top:'52%',width:190,height:190,transform:`translate(-50%,-50%) rotate(${(frame-s4Start)*.15}deg)`,borderRadius:'50%',background:'radial-gradient(circle at 28% 24%,#B0FEDE,#11DE99 28%,#07573B 63%,#001810 100%)',boxShadow:'0 0 90px rgba(17,222,153,.38)'}}/>
      {Array.from({length:9},(_,i)=>{
        const a=orbit+i*Math.PI*2/9;
        const x=Math.cos(a)*425,y=Math.sin(a)*210;
        const activeIndex=active?positioned.indexOf(active):-1;
        const focus=activeIndex===i;
        const appear=focus?1:0.48;
        return <div key={i} style={{position:'absolute',left:'50%',top:'52%',transform:`translate(${x}px,${y}px) scale(${focus?1.08:.78})`,opacity:appear}}>
          <GlassBubble size={88} label={positioned[i]?.text ?? 'Taskip tool'} style={{boxShadow:'0 14px 34px rgba(0,0,0,.42),0 0 24px rgba(59,255,199,.24)'}}>
            <Sparkle size={34} color={focus?C.forest3:C.forest2}/>
          </GlassBubble>
        </div>;
      })}
      {active&&<Phrase text={active.text} words={active.words} start={active.start} duration={active.duration}/>}
      <div style={{position:'absolute',left:'50%',top:'90%',transform:'translate(-50%,-50%)',fontFamily:TYPE.family,fontSize:18,fontWeight:600,letterSpacing:'.12em',color:C.mintLight,opacity:.72}}>ONE WORKSPACE. LESS CHAOS.</div>
      <Grain opacity={.03}/>
    </AbsoluteFill>
  );
};

export const Act1: React.FC = () => {
  const frame=useCurrentFrame();
  const s1=SCENES.s01Intro.end;
  const s2=SCENES.s02Orbit.end;
  const s3=SCENES.s03Collapse.end;
  const s4=SCENES.s04ToolList.end;
  const scene = frame < s1 ? 0 : frame < s2 ? 1 : frame < s3 ? 2 : 3;
  const content = scene===0?<IntroScene/>:scene===1?<OrbitScene/>:scene===2?<CollapseScene/>:<ToolListScene/>;
  const transitionStart = scene===0?s1-20:scene===1?s2-18:scene===2?s3-16:s4-1;
  const transitionDuration = scene===0?24:scene===1?24:scene===2?24:1;
  const transitionFrame=frame-transitionStart;
  const transitionProgress=Easing.bezier(.76,0,.24,1)(interpolate(transitionFrame,[0,transitionDuration],[0,1],clamp));
  const transitionShape=scene===1?'iris':scene===2?'dome':'squircle';
  const outgoingOpacity=scene===1?1-transitionProgress:1;
  return (
    <AbsoluteFill style={{backgroundColor:C.bg0,overflow:'hidden'}}>
      <AbsoluteFill style={{opacity:outgoingOpacity}}>{content}</AbsoluteFill>
      {scene>0&&scene<3&&transitionFrame>=0&&(
        <AbsoluteFill style={{opacity:transitionProgress}}>
          <ClipReveal shape={transitionShape} progress={transitionProgress}>
            <div style={fullFrame}>
              {scene===1?<OrbitScene/>:scene===2?<CollapseScene/>:<ToolListScene/>}
            </div>
          </ClipReveal>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Act1;
