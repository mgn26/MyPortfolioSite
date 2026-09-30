"use client";

import { AccordionItem } from "@/components/portfolio/accordion-item";
import { BioMarkdown } from "@/components/portfolio/bio-markdown";
import type { SiteContent } from "@/lib/pocketbase";

export function AboutContent({ site }: { site: SiteContent }) {
  const hasSkills = site.skillGroups.length > 0;
  const hasInterests = site.interests.length > 0;

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-heading">
        {site.name}.
      </h1>
      <p className={site.quote ? "mb-8 text-muted" : "mb-12 text-muted"}>
        {site.role}
      </p>
      {site.quote ? (
        <figure className="mb-8 border-l-2 border-border-subtle pl-4">
          <blockquote className="text-sm italic leading-relaxed text-muted">
            “{site.quote}”
          </blockquote>
          {site.quoteAttribution ? (
            <figcaption className="mt-1.5 text-xs text-muted">
              — {site.quoteAttribution}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {hasSkills ? (
        <AccordionItem id="about-skills" label="SKILLS" variant="nested">
          <dl className="space-y-5">
            {site.skillGroups.map((group) => (
              <div key={group.category}>
                <dt className="mb-1 text-base font-semibold tracking-tight text-heading">
                  {group.category}
                </dt>
                <dd className="text-base leading-relaxed text-muted">
                  {group.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </AccordionItem>
      ) : null}

      {hasInterests ? (
        <AccordionItem id="about-interests" label="INTERESTS" variant="nested">
          <ul className="list-disc space-y-1 pl-5 text-base leading-relaxed text-muted">
            {site.interests.map((interest) => (
              <li key={interest.label} className="pl-1">
                {interest.label}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ) : null}

      <AccordionItem id="about-story" label="MY STORY" variant="nested">
        <BioMarkdown content={site.bio} />
      </AccordionItem>
    </div>
  );
}
