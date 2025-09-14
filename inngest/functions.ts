import { useWebcontainer } from "@/hooks/useWebcontainer";
import { inngest } from "./client";
import { WebContainer } from "@webcontainer/api";

// export const serverSetup = inngest.createFunction(
//   { id: "server-setup" },
//   { event: "app/server-setup" },
//   async ({ event, step }) => {

    
    
//     await step.run("installation triggered", async () =>
//       webContainer.spawn("npm", ["install"])
//     );

//     await step.run("development server started", async () => {
//       webContainer.spawn("npm", ["run", "dev"]);
//     });

//     let url_res = "";

//      webContainer.on("server-ready", async (port, url) => {
//        console.log("Server ready:", url, port);
//        url_res=url;
//      });

//     return { url : url_res };
//   }
// );

