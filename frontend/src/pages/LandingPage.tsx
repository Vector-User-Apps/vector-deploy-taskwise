import { useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, LoginButton, SignupButton } from '@govector/auth'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Clock, Sparkles, Target, Zap } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { getPricingPageUrl } from '@/utils/hostedPageUrls'
import { FeatureCard } from '../components/landing/FeatureCard'

const features = [
  { title: "Instant AI Evaluation", description: "AI analyzes each task and tells you if it's worth scheduling or worth doing right now", icon: Sparkles },
  { title: "5-Minute Rule", description: "Get smart recommendations on quick wins you can complete immediately instead of adding to your list", icon: Clock },
  { title: "Reduce Decision Fatigue", description: "Let AI handle the prioritization logic so you focus on execution, not planning", icon: Zap },
  { title: "Build Better Habits", description: "Train yourself to distinguish between tasks worth scheduling and tasks worth doing now", icon: Target }
]

const showcaseSteps = [
  { title: "Enter Your Task", description: "Type in any todo that comes to mind" },
  { title: "Get AI Insight", description: "AI instantly evaluates if it's a 5-minute task or worth scheduling" },
  { title: "Act or Schedule", description: "Do it now or add it to your list with confidence" }
]

const wordVariants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
  visible: (i: number) => ({
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
}

function RevealWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  return (
    <span className={className} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "inline-block", marginRight: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export function LandingPage() {
  const { isAuthenticated, loading } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)
  const showcaseRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  const { scrollYProgress: showcaseProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "end start"],
  })

  // Parallax orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])

  // Showcase scroll transforms
  const showcaseScale = useTransform(showcaseProgress, [0.1, 0.4], [0.92, 1])
  const showcaseOpacity = useTransform(showcaseProgress, [0.05, 0.25], [0, 1])
  const step1Opacity = useTransform(showcaseProgress, [0.15, 0.35], [0, 1])
  const step1X = useTransform(showcaseProgress, [0.15, 0.35], [-40, 0])
  const step2Opacity = useTransform(showcaseProgress, [0.3, 0.5], [0, 1])
  const step2X = useTransform(showcaseProgress, [0.3, 0.5], [40, 0])
  const step3Opacity = useTransform(showcaseProgress, [0.45, 0.65], [0, 1])
  const step3Y = useTransform(showcaseProgress, [0.45, 0.65], [20, 0])

  // CTA in-view
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" })

  // Load heading font
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div
      ref={scrollRef}
      style={{ background: "var(--color-bg)", color: "var(--color-fg)", fontFamily: "var(--font-body)" }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* Parallax background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div style={{ y: orb1Y }}>
          <div
            className="absolute rounded-full"
            style={{
              width: 600,
              height: 600,
              top: "-10%",
              left: "20%",
              background: "radial-gradient(circle, var(--lp-orb-accent) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </motion.div>
        <motion.div style={{ y: orb2Y }}>
          <div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              top: "40%",
              right: "-5%",
              background: "radial-gradient(circle, var(--lp-orb-accent-2) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
        <motion.div style={{ y: orb3Y }}>
          <div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              bottom: "10%",
              left: "-5%",
              background: "radial-gradient(circle, var(--lp-orb-surface) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.5 }}
          >
            <source src="https://pub-107410270e7642b8a6530f247e9202d0.r2.dev/videos/pulsing-orb.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, var(--lp-overlay-start) 0%, var(--lp-overlay-mid) 60%, var(--color-bg) 100%)" }}
          />
        </div>

        {/* Navbar */}
        <nav
          className="relative flex items-center justify-between px-6 lg:px-8 py-4"
          style={{ borderBottom: "1px solid var(--lp-border-subtle)", zIndex: 10 }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              color: "var(--color-fg)",
              fontSize: "1.125rem",
              letterSpacing: "-0.01em",
            }}
          >
            Todo AI
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden md:inline text-sm font-medium transition-colors"
              style={{ color: "var(--color-muted)" }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden md:inline text-sm font-medium transition-colors"
              style={{ color: "var(--color-muted)" }}
            >
              How it works
            </a>
            <a
              href={getPricingPageUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline text-sm font-medium transition-colors"
              style={{ color: "var(--color-muted)" }}
            >
              Pricing
            </a>
            <LoginButton />
            <SignupButton />
          </div>
        </nav>

        {/* Hero content */}
        <div
          className="relative flex flex-col justify-center flex-1 px-6 lg:px-8 pt-16 lg:pt-24 pb-16 lg:pb-24 text-center items-center"
          style={{ zIndex: 10 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "var(--palette-primary-light)",
                color: "var(--color-accent)",
                border: "1px solid var(--lp-accent-border-light)",
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: 6, height: 6, background: "var(--color-accent)" }}
              />
              AI-powered · Smart filtering
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="max-w-2xl mx-auto leading-tight mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              color: "var(--color-fg)",
              lineHeight: 1.15,
              textShadow: "var(--lp-hero-text-shadow)",
            }}
          >
            <RevealWords text={`Smart todos, smarter decisions`} />
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
            className="max-w-xl mx-auto mb-8"
            style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)", textShadow: "var(--lp-hero-text-shadow)" }}
          >
            Get instant AI feedback on every task you add. Decide whether to tackle it now in 5 minutes or save it for later. Stop overthinking, start doing.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-4 flex-wrap"
          >
            <SignupButton />
            <a
              href="#how-it-works"
              className="font-medium rounded-md px-6 py-3 transition-all inline-flex items-center justify-center text-sm"
              style={{
                background: "transparent",
                color: "var(--color-accent)",
                border: "1px solid var(--lp-accent-border-medium)",
              }}
            >
              See how it works
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section
        id="features"
        className="relative py-20 lg:py-28 px-6 lg:px-8"
        style={{ background: "var(--color-surface)", zIndex: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14"
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                color: "var(--color-fg)",
                lineHeight: "var(--line-height-tight)",
                marginBottom: "0.75rem",
              }}
            >
              AI-powered clarity for every task
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", maxWidth: 480, margin: "0 auto" }}>
              Stop procrastinating by overthinking—let AI guide you to smarter decisions instantly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                <FeatureCard feature={feature} index={index} isWide={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scroll Showcase Section ── */}
      <section
        id="how-it-works"
        ref={showcaseRef}
        className="relative py-20 lg:py-28 px-6 lg:px-8"
        style={{ minHeight: "80vh", background: "var(--color-bg)", zIndex: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14"
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                color: "var(--color-fg)",
                lineHeight: "var(--line-height-tight)",
                marginBottom: "0.75rem",
              }}
            >
              Three steps to smarter productivity
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", maxWidth: 480, margin: "0 auto" }}>
              From task entry to decision in seconds—no more decision paralysis.
            </p>
          </motion.div>

          <motion.div
            style={{ scale: showcaseScale, opacity: showcaseOpacity }}
            className="space-y-8"
          >
            {/* Step 1 */}
            <motion.div style={{ opacity: step1Opacity, x: step1X }}>
              <div
                className="flex items-start gap-6 p-6 rounded-xl border"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
                  style={{ background: "var(--color-accent)", color: "#fff" }}
                >
                  1
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--color-fg)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)" }}
                  >
                    {showcaseSteps[0].title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
                    {showcaseSteps[0].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div style={{ opacity: step2Opacity, x: step2X }}>
              <div
                className="flex items-start gap-6 p-6 rounded-xl border"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
                  style={{ background: "var(--color-accent)", color: "#fff" }}
                >
                  2
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--color-fg)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)" }}
                  >
                    {showcaseSteps[1].title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
                    {showcaseSteps[1].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div style={{ opacity: step3Opacity, y: step3Y }}>
              <div
                className="flex items-start gap-6 p-6 rounded-xl border"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
                  style={{ background: "var(--color-accent)", color: "#fff" }}
                >
                  3
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "var(--color-fg)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)" }}
                  >
                    {showcaseSteps[2].title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
                    {showcaseSteps[2].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section
        className="relative py-20 lg:py-28 px-6 lg:px-8 text-center"
        style={{ background: "var(--color-surface)", zIndex: 1 }}
      >
        <div ref={ctaRef} className="max-w-2xl mx-auto">
          <motion.div
            animate={ctaInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                color: "var(--color-fg)",
                lineHeight: "var(--line-height-tight)",
              }}
            >
              Stop overthinking your todos
            </h2>
            <p
              className="mb-8"
              style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-lg)", lineHeight: "var(--line-height-relaxed)" }}
            >
              Let AI help you decide what's worth your time right now.
            </p>
            <SignupButton />
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-6 lg:px-8 text-center"
        style={{ borderTop: "1px solid var(--color-border)", zIndex: 1, position: "relative" }}
      >
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          &copy; {new Date().getFullYear()} Todo AI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
