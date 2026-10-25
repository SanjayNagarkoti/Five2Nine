import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Menu,
  PenLine,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";

const categories = [
  { name: "Design & creative", detail: "Brands, products, visuals", Icon: Palette, shade: "bg-[#e5f5ec] text-[#25816a]" },
  { name: "Development", detail: "Websites, apps, systems", Icon: Code2, shade: "bg-[#e9edff] text-[#5c6bc4]" },
  { name: "Writing & content", detail: "Words that move people", Icon: PenLine, shade: "bg-[#fff1df] text-[#bd7932]" },
  { name: "Marketing & growth", detail: "Reach the right audience", Icon: Zap, shade: "bg-[#f4e9fb] text-[#9662b8]" },
  { name: "Video & motion", detail: "Stories in every frame", Icon: Video, shade: "bg-[#ffe8e5] text-[#c36d61]" },
  { name: "Business & consulting", detail: "Ideas, strategy, direction", Icon: BriefcaseBusiness, shade: "bg-[#e5f2f7] text-[#4d8297]" },
];

const steps = [
  { number: "01", title: "Share what you need", text: "Set the goal, outline the work, and make the expectations clear from day one." },
  { number: "02", title: "Find your fit", text: "Connect with independent talent or clients who understand what you’re trying to do." },
  { number: "03", title: "Make great work", text: "Keep the conversation moving and turn a good match into something meaningful." },
];

export default function Home() {
  const token = localStorage.getItem("token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f4] text-[#1b332d]">
      <header className="sticky top-0 z-50 border-b border-[#e8eee8]/80 bg-[#f7f8f4]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandMark />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#discover" className="text-[13px] font-medium text-[#647970] transition hover:text-[#197d68]">Explore skills</a>
            <a href="#how-it-works" className="text-[13px] font-medium text-[#647970] transition hover:text-[#197d68]">How it works</a>
            <a href="#why-five2nine" className="text-[13px] font-medium text-[#647970] transition hover:text-[#197d68]">Why Five2Nine</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {token ? (
              <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#197d68] px-5 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#146b5a]">Go to dashboard <ArrowUpRight size={15} /></Link>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4c655b] transition hover:bg-white hover:text-[#197d68]">Log in</Link>
                <Link to="/signup" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#197d68] to-[#238e74] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(31,128,105,0.18)] transition hover:-translate-y-0.5 hover:shadow-lg">Get started <ArrowRight size={15} /></Link>
              </>
            )}
          </div>

          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfe8e2] bg-white text-[#315348] md:hidden" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#e7eee8] bg-[#fbfcf9] px-5 py-4 shadow-lg md:hidden">
            <nav className="mx-auto flex max-w-[1240px] flex-col gap-1" aria-label="Mobile navigation">
              <a href="#discover" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-[#526c61] hover:bg-[#eef6f0]">Explore skills</a>
              <a href="#how-it-works" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-[#526c61] hover:bg-[#eef6f0]">How it works</a>
              <a href="#why-five2nine" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-[#526c61] hover:bg-[#eef6f0]">Why Five2Nine</a>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {token ? <Link to="/dashboard" onClick={closeMenu} className="rounded-xl bg-[#197d68] px-4 py-3 text-center text-sm font-semibold text-white">Dashboard</Link> : <><Link to="/login" onClick={closeMenu} className="rounded-xl border border-[#dfe8e2] bg-white px-4 py-3 text-center text-sm font-semibold text-[#39584d]">Log in</Link><Link to="/signup" onClick={closeMenu} className="rounded-xl bg-[#197d68] px-4 py-3 text-center text-sm font-semibold text-white">Get started</Link></>}
              </div>
            </nav>
          </div>
        )}
      </header>

      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-40 top-12 -z-10 h-[430px] w-[430px] rounded-full bg-[#dcefe5]/65 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 top-24 -z-10 h-[480px] w-[480px] rounded-full bg-[#e8e9fb]/70 blur-3xl" />
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="f2n-fade-up relative z-10 max-w-[650px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcebe2] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#477365] shadow-sm shadow-[#1d5d48]/5 backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#42a987] opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#26856d]" /></span>
              A more thoughtful way to freelance
              <Sparkles size={13} className="text-[#bd8742]" />
            </div>

            <h1 className="font-display max-w-[700px] text-[clamp(3.2rem,6.2vw,5.65rem)] font-medium leading-[0.99] tracking-[-0.065em] text-[#18332d]">
              Great work takes <span className="relative inline-block text-[#23836c]">the right people.<svg aria-hidden="true" viewBox="0 0 320 16" className="absolute -bottom-2 left-0 h-3 w-full text-[#a9d9c2]" fill="none"><path d="M3 10.5C76 3.5 219 2 316 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></span>
            </h1>
            <p className="mt-7 max-w-[520px] text-base leading-7 text-[#6d8178] sm:text-lg sm:leading-8">A better place for independent talent to find meaningful projects—and for ambitious teams to find their next great collaborator.</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {token ? (
                <Link to="/dashboard" className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#197d68] to-[#238e74] px-6 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(31,128,105,0.20)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(31,128,105,0.26)]">Go to your workspace <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
              ) : (
                <>
                  <Link to="/signup" className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#197d68] to-[#238e74] px-6 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(31,128,105,0.20)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(31,128,105,0.26)]">Get started for free <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
                  <a href="#discover" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#dce7df] bg-white/75 px-6 text-sm font-semibold text-[#466359] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#bfd8cb] hover:bg-white">Explore the possibilities <ArrowDownRight size={16} /></a>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#7a8d84]">
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#27866e]" /> Clear project expectations</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#27866e]" /> Direct collaboration</span>
            </div>
          </div>

          <div className="relative mx-auto min-h-[400px] w-full max-w-[580px] sm:min-h-[470px] lg:min-h-[530px]">
            <div className="absolute inset-4 rounded-[42px] bg-gradient-to-br from-[#e3f2e9]/70 via-white/50 to-[#e6e9fb]/70 blur-sm sm:inset-7" />
            <div className="absolute inset-5 rounded-[36px] border border-white/80 bg-white/25 [background-image:radial-gradient(#9dbdb0_0.8px,transparent_0.8px)] [background-size:19px_19px] sm:inset-8" />

            <div className="f2n-tilt f2n-float absolute left-[1%] top-[12%] z-20 w-[190px] rounded-2xl border border-white bg-white/95 p-4 shadow-[0_22px_60px_rgba(38,82,68,0.14)] backdrop-blur sm:left-0 sm:w-[218px]">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#84958d]">Project match</span><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e8f7ee] text-[#21836a]"><Check size={14} /></span></div>
              <p className="mt-3 text-sm font-bold text-[#29483c]">Brand identity</p>
              <p className="mt-1 text-xs text-[#8a9a92]">Creative · Project brief</p>
              <div className="mt-4 flex items-center"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#e8d9c9] text-[10px] font-bold text-[#705541]">AM</span><span className="-ml-2 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#d9e7fb] text-[10px] font-bold text-[#506a9a]">JS</span><span className="-ml-2 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#d9efe4] text-[10px] font-bold text-[#36715b]">RK</span><span className="ml-2 text-[10px] font-medium text-[#7c8d84]">A good fit, together</span></div>
            </div>

            <div className="f2n-tilt absolute left-[12%] top-[25%] z-10 w-[78%] max-w-[405px] rounded-[26px] border border-white/90 bg-white/90 p-5 shadow-[0_30px_80px_rgba(37,76,62,0.15)] backdrop-blur-xl transition duration-500 sm:left-[14%] sm:top-[22%] sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-[#edf1ed] pb-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87968f]">Your workspace</p><h3 className="mt-1.5 text-lg font-bold tracking-[-0.03em] text-[#254337]">Make progress feel simple.</h3></div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#dbf3e6] to-[#e8eaff] text-[#3c8b73]"><Blocks size={20} /></div>
              </div>
              <div className="mt-5 rounded-2xl bg-[#f7faf7] p-4 ring-1 ring-[#eaf0eb]">
                <div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold text-[#49675a]">Website refresh</p><p className="mt-1 text-[11px] text-[#92a098]">Creative collaboration</p></div><span className="rounded-full bg-[#e4f5eb] px-2.5 py-1 text-[10px] font-bold text-[#267b64]">In progress</span></div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-[#83958b]"><span>Project momentum</span><span>Next step ahead</span></div>
                <div className="mt-2 h-2 rounded-full bg-[#e5eee7]"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#328f76] to-[#91cdb0]" /></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#e8efe9] p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eff6f0] text-[#3d8a70]"><Users size={14} /></span><p className="mt-2 text-xs font-bold text-[#3c594c]">Right people</p><p className="mt-1 text-[10px] leading-4 text-[#8b9b92]">Work with intent</p></div>
                <div className="rounded-xl border border-[#e8efe9] p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f1edfc] text-[#8c70b6]"><ShieldCheck size={14} /></span><p className="mt-2 text-xs font-bold text-[#3c594c]">Clear process</p><p className="mt-1 text-[10px] leading-4 text-[#8b9b92]">Less guesswork</p></div>
              </div>
            </div>

            <div className="f2n-tilt f2n-float-slow absolute bottom-[9%] right-[0%] z-20 w-[190px] rounded-2xl border border-white bg-white/95 p-4 shadow-[0_20px_50px_rgba(38,82,68,0.13)] backdrop-blur sm:right-[-1%] sm:w-[215px]">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#fff0d9] to-[#ffe7e1] text-[#b8793d]"><Search size={18} /></span><div><p className="text-xs font-bold text-[#345044]">Find your fit</p><p className="mt-1 text-[10px] text-[#8a9a92]">Skills meet opportunity</p></div></div>
              <div className="mt-4 flex flex-wrap gap-1.5"><span className="rounded-full bg-[#eff6f0] px-2.5 py-1 text-[10px] font-medium text-[#5f7e70]">Creative</span><span className="rounded-full bg-[#f0effb] px-2.5 py-1 text-[10px] font-medium text-[#7770a6]">Development</span><span className="rounded-full bg-[#fff2e5] px-2.5 py-1 text-[10px] font-medium text-[#a77a4d]">Strategy</span></div>
            </div>

            <div className="absolute bottom-[5%] left-[5%] z-10 hidden items-center gap-2 rounded-xl border border-white bg-white/85 px-3 py-2.5 text-xs font-semibold text-[#59776a] shadow-lg backdrop-blur sm:flex"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e5f5ec] text-[#27836a]"><Sparkles size={14} /></span> A little more flow, a lot less friction</div>
          </div>
        </div>
      </section>

      <section id="discover" className="border-y border-[#e7eee7] bg-white/75 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-[610px]"><p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#28856d]">Made for many kinds of great work</p><h2 className="font-display text-3xl font-medium tracking-[-0.05em] text-[#1b332d] sm:text-4xl">Whatever you do, find your people.</h2><p className="mt-3 max-w-[540px] text-sm leading-6 text-[#768980]">From a first brief to a long-term partnership, bring the right skills and ideas into the same room.</p></div>
            <Link to="/signup" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#197d68] transition hover:gap-3">Explore Five2Nine <ArrowRight size={16} /></Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, detail, Icon, shade }) => (
              <Link to="/signup" key={name} className="f2n-tilt group flex items-center gap-4 rounded-2xl border border-[#e5ece6] bg-white p-5 shadow-[0_4px_15px_rgba(36,68,53,0.025)] transition duration-300 hover:border-[#c8ded0] hover:shadow-[0_16px_36px_rgba(36,68,53,0.08)]">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${shade} transition duration-300 group-hover:rotate-[-4deg] group-hover:scale-105`}><Icon size={21} /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#2a493c]">{name}</span><span className="mt-1 block text-xs text-[#899890]">{detail}</span></span>
                <ChevronRight size={17} className="text-[#b4c2ba] transition duration-200 group-hover:translate-x-1 group-hover:text-[#25826a]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute right-[-120px] top-0 h-80 w-80 rounded-full bg-[#e8eafa]/60 blur-3xl" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[680px] text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#28856d]">Simple by design</p><h2 className="font-display text-3xl font-medium tracking-[-0.05em] text-[#1b332d] sm:text-4xl">From “what if” to “work done”.</h2><p className="mt-3 text-sm leading-6 text-[#768980]">A straightforward path that keeps the focus where it belongs: on doing good work together.</p></div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.number} className="f2n-tilt relative rounded-[24px] border border-white bg-white/85 p-6 shadow-[0_12px_36px_rgba(43,78,62,0.055)] transition duration-300 hover:shadow-[0_20px_48px_rgba(43,78,62,0.10)] sm:p-7">
                <div className="flex items-center justify-between"><span className="font-display text-3xl font-medium tracking-[-0.06em] text-[#a4cdb8]">{step.number}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef7f1] text-[#34876f]">{index === 0 ? <Search size={18} /> : index === 1 ? <Users size={18} /> : <Sparkles size={18} />}</span></div>
                <h3 className="mt-7 text-lg font-bold tracking-[-0.025em] text-[#2a493c]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#7b8e84]">{step.text}</p>
                {index < 2 && <div className="absolute -right-3 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-[#e2ece4] bg-white text-[#82ad99] shadow-sm md:grid"><ArrowRight size={14} /></div>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-five2nine" className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#e5f4eb] via-[#eef6f0] to-[#e9ecfb] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/35" />
          <div className="pointer-events-none absolute bottom-[-100px] right-[20%] h-64 w-64 rounded-full bg-white/40 blur-2xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-[680px]"><span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#3e7e68]"><Sparkles size={13} /> Your next project starts here</span><h2 className="font-display mt-5 text-3xl font-medium leading-tight tracking-[-0.055em] text-[#1b382f] sm:text-4xl lg:text-[2.8rem]">Make room for work you’re proud of.</h2><p className="mt-4 max-w-[590px] text-sm leading-7 text-[#658076]">Whether you’re building your independent career or growing a team, start with a better connection.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to={token ? "/dashboard" : "/signup"} className="group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#197d68] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(31,128,105,0.18)] transition hover:-translate-y-0.5 hover:bg-[#146b5a] hover:shadow-lg">{token ? "Open your workspace" : "Create your account"}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
              {!token && <Link to="/login" className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/90 bg-white/65 px-5 text-sm font-semibold text-[#41665a] transition hover:bg-white">I already have an account</Link>}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5ece5] bg-[#f0f4ef]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div><BrandMark compact /><p className="mt-2 text-xs text-[#819288]">Freelance. Hire. Negotiate. Work.</p></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#71867b]"><a href="#discover" className="transition hover:text-[#197d68]">Explore skills</a><a href="#how-it-works" className="transition hover:text-[#197d68]">How it works</a><Link to="/login" className="transition hover:text-[#197d68]">Log in</Link><Link to="/signup" className="transition hover:text-[#197d68]">Sign up</Link></div>
          <p className="text-xs text-[#91a097]">© {new Date().getFullYear()} Five2Nine</p>
        </div>
      </footer>
    </main>
  );
}
