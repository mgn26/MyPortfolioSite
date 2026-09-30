import { ContactBlock } from "@/components/portfolio/contact-block";
import { InProgressMark } from "@/components/portfolio/in-progress-mark";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { AccordionItem } from "@/components/portfolio/accordion-item";
import { AccordionStack } from "@/components/portfolio/accordion-stack";
import { AboutContent } from "@/components/portfolio/about-content";
import { ProjectsContent } from "@/components/portfolio/projects-content";
import { TopHeader } from "@/components/portfolio/top-header";
import { getSiteContent } from "@/lib/pocketbase";

/** Always read latest PocketBase content (no stale CMS cache). */
export const dynamic = "force-dynamic";

export default async function Home() {
  const site = await getSiteContent();

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col bg-page">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-x-visible px-4 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-4">
        <TopHeader site={site} />
        <div className="mt-6 border-t border-border-subtle" />

        <AccordionStack className="space-y-2 py-8">
          <AccordionItem id="about" label="ABOUT">
            <AboutContent site={site} />
          </AccordionItem>

          <AccordionItem
            id="projects"
            label="PROJECTS"
            contentReveal="none"
            allowDescendantBleed
          >
            <ProjectsContent projectGroups={site.projectGroups} />
          </AccordionItem>

          <AccordionItem id="contact" label="CONTACT">
            <ContactBlock
              contactEmail={site.contactEmail}
              contactWhatsapp={site.contactWhatsapp}
              socials={site.socials}
            />
          </AccordionItem>
        </AccordionStack>
      </main>

      <SiteFooter />
      <InProgressMark />
    </div>
  );
}
