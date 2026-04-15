import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  feature: { title: string; description: string; icon: LucideIcon }
  index: number
  isWide?: boolean
}

export function FeatureCard({ feature, index, isWide }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 })

  function handleMouse(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const Icon = feature.icon

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ perspective: "1000px" }}
      className="h-full"
    >
      <motion.div
        className="rounded-xl border p-7 h-full"
        style={{
          background: "var(--color-bg)",
          borderColor: "var(--color-border)",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Icon className="w-8 h-8 mb-4" style={{ color: "var(--color-accent)" }} />
        <h3
          className="font-medium mb-2"
          style={{
            color: "var(--color-fg)",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--font-size-lg)",
          }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm"
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: "var(--line-height-relaxed)",
            ...(isWide ? { maxWidth: 460 } : {}),
          }}
        >
          {feature.description}
        </p>
      </motion.div>
    </div>
  )
}
