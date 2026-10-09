interface SkillBadgeProps {
  skill: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

const variantStyles = {
  primary: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function SkillBadge({ skill, variant = 'primary' }: SkillBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-transform duration-150 hover:scale-105 cursor-default ${variantStyles[variant]}`}
    >
      {skill}
    </span>
  );
}
