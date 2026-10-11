import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../i18n';

export interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

// Ctrl/⌘+K: jump to a project, the overview or contact details. Everything here is also reachable from the
// visible navigation; the palette is a shortcut, not the only way.
export function CommandPalette({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: Command[] }) {
  const t = useT().palette;
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(t)) : commands;
  }, [q, commands]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      setQ('');
      setI(0);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  function choose(c: Command | undefined) {
    if (!c) return;
    dialog.current?.close();
    c.run();
  }

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label={t.aria}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current.close();
      }}
    >
      <input
        autoFocus
        value={q}
        placeholder={t.placeholder}
        aria-label={t.search}
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-list"
        aria-activedescendant={list[i] ? `cmd-${list[i].id}` : undefined}
        onChange={(e) => {
          setQ(e.target.value);
          setI(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setI((x) => Math.min(list.length - 1, x + 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setI((x) => Math.max(0, x - 1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            choose(list[i]);
          }
        }}
      />
      <ul id="palette-list" role="listbox">
        {list.map((c, k) => (
          <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={k === i} onMouseEnter={() => setI(k)} onClick={() => choose(c)}>
            <span>{c.label}</span>
            <small>{c.hint}</small>
          </li>
        ))}
        {list.length === 0 && <li aria-disabled="true">{t.none(q)}</li>}
      </ul>
      <div className="palette__hint">{t.hint}</div>
    </dialog>
  );
}
