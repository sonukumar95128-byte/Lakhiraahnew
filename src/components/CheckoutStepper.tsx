const steps = ["Address", "Payment", "Review"] as const;

export function CheckoutStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-medium transition-colors " +
                  (done
                    ? "bg-gold text-brand"
                    : active
                      ? "bg-brand text-gold-light"
                      : "border border-beige text-ink/40")
                }
              >
                {done ? "✓" : stepNum}
              </span>
              <span className={"text-sm " + (active ? "text-brand font-medium" : "text-ink/50")}>{label}</span>
            </div>
            {stepNum < steps.length && (
              <div className={"mx-3 h-px flex-1 " + (done ? "bg-gold" : "bg-beige")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
