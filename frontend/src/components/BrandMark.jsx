
import { Link } from "react-router-dom";

export default function BrandMark({
  compact = false,
  light = false,
}) {
  const logoSrc = light
    ? "/brand/five2nine-logo-compact-dark.svg"
    : "/brand/five2nine-logo-compact.svg";

  return (
    <Link
      to="/"
      aria-label="Five2Nine home"
      className="group inline-flex w-fit items-center rounded-xl
        focus-visible:outline-none focus-visible:ring-4
        focus-visible:ring-emerald-200"
    >
      <img
        src={logoSrc}
        alt="Five2Nine"
        draggable="false"
        className={`${
          compact ? "h-8" : "h-10"
        } w-auto select-none object-contain
          transition-transform duration-300
          group-hover:scale-[1.03]`}
      />
    </Link>
  );
}
