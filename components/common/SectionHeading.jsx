export function SectionHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto mb-10 max-w-2xl text-center" : "mb-10 max-w-2xl"}>
      {eyebrow && <p className="eyebrow text-secondary">{eyebrow}</p>}
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-7 text-muted-foreground">{text}</p>}
    </div>
  );
}