import { Reveal } from '@/components/reveal'

export function SectionLabel({
  index,
  label,
}: {
  index: string
  label: string
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-primary">
        <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
        <span>
          {index} / {label}
        </span>
      </div>
    </Reveal>
  )
}
