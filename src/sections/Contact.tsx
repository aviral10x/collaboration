import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHlsVideo } from '../hooks/useHlsVideo';

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
const calendlyUrl = 'https://calendly.com/neuralstudios9/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=21364f&primary_color=7b2cbf';

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

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LinkIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.9 5.03" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07l1.22-1.22" />
    </svg>
  );
}

function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  );
}

function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.96.33 1.9.63 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.3 1.84.51 2.8.63A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function FieldShell({
  children,
  accent = '#b05cff',
  active = false,
}: {
  children: ReactNode;
  accent?: string;
  active?: boolean;
}) {
  return (
    <div
      className="flex min-h-[100px] items-center gap-7 rounded-2xl border bg-black/22 px-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-300 md:min-h-[104px] md:px-9"
      style={{
        borderColor: active ? accent : 'rgba(255,255,255,0.11)',
        boxShadow: active
          ? `0 0 0 1px ${accent}, 0 0 36px ${accent}24, inset 0 1px 0 rgba(255,255,255,0.05)`
          : 'inset 0 1px 0 rgba(255,255,255,0.04)',
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
  accent = '#b05cff',
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[92px] w-full items-center gap-7 rounded-2xl border bg-black/22 px-8 text-left text-2xl font-semibold text-white/64 transition-all duration-300 hover:border-white/28 hover:text-white md:text-3xl"
      style={{
        borderColor: selected ? accent : 'rgba(255,255,255,0.11)',
        background: selected ? `${accent}1f` : 'rgba(0,0,0,0.22)',
        color: selected ? '#fff' : undefined,
        boxShadow: selected ? `0 0 0 1px ${accent}, 0 0 34px ${accent}1f` : undefined,
      }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center" style={{ color: selected ? accent : 'transparent' }}>
        {selected && <CheckIcon />}
      </span>
      {children}
    </button>
  );
}

export function Contact() {
  const { videoRef } = useHlsVideo('https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8');
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

  function isValidUrl(value: string) {
    try {
      const url = new URL(value);
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
      formData.append('project_website_or_social_link', form.website);
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
    <section id="contact" className="relative min-h-[100dvh] overflow-hidden bg-[var(--color-bg)] px-3 py-6 md:px-8 md:py-10">
      <div className="absolute inset-0 z-0 bg-[var(--color-bg)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-y-[-1] object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-black/76 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(151,66,255,0.16),transparent_42%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[1320px] items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#111016]/70 px-5 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl md:px-12 md:py-12 lg:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_35%,rgba(178,79,255,0.05))]" />
          <div className="relative mx-auto flex min-h-[650px] w-full max-w-[900px] flex-col">
            <div className="mb-14 md:mb-20">
              <div className="mb-6 flex items-center justify-between text-sm font-bold uppercase tracking-[0.09em] text-[#a8adbd] md:text-2xl md:tracking-[0.08em]">
                <span>STEP {step} OF {totalSteps}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/7">
                <motion.div
                  className="h-full rounded-full bg-[#c147ff]"
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
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-1 flex-col justify-center"
                  >
                    <h2 className="mb-5 text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white md:text-7xl">
                      Application submitted <span className="text-[#b45cff]">*</span>
                    </h2>
                    <p className="max-w-2xl text-2xl leading-relaxed text-[#a8adbd]">
                      We received your details and your scheduled call. See you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.32 }}
                    className="flex flex-1 flex-col"
                  >
                    {step === 1 && (
                      <div>
                        <QuestionTitle>What's your name?</QuestionTitle>
                        <FieldShell>
                          <UserIcon className="shrink-0 text-[#8c92a5]" />
                          <input
                            value={form.name}
                            onChange={(event) => update('name', event.target.value)}
                            onKeyDown={handleEnter}
                            autoComplete="name"
                            autoFocus
                            className="w-full bg-transparent text-3xl text-white outline-none placeholder:text-[#8c92a5] md:text-4xl"
                          />
                        </FieldShell>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <QuestionTitle>What's your best email address?</QuestionTitle>
                        <FieldShell active>
                          <MailIcon className="shrink-0 text-[#b45cff]" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={(event) => update('email', event.target.value)}
                            onKeyDown={handleEnter}
                            autoComplete="email"
                            autoFocus
                            className="w-full bg-transparent text-3xl text-white outline-none placeholder:text-[#8c92a5] md:text-4xl"
                          />
                        </FieldShell>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <QuestionTitle>Project website or social link</QuestionTitle>
                        <FieldShell active>
                          <LinkIcon className="shrink-0 text-[#b45cff]" />
                          <input
                            type="url"
                            value={form.website}
                            onChange={(event) => update('website', event.target.value)}
                            onKeyDown={handleEnter}
                            placeholder="https://"
                            autoFocus
                            className="w-full bg-transparent text-3xl text-white outline-none placeholder:text-[#8c92a5] md:text-4xl"
                          />
                        </FieldShell>
                      </div>
                    )}

                    {step === 4 && (
                      <div>
                        <QuestionTitle>How can we reach you?</QuestionTitle>
                        <div className="mb-12 grid gap-6 md:grid-cols-2">
                          {(['Telegram', 'WhatsApp'] as ContactMethod[]).map((method) => {
                            const isSelected = form.contactMethod === method;
                            const accent = method === 'Telegram' ? '#00a9f4' : '#25d366';
                            const Icon = method === 'Telegram' ? ChatIcon : PhoneIcon;
                            return (
                              <button
                                key={method}
                                type="button"
                                onClick={() => {
                                  update('contactMethod', method);
                                  update('contactHandle', '');
                                }}
                                className="flex min-h-[186px] flex-col items-center justify-center gap-5 rounded-2xl border bg-black/22 text-3xl font-semibold text-[#9aa0b2] transition-all duration-300 hover:border-white/25"
                                style={{
                                  borderColor: isSelected ? accent : 'rgba(255,255,255,0.12)',
                                  background: isSelected ? `${accent}16` : 'rgba(0,0,0,0.22)',
                                  color: isSelected ? accent : undefined,
                                  boxShadow: isSelected ? `0 0 0 1px ${accent}, 0 0 36px ${accent}1f` : undefined,
                                }}
                              >
                                <Icon />
                                {method}
                              </button>
                            );
                          })}
                        </div>
                        <FieldShell active accent={form.contactMethod === 'Telegram' ? '#00a9f4' : '#25d366'}>
                          {form.contactMethod === 'Telegram' ? (
                            <ChatIcon className="shrink-0 text-[#00a9f4]" />
                          ) : (
                            <PhoneIcon className="shrink-0 text-[#25d366]" />
                          )}
                          <input
                            value={form.contactHandle}
                            onChange={(event) => update('contactHandle', event.target.value)}
                            onKeyDown={handleEnter}
                            placeholder={form.contactMethod === 'Telegram' ? '@yo' : '+1 234 567 8900'}
                            autoFocus
                            className="w-full bg-transparent text-3xl text-white outline-none placeholder:text-[#8c92a5] md:text-4xl"
                          />
                        </FieldShell>
                      </div>
                    )}

                    {step === 5 && (
                      <div>
                        <QuestionTitle>What are you looking for?</QuestionTitle>
                        <div className="space-y-4">
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
                        <p className="-mt-2 mb-12 text-2xl leading-relaxed text-[#a8adbd] md:text-3xl">
                          What are you building and why do you need video content?
                        </p>
                        <textarea
                          value={form.projectDetails}
                          onChange={(event) => update('projectDetails', event.target.value)}
                          autoFocus
                          className="min-h-[282px] w-full resize-none rounded-2xl border border-[#d331ff] bg-black/22 p-9 text-3xl leading-relaxed text-white outline-none shadow-[0_0_0_1px_#d331ff,0_0_34px_rgba(211,49,255,0.16)] placeholder:text-[#8c92a5]"
                        />
                      </div>
                    )}

                    {step === 7 && (
                      <div>
                        <QuestionTitle>What's your monthly budget?</QuestionTitle>
                        <div className="space-y-4">
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
                        <div className="space-y-4">
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
                        <p className="-mt-2 mb-12 max-w-3xl text-2xl leading-relaxed text-[#a8adbd] md:text-3xl">
                          This 15-min call is required to map out your project and activate your application.
                        </p>
                        <div className="overflow-hidden rounded-2xl border border-white/18 bg-white">
                          <iframe
                            src={calendlyUrl}
                            title="Book your discovery call"
                            className="h-[760px] w-full bg-white"
                          />
                        </div>
                        <div className="mt-12 flex min-h-[82px] items-center gap-5 rounded-2xl border border-[#8c3bd1]/60 bg-[#b45cff]/12 px-7 text-2xl text-[#c07cff]">
                          <span className="h-3 w-3 rounded-full bg-[#a855f7]" />
                          {bookedCall ? 'Booking confirmed.' : 'Waiting for booking confirmation...'}
                        </div>
                      </div>
                    )}

                    {error && (
                      <p className="mt-8 text-2xl text-[#ff6565]">
                        {error}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!submitted && (
              <div className="mt-16 grid gap-6 md:grid-cols-[0.72fr_1.43fr]">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="flex min-h-[90px] items-center justify-center gap-5 rounded-2xl border border-white/12 bg-black/18 text-2xl font-semibold text-[#a8adbd] transition-colors hover:border-white/28 hover:text-white disabled:pointer-events-none disabled:opacity-0"
                >
                  <ArrowLeftIcon />
                  Back
                </button>
                <button
                  type="button"
                  onClick={isLastStep ? () => void handleSubmit() : handleContinue}
                  disabled={isLastStep ? !canSubmit : false}
                  className="flex min-h-[90px] items-center justify-center gap-5 rounded-2xl bg-white text-2xl font-bold text-black transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:bg-[#7a2d98] disabled:text-white/45"
                >
                  {isLastStep ? (submitting ? 'Submitting...' : 'Submit') : 'Continue'}
                  {isLastStep ? <CheckIcon /> : <ArrowRightIcon />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 text-[clamp(3rem,5vw,4.5rem)] font-bold leading-[1.06] text-white">
      {children} <span className="inline-block text-[#b45cff]">*</span>
    </h2>
  );
}
