import { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// True water-refraction background (WebGL). A very subtle theme-coloured gradient
// is the "surface"; expanding concentric waves displace where each pixel samples
// that surface (refraction) and add a glassy highlight on the wave crests. Waves
// are elliptical for a 3D, viewed-at-an-angle feel. Decorative + aria-hidden, so
// no SEO weight; the loop pauses when the tab is hidden and degrades to a static
// clean background under prefers-reduced-motion or when WebGL is unavailable.

const MAX_RIPPLES = 8;
const LIFE = 14.0;        // seconds a ripple lives (long -> slow, calm)
const SPEED = 78;         // px/sec the wavefront expands (very slow tempo)
const SPAWN_EVERY = 4.8;  // seconds between ambient drops (infrequent)

// Theme surface + highlight colours (0..1 rgb). Base matches --bg so the canvas
// blends seamlessly with the page; colB is a barely-there tint for refraction.
const THEMES = {
  light: { colA: [0.992, 0.988, 0.980], colB: [0.945, 0.952, 0.968], tint: [0.42, 0.55, 0.78], hi: 0.09 },
  dark:  { colA: [0.067, 0.067, 0.067], colB: [0.086, 0.100, 0.130], tint: [0.45, 0.60, 0.90], hi: 0.14 },
};

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2  uRes;
uniform float uTime;
uniform int   uCount;
uniform vec3  uRipples[${MAX_RIPPLES}]; // x, y (px, gl bottom-left origin), startTime (s)
uniform vec3  uColA;
uniform vec3  uColB;
uniform vec3  uTint;
uniform float uHi;

const float SQUASH = 1.0; // 1.0 = perfectly round rings (no perspective squash)

vec3 surface(vec2 uv){
  float g = clamp(dot(uv, vec2(0.55, 0.75)) * 0.9, 0.0, 1.0);
  return mix(uColA, uColB, smoothstep(0.0, 1.0, g));
}

void main(){
  vec2 fp = gl_FragCoord.xy;
  vec2 disp = vec2(0.0);
  float crest = 0.0;

  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    if (i >= uCount) break;
    vec3 r = uRipples[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > ${LIFE.toFixed(1)}) continue;

    vec2 dd = fp - r.xy;
    // elliptical distance (perspective): vertical axis compressed
    float d = length(vec2(dd.x, dd.y / SQUASH));
    float front = age * ${SPEED.toFixed(1)};
    float band = exp(-pow((d - front) / 190.0, 2.0));   // energy near the wavefront
    float life = clamp(1.0 - age / ${LIFE.toFixed(1)}, 0.0, 1.0);
    float wave = sin((d - front) * 0.055);

    vec2 dir = normalize(dd + vec2(0.0001));
    dir.y *= SQUASH;
    disp += dir * wave * band * life * 11.0;
    crest += wave * band * life;
  }

  vec2 uv = (fp + disp) / uRes;
  vec3 col = surface(uv);
  col += uTint * crest * uHi;          // glassy highlight / shadow on crests
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function RippleBackground() {
  const { theme } = useApp();
  const themeRef = useRef(THEMES[theme] || THEMES.light);
  const canvasRef = useRef(null);

  useEffect(() => {
    themeRef.current = THEMES[theme] || THEMES.light;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let gl;
    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: false, depth: false })
        || canvas.getContext('experimental-webgl');
    } catch (_) { gl = null; }
    if (!gl) return; // no WebGL -> leave transparent, page --bg shows through

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[ripple] shader error:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[ripple] link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad (triangle strip).
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      count: gl.getUniformLocation(prog, 'uCount'),
      ripples: gl.getUniformLocation(prog, 'uRipples'),
      colA: gl.getUniformLocation(prog, 'uColA'),
      colB: gl.getUniformLocation(prog, 'uColB'),
      tint: gl.getUniformLocation(prog, 'uTint'),
      hi: gl.getUniformLocation(prog, 'uHi'),
    };

    const SCALE = Math.min(window.devicePixelRatio || 1, 1.5); // soft effect -> cap for mobile
    let W = 0, H = 0;
    const resize = () => {
      W = Math.floor(window.innerWidth * SCALE);
      H = Math.floor(window.innerHeight * SCALE);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, W, H);
    };

    // Ripples: flat Float32Array [x, y, startSec] * MAX. y in gl bottom-left origin.
    const data = new Float32Array(MAX_RIPPLES * 3);
    let count = 0;
    let head = 0;
    const spawn = (px, py, tSec) => {
      const idx = (count < MAX_RIPPLES ? count : head) * 3;
      data[idx] = px;
      data[idx + 1] = H - py; // flip Y for gl_FragCoord
      data[idx + 2] = tSec;
      if (count < MAX_RIPPLES) count++;
      else head = (head + 1) % MAX_RIPPLES;
    };

    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;

    let hidden = false;
    let rafId = 0;
    let sinceSpawn = 0;
    let lastT = 0;

    const render = () => {
      if (hidden) return;
      const t = now();
      const dt = lastT ? t - lastT : 0.016;
      lastT = t;

      if (!prefersReduced) {
        sinceSpawn += dt;
        if (sinceSpawn >= SPAWN_EVERY) {
          sinceSpawn = 0;
          spawn(Math.random() * W, Math.random() * window.innerHeight * SCALE, t);
        }
      }

      const th = themeRef.current;
      gl.uniform2f(U.res, W, H);
      gl.uniform1f(U.time, prefersReduced ? 2.2 : t);
      gl.uniform1i(U.count, count);
      gl.uniform3fv(U.ripples, data);
      gl.uniform3f(U.colA, th.colA[0], th.colA[1], th.colA[2]);
      gl.uniform3f(U.colB, th.colB[0], th.colB[1], th.colB[2]);
      gl.uniform3f(U.tint, th.tint[0], th.tint[1], th.tint[2]);
      gl.uniform1f(U.hi, th.hi);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!prefersReduced) rafId = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden && !prefersReduced) {
        lastT = 0;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      }
    };

    // Tap / click sends a ripple from that point.
    const onPointer = (e) => {
      if (prefersReduced || hidden) return;
      spawn(e.clientX * SCALE, e.clientY * SCALE, now());
    };

    resize();
    if (prefersReduced) {
      // One static wave so the surface still reads as water.
      spawn(W * 0.5, window.innerHeight * SCALE * 0.42, -3.0);
      render();
    } else {
      // Just one ripple on first load.
      spawn(W * 0.5, window.innerHeight * SCALE * 0.42, -1.5);
      rafId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointerdown', onPointer);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerdown', onPointer);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-bg" aria-hidden="true" />;
}
