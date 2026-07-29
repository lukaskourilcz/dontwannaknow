// Hero motif frame. Owns the static poster and decides whether the browser
// gets the three.js scene on top of it.
//
// The poster paints immediately and stays underneath forever, so a browser
// without WebGL, a device asking to save data, or a lost GL context all land on
// exactly the landing page this project shipped before the scene existed.

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SUPPORTED_YEAR_RANGE } from "../lib/person";

const HeroScene = lazy(() => import("./HeroScene"));

type Props = {
  /** Birth year currently typed into the first person's form, if valid. */
  highlightYear: number | null;
};

type Connection = { saveData?: boolean };

function canRenderScene(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  // Checked before touching getContext so environments without WebGL at all —
  // jsdom included — bail out silently instead of logging a failed probe.
  if (!("WebGL2RenderingContext" in window) && !("WebGLRenderingContext" in window)) {
    return false;
  }
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!context) return false;
    // Drop the probe context immediately; browsers cap how many stay alive.
    (context as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function whenIdle(run: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(run, { timeout: 1200 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(run, 300);
  return () => window.clearTimeout(handle);
}

export default function HeroArchive({ highlightYear }: Props) {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!canRenderScene()) return;
    // Wait for idle: the form is the page's job, the motif is its atmosphere.
    const cancel = whenIdle(() => {
      if (mounted.current) setEnabled(true);
    });
    return () => {
      mounted.current = false;
      cancel();
    };
  }, []);

  return (
    <div
      className={`hero-archive-motif${ready ? " scene-ready" : ""}`}
      aria-hidden="true"
    >
      <picture>
        <source
          media="(max-width: 980px)"
          srcSet="/media/hero-editorial-mobile.webp"
          width="800"
          height="600"
        />
        <img
          src="/media/hero-editorial-desktop.webp"
          width="720"
          height="900"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      {enabled && (
        <Suspense fallback={null}>
          <HeroScene
            highlightYear={highlightYear}
            yearRange={SUPPORTED_YEAR_RANGE}
            reducedMotion={Boolean(reducedMotion)}
            onReady={() => setReady(true)}
          />
        </Suspense>
      )}
      <span className="hero-archive-frame" />
    </div>
  );
}
