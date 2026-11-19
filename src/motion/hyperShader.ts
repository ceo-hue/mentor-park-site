/**
 * 하이퍼스페이스 빛줄기 셰이더 (NoraVale 원본 hyper()).
 * 첫 화면과 지원 분야 배경이 함께 쓴다.
 * - uCenter: 빛줄기가 뻗어 나오는 중심(캔버스 픽셀). 첫 화면은 화면 중앙
 * - uPhase: 줄기가 바깥으로 나아간 누적 거리. 늘기만 하므로 항상 중심에서 바깥으로 뻗는다 (첫 화면은 0)
 * - uClip: (x, y, 반지름) 캔버스 픽셀. 이 원 안에만 그린다. 반지름이 음수면 화면 전체
 * - uDark: 1이면 남색 위의 밝은 색, 0이면 흰 바탕 위의 옅은 푸른색
 */
export const LIGHT_VERT = "void main(){gl_Position=vec4(position.xy,0.,1.);}";

export const LIGHT_FRAG = [
  "uniform vec3 iRes;uniform float iTime,uDur,uOpacity,uDark,uPhase;uniform vec3 uSA,uSB;uniform vec2 uCenter;uniform vec3 uClip;",
  "float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
  "vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1e-10;return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);}",
  "vec3 hsv2rgb(vec3 c){vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);}",
  "vec3 hyper(vec2 fc){vec2 R=iRes.xy;float bs=max(1.,min(R.x,R.y));vec2 u=(fc-uCenter)*2./bs;float t=clamp(clamp(iTime,0.,uDur)/uDur,0.,1.);float time=t*uDur;",
  " const float cd=100.;vec2 polar=vec2(atan(u.y,u.x)/3.,length(u));float ac=(6.-polar.x)*cd;float aid=floor(ac)+.5;float acell=abs(fract(ac)-.5);float rc=(6.-polar.y)*cd;vec2 q=vec2(aid,rc);",
  " float travel=smoothstep(0.,1.,t);float keepP=mix(.18,1.,travel);float speed=mix(.7,3.6,travel);float trail=mix(2.7,.975,travel);",
  " float seq=fract((aid+.5)*.61803398875);float keep=1.-smoothstep(keepP-.025,keepP+.025,seq);",
  " float pb=(q.y*.02+q.x*.4)*fract(q.x*.61);vec4 sp=max(1.-fract(vec4(7.,6.,4.,0.)*.02+pb+time*speed+uPhase)*trail,0.);",
  " float ch=max(max(sp.r,sp.g),sp.b);float edge=max(fwidth(ch)*1.5,2./max(iRes.y,1.));float star=smoothstep(.12-edge,.12+edge,ch);",
  " float te=max(fwidth(acell)*1.5,.002);float thin=1.-smoothstep(.13-te,.13+te,acell);star*=thin*keep;",
  " float rb=pow(smoothstep(.1,1.,polar.y),1.25);float inten=mix(0.,3.4,t*1.2);",
  " float sb=h21(vec2(aid,19.713));vec3 srgb=mix(uSA,uSB,sb);vec3 ha=rgb2hsv(max(uSA,vec3(1e-5))),hb=rgb2hsv(max(uSB,vec3(1e-5)));float dh=abs(ha.x-hb.x);dh=min(dh,1.-dh);float band=clamp(dh*1.25+.04,.05,.13);",
  " vec3 hsv=rgb2hsv(max(srgb,vec3(1e-5)));float i1=h21(vec2(aid,6.18)),i2=h21(vec2(aid,91.7));float ph=time*speed+uPhase;",
  " hsv.x=fract(hsv.x+(i1-.5)*band*2.+sin(ph*.52+aid*.29+i1*6.2831853)*(band*.85));hsv.y=clamp(hsv.y*mix(.96,1.06,i2),0.,1.);hsv.z=clamp(hsv.z*mix(.97,1.05,i1),0.,1.);",
  " vec3 sc=hsv2rgb(hsv)*mix(.78,1.,smoothstep(.14,.5,ch));return inten*rb*sc*star;}",
  "void main(){vec3 stripes=hyper(gl_FragCoord.xy);float luma=dot(stripes,vec3(.299,.587,.114));",
  // 흰 바탕용(uDark 0): 옅은 푸른 줄기
  " vec3 tint=mix(vec3(.48,.59,.80),clamp(stripes*1.15,0.,1.),.16);float aLight=smoothstep(.015,.38,luma);",
  // 어두운 바탕용(uDark 1): 원본처럼 '검정 + 빛'. 가장 밝은 채널을 불투명도로, 색은 그만큼 나눠
  // 검정 위에 합성하면 줄기 빛이 그대로 남는다 (옅은 줄기도 사라지지 않는다)
  " vec3 s=min(stripes,vec3(1.));float aDark=max(max(s.r,s.g),s.b);vec3 cDark=aDark>1e-4?s/aDark:vec3(0.);",
  " float k=step(.5,uDark);float clipK=uClip.z<0.?1.:1.-smoothstep(uClip.z-1.5,uClip.z+1.5,length(gl_FragCoord.xy-uClip.xy));",
  " gl_FragColor=vec4(mix(tint,cDark,k),mix(aLight,aDark,k)*uOpacity*clipK);}",
].join("\n");
