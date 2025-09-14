import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { serverSetup, serverReady } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    serverSetup,
    serverReady
  ],
});
