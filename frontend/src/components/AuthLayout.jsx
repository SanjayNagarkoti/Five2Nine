export default function AuthLayout({
  children,
  eyebrow = "Five2Nine",
  title,
  subtitle,
  sideTitle = "Work on your terms.",
  sideDescription = "Connect with the right people, negotiate clearly, and get the work done.",
}) {
  return (
    <div className="min-h-screen bg-[#E9E5DA] flex justify-center">
      <div className="w-full max-w-[1360px] min-h-screen flex bg-[#FAF8F3] shadow-[0_0_80px_rgba(27,33,64,0.12)]">

        {/* Left */}
        <div className="hidden lg:flex lg:w-[44%] bg-[#1B2140] text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-[#1F8A70] flex items-center justify-center">
                <span className="text-[#1B2140] font-bold text-sm">
                  F2N
                </span>
              </div>

              <span
                className="text-lg"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Five2Nine
              </span>
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-[#1F8A70] uppercase tracking-[0.2em] text-xs mb-4">
              {eyebrow}
            </p>

            <h1
              className="text-5xl leading-tight"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
              }}
            >
              {sideTitle}
            </h1>

            <p className="text-[#B8BCD4] text-sm leading-7 mt-6">
              {sideDescription}
            </p>

            <div className="h-px bg-[#333A5C] mt-10" />
          </div>

          <p className="text-[#7C81A6] text-xs">
            Five2Nine — Freelance. Hire. Negotiate. Work.
          </p>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[430px]">
            <div className="lg:hidden flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-sm bg-[#1F8A70] flex items-center justify-center">
                <span className="text-[#1B2140] font-bold text-sm">
                  F2N
                </span>
              </div>

              <span
                className="text-lg text-[#1B2140]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Five2Nine
              </span>
            </div>

            <h2
              className="text-[1.9rem] text-[#1B2140]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
              }}
            >
              {title}
            </h2>

            {subtitle && (
              <p className="text-[#8288A8] text-sm mt-2 mb-8">
                {subtitle}
              </p>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}