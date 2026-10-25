import { ArrowUpRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import BrandMark from "./BrandMark";

const highlights = ["A clearer way to collaborate", "Work built around your goals", "Your next step starts here"];

export default function AuthLayout({
  children,
  eyebrow = "WELCOME TO FIVE2NINE",
  headline = <>Make good work<br />happen here.</>,
  description = "A thoughtful space for independent talent and the people who need it.",
}) {
  return (
    <main className="f2n-auth-bg flex min-h-screen items-center justify-center px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <section className="grid w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_28px_100px_rgba(30,65,55,0.12)] backdrop-blur-xl lg:min-h-[720px] lg:grid-cols-[0.93fr_1.07fr]">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#e9f6f0] via-[#f0f7f1] to-[#edf0fb] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-[#b9e3d3]/55 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-[-50px] h-80 w-80 rounded-full bg-[#d9def8]/70 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.26] [background-image:radial-gradient(#8eaaa1_0.8px,transparent_0.8px)] [background-size:20px_20px]" />

          <div className="relative z-10">
            <BrandMark />
          </div>

          <div className="relative z-10 my-10 max-w-[460px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-[11px] font-bold tracking-[0.14em] text-[#357563] shadow-sm">
              <Sparkles size={14} /> {eyebrow}
            </div>
            <h1 className="font-display text-[clamp(2.65rem,4vw,4.15rem)] font-medium leading-[1.04] tracking-[-0.055em] text-[#18332d]">
              {headline}
            </h1>
            <p className="mt-5 max-w-[390px] text-base leading-7 text-[#627872]">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium text-[#45645b]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/85 text-[#16806a] shadow-sm ring-1 ring-[#d7e8df]">
                    <Check size={13} strokeWidth={2.7} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="f2n-tilt relative rounded-2xl border border-white/90 bg-white/75 p-4 shadow-[0_18px_44px_rgba(39,89,72,0.10)] backdrop-blur-md transition duration-500">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#d5f0e5] to-[#e9e8fa] text-[#297d69]">
                  <ShieldCheck size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1e3c34]">Your work, with more clarity</p>
                  <p className="mt-1 text-xs text-[#71847d]">Thoughtful tools. Better collaboration.</p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf8f2] text-[#247e68]">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e7eee9]">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#2a947a] to-[#9acdb5]" />
              </div>
            </div>
            <p className="mt-5 text-xs text-[#81958d]">Freelance. Hire. Negotiate. Work.</p>
          </div>
        </aside>

        <div className="flex min-w-0 items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-[440px]">
            <div className="mb-9 lg:hidden">
              <BrandMark compact />
            </div>
            {children}
            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#87948e]">
              <ShieldCheck size={13} /> A better experience starts with a secure account
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
