import { render } from "react-email";
import { describe, expect, it } from "vitest";

import { JobAlertEmail } from "./job-alert";
import { ReminderEmail } from "./reminder";
import { WelcomeEmail } from "./welcome";

const footer = {
  reason: "Why you got this",
  unsubscribeLabel: "Unsubscribe",
  unsubscribeUrl: "https://example.com/unsubscribe?token=abc",
  settingsLabel: "Email settings",
  settingsUrl: "https://example.com/settings",
};

describe("email templates", () => {
  it("renders the welcome email with its links", async () => {
    const html = await render(
      <WelcomeEmail
        lang="en"
        brand="Brand"
        preview="Preview"
        heading="Welcome aboard"
        body="Body"
        tip="Tip"
        cta="Open my dashboard"
        dashboardUrl="https://example.com/dashboard"
        footer={footer}
      />,
    );
    expect(html).toContain('lang="en"');
    expect(html).toContain("Welcome aboard");
    expect(html).toContain('href="https://example.com/dashboard"');
    expect(html).toContain('href="https://example.com/unsubscribe?token=abc"');
    expect(html).toContain('href="https://example.com/settings"');
  });

  it("renders one line per due card, in plain text too", async () => {
    const element = (
      <ReminderEmail
        lang="en"
        brand="Brand"
        preview="Preview"
        heading="Time to follow up"
        intro="These are due"
        cards={[
          { title: "Litigation Associate", detail: "Applied · Mercor" },
          { title: "Acme <direct>", detail: "Saved" },
        ]}
        cta="Open my dashboard"
        dashboardUrl="https://example.com/dashboard"
        footer={footer}
      />
    );
    const html = await render(element);
    expect(html).toContain("Litigation Associate");
    expect(html).toContain("Acme &lt;direct&gt;");
    const text = await render(element, { plainText: true });
    expect(text).toContain("Applied · Mercor");
    expect(text).toContain("Unsubscribe");
  });

  it("renders each search with its jobs and a see-all link", async () => {
    const html = await render(
      <JobAlertEmail
        lang="en"
        brand="Brand"
        preview="Preview"
        heading="3 new jobs for you"
        intro="Intro"
        searches={[
          {
            description: "Law · Spanish",
            countLabel: "12 new jobs",
            jobs: [
              {
                title: "Contract Lawyer",
                detail: "Mercor · $40–50 / hr",
                url: "https://example.com/jobs/1",
              },
            ],
            seeAll: {
              label: "See all 12 new jobs",
              url: "https://example.com/?domain=law",
            },
          },
          {
            description: "All new jobs",
            countLabel: "1 new job",
            jobs: [
              {
                title: "Tutor",
                detail: "micro1",
                url: "https://example.com/jobs/2",
              },
            ],
            seeAll: null,
          },
        ]}
        footer={footer}
      />,
    );
    expect(html).toContain("Law · Spanish");
    expect(html).toContain('href="https://example.com/jobs/1"');
    expect(html).toContain("See all 12 new jobs");
    expect(html.match(/See all/g)).toHaveLength(1);
  });
});
