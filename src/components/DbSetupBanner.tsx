export default function DbSetupBanner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="font-display text-5xl uppercase text-ember md:text-7xl">
        Almost there
        <span className="text-paper">.</span>
      </p>
      <p className="mx-auto mt-6 max-w-lg font-mono text-xs leading-relaxed tracking-[0.2em] text-smoke">
        DATABASE NOT CONNECTED — ADD YOUR DATABASE_URL ENVIRONMENT VARIABLE IN
        VERCEL PROJECT SETTINGS, THEN REDEPLOY.
      </p>
      <div className="mt-10 max-w-xl border border-line bg-coal p-6 text-left">
        <p className="font-mono text-[10px] tracking-[0.35em] text-ember">
          VERCEL SETUP STEPS
        </p>
        <ol className="mt-4 space-y-3 font-mono text-[11px] leading-relaxed tracking-wide text-smoke">
          <li>
            <span className="text-paper">01.</span> Create a free Postgres DB at{" "}
            <span className="text-ember">neon.tech</span> or{" "}
            <span className="text-ember">supabase.com</span>
          </li>
          <li>
            <span className="text-paper">02.</span> Copy the connection string
            (starts with <span className="text-paper">postgres://</span> or{" "}
            <span className="text-paper">postgresql://</span>)
          </li>
          <li>
            <span className="text-paper">03.</span> Vercel Dashboard → Project
            → Settings → Environment Variables → add{" "}
            <span className="text-paper">DATABASE_URL</span>
          </li>
          <li>
            <span className="text-paper">04.</span> Also add{" "}
            <span className="text-paper">ADMIN_PASSWORD</span> and{" "}
            <span className="text-paper">ADMIN_SECRET</span>
          </li>
          <li>
            <span className="text-paper">05.</span> Redeploy, then run once:
            <br />
            <span className="mt-1 inline-block bg-ink px-3 py-1 text-ember">
              DATABASE_URL=&quot;...&quot; npx drizzle-kit push
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
