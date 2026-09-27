import type { IconType } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

type Social = {
  name: string;
  href: string;
  icon: IconType;
};

const SOCIALS: Social[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/anmol8835", icon: FaLinkedin },
  { name: "X", href: "https://x.com/anmol_053", icon: FaXTwitter },
  { name: "Email", href: "mailto:anmolyadav8033@gmail.com", icon: FaEnvelope },
  { name: "GitHub", href: "https://github.com/Anmol8835", icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="mt-12 flex justify-center px-4 pb-8">
      <div className="flex items-center gap-4 rounded-full border border-white/50 bg-white/35 px-5 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md md:px-6">
        <p className="shrink-0 whitespace-nowrap text-[13px] tabular-nums text-neutral-700">
          © {new Date().getFullYear()} Anmol
        </p>
        <span className="h-4 w-px bg-neutral-400/70" />
        <div className="flex items-center gap-1">
          {SOCIALS.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              aria-label={name}
              {...(href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition duration-150 hover:text-neutral-950 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 motion-reduce:transition-none"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
