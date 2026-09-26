export function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="page-hero">
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow text-highlight">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/78">{text}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}