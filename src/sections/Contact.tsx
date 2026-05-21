import { useEffect, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHlsVideo } from '../hooks/useHlsVideo';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

type ContactMethod = 'Telegram' | 'WhatsApp';

type FormState = {
  name: string;
  email: string;
  website: string;
  contactMethod: ContactMethod;
  contactHandle: string;
  goal: string;
  projectDetails: string;
  budget: string;
  timeline: string;
};

type IconProps = {
  className?: string;
  style?: CSSProperties;
};

const initialForm: FormState = {
  name: '',
  email: '',
  website: '',
  contactMethod: 'Telegram',
  contactHandle: '',
  goal: '',
  projectDetails: '',
  budget: '',
  timeline: '',
};

const totalSteps = 9;
const calendlyUrl = 'https://calendly.com/neuralstudios9/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=21364f&primary_color=4E85BF';
const accent = '#89AACC';
const accentStrong = '#4E85BF';

const needsOptions = [
  'Explain my product or service',
  'Grow on social media',
  'Launch a product',
  'Run ads that convert',
  'Design a website',
  'Something else',
];

const budgetOptions = ['$1,500 - $3,000', '$3,000 - $5,000', '$5,000 - $10,000', '$10,000+'];
const timelineOptions = ['ASAP (this week)', 'This month', 'Within 30 days'];

const exploreLinks = [
  { label: 'Home', target: 'hero' },
  { label: 'Work', target: 'work' },
  { label: 'Services', target: 'journal' },
  { label: 'Contact', target: 'contact' },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MailIconSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,7 12,13 2,7" />
    </svg>
  );
}

function UserIcon({ className = '', style }: IconProps) {
  return (
    <svg className={className} style={style} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon({ className = '', style }: IconProps) {
  return (
    <svg className={className} style={style} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LinkIcon({ className = '', style }: IconProps) {
  return (
    <svg className={className} style={style} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.9 5.03" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07l1.22-1.22" />
    </svg>
  );
}

function ChatIcon({ className = '', style }: IconProps) {
  return (
    <svg className={className} style={style} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  );
}

function PhoneIcon({ className = '', style }: IconProps) {
  return (
    <svg className={className} style={style} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.96.33 1.9.63 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.3 1.84.51 2.8.63A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function FieldShell({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className="flex min-h-[82px] items-center gap-5 rounded-lg border bg-white/[0.035] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition-colors duration-300 md:min-h-[92px] md:px-7"
      style={{
        borderColor: active ? accent : 'rgba(255,255,255,0.13)',
        boxShadow: active
          ? `0 0 0 1px ${accent}99, 0 0 30px ${accentStrong}22, inset 0 1px 0 rgba(255,255,255,0.06)`
          : 'inset 0 1px 0 rgba(255,255,255,0.045)',
      }}
    >
      {children}
    </div>
  );
}

function OptionButton({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[76px] w-full items-center gap-5 rounded-lg border bg-white/[0.03] px-5 text-left text-lg font-medium text-[var(--color-muted)] transition-all duration-300 hover:border-white/28 hover:text-white md:min-h-[84px] md:px-7 md:text-2xl"
      style={{
        borderColor: selected ? accent : 'rgba(255,255,255,0.12)',
        background: selected ? 'rgba(137, 170, 204, 0.11)' : 'rgba(255,255,255,0.03)',
        color: selected ? 'var(--color-text-primary)' : undefined,
        boxShadow: selected ? `0 0 0 1px ${accent}88, 0 0 28px ${accentStrong}1f` : undefined,
      }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center" style={{ color: selected ? accent : 'transparent' }}>
        {selected && <CheckIcon />}
      </span>
      {children}
    </button>
  );
}

const socials = [
  { name: 'Instagram', url: 'https://www.instagram.com/aurakidzzz/', icon: InstagramIcon },
  { name: 'X', url: 'https://x.com/aviral10x', icon: XIcon },
  { name: 'Email', url: 'mailto:aviral10x@gmail.com', icon: MailIconSmall },
];

export function Contact() {
  const { videoRef } = useHlsVideo('https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8');
  const { scrollToSection } = useSmoothScroll();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [bookedCall, setBookedCall] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = Math.round((step / totalSteps) * 100);
  const isLastStep = step === totalSteps;
  const canSubmit = bookedCall && !submitting;

  useEffect(() => {
    const handleCalendlyMessage = (event: MessageEvent) => {
      const data = event.data as { event?: string } | undefined;
      if (data?.event === 'calendly.event_scheduled') {
        setBookedCall(true);
      }
    };

    window.addEventListener('message', handleCalendlyMessage);
    return () => window.removeEventListener('message', handleCalendlyMessage);
  }, []);

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  function normalizeUrl(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function isValidUrl(value: string) {
    try {
      const url = new URL(normalizeUrl(value));
      return Boolean(url.hostname.includes('.'));
    } catch {
      return false;
    }
  }

  function validateStep() {
    if (step === 1 && !form.name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (step === 2 && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (step === 3 && !isValidUrl(form.website.trim())) {
      setError('Please enter a URL.');
      return false;
    }
    if (step === 4 && !form.contactHandle.trim()) {
      setError(form.contactMethod === 'Telegram' ? 'Please enter your Telegram username.' : 'Please enter your WhatsApp number.');
      return false;
    }
    if (step === 5 && !form.goal) {
      setError('Please select one option.');
      return false;
    }
    if (step === 6 && form.projectDetails.trim().length < 50) {
      setError('Please provide at least 50 characters');
      return false;
    }
    if (step === 7 && !form.budget) {
      setError('Please select one option.');
      return false;
    }
    if (step === 8 && !form.timeline) {
      setError('Please select one option.');
      return false;
    }
    return true;
  }

  function handleContinue() {
    if (!validateStep()) return;
    if (step === 3) {
      update('website', normalizeUrl(form.website));
    }
    setStep((prev) => Math.min(totalSteps, prev + 1));
  }

  function handleBack() {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('access_key', '5ef59b49-97e2-4d47-b503-5197e223d81a');
      formData.append('subject', `Neural Studios Application - ${form.name}`);
      formData.append('from_name', 'Neural Studios Website');
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('project_website_or_social_link', normalizeUrl(form.website));
      formData.append('preferred_contact_method', form.contactMethod);
      formData.append('contact_handle', form.contactHandle);
      formData.append('looking_for', form.goal);
      formData.append('project_details', form.projectDetails);
      formData.append('monthly_budget', form.budget);
      formData.append('ideal_timeline', form.timeline);
      formData.append('calendly_call_booked', bookedCall ? 'Yes' : 'No');

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

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleContinue();
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--color-bg)] px-6 py-12 md:px-10 md:py-16">
      <div className="absolute inset-0 z-0 bg-[var(--color-bg)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-y-[-1] object-cover opacity-28"
        />
        <div className="absolute inset-0 bg-black/78 backdrop-blur-[2px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-bg)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-[1440px] flex-col justify-between">
        <div className="mx-auto w-full max-w-[980px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-lg border border-white/10 bg-black/34 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:p-9 lg:p-11"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0)_42%,rgba(137,170,204,0.06))]" />
            <div className="relative flex min-h-[620px] flex-col">
              <div className="mb-12 md:mb-16">
                <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)] md:text-sm">
                  <span>STEP {step} OF {totalSteps}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full accent-gradient"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="submitted"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.32 }}
                      className="flex flex-1 flex-col justify-center"
                    >
                      <h2 className="mb-5 font-display text-[clamp(3.6rem,7vw,6.2rem)] leading-none text-white">
                        Application <span className="italic">submitted</span>
                      </h2>
                      <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
                        We received your details and your scheduled call. See you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.32 }}
                      className="flex flex-1 flex-col"
                    >
                      {step === 1 && (
                        <div>
                          <QuestionTitle>What's your name?</QuestionTitle>
                          <FieldShell>
                            <UserIcon className="shrink-0 text-[var(--color-muted)]" />
                            <input
                              value={form.name}
                              onChange={(event) => update('name', event.target.value)}
                              onKeyDown={handleEnter}
                              autoComplete="name"
                              autoFocus
                              className="w-full bg-transparent text-2xl text-white outline-none placeholder:text-[var(--color-muted)] md:text-3xl"
                            />
                          </FieldShell>
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <QuestionTitle>What's your best email address?</QuestionTitle>
                          <FieldShell active>
                            <MailIcon className="shrink-0" style={{ color: accent }} />
                            <input
                              type="email"
                              value={form.email}
                              onChange={(event) => update('email', event.target.value)}
                              onKeyDown={handleEnter}
                              autoComplete="email"
                              autoFocus
                              className="w-full bg-transparent text-2xl text-white outline-none placeholder:text-[var(--color-muted)] md:text-3xl"
                            />
                          </FieldShell>
                        </div>
                      )}

                      {step === 3 && (
                        <div>
                          <QuestionTitle>Project website or social link</QuestionTitle>
                          <FieldShell active>
                            <LinkIcon className="shrink-0" style={{ color: accent }} />
                            <input
                              type="text"
                              value={form.website}
                              onChange={(event) => update('website', event.target.value)}
                              onKeyDown={handleEnter}
                              placeholder="https://"
                              autoFocus
                              className="w-full bg-transparent text-2xl text-white outline-none placeholder:text-[var(--color-muted)] md:text-3xl"
                            />
                          </FieldShell>
                        </div>
                      )}

                      {step === 4 && (
                        <div>
                          <QuestionTitle>How can we reach you?</QuestionTitle>
                          <div className="mb-8 grid gap-4 md:grid-cols-2">
                            {(['Telegram', 'WhatsApp'] as ContactMethod[]).map((method) => {
                              const isSelected = form.contactMethod === method;
                              const Icon = method === 'Telegram' ? ChatIcon : PhoneIcon;
                              return (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() => {
                                    update('contactMethod', method);
                                    update('contactHandle', '');
                                  }}
                                  className="flex min-h-[132px] flex-col items-center justify-center gap-4 rounded-lg border bg-white/[0.03] text-xl font-medium text-[var(--color-muted)] transition-all duration-300 hover:border-white/28 hover:text-white md:min-h-[150px] md:text-2xl"
                                  style={{
                                    borderColor: isSelected ? accent : 'rgba(255,255,255,0.12)',
                                    background: isSelected ? 'rgba(137, 170, 204, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: isSelected ? 'var(--color-text-primary)' : undefined,
                                    boxShadow: isSelected ? `0 0 0 1px ${accent}88, 0 0 28px ${accentStrong}1f` : undefined,
                                  }}
                                >
                                  <Icon style={{ color: isSelected ? accent : 'currentColor' }} />
                                  {method}
                                </button>
                              );
                            })}
                          </div>
                          <FieldShell active>
                            {form.contactMethod === 'Telegram' ? (
                              <ChatIcon className="shrink-0" style={{ color: accent }} />
                            ) : (
                              <PhoneIcon className="shrink-0" style={{ color: accent }} />
                            )}
                            <input
                              value={form.contactHandle}
                              onChange={(event) => update('contactHandle', event.target.value)}
                              onKeyDown={handleEnter}
                              placeholder={form.contactMethod === 'Telegram' ? '@yo' : '+1 234 567 8900'}
                              autoFocus
                              className="w-full bg-transparent text-2xl text-white outline-none placeholder:text-[var(--color-muted)] md:text-3xl"
                            />
                          </FieldShell>
                        </div>
                      )}

                      {step === 5 && (
                        <div>
                          <QuestionTitle>What are you looking for?</QuestionTitle>
                          <div className="space-y-3">
                            {needsOptions.map((option) => (
                              <OptionButton
                                key={option}
                                selected={form.goal === option}
                                onClick={() => update('goal', option)}
                              >
                                {option}
                              </OptionButton>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 6 && (
                        <div>
                          <QuestionTitle>Tell us about your project</QuestionTitle>
                          <p className="-mt-2 mb-8 text-base leading-7 text-[var(--color-muted)] md:text-lg">
                            What are you building and why do you need video content?
                          </p>
                          <textarea
                            value={form.projectDetails}
                            onChange={(event) => update('projectDetails', event.target.value)}
                            autoFocus
                            className="min-h-[220px] w-full resize-none rounded-lg border bg-white/[0.035] p-6 text-xl leading-relaxed text-white outline-none placeholder:text-[var(--color-muted)] md:min-h-[260px] md:text-2xl"
                            style={{
                              borderColor: error ? '#ff6565' : accent,
                              boxShadow: error
                                ? '0 0 0 1px rgba(255,101,101,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'
                                : `0 0 0 1px ${accent}88, 0 0 30px ${accentStrong}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
                            }}
                          />
                        </div>
                      )}

                      {step === 7 && (
                        <div>
                          <QuestionTitle>What's your monthly budget?</QuestionTitle>
                          <div className="space-y-3">
                            {budgetOptions.map((option) => (
                              <OptionButton
                                key={option}
                                selected={form.budget === option}
                                onClick={() => update('budget', option)}
                              >
                                {option}
                              </OptionButton>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 8 && (
                        <div>
                          <QuestionTitle>Ideal timeline to start?</QuestionTitle>
                          <div className="space-y-3">
                            {timelineOptions.map((option) => (
                              <OptionButton
                                key={option}
                                selected={form.timeline === option}
                                onClick={() => update('timeline', option)}
                              >
                                {option}
                              </OptionButton>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 9 && (
                        <div>
                          <QuestionTitle>Book your discovery call</QuestionTitle>
                          <p className="-mt-2 mb-8 max-w-3xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
                            This 15-min call is required to map out your project and activate your application.
                          </p>
                          <div className="overflow-hidden rounded-lg border border-white/15 bg-white">
                            <iframe
                              src={calendlyUrl}
                              title="Book your discovery call"
                              className="h-[680px] w-full bg-white"
                            />
                          </div>
                          <div className="mt-7 flex min-h-[64px] items-center gap-4 rounded-lg border border-white/12 bg-white/[0.04] px-5 text-base text-[var(--color-muted)]">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                            {bookedCall ? 'Booking confirmed.' : 'Waiting for booking confirmation...'}
                          </div>
                        </div>
                      )}

                      {error && (
                        <p className="mt-6 text-base text-[#ff6565] md:text-lg">
                          {error}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!submitted && (
                <div className={`mt-10 grid gap-4 ${step > 1 ? 'md:grid-cols-[0.72fr_1.43fr]' : ''}`}>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex min-h-[68px] items-center justify-center gap-4 rounded-lg border border-white/12 bg-white/[0.025] text-base font-medium text-[var(--color-muted)] transition-colors hover:border-white/28 hover:text-white md:min-h-[78px] md:text-xl"
                    >
                      <ArrowLeftIcon />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={isLastStep ? () => void handleSubmit() : handleContinue}
                    disabled={isLastStep ? !canSubmit : false}
                    className="flex min-h-[68px] items-center justify-center gap-4 rounded-lg bg-[var(--color-text-primary)] text-base font-semibold text-[var(--color-bg)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:bg-white/12 disabled:text-[var(--color-muted)] md:min-h-[78px] md:text-xl"
                  >
                    {isLastStep ? (submitting ? 'Submitting...' : 'Submit') : 'Continue'}
                    {isLastStep ? <CheckIcon /> : <ArrowRightIcon />}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <SiteFooter scrollToSection={scrollToSection} />
      </div>
    </section>
  );
}

function QuestionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 font-display text-[clamp(3.3rem,6.7vw,6.4rem)] leading-none text-white">
      {children} <span className="italic" style={{ color: accent }}>*</span>
    </h2>
  );
}

function SiteFooter({ scrollToSection }: { scrollToSection: (target: string) => void }) {
  return (
    <footer className="mt-14 grid gap-8 border-t border-white/10 pt-6 md:grid-cols-[1fr_1.4fr_1fr] md:items-start">
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
  );
}
