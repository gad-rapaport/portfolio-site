import { useId, useRef, useState } from 'react';
import type { Shot } from '../data/projects';

// Two real screenshots of Signalpost's public status page — normal and during the failure drill — behind a
// draggable divider. The range input under it is the keyboard and screen-reader way to move the same divider.

export function StatusCompare({ before, after }: { before: Shot; after: Shot }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();

  function moveTo(clientX: number) {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }

  return (
    <div className="canvas cv-sp">
      <div className="canvas__label">
        <span>
          <span className="badge" style={{ color: 'var(--sp)' }}>Real screens</span> public status page · normal ↔ failure drill
        </span>
        <span>no JavaScript on the real page</span>
      </div>

      <div
        className="compare"
        ref={box}
        style={{ ['--pos' as string]: `${pos}%`, aspectRatio: `${before.w} / ${Math.min(before.h, before.w * 0.62)}` }}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) moveTo(e.clientX);
        }}
      >
        <img src={after.file} alt={after.alt} width={after.w} height={after.h} draggable={false} />
        <div className="compare__top">
          <img src={before.file} alt={before.alt} width={before.w} height={before.h} draggable={false} />
        </div>
        <div className="compare__handle" aria-hidden="true">
          <span>⇔</span>
        </div>
        <span className="compare__tag compare__tag--l">operational</span>
        <span className="compare__tag compare__tag--r">during the drill</span>
      </div>

      <ul className="sp-policy" aria-label="Outbound policy, from src/net/policy.ts">
        <li><b>refused</b> 169.254.169.254 · metadata</li>
        <li><b>refused</b> 127.0.0.1 · loopback</li>
        <li><b>refused</b> 10.x / 192.168.x · private</li>
        <li><b>reported</b> 3xx · never followed</li>
        <li className="ok"><b>allowed</b> allowlisted host · pinned IP</li>
      </ul>

      <div className="canvas__foot">
        <label htmlFor={id} className="mono">Divider</label>
        <input id={id} type="range" min={0} max={100} value={Math.round(pos)} onChange={(e) => setPos(Number(e.target.value))} aria-valuetext={`${Math.round(pos)}% operational view`} />
      </div>
    </div>
  );
}
