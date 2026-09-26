function Field({label,children}){
  return <label className="grid gap-2 text-sm font-bold text-foreground">
    <span>{label}</span>
    {children}
  </label>
}

export {Field}