import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { IconClose } from './Icons';

export type Media =
  | { kind: 'film'; src: string; poster: string; title: string; repo: string | null }
  | { kind: 'image'; src: string; alt: string; w: number; h: number; title: string };

const Ctx = createContext<(m: Media) => void>(() => {});
export const useMedia = () => useContext(Ctx);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<Media | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((m: Media) => {
    opener.current = document.activeElement as HTMLElement | null;
    setMedia(m);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (media && d && !d.open) d.showModal();
  }, [media]);

  function onClose() {
    setMedia(null);
    opener.current?.focus();
  }

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="film"
        aria-label={media?.title}
        onClose={onClose}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        {media && (
          <>
            <div className="film__bar">
              <strong>{media.title}</strong>
              <button type="button" className="icon-btn" onClick={() => dialog.current?.close()} aria-label="Close">
                <IconClose />
              </button>
            </div>
            {media.kind === 'film' ? (
              <>
                <video src={media.src} poster={media.poster} controls autoPlay muted playsInline width={1920} height={1080} />
                <p className="film__note">
                  Rendered from code in the project’s animation/ folder; it shows only real screens and real numbers from the
                  product. No sound.{' '}
                  {media.repo && (
                    <a href={`${media.repo}/releases/tag/v0.1.0`} target="_blank" rel="noreferrer">
                      Release v0.1.0
                    </a>
                  )}
                </p>
              </>
            ) : (
              <img src={media.src} alt={media.alt} width={media.w} height={media.h} />
            )}
          </>
        )}
      </dialog>
    </Ctx.Provider>
  );
}
