import React, { useEffect } from 'react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (args: { reload: boolean; config?: (this: any) => void }) => void;
    };
    disqus_config?: (this: any) => void;
  }
}

const DISQUS_SHORTNAME = 'hdb-resale-price-explorer';
const PAGE_URL = 'https://problemset3new.vercel.app';
const PAGE_IDENTIFIER = 'home';

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function (this: any) {
          this.page.url = PAGE_URL;
          this.page.identifier = PAGE_IDENTIFIER;
        },
      });
    } else {
      window.disqus_config = function (this: any) {
        this.page.url = PAGE_URL;
        this.page.identifier = PAGE_IDENTIFIER;
      };

      const scriptId = 'disqus-embed-script';
      if (!document.getElementById(scriptId)) {
        const s = document.createElement('script');
        s.id = scriptId;
        s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', String(+new Date()));
        (document.head || document.body).appendChild(s);
      }
    }
  }, []);

  return (
    <section
      id="feedback-comments-section"
      aria-label="Feedback and Discussion"
      className="mt-10 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm"
    >
      <p className="text-sm sm:text-base font-semibold text-slate-800 mb-6">
        Tell us what worked for you and what did not.
      </p>
      <div id="disqus_thread" />
    </section>
  );
};
