const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  Redeemed: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400",
  Expired: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  Cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-400",
};

export function StatusBadge({ status }: { status: string }) {
  const styles = statusStyles[status] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70
      ? "#15803d"
      : score >= 40
        ? "#d97706"
        : "#e11d48";
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex h-16 w-16 items-center justify-center">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-muted"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-sm font-bold">{score}</span>
    </div>
  );
}