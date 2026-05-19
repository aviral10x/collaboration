import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useHlsVideo } from '../hooks/useHlsVideo';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  goal: string;
  timeline: string;
  budget: string;
  references: string;
  details: string;
};

type FormKey = keyof FormState;

const initialForm: FormState = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  goal: '',
  timeline: '',
  budget: '',
  references: '',
  details: '',
};

const questions: Array<{
  key: FormKey;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'textarea' | 'choices';
  options?: string[];
}> = [
  { key: 'name', label: "What's your name? *", placeholder: 'Your name', required: true },
  { key: 'email', label: "What's your email? *", placeholder: 'you@studio.com', required: true, type: 'email' },
  { key: 'company', label: "What's your team or project?", placeholder: 'Studio, team, or project name' },
  {
    key: 'projectType',
    label: 'What do you need made?',
    type: 'choices',
    options: ['Product commercial', 'Fashion film', 'Beauty campaign', 'Automotive spot', 'Social content', 'Launch reel'],
  },
  { key: 'goal', label: "What's the main goal?", placeholder: 'Launch, sell, explain, pitch, grow, or build awareness', type: 'textarea' },
  {
    key: 'timeline',
    label: 'When do you need it?',
    type: 'choices',
    options: ['This week', '2-3 weeks', 'This month', 'Flexible'],
  },
  {
    key: 'budget',
    label: "What's the budget range?",
    type: 'choices',
    options: ['$1k-$3k', '$3k-$7k', '$7k-$15k', '$15k+'],
  },
  { key: 'references', label: 'Any references we should see?', placeholder: 'Links, moods, videos, or visual direction', type: 'textarea' },
  { key: 'details', label: 'Anything else we should know?', placeholder: 'Give us the spark, the constraints, and the feeling.', type: 'textarea' },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,7 12,13 2,7" />
    </svg>
  );
}

const socials = [
  { name: 'Instagram', url: 'https://www.instagram.com/aurakidzzz/', icon: InstagramIcon },
  { name: 'X', url: 'https://x.com/aviral10x', icon: XIcon },
  { name: 'Email', url: 'mailto:aviral10x@gmail.com', icon: MailIcon },
];

const exploreLinks = [
  { label: 'Home', target: 'hero' },
  { label: 'Work', target: 'work' },
  { label: 'Services', target: 'journal' },
  { label: 'Contact', target: 'contact' },
];

const marqueeItems = Array.from({ length: 6 });

export function Contact() {
  const { videoRef } = useHlsVideo('https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8');
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollToSection } = useSmoothScroll();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);
  const isFinalStep = step === questions.length - 1;

  useEffect(() => {
    if (!marqueeRef.current) return;

    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 42,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  function update(field: FormKey, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }

  function validateCurrentStep() {
    const value = form[currentQuestion.key].trim();
    if (currentQuestion.required && !value) {
      setError('Please answer this before continuing.');
      return false;
    }
    if (currentQuestion.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
      setError('Please enter a valid email.');
      return false;
    }
    return true;
  }

  async function submitInquiry() {
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('access_key', '5ef59b49-97e2-4d47-b503-5197e223d81a');
      formData.append('subject', `Neural Studios Inquiry ${form.projectType || 'General'}`);
      formData.append('from_name', 'Neural Studios Website');
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('company', form.company || 'Not specified');
      formData.append('project_type', form.projectType || 'Not specified');
      formData.append('goal', form.goal || 'Not specified');
      formData.append('timeline', form.timeline || 'Not specified');
      formData.append('budget', form.budget || 'Not specified');
      formData.append('references', form.references || 'Not specified');
      formData.append('message', form.details || 'No extra details');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!data.success) {
        setError('Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleContinue() {
    if (!validateCurrentStep()) return;

    if (isFinalStep) {
      await submitInquiry();
      return;
    }

    setStep((prev) => prev + 1);
  }

  function handleBack() {
    setError('');
    setStep((prev) => Math.max(0, prev - 1));
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
    setStep(0);
    setError('');
  }

  return (
    <section id="contact" className="relative min-h-[100dvh] overflow-hidden bg-[var(--color-bg)] px-6 py-10 md:px-10 md:py-12">
      <div className="absolute inset-0 z-0 bg-[var(--color-bg)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-y-[-1] object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-bg)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-[1440px] flex-col justify-between">
        <div className="contact-marquee relative left-1/2 w-screen -translate-x-1/2 overflow-hidden whitespace-nowrap pb-6">
          <div ref={marqueeRef} className="contact-marquee-track flex w-max">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0">
                {marqueeItems.map((_, i) => (
                  <span
                    key={`${group}-${i}`}
                    className="mr-10 font-display text-[clamp(5rem,11vw,10rem)] leading-none text-[var(--color-text-primary)]/12"
                  >
                    NEURAL STUDIOS *
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            <h2 className="mb-4 font-display text-5xl leading-none text-[var(--color-text-primary)] md:text-6xl">
              Let's bring your vision to life
            </h2>
            <p className="mx-auto mb-7 max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
              Answer a few quick questions and we'll get back to you within 24 hours.
            </p>

            <div className="mx-auto mb-6 max-w-xl">
              <div className="mb-3 flex items-center justify-between text-xs uppercase text-[var(--color-muted)]">
                <span>Step {step + 1} of {questions.length}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-px w-full overflow-hidden bg-white/15">
                <motion.div
                  className="h-full bg-[var(--color-text-primary)]"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45 }}
                  className="mx-auto max-w-xl py-8"
                >
                  <h3 className="mb-4 font-display text-5xl text-[var(--color-text-primary)]">
                    Message sent
                  </h3>
                  <p className="mb-8 text-sm leading-7 text-[var(--color-muted)] md:text-base">
                    We received your inquiry and will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-white/20 px-7 py-3 text-sm text-[var(--color-text-primary)] transition-colors hover:bg-white hover:text-[var(--color-bg)]"
                  >
                    Start another
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={currentQuestion.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35 }}
                  className="mx-auto w-full max-w-xl"
                >
                  <h3 className="mb-5 text-3xl leading-tight text-[var(--color-text-primary)] md:text-4xl">
                    {currentQuestion.label}
                  </h3>

                  {currentQuestion.type === 'choices' ? (
                    <div className="mb-6 flex flex-wrap justify-center gap-3">
                      {currentQuestion.options?.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => update(currentQuestion.key, form[currentQuestion.key] === option ? '' : option)}
                          className={`rounded-full border px-5 py-3 text-sm transition-all duration-300 ${
                            form[currentQuestion.key] === option
                              ? 'border-white bg-white text-[var(--color-bg)]'
                              : 'border-white/15 bg-white/5 text-[var(--color-muted)] hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : currentQuestion.type === 'textarea' ? (
                    <textarea
                      value={form[currentQuestion.key]}
                      onChange={(event) => update(currentQuestion.key, event.target.value)}
                      rows={4}
                      placeholder={currentQuestion.placeholder}
                      className="mb-6 w-full resize-none border-0 border-b border-white/20 bg-transparent px-0 py-3 text-center text-xl text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-muted)]/50 focus:border-white md:text-2xl"
                    />
                  ) : (
                    <input
                      type={currentQuestion.type || 'text'}
                      value={form[currentQuestion.key]}
                      onChange={(event) => update(currentQuestion.key, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          void handleContinue();
                        }
                      }}
                      placeholder={currentQuestion.placeholder}
                      className="mb-6 w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-center text-2xl text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-muted)]/50 focus:border-white md:text-3xl"
                    />
                  )}

                  {error && <p className="mb-5 text-sm text-red-300">{error}</p>}

                  <div className="flex items-center justify-center gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="rounded-full border border-white/15 px-6 py-3 text-sm text-[var(--color-muted)] transition-colors hover:border-white/40 hover:text-white"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleContinue()}
                      disabled={submitting}
                      className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-[var(--color-bg)] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                    >
                      {submitting ? 'Sending...' : isFinalStep ? 'Send inquiry' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <footer className="mt-10 grid gap-8 border-t border-white/10 pt-6 md:grid-cols-[1fr_1.4fr_1fr] md:items-start">
          <div>
            <h3 className="mb-4 text-sm text-[var(--color-text-primary)]">Follow Us</h3>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[var(--color-muted)] transition-colors hover:border-white/40 hover:text-white"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          <div className="md:text-center">
            <h3 className="mb-4 text-sm text-[var(--color-text-primary)]">Explore</h3>
            <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
              {exploreLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollToSection(link.target)}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:text-right">
            <h3 className="mb-4 text-sm text-[var(--color-text-primary)]">Let's work together</h3>
            <a href="mailto:aviral10x@gmail.com" className="text-sm text-[var(--color-muted)] transition-colors hover:text-white">
              Have an idea?
            </a>
          </div>

          <div className="text-xs text-[var(--color-muted)] md:col-span-2">
            © {new Date().getFullYear()} Neural Studios. All rights reserved.
          </div>
          <div className="flex gap-5 text-xs text-[var(--color-muted)] md:justify-end">
            <a href="mailto:aviral10x@gmail.com" className="transition-colors hover:text-white">Legal</a>
            <a href="mailto:aviral10x@gmail.com" className="transition-colors hover:text-white">Privacy Policy</a>
            <button type="button" className="transition-colors hover:text-white">Cookie Settings</button>
          </div>
        </footer>
      </div>
    </section>
  );
}
