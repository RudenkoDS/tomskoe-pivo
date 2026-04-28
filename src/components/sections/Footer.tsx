export function Footer() {
  return (
    <footer id="footer" className="border-t border-amber-900/20 bg-background px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">Томское Пиво</p>
          <p className="mt-1 font-mono text-[11px] text-muted">© 1876 — {new Date().getFullYear()} · Томск, Сибирь</p>
        </div>
        <p className="font-mono text-[11px] text-muted max-w-[40ch] text-right">
          Варить пиво честно — принцип, который не менялся 150 лет.
        </p>
      </div>
    </footer>
  );
}
