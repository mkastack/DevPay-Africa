import { inngest } from "./client";
import { supabase } from "@/integrations/supabase/client";
import { sendJobAlertEmail } from "@/integrations/resend";
import { captureException } from "@/integrations/sentry";

// Background function: Match and notify developers when a new job is posted
export const notifyMatchingDevelopers = inngest.createFunction(
  { id: "notify-matching-developers", name: "Notify Developers on Matching Job Post" },
  { event: "job/posted" },
  async ({ event, step }) => {
    try {
      const { jobId, title, description, skills } = event.data;

      // Step 1: Query developers from developer_profiles
      const developers = await step.run("fetch-all-developers", async () => {
        const { data } = await supabase
          .from("developer_profiles")
          .select("user_id, skills, title, profile:profiles(full_name, email)");
        return data ?? [];
      });

      // Step 2: Filter matching developers based on skill sets or title keywords
      const matchingDevelopers = await step.run("match-developer-skills", async () => {
        const jobSkillsLower = (skills as string[]).map(s => s.toLowerCase());
        const jobTitleLower = title.toLowerCase();

        return developers.filter(dev => {
          // Match skills
          const devSkills = (dev.skills ?? []).map(s => s.toLowerCase());
          const skillMatch = devSkills.some(s => jobSkillsLower.includes(s));

          // Match title keywords
          const devTitle = (dev.title ?? "").toLowerCase();
          const titleKeywords = jobTitleLower.split(" ");
          const titleMatch = titleKeywords.some(word => word.length > 3 && devTitle.includes(word));

          return skillMatch || titleMatch;
        });
      });

      // Step 3: Send background notifications and trigger Resend email alerts
      const notifications = await step.run("dispatch-notifications", async () => {
        const results = [];
        for (const dev of matchingDevelopers) {
          try {
            // Write to Supabase system notifications
            const { error } = await supabase.from("notifications").insert({
              user_id: dev.user_id,
              type: "job_match",
              title: "New Job Match Alert! 🚀",
              message: `A new job matching your skill set was posted: "${title}". View details and submit a proposal!`,
              link: `/jobs/${jobId}`
            });

            // Dispatch styled HTML transactional email using Resend
            if (dev.profile?.email) {
              await sendJobAlertEmail(
                dev.profile.email,
                dev.profile.full_name || "Developer",
                title,
                jobId
              );
            }

            results.push({ devId: dev.user_id, status: error ? "failed" : "success" });
          } catch (e) {
            // Quietly report sub-tasks errors to Sentry without killing the loop
            captureException(e, {
              userId: dev.user_id,
              tags: { subtask: "email-dispatch", jobId }
            });
            results.push({ devId: dev.user_id, status: "error" });
          }
        }
        return results;
      });

      return {
        message: `Successfully processed background notifications for ${matchingDevelopers.length} developers.`,
        notifications
      };
    } catch (error) {
      // Capture critical step crash inside Sentry
      captureException(error, {
        tags: { workflow: "notifyMatchingDevelopers", jobId: event.data?.jobId }
      });
      throw error;
    }
  }
);
