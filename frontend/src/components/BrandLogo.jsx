/** Shared Five2Nine logo for navbar, auth pages, and footers. */
export default function BrandLogo({
  variant = "light", // "light" on cream/white, "dark" on forest backgrounds
  compact = true, // omit tagline for navbar/auth headers
  iconOnly = false, // just the square F2N mark
  className = "h-10 w-auto",
}) {
  let asset = "/brand/five2nine-logo.svg";

  if (iconOnly) {
    asset = "/brand/five2nine-mark.svg";
  } else if (compact) {
    asset = variant === "dark"
      ? "/brand/five2nine-logo-compact-dark.svg"
      : "/brand/five2nine-logo-compact.svg";
  } else if (variant === "dark") {
    asset = "/brand/five2nine-logo-dark.svg";
  }

  return (
    <img
      src={asset}
      alt="Five2Nine"
      className={className}
      draggable="false"
    />
  );
}
