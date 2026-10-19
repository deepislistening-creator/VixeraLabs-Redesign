export const VERTEX_SHADER = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

// "Folded Light" fragment shader. Used verbatim: the look depends on its exact numbers.
export const FRAGMENT_SHADER = `precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uLoop;
uniform float uBlur;
uniform float uGrain;
uniform vec2 uMouse;
uniform vec3 uPal[9];

// palette roles
#define GREEN  uPal[0]
#define LIME   uPal[1]
#define YELLOW uPal[2]
#define TEAL   uPal[3]
#define AQUA   uPal[4]
#define CREAM  uPal[5]
#define MINTG  uPal[6]
#define CYAN   uPal[7]
#define DEEP   uPal[8]

const float FA = 1.7778;      // composition is authored in a 16:9 frame
const float PI = 3.14159265;

// signed distance to a (optionally curved) fold edge; a = position along the edge
float edgeSD(vec2 p, vec2 o, float ang, float bend, out float a) {
  vec2 d = vec2(cos(ang), sin(ang));
  vec2 n = vec2(-d.y, d.x);
  vec2 q = p - o;
  a = dot(q, d);
  float t = min(a, 0.0);                 // bend only the leading (negative-a) end -> a curl
  return dot(q, n) + bend * t * t;
}
float cover(float s, float soft) {
  soft = max(soft * uBlur, 0.0012);
  return smoothstep(-soft, soft, s);
}
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  float A = uRes.x / uRes.y;
  vec2 f = vec2(vUv.x, 1.0 - vUv.y);               // y down, 0..1
  if (A > FA) f.y = 0.5 + (f.y - 0.5) * FA / A;     // "cover" crop of the 16:9 frame
  else        f.x = 0.5 + (f.x - 0.5) * max(A / FA, 0.55);   // portrait: crop + gentle squeeze
  vec2 p = vec2(f.x * FA, f.y) + uMouse * vec2(0.025, -0.025);

  float ph = 6.28318530718 * uTime / uLoop;         // everything is periodic in ph
  #define S1(k) (sin(ph + (k)) - sin(k))          // zero at t=0 -> t=0 is the authored frame
  #define S2(k) (sin(2.0 * ph + (k)) - sin(k))

  // ---------------- base wash ----------------
  vec3 top = mix(mix(MINTG, TEAL, 0.25), GREEN, smoothstep(0.0, 0.35, f.x));
  top = mix(top, mix(GREEN, LIME, 0.5), smoothstep(0.5, 1.0, f.x));
  vec3 bot = mix(CREAM, mix(LIME, CREAM, 0.35), smoothstep(0.45, 1.0, f.x));
  vec3 col = mix(top, bot, smoothstep(0.12, 0.85, f.y));
  vec2 gq = p - vec2(0.45 + 0.08 * S1(0.4), 0.42);
  col = mix(col, AQUA, 0.55 * exp(-dot(gq, gq) * 5.0));

  float a, s, c;

  // ---------------- cream sheet (bottom-left) ----------------
  s = edgeSD(p, vec2(0.98 + 0.07 * S1(0.3), 0.66 + 0.03 * S2(1.0)), 2.10 + 0.10 * S1(2.0), 0.0, a);
  c = cover(s, 0.08) * smoothstep(-0.15, 0.35, a) * smoothstep(0.30, 0.75, p.y + 0.06 * S1(1.4));
  col = mix(col, mix(AQUA, CREAM, smoothstep(0.0, 0.4, s)), c * 0.9);

  // ---------------- top-left fold ----------------
  s = edgeSD(p, vec2(0.17 + 0.06 * S1(1.7), 0.14 + 0.04 * S2(0.2)), 0.333 + PI + 0.12 * S1(3.1), 0.0, a);
  float softTL = mix(0.025, 0.09, smoothstep(-0.15, 0.25, -a));
  c = cover(s, softTL);
  col = mix(col, DEEP, 0.30 * smoothstep(-0.28, 0.0, s) * (1.0 - c));             // shadow under the lip
  col = mix(col, MINTG, 0.55 * smoothstep(-0.55, -0.1, s) * (1.0 - c) * smoothstep(0.7, 0.1, p.x));
  vec3 tlc = mix(mix(YELLOW, LIME, 0.25), mix(GREEN, TEAL, 0.55), smoothstep(0.0, 0.2, s));
  tlc = mix(tlc, mix(GREEN, TEAL, 0.4), smoothstep(-0.05, 0.3, a));
  col = mix(col, tlc, c * 0.9);

  // ---------------- lime field right of the beam ----------------
  vec2 bo = vec2(1.07 + 0.10 * S1(0.0), 0.28 + 0.03 * S2(2.2));
  float bang = 2.072 + 0.10 * S1(1.2);
  float ab;
  float sb = edgeSD(p, bo, bang, 0.0, ab);
  float softB = mix(0.008, 0.035, smoothstep(-0.2, 0.4, ab));
  c = (1.0 - cover(sb, softB)) * (1.0 - smoothstep(0.15, 0.55, ab));
  col = mix(col, mix(LIME, GREEN, 0.15 * smoothstep(0.0, 0.3, -sb)), c * 0.85);

  // ---------------- mint curl (centre-left, curved crisp edge) ----------------
  s = edgeSD(p, vec2(0.76 + 0.06 * S1(2.4), 0.25 + 0.03 * S1(0.9)), 1.11 + 0.15 * S1(4.0), -2.2 + 0.9 * S2(0.5), a);
  float softC = mix(0.010, 0.08, smoothstep(-0.1, 0.3, a));
  c = cover(s, softC) * smoothstep(-0.30, -0.14, a) * (1.0 - 0.75 * smoothstep(0.30, 0.75, s));
  col = mix(col, mix(AQUA, mix(AQUA, CREAM, 0.4), smoothstep(0.0, 0.35, s)), c * 0.85);

  // ---------------- yellow beam (crisp right edge) ----------------
  float w = 0.20 + 0.04 * S2(1.6);
  c = cover(sb, softB) * (1.0 - cover(sb - w, 0.07)) * (1.0 - smoothstep(0.42, 0.80, ab));
  vec3 beam = mix(AQUA, YELLOW, smoothstep(-0.30, 0.25, ab));
  beam = mix(beam, mix(AQUA, CREAM, 0.3), smoothstep(0.02, w, sb) * 0.45);
  col = mix(col, beam, c * 0.9);

  // ---------------- streak line (soft aqua fold, bottom-centre) ----------------
  float a2;
  vec2 so = vec2(0.98 + 0.07 * S1(0.3), 0.66 + 0.03 * S2(1.0));
  float s2 = edgeSD(p, so, -1.042 + 0.10 * S1(2.0), 0.0, a2);

  // ---------------- teal panel ----------------
  s = edgeSD(p, vec2(1.28 + 0.08 * S1(5.0), 0.28 + 0.06 * S1(2.6)), -0.667 + 0.10 * S2(4.4), 0.12 * S1(1.0), a);
  float rim = exp(-pow((s + 0.05) / 0.045, 2.0)) * smoothstep(0.15, 0.5, a);
  col = mix(col, YELLOW, rim * 0.8);                                                // yellow lip
  col = mix(col, DEEP, 0.25 * exp(-pow((s + 0.012) / 0.02, 2.0)) * smoothstep(0.0, 0.3, a));
  float softP = mix(0.06, 0.012, smoothstep(-0.3, 0.2, a));
  c = cover(s, softP) * cover(s2, 0.05);
  vec3 pe = mix(AQUA, TEAL, smoothstep(-0.40, 0.10, a));
  vec3 panel = mix(pe, mix(LIME, CREAM, 0.15), smoothstep(0.0, 0.50, s));
  col = mix(col, panel, c * 0.92);

  // soft aqua streak along the panel's left boundary
  col = mix(col, AQUA, 0.6 * exp(-pow(s2 / 0.07, 2.0)) * (1.0 - smoothstep(0.15, 0.40, a2)));

  // ---------------- bottom-right corner ----------------
  s = edgeSD(p, vec2(1.74 + 0.05 * S1(3.3), 0.86 + 0.05 * S2(0.7)), -1.0 + 0.12 * S1(5.5), -0.8, a);
  col = mix(col, CREAM, 0.35 * exp(-pow((s + 0.07) / 0.06, 2.0)) * smoothstep(-0.25, 0.0, a));
  c = cover(s, 0.05);
  col = mix(col, mix(CYAN, TEAL, smoothstep(0.0, 0.25, s)), c * 0.88);

  // film grain / dithering
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 311.0) - 0.5) * uGrain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
