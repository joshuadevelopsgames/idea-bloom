import { useEffect, useRef } from "react";

const VERT = `#version 300 es
precision mediump float;
in vec2 aPosition;
out vec2 vUV;
void main(){
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

// ---- noise ----
vec4 permute(vec4 t){ return t*(t*34.0+133.0); }
vec3 grad(float hash){
  vec3 cube = mod(floor(hash/vec3(1,2,4)),2.0)*2.0-1.0;
  vec3 cuboct = cube;
  float i0 = step(0.0,1.0-floor(hash/16.0));
  float i1 = step(0.0,floor(hash/16.0)-1.0);
  cuboct.x *= 1.0-i0; cuboct.y *= 1.0-i1; cuboct.z *= 1.0-(1.0-i0-i1);
  float tp = mod(floor(hash/8.0),2.0);
  vec3 rhomb = (1.0-tp)*cube + tp*(cuboct+cross(cube,cuboct));
  return (cuboct*1.22474487139+rhomb)*(1.0-0.042942436724648037*tp)*3.5946317686139184;
}
vec4 bccPart(vec3 X){
  vec3 b=floor(X); vec4 i4=vec4(X-b,2.5);
  vec3 v1=b+floor(dot(i4,vec4(.25)));
  vec3 v2=b+vec3(1,0,0)+vec3(-1,1,1)*floor(dot(i4,vec4(-.25,.25,.25,.35)));
  vec3 v3=b+vec3(0,1,0)+vec3(1,-1,1)*floor(dot(i4,vec4(.25,-.25,.25,.35)));
  vec3 v4=b+vec3(0,0,1)+vec3(1,1,-1)*floor(dot(i4,vec4(.25,.25,-.25,.35)));
  vec4 h=permute(mod(vec4(v1.x,v2.x,v3.x,v4.x),289.0));
  h=permute(mod(h+vec4(v1.y,v2.y,v3.y,v4.y),289.0));
  h=mod(permute(mod(h+vec4(v1.z,v2.z,v3.z,v4.z),289.0)),48.0);
  vec3 d1=X-v1,d2=X-v2,d3=X-v3,d4=X-v4;
  vec4 a=max(.75-vec4(dot(d1,d1),dot(d2,d2),dot(d3,d3),dot(d4,d4)),0.0);
  vec4 aa=a*a, aaaa=aa*aa;
  vec3 g1=grad(h.x),g2=grad(h.y),g3=grad(h.z),g4=grad(h.w);
  vec4 ex=vec4(dot(d1,g1),dot(d2,g2),dot(d3,g3),dot(d4,g4));
  vec3 deriv=-8.0*mat4x3(d1,d2,d3,d4)*(aa*a*ex)+mat4x3(g1,g2,g3,g4)*aaaa;
  return vec4(deriv,dot(aaaa,ex));
}
float bccNoise(vec3 X){
  mat3 om=mat3(.788675134594813,-.211324865405187,-.577350269189626,
               -.211324865405187,.788675134594813,-.577350269189626,
               .577350269189626,.577350269189626,.577350269189626);
  X=om*X;
  return (bccPart(X)+bccPart(X+144.5)).w;
}

// ---- aurora helpers ----
vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(TAU*(c*t+d));}
vec3 tonemap(vec3 x){x*=4.;return x/(1.0+x);}
float sdCircle(vec2 st,float r){return length(st)-r;}

mat2 rot2(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}

vec2 turb(vec2 pos,float t,float it){
  mat2 r=mat2(0.6,-0.8,0.8,0.6);
  float freq=mix(2.,15.,0.5);
  float amp=0.5;
  float time=t*0.1;
  for(float i=0.;i<4.;i++){
    vec2 s=sin(freq*(pos*r)+i*time+it);
    pos+=amp*r[0]*s/freq;
    r*=mat2(0.6,-0.8,0.8,0.6);
    freq*=1.4;
  }
  return pos;
}

// ---- SDF sphere ----
float sphere(vec3 p,float r){return length(p)-r;}
vec3 calcNorm(vec3 p,float e){
  vec2 h=vec2(1,-1)*e*0.5;
  return normalize(h.xyy*sphere(p+h.xyy,1.0)+h.yyx*sphere(p+h.yyx,1.0)+h.yxy*sphere(p+h.yxy,1.0)+h.xxx*sphere(p+h.xxx,1.0));
}
float fresnel(vec3 eye,vec3 n,float pw){return pow(1.0-abs(dot(eye,n)),pw);}

void main(){
  vec2 uv = vUV;
  float aspect = uResolution.x/uResolution.y;
  vec2 centeredUV = (uv - 0.5) * vec2(aspect, 1.0);
  float t = uTime;

  // ---- background noise fill (warm pinkish tones) ----
  float n = bccNoise(vec3(centeredUV * 3.5, t * 0.02));
  n = smoothstep(0.0, 1.0, n * 0.5 + 0.5);
  vec3 bgCol = mix(vec3(1.0, 0.92, 0.96), vec3(0.95, 0.85, 0.9), n);

  // ---- aurora layer ----
  const float ITERS = 36.0;
  vec3 pp = vec3(0.0);
  vec3 bloom = vec3(0.0);
  float at = t * 0.5;
  vec2 pos = centeredUV;
  float rotation = -0.0243 * -TAU;
  mat2 rm = mat2(cos(rotation),-sin(rotation),sin(rotation),cos(rotation));
  pos = rm * pos;
  vec2 prevPos = turb(pos, at, -1.0/ITERS);
  float spacing = mix(1.0, TAU, 0.5);
  for(float i=1.;i<ITERS+1.;i++){
    float iter=i/ITERS;
    vec2 st=turb(pos, at, iter*spacing);
    float d=abs(sdCircle(st, 0.26));
    float pd=distance(st,prevPos);
    prevPos=st;
    float db=exp2(pd*2.0*1.4426950408889634)-1.0;
    float ds=smoothstep(0.,max(db,0.001),d);
    vec3 color=pal(iter*mix(0.1,1.9,0.23)+0.68,vec3(0.5),vec3(0.5),vec3(1),vec3(0.259,0.161,0.918));
    float invd=1./max(d+db,0.001);
    pp+=(ds-1.)*color;
    bloom+=clamp(invd,0.,250.)*color;
  }
  pp*=1./ITERS;
  bloom=bloom/(bloom+2e4);
  vec3 auroraCol=tonemap((-pp+bloom*3.*0.75)*1.2);

  // ---- 3D glass sphere ----
  float fov = tan(radians(20.0)*0.5);
  vec3 rd = vec3(centeredUV * fov, 0.5);
  vec3 ro = vec3(0, 0, -4.25);
  float scale = 1.0/max(0.392, 0.0001);

  float traveled = 0.0;
  vec3 entryPt = vec3(0);
  vec3 entryN = vec3(0);
  float hit = 0.0;
  float px = 0.0025;

  // spin
  float timeY = t * 0.02;
  mat3 rY = mat3(cos(timeY),0,sin(timeY),0,1,0,-sin(timeY),0,cos(timeY));

  for(int i=0;i<80;i++){
    vec3 p = ro + rd * traveled;
    vec3 sp = p * scale;
    sp.xy *= vec2(aspect, 1.0);
    sp *= 1.01;
    sp = rY * sp;
    float d = max(0.0000001, sphere(sp, 1.0) - 0.005) * 0.392;
    if(d > 100.0) break;
    if(d < px){
      hit = 1.0;
      entryPt = p;
      vec3 ep = entryPt * scale;
      ep.xy *= vec2(aspect, 1.0);
      ep *= 1.01;
      ep = rY * ep;
      entryN = calcNorm(ep, px * 2.0);
      break;
    }
    traveled += max(d, px);
    if(traveled > 100.0) break;
  }

  vec3 finalCol = bgCol + auroraCol;

  if(hit > 0.5){
    // refraction
    float ior = 1.0/(1.0+0.12*0.25);
    vec3 refracted = refract(rd, entryN, ior);
    vec3 refrCol = mix(bgCol, auroraCol + bgCol, 0.5);

    // fresnel
    float fr = fresnel(rd, entryN, 8.0) * 0.87;
    vec3 frCol = fr * vec3(1.0, 0.82, 0.596);

    // specular
    vec3 lightDir = normalize(vec3(-0.25, 0.25, -3.0));
    vec3 halfDir = normalize(lightDir + rd);
    float spec = pow(max(dot(entryN, halfDir), 0.0), 64.0*0.13+0.01) * 0.13;
    vec3 specCol = spec * vec3(1.0, 0.82, 0.596);

    float ndl = dot(entryN, normalize(vec3(-0.25, 0.25, -3.0)));
    vec3 sphereCol = mix(refrCol, vec3(1.0, 0.82, 0.596) * ndl, 0.64);
    sphereCol += frCol + specCol;

    finalCol = sphereCol;
  }

  // subtle vignette
  float vig = 1.0 - length(centeredUV) * 0.8;
  finalCol *= clamp(vig, 0.3, 1.0);

  fragColor = vec4(finalCol, hit > 0.5 ? 1.0 : 0.0);
}`;

function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
  }
  return s;
}

const ShaderOrb = ({ size = 200 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = size * dpr;
    const h = size * dpr;
    canvas.width = w;
    canvas.height = h;

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "aPosition");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");

    gl.useProgram(prog);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, w, h);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, borderRadius: "50%" }}
      className="pointer-events-none"
    />
  );
};

export default ShaderOrb;
