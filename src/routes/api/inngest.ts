import { createAPIFileRoute } from "@tanstack/react-start/api";
import { serve } from "inngest/h3";
import { inngest } from "../../inngest/client";
import {
  notifyMatchingDevelopers,
  sendWelcomeEmail,
  notifyPaymentReleased,
} from "../../inngest/functions";

const handler = serve({
  client: inngest,
  functions: [
    notifyMatchingDevelopers,
    sendWelcomeEmail,
    notifyPaymentReleased,
  ],
});

export const APIRoute = createAPIFileRoute("/api/inngest")({
  GET: handler,
  POST: handler,
  PUT: handler,
});
