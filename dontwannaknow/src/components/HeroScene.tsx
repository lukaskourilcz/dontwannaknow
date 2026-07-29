// Landing hero motif: a slowly turning archive of blank pages.
//
// The column is a loose helix of paper sheets standing in for the span of years
// the product covers. It carries no facts and no readable text — the ruled
// marks are procedural strokes, never characters — so it stays decoration under
// the generated-media contract in ../../../docs/generated-media.md. When the
// visitor types a birth year the column glides to that stratum and marks it
// with a coral tab, which is the only thing the scene ever "says".
//
// Heavy on purpose and therefore lazy: HeroArchive only imports this module
// after first paint, and only when the browser can actually run it.

import { useEffect, useRef } from "react";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Line,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Quaternion,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

type Props = {
  /** Birth year the visitor has typed, or null while the field is empty. */
  highlightYear: number | null;
  /** Year span the timeline represents — the same range the form accepts. */
  yearRange: { min: number; max: number };
  reducedMotion: boolean;
  onReady?: () => void;
};

/* ------------------------------------------------------------------ layout */

const SHEET_COUNT = 230;
/** Vertical distance covered by the supported year range, in scene units. */
const TIMELINE_HEIGHT = 11;
/** Extra column above and below the range so the archive never looks finished. */
const RUN_OUT = 0.3;
const TURNS = 7;
const RADIUS = 1.15;
const THREAD_RADIUS = RADIUS + 0.34;
const THREAD_SAMPLES = 560;
const SHEET_WIDTH = 0.52;
const SHEET_HEIGHT = 0.35;
const SPIN_SPEED = 0.085;
const CAMERA_FOV = 34;
const BACKDROP_Z = -6;
const REVEAL_MS = 2100;
const MAX_PIXEL_RATIO = 1.9;

// The plate is portrait on desktop and square on narrow screens, so the camera
// is placed from the frame's aspect rather than pinned: the column keeps the
// same share of the width, and the vertical dissolve is derived from whatever
// height that leaves. Without this the column either overflows a wide frame or
// floats in empty green.
const COLUMN_HALF_WIDTH = RADIUS * 1.19 + SHEET_WIDTH / 2;
const COLUMN_WIDTH_SHARE = 0.72;
const MIN_CAMERA_DISTANCE = 7;
const MAX_CAMERA_DISTANCE = 11;
/** Share of the visible half-height at which the column has fully dissolved. */
const FADE_EDGE = 0.94;

const TAU = Math.PI * 2;

const PAPER = "#f4ecdc";
const PAPER_BACK = "#c2b69e";
const INK = "#18201d";
const CORAL = "#d9684f";
const BACKDROP_NEAR = "#2c5f56";
const BACKDROP_FAR = "#0d2521";
const THREAD = "#b6c2bc";
const DECADE_DOT = "#dbe4e0";
const MARKER = "#f0a184";

/** Deterministic per-sheet noise — the product never uses Math.random. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sheet index -> position along the run-out padded timeline. */
function sheetU(index: number): number {
  return -RUN_OUT + (index / (SHEET_COUNT - 1)) * (1 + RUN_OUT * 2);
}

function helixPoint(u: number, radius: number, out: Vector3): Vector3 {
  const angle = u * TURNS * TAU;
  return out.set(
    Math.sin(angle) * radius,
    (u - 0.5) * TIMELINE_HEIGHT,
    Math.cos(angle) * radius,
  );
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ----------------------------------------------------------------- shaders */

// Shared by every material so the column can dissolve into exactly the colour
// behind it rather than into a flat fog that leaves a visible silhouette.
const BACKDROP_CHUNK = /* glsl */ `
  uniform vec3 uBackdropNear;
  uniform vec3 uBackdropFar;
  uniform vec2 uResolution;

  vec3 backdropAt(vec2 fragment) {
    float d = distance(fragment / uResolution, vec2(0.44, 0.56)) * 1.5;
    return mix(uBackdropNear, uBackdropFar, smoothstep(0.0, 1.0, d));
  }
`;

const FADE_CHUNK = /* glsl */ `
  uniform float uFadeStart;
  uniform float uFadeEnd;

  float columnFade(float worldY) {
    return 1.0 - smoothstep(uFadeStart, uFadeEnd, abs(worldY));
  }
`;

const SHEET_VERTEX = /* glsl */ `
  uniform float uTime;
  ${FADE_CHUNK}

  attribute float aPhase;
  attribute float aT;

  varying vec2 vUv;
  varying float vFacing;
  varying float vT;
  varying float vDepth;
  varying float vCurl;
  varying float vColumn;

  void main() {
    vUv = uv;
    vT = aT;

    // One long edge lifts, the way a loose page never lies flat. The amount
    // breathes per sheet so the column reads as paper rather than geometry.
    float breathe = 0.55 + 0.45 * sin(uTime * 0.42 + aPhase * 6.2831853);
    float lift = 0.11 + 0.07 * breathe;
    float edge = max(uv.x - 0.42, 0.0) / 0.58;
    float curl = edge * edge * lift;

    vec3 pos = position;
    pos.z += curl;
    pos.z += sin(uv.y * 3.1 + aPhase * 6.2831853 + uTime * 0.31) * 0.012;
    vCurl = curl;

    // Normal follows the curl so the lifted edge catches the key light.
    vec3 curlNormal = normalize(vec3(-(2.0 * edge * lift) / 0.58, 0.0, 1.0));

    vec4 world = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    vec3 worldNormal = normalize(
      mat3(modelMatrix) * mat3(instanceMatrix) * curlNormal
    );
    vFacing = dot(worldNormal, normalize(cameraPosition - world.xyz));
    vColumn = columnFade(world.y);

    vec4 viewPosition = viewMatrix * world;
    vDepth = -viewPosition.z;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const SHEET_FRAGMENT = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uPaperBack;
  uniform vec3 uInk;
  uniform vec3 uCoral;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uHighlight;
  uniform float uReveal;
  ${BACKDROP_CHUNK}

  varying vec2 vUv;
  varying float vFacing;
  varying float vT;
  varying float vDepth;
  varying float vCurl;
  varying float vColumn;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.7, 289.3))) * 43758.5453);
  }

  void main() {
    float facing = clamp(abs(vFacing), 0.0, 1.0);
    vec3 base = gl_FrontFacing ? uPaper : uPaperBack;

    // Hand-rolled two-term lighting: with no scene lights the material stays
    // one small program instead of pulling in the standard shader chunks.
    base *= 0.5 + 0.5 * facing;
    base *= 1.0 - vCurl * 1.1;
    base += vec3(0.05) * smoothstep(0.05, 0.15, vCurl) * facing;

    // Abstract ruled strokes. Row starts and lengths vary but never form
    // glyphs, and they only resolve on sheets turned toward the reader.
    float read = smoothstep(0.42, 0.94, facing) * uReveal;
    float rows = 7.0;
    float row = floor(vUv.y * rows);
    float seed = floor(vT * 137.0);
    float start = 0.14 + 0.1 * hash(vec2(row + 11.0, seed));
    float len = row < 1.0 ? 0.34 : 0.2 + 0.62 * hash(vec2(row, seed));
    float inside = step(start, vUv.x) * step(vUv.x, start + len * 0.7);
    float stroke = 1.0 - smoothstep(0.03, 0.09, abs(fract(vUv.y * rows) - 0.5));
    base = mix(base, uInk, stroke * inside * read * 0.17);

    base += (hash(vUv * 512.0 + vT) - 0.5) * 0.02;

    // The year the visitor typed: a slightly brighter band and a coral tab on
    // the binding edge. Decorative marking only — it states no fact.
    float band = uHighlight < 0.0
      ? 0.0
      : 1.0 - smoothstep(0.0, 0.045, abs(vT - uHighlight));
    base = mix(base, base * 1.16 + uCoral * 0.05, band);
    float tab = step(vUv.x, 0.08) * step(0.06, vUv.y) * step(vUv.y, 0.94) * band;
    base = mix(base, uCoral, tab * 0.92 * (gl_FrontFacing ? 1.0 : 0.4));

    float depthFog = smoothstep(uFogNear, uFogFar, vDepth);
    vec3 behind = backdropAt(gl_FragCoord.xy);
    gl_FragColor = vec4(mix(base, behind, max(depthFog, 1.0 - vColumn)), 1.0);
    #include <colorspace_fragment>
  }
`;

const BACKDROP_VERTEX = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BACKDROP_FRAGMENT = /* glsl */ `
  ${BACKDROP_CHUNK}

  void main() {
    // Soft off-centre pool of light so the column reads against depth rather
    // than a flat fill. Matte on purpose: no bloom, no glow.
    gl_FragColor = vec4(backdropAt(gl_FragCoord.xy), 1.0);
    #include <colorspace_fragment>
  }
`;

const THREAD_VERTEX = /* glsl */ `
  ${FADE_CHUNK}
  varying float vFade;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vFade = columnFade(world.y);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const THREAD_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    float alpha = uOpacity * vFade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

const DOT_VERTEX = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uScale;
  ${FADE_CHUNK}

  attribute float aSize;
  varying float vFade;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vFade = columnFade(world.y);
    vec4 viewPosition = viewMatrix * world;
    gl_PointSize = aSize * uScale * uPixelRatio * (7.0 / -viewPosition.z);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const DOT_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = (1.0 - smoothstep(0.4, 0.5, d)) * uOpacity * vFade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

/* -------------------------------------------------------------- the module */

export default function HeroScene({
  highlightYear,
  yearRange,
  reducedMotion,
  onReady,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  // Read by the animation loop; kept in refs so prop changes never rebuild the
  // scene — rebuilding on every keystroke would restart the reveal.
  const targetRef = useRef<number | null>(null);
  const reducedRef = useRef(reducedMotion);
  const refreshRef = useRef<(() => void) | null>(null);
  const readyRef = useRef(onReady);

  const { min: minYear, max: maxYear } = yearRange;
  const highlightT =
    highlightYear === null || maxYear <= minYear
      ? null
      : clamp01((highlightYear - minYear) / (maxYear - minYear));

  targetRef.current = highlightT;
  reducedRef.current = reducedMotion;
  readyRef.current = onReady;

  // Reduced motion draws single frames on demand instead of running a loop, so
  // a new year still moves the column — it just arrives without the travel.
  useEffect(() => {
    refreshRef.current?.();
  }, [highlightT, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, powerPreference: "low-power" });
    } catch {
      return; // Context creation can still fail after the capability probe.
    }

    renderer.setClearColor(new Color(BACKDROP_FAR), 1);
    renderer.domElement.className = "hero-scene-canvas";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 40);
    const halfFovTangent = Math.tan((CAMERA_FOV * Math.PI) / 360);
    let cameraDistance = MAX_CAMERA_DISTANCE;

    // Shared uniform objects, so one resize updates every material at once.
    const resolution = { value: new Vector2(1, 1) };
    const backdropNear = { value: new Color(BACKDROP_NEAR) };
    const backdropFar = { value: new Color(BACKDROP_FAR) };
    const fadeStart = { value: 1 };
    const fadeEnd = { value: 2.4 };
    const fogNear = { value: 0 };
    const fogFar = { value: 0 };
    const pixelRatio = { value: 1 };

    /* backdrop --------------------------------------------------------- */

    const backdropMaterial = new ShaderMaterial({
      vertexShader: BACKDROP_VERTEX,
      fragmentShader: BACKDROP_FRAGMENT,
      depthWrite: false,
      uniforms: {
        uBackdropNear: backdropNear,
        uBackdropFar: backdropFar,
        uResolution: resolution,
      },
    });
    const backdrop = new Mesh(new PlaneGeometry(1, 1), backdropMaterial);
    backdrop.position.z = BACKDROP_Z;
    backdrop.renderOrder = -1;
    backdrop.frustumCulled = false;
    scene.add(backdrop);

    /* the column ------------------------------------------------------- */

    const column = new Group();
    scene.add(column);

    const random = mulberry32(19200424);
    const phases = new Float32Array(SHEET_COUNT);
    const timeline = new Float32Array(SHEET_COUNT);
    // Per-sheet jitter. Without it every page sits exactly tangent to the helix
    // and the column collapses into one uniform ribbon; these offsets are what
    // let individual sheets catch the light and read as separate records.
    const jitter: Array<{ yaw: number; radius: number; lift: number; tilt: number }> = [];
    // Start pose for the reveal: the same helix, blown outward and tumbled.
    const scatter: Array<{ radius: number; lift: number; euler: Euler }> = [];
    for (let i = 0; i < SHEET_COUNT; i += 1) {
      phases[i] = random();
      timeline[i] = sheetU(i);
      jitter.push({
        yaw: (random() - 0.5) * 0.9,
        radius: RADIUS * (1 + (random() - 0.5) * 0.38),
        lift: (random() - 0.5) * 0.34,
        tilt: (random() - 0.5) * 0.5,
      });
      scatter.push({
        radius: RADIUS * (3.4 + random() * 2.6),
        lift: (random() - 0.5) * 5.5,
        euler: new Euler(
          (random() - 0.5) * 2.4,
          (random() - 0.5) * 3.4,
          (random() - 0.5) * 2.4,
        ),
      });
    }

    const sheetGeometry = new PlaneGeometry(SHEET_WIDTH, SHEET_HEIGHT, 10, 6);
    sheetGeometry.setAttribute("aPhase", new InstancedBufferAttribute(phases, 1));
    sheetGeometry.setAttribute("aT", new InstancedBufferAttribute(timeline, 1));

    const sheetMaterial = new ShaderMaterial({
      vertexShader: SHEET_VERTEX,
      fragmentShader: SHEET_FRAGMENT,
      side: DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uHighlight: { value: -1 },
        uPaper: { value: new Color(PAPER) },
        uPaperBack: { value: new Color(PAPER_BACK) },
        uInk: { value: new Color(INK) },
        uCoral: { value: new Color(CORAL) },
        uFogNear: fogNear,
        uFogFar: fogFar,
        uBackdropNear: backdropNear,
        uBackdropFar: backdropFar,
        uResolution: resolution,
        uFadeStart: fadeStart,
        uFadeEnd: fadeEnd,
      },
    });

    const sheets = new InstancedMesh(sheetGeometry, sheetMaterial, SHEET_COUNT);
    sheets.frustumCulled = false;
    column.add(sheets);

    /* thread and markers ----------------------------------------------- */

    const point = new Vector3();
    const threadPositions = new Float32Array(THREAD_SAMPLES * 3);
    for (let i = 0; i < THREAD_SAMPLES; i += 1) {
      const u = -RUN_OUT + (i / (THREAD_SAMPLES - 1)) * (1 + RUN_OUT * 2);
      helixPoint(u, THREAD_RADIUS, point).toArray(threadPositions, i * 3);
    }
    const threadGeometry = new BufferGeometry();
    threadGeometry.setAttribute("position", new Float32BufferAttribute(threadPositions, 3));
    const threadMaterial = new ShaderMaterial({
      vertexShader: THREAD_VERTEX,
      fragmentShader: THREAD_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new Color(THREAD) },
        uOpacity: { value: 0 },
        uFadeStart: fadeStart,
        uFadeEnd: fadeEnd,
      },
    });
    const thread = new Line(threadGeometry, threadMaterial);
    thread.frustumCulled = false;
    column.add(thread);

    // A dot every decade the product covers, sitting on the thread.
    const decadeYears: number[] = [];
    for (let year = Math.ceil(minYear / 10) * 10; year <= maxYear; year += 10) {
      decadeYears.push(year);
    }
    const decadePositions = new Float32Array(decadeYears.length * 3);
    const decadeSizes = new Float32Array(decadeYears.length);
    decadeYears.forEach((year, i) => {
      const u = clamp01((year - minYear) / (maxYear - minYear));
      helixPoint(u, THREAD_RADIUS, point).toArray(decadePositions, i * 3);
      decadeSizes[i] = year % 50 === 0 ? 9 : 5.5;
    });
    const decadeGeometry = new BufferGeometry();
    decadeGeometry.setAttribute("position", new Float32BufferAttribute(decadePositions, 3));
    decadeGeometry.setAttribute("aSize", new Float32BufferAttribute(decadeSizes, 1));
    const decadeMaterial = new ShaderMaterial({
      vertexShader: DOT_VERTEX,
      fragmentShader: DOT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new Color(DECADE_DOT) },
        uOpacity: { value: 0 },
        uPixelRatio: pixelRatio,
        uScale: { value: 1 },
        uFadeStart: fadeStart,
        uFadeEnd: fadeEnd,
      },
    });
    const decades = new Points(decadeGeometry, decadeMaterial);
    decades.frustumCulled = false;
    column.add(decades);

    const markerGeometry = new BufferGeometry();
    markerGeometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(3), 3));
    markerGeometry.setAttribute("aSize", new Float32BufferAttribute(new Float32Array([13]), 1));
    const markerMaterial = new ShaderMaterial({
      vertexShader: DOT_VERTEX,
      fragmentShader: DOT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new Color(MARKER) },
        uOpacity: { value: 0 },
        uPixelRatio: pixelRatio,
        uScale: { value: 1 },
        uFadeStart: fadeStart,
        uFadeEnd: fadeEnd,
      },
    });
    const marker = new Points(markerGeometry, markerMaterial);
    marker.frustumCulled = false;
    column.add(marker);

    /* per-frame state --------------------------------------------------- */

    const matrix = new Matrix4();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const euler = new Euler();
    const markerPosition = new Vector3();
    const scatterPosition = new Vector3();
    const scatterQuaternion = new Quaternion();

    let focus = 0.5; // eased centre of the column, in timeline units
    let highlight = -1; // eased uHighlight, -1 while no year is chosen
    let pointerX = 0;
    let pointerY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let elapsed = 0;
    let revealed = 0;
    let running = false;
    let visible = true;
    let onScreen = true;
    let lastTimestamp = 0;
    let announced = false;

    function layoutSheets(time: number, reveal: number) {
      for (let i = 0; i < SHEET_COUNT; i += 1) {
        const u = timeline[i];
        const phase = phases[i];
        const offsets = jitter[i];
        const angle = u * TURNS * TAU;
        const drift = Math.sin(time * 0.5 + phase * TAU) * 0.07;

        helixPoint(u, offsets.radius, position).y += offsets.lift;
        euler.set(drift * 0.8 + offsets.tilt, angle + offsets.yaw, drift + offsets.tilt);

        const delay = (i / (SHEET_COUNT - 1)) * 0.45;
        const local = easeOutCubic(clamp01((reveal - delay) / 0.55));
        quaternion.setFromEuler(euler);
        if (local < 1) {
          const start = scatter[i];
          helixPoint(u, start.radius, scatterPosition).y += start.lift;
          position.lerp(scatterPosition, 1 - local);
          quaternion.slerp(scatterQuaternion.setFromEuler(start.euler), 1 - local);
        }

        const size = 0.55 + 0.45 * local;
        scale.set(size, size, size);
        sheets.setMatrixAt(i, matrix.compose(position, quaternion, scale));
      }
      sheets.instanceMatrix.needsUpdate = true;
    }

    function draw(deltaSeconds: number) {
      const reduced = reducedRef.current;
      const target = targetRef.current;

      if (reduced) {
        elapsed = 3.4; // a composed still rather than the loop's first frame
        revealed = 1;
        focus = target ?? 0.5;
        highlight = target ?? -1;
        parallaxX = 0;
        parallaxY = 0;
      } else {
        elapsed += deltaSeconds;
        revealed = clamp01(revealed + deltaSeconds * (1000 / REVEAL_MS));
        const idle = 0.5 + Math.sin(elapsed * 0.11) * 0.055;
        focus += ((target ?? idle) - focus) * Math.min(1, deltaSeconds * 2.2);
        const highlightTarget = target ?? -1;
        highlight =
          highlight < 0 || highlightTarget < 0
            ? highlightTarget
            : highlight + (highlightTarget - highlight) * Math.min(1, deltaSeconds * 2.2);
        parallaxX += (pointerX - parallaxX) * Math.min(1, deltaSeconds * 2.2);
        parallaxY += (pointerY - parallaxY) * Math.min(1, deltaSeconds * 2.2);
      }

      const eased = easeOutCubic(revealed);
      column.rotation.y = elapsed * SPIN_SPEED - (1 - eased) * 0.6;
      column.position.y = -(focus - 0.5) * TIMELINE_HEIGHT;

      layoutSheets(elapsed, revealed);

      sheetMaterial.uniforms.uTime.value = elapsed;
      sheetMaterial.uniforms.uReveal.value = eased;
      sheetMaterial.uniforms.uHighlight.value = highlight;

      threadMaterial.uniforms.uOpacity.value = 0.55 * eased;
      threadGeometry.setDrawRange(0, Math.max(2, Math.round(THREAD_SAMPLES * eased)));
      decadeMaterial.uniforms.uOpacity.value = 0.85 * clamp01((eased - 0.55) / 0.45);

      if (highlight >= 0) {
        helixPoint(highlight, THREAD_RADIUS, markerPosition);
        const markerArray = markerGeometry.attributes.position.array as Float32Array;
        markerArray[0] = markerPosition.x;
        markerArray[1] = markerPosition.y;
        markerArray[2] = markerPosition.z;
        markerGeometry.attributes.position.needsUpdate = true;
        markerMaterial.uniforms.uOpacity.value = 0.95 * eased;
        markerMaterial.uniforms.uScale.value = 1 + Math.sin(elapsed * 1.8) * 0.09;
      } else {
        markerMaterial.uniforms.uOpacity.value = 0;
      }

      // A short dolly on arrival, then only the pointer moves the camera.
      camera.position.set(
        parallaxX * 0.5,
        parallaxY * 0.3,
        cameraDistance + (1 - eased) * 2.6,
      );
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (!announced) {
        announced = true;
        readyRef.current?.();
      }
    }

    /* sizing ------------------------------------------------------------ */

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      pixelRatio.value = renderer.getPixelRatio();
      resolution.value.set(width * pixelRatio.value, height * pixelRatio.value);

      cameraDistance = Math.min(
        MAX_CAMERA_DISTANCE,
        Math.max(
          MIN_CAMERA_DISTANCE,
          COLUMN_HALF_WIDTH / COLUMN_WIDTH_SHARE / (halfFovTangent * camera.aspect),
        ),
      );
      const visibleHalfHeight = cameraDistance * halfFovTangent;
      fadeEnd.value = visibleHalfHeight * FADE_EDGE;
      fadeStart.value = fadeEnd.value * 0.4;
      fogNear.value = cameraDistance - RADIUS;
      fogFar.value = cameraDistance + RADIUS * 1.3;

      // Cover the frustum at the backdrop's depth, with room for parallax.
      const backdropHeight = 2 * (cameraDistance - BACKDROP_Z) * halfFovTangent;
      backdrop.scale.set(backdropHeight * camera.aspect * 1.3, backdropHeight * 1.3, 1);
      drawFrame();
    };

    /* the loop ---------------------------------------------------------- */

    function tick(timestamp: number) {
      const delta = lastTimestamp === 0 ? 0.016 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      draw(Math.min(delta, 0.05)); // a backgrounded tab must not jump the reveal
    }

    function drawFrame() {
      if (running) return; // the loop will pick the change up on its next tick
      lastTimestamp = 0;
      draw(0);
    }

    function sync() {
      const shouldRun = visible && onScreen && !reducedRef.current;
      if (shouldRun === running) return;
      running = shouldRun;
      lastTimestamp = 0;
      renderer.setAnimationLoop(shouldRun ? tick : null);
      if (!shouldRun) drawFrame();
    }

    // Called from React when a prop the loop reads through a ref changes. It
    // also re-evaluates whether the loop should be running, so toggling the OS
    // reduced-motion setting starts or stops it without a rebuild.
    refreshRef.current = () => {
      sync();
      drawFrame();
    };

    /* listeners --------------------------------------------------------- */

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(host);

    const onVisibility = () => {
      visible = document.visibilityState !== "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = 1 - (event.clientY / window.innerHeight) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // A lost context leaves a blank canvas; hand the frame back to the poster.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      running = false;
      renderer.setAnimationLoop(null);
      host.classList.add("is-lost");
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    resize();
    sync();

    /* teardown ---------------------------------------------------------- */

    return () => {
      refreshRef.current = null;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.remove();

      sheetGeometry.dispose();
      sheetMaterial.dispose();
      threadGeometry.dispose();
      threadMaterial.dispose();
      decadeGeometry.dispose();
      decadeMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      backdrop.geometry.dispose();
      backdropMaterial.dispose();
      sheets.dispose();
      renderer.dispose();
    };
    // Only the timeline span rebuilds the scene. A year change would restart
    // the reveal, so the loop reads that from targetRef instead.
  }, [minYear, maxYear]);

  return <div className="hero-scene" ref={hostRef} />;
}
