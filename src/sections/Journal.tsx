import { motion } from 'framer-motion';
import { servicePillars } from '../data/content';

const workflow = ['Strategy', 'Generation', 'Edit', 'Deploy'];

export function Journal() {
  return (
    <section id="journal" className="relative overflow-hidden bg-[var(--color-bg)] py-20 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-stroke)]" />
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-[0.3em]">
                What We Make
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-[var(--color-text-primary)] mb-5">
              Campaign <span className="font-display italic">Systems</span>
            </h2>
          </div>

          <div className="md:justify-self-end md:max-w-xl">
            <p className="text-[var(--color-muted)] text-base md:text-lg leading-relaxed">
              Two focused production systems: one for premium product campaigns, one for always-on social output.
              Both move from idea to polished video assets with AI-first speed and cinematic direction.
            </p>
          </div>
        </motion.div>

        {/* Service Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {servicePillars.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative min-h-[520px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 hover:bg-white/[0.055] md:p-9"
            >
              <div
                className="absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ backgroundColor: service.accent, opacity: 0.18 }}
              />

              <div className="relative flex h-full flex-col justify-between gap-12">
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                      {service.label}
                    </span>
                    <span className="text-xs tabular-nums text-[var(--color-muted)]/70">
                      {service.num}
                    </span>
                  </div>

                  <h3 className="mb-5 max-w-md text-3xl leading-none text-[var(--color-text-primary)] md:text-5xl">
                  {service.title}
                  </h3>

                  <p className="mb-6 max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                    {service.desc}
                  </p>

                  <p className="max-w-lg border-l pl-4 text-sm leading-6 text-[var(--color-text-primary)]/80" style={{ borderColor: service.accent }}>
                    {service.outcome}
                  </p>
                </div>

                <div>
                  <div className="mb-4 h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
                  <div className="flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)] transition-colors duration-500 group-hover:border-white/25 group-hover:text-[var(--color-text-primary)] md:text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 h-px w-24 transition-all duration-500 group-hover:w-40"
                  style={{ backgroundColor: service.accent }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 border-y border-white/10 py-5"
        >
          <div className="grid gap-4 md:grid-cols-4">
            {workflow.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-xs tabular-nums text-[var(--color-muted)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-[var(--color-text-primary)] md:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
