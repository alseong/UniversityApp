"use client";

type View = "summary" | "detailed";

type Props = {
  activeView: View;
  onChange: (view: View) => void;
};

export default function ViewToggle({ activeView, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-muted p-1 gap-1">
      {(["summary", "detailed"] as View[]).map((view) => (
        <button
          key={view}
          role="button"
          aria-pressed={activeView === view}
          onClick={() => onChange(view)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
            activeView === view
              ? "bg-blue-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {view}
        </button>
      ))}
    </div>
  );
}
