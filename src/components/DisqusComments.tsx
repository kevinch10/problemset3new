import React, { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (args: { reload: boolean; config?: (this: any) => void }) => void;
    };
    disqus_config?: (this: any) => void;
  }
}

const DISQUS_SHORTNAME = 'hdb-resale-price-explorer';
const PAGE_URL = 'https://problemset3-kevin.vercel.app/';
const PAGE_IDENTIFIER = 'home';

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

const DEFAULT_REACTIONS: Reaction[] = [
  { id: 'upvote', emoji: '👍', label: 'Upvote', count: 0 },
  { id: 'funny', emoji: '😝', label: 'Funny', count: 0 },
  { id: 'love', emoji: '😍', label: 'Love', count: 1 },
  { id: 'surprised', emoji: '😲', label: 'Surprised', count: 0 },
  { id: 'angry', emoji: '😤', label: 'Angry', count: 0 },
  { id: 'sad', emoji: '😢', label: 'Sad', count: 0 },
];

export const DisqusComments: React.FC = () => {
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    try {
      const saved = localStorage.getItem('hdb_reactions_counts');
      return saved ? JSON.parse(saved) : DEFAULT_REACTIONS;
    } catch {
      return DEFAULT_REACTIONS;
    }
  });

  const [selectedReaction, setSelectedReaction] = useState<string | null>(() => {
    try {
      return localStorage.getItem('hdb_selected_reaction') || 'love';
    } catch {
      return 'love';
    }
  });

  const [disqusLoaded, setDisqusLoaded] = useState<boolean>(false);
  const [disqusError, setDisqusError] = useState<boolean>(false);

  const totalResponses = reactions.reduce((sum, r) => sum + r.count, 0);

  const handleReactionClick = (id: string) => {
    const isCurrentlySelected = selectedReaction === id;
    const newSelected = isCurrentlySelected ? null : id;

    const updated = reactions.map((r) => {
      let count = r.count;
      if (r.id === selectedReaction) {
        count = Math.max(0, count - 1);
      }
      if (!isCurrentlySelected && r.id === id) {
        count += 1;
      }
      return { ...r, count };
    });

    setReactions(updated);
    setSelectedReaction(newSelected);

    try {
      localStorage.setItem('hdb_reactions_counts', JSON.stringify(updated));
      if (newSelected) {
        localStorage.setItem('hdb_selected_reaction', newSelected);
      } else {
        localStorage.removeItem('hdb_selected_reaction');
      }
    } catch {
      // ignore storage error
    }
  };

  const loadDisqus = () => {
    setDisqusError(false);

    const config = function (this: any) {
      try {
        if (this) {
          if (!this.page) {
            this.page = {};
          }
          this.page.url = PAGE_URL;
          this.page.identifier = PAGE_IDENTIFIER;
          this.page.title = 'HDB Resale Price Explorer — Community Feedback';
        }
      } catch (err) {
        console.warn('Error inside disqus_config handler:', err);
      }
    };

    window.disqus_config = config;

    if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config,
        });
        setDisqusLoaded(true);
      } catch (err) {
        console.warn('Disqus reset notice:', err);
        setDisqusError(true);
      }
      return;
    }

    const scriptId = 'disqus-embed-script';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existing) {
      const handleLoad = () => {
        if (window.DISQUS) {
          try {
            window.DISQUS.reset({ reload: true, config });
            setDisqusLoaded(true);
          } catch (err) {
            console.warn('Disqus reset after existing script load:', err);
            setDisqusError(true);
          }
        }
      };

      existing.addEventListener('load', handleLoad);
      existing.addEventListener('error', () => {
        setDisqusError(true);
      });

      // In case it already loaded
      if (window.DISQUS) {
        try {
          window.DISQUS.reset({ reload: true, config });
          setDisqusLoaded(true);
        } catch (err) {
          console.warn('Disqus reset immediately on existing script:', err);
          setDisqusError(true);
        }
      }
    } else {
      try {
        const s = document.createElement('script');
        s.id = scriptId;
        s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onload = () => {
          setDisqusLoaded(true);
        };
        s.onerror = (e) => {
          console.warn('Disqus script could not be loaded from external CDN:', e);
          setDisqusError(true);
        };
        (document.head || document.body).appendChild(s);
      } catch (err) {
        console.warn('Failed to inject Disqus script element:', err);
        setDisqusError(true);
      }
    }
  };

  useEffect(() => {
    loadDisqus();
  }, []);

  return (
    <section
      id="feedback-comments-section"
      aria-label="Feedback and Discussion"
      className="mt-10 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm"
    >
      {/* 1. Header invitation line */}
      <p className="text-sm sm:text-base font-semibold text-slate-800 mb-6">
        Tell us what worked for you and what didn&apos;t — we appreciate your feedback!
      </p>

      {/* 2. "What do you think?" Reactions bar matching the reference image */}
      <div className="flex flex-col items-center justify-center pt-2 pb-6 border-b border-slate-200/90">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          What do you think?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 mb-5 font-medium">
          {totalResponses} {totalResponses === 1 ? 'Response' : 'Responses'}
        </p>

        {/* Emojis row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
          {reactions.map((reaction) => {
            const isSelected = selectedReaction === reaction.id;
            return (
              <button
                key={reaction.id}
                type="button"
                onClick={() => handleReactionClick(reaction.id)}
                className={`flex flex-col items-center justify-center min-w-[58px] sm:min-w-[68px] px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-2 border-indigo-500 bg-indigo-50/40 shadow-xs'
                    : 'border-2 border-transparent hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="text-2xl sm:text-3xl leading-none mb-1.5 transition-transform hover:scale-110">
                  {reaction.emoji}
                </span>
                <span className={`text-xs sm:text-sm font-bold leading-none ${isSelected ? 'text-indigo-950 font-extrabold' : 'text-slate-800'}`}>
                  {reaction.count}
                </span>
                <span className={`text-[11px] sm:text-xs font-medium mt-1 leading-none ${isSelected ? 'text-indigo-700 font-semibold' : 'text-slate-500'}`}>
                  {reaction.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Disqus Thread embed container */}
      <div className="pt-6 relative">
        {disqusError && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Disqus connection tips:</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              If Disqus is not loading in this browser window, it may be due to an ad-blocker (uBlock, Brave Shields) or third-party cookies being blocked. You can:
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://disqus.com/home/discussion/${DISQUS_SHORTNAME}/${PAGE_IDENTIFIER}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-950 underline hover:text-black"
              >
                <span>Open thread directly on Disqus.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={loadDisqus}
                className="inline-flex items-center gap-1 font-bold text-slate-800 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        )}

        <div id="disqus_thread" className="min-h-[260px]" />
      </div>
    </section>
  );
};
