export type SocialIconName =
  | "twitter"
  | "youtube"
  | "linkedin"
  | "github"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "reddit";

export type SiteSocial = {
  href: string;
  label: string;
  icon: SocialIconName;
};

export type ProjectStatus = "live" | "staging";
export type ProjectInvolvement = "gen-ai" | "human" | "both";

export type SiteProject = {
  title: string;
  /** Technologies used in the project (shown in order). */
  techStack: string[];
  status: ProjectStatus;
  involvement: ProjectInvolvement;
  githubUrl?: string;
  imageSrc?: string;
  url?: string;
  description?: string;
  /** Subtle gradient tint on placeholder artwork */
  accent?: string;
};

export type ProjectGroupId = "software-engineering" | "cybersecurity";

export type SiteProjectGroup = {
  id: ProjectGroupId;
  label: string;
  projects: SiteProject[];
};

export type SiteSkillGroup = {
  category: string;
  items: string[];
};

export type SiteInterest = {
  label: string;
};

/** Browser tab title (code only, not PocketBase). */
export const siteDisplayTitle = "MADE BY MGN";

export const site = {
  name: "Mojalefa Gideon Nkwana",
  role: "Software | Cybersecurity",
  quote: "Simplicity is the ultimate sophistication.",
  quoteAttribution: "Leonardo da Vinci",
  bio: "I craft calm, readable interfaces and ship thoughtful web experiences. Currently freelancing and exploring creative tooling.",
  initials: "MG",
  skillGroups: [
    {
      category: "Soft Skills",
      items: [
        "Problem-solving",
        "Effective Communication",
        "Collaboration and teamwork",
      ],
    },
    {
      category: "Languages",
      items: [
        "C",
        "C++",
        "Python",
        "JavaScript/TypeScript",
        "SQL",
        "Bash",
        "HTML/CSS",
      ],
    },
    {
      category: "Application Frontend/Backend",
      items: ["React", "Next.js", "Node.js", "Express"],
    },
    {
      category: "Data stores",
      items: ["MySQL", "PostgreSQL", "PocketBase", "Supabase", "Firebase"],
    },
    {
      category: "Tools",
      items: [
        "Git",
        "GitHub",
        "Docker",
        "Nmap",
        "OWASP ZAP",
        "Wireshark",
        "Cursor",
        "Claude",
      ],
    },
    {
      category: "Security",
      items: [
        "OWASP awareness",
        "Linux hardening basics",
        "Defensive lab practice",
      ],
    },
  ] satisfies SiteSkillGroup[],
  interests: [
    { label: "Building problem solving projects" },
    { label: "Health and fitness" },
    { label: "Algorithmic trading" },
  ] satisfies SiteInterest[],
  socials: [
    { href: "https://twitter.com", label: "X / Twitter", icon: "twitter" },
    { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
    { href: "https://linkedin.com", label: "LinkedIn", icon: "linkedin" },
    { href: "https://github.com", label: "GitHub", icon: "github" },
    { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
    { href: "https://tiktok.com", label: "TikTok", icon: "tiktok" },
    { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
    { href: "https://reddit.com", label: "Reddit", icon: "reddit" },
  ] satisfies SiteSocial[],
  projectGroups: [
    {
      id: "software-engineering",
      label: "SOFTWARE ENGINEERING",
      projects: [
        {
          title: "Northwind Studio",
          techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
          status: "live",
          involvement: "human",
          githubUrl: "#",
          description:
            "Brand and marketing site for a small product studio—typography-led layouts and a modular component system.",
          url: "#",
          accent: "#6366f1",
        },
        {
          title: "Ledgerbooks",
          techStack: ["React", "TypeScript", "TanStack Query", "Tailwind CSS", "Radix UI"],
          status: "live",
          involvement: "both",
          githubUrl: "#",
          description:
            "SaaS dashboard UI exploration focused on dense data, keyboard flows, and accessible charts.",
          url: "#",
          accent: "#0ea5e9",
        },
        {
          title: "Atlas Reader",
          techStack: ["TypeScript", "React", "Vite", "CSS"],
          status: "staging",
          involvement: "gen-ai",
          githubUrl: "#",
          description:
            "Minimal reading app marketing page with fluid type scales and a restrained monochrome palette.",
          url: "#",
          accent: "#22c55e",
        },
      ],
    },
    {
      id: "cybersecurity",
      label: "CYBERSECURITY",
      projects: [],
    },
  ] satisfies SiteProjectGroup[],
};
