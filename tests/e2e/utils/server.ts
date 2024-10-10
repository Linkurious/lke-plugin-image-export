import { spawn } from "child_process";

export type ServerProcess = ReturnType<typeof spawn>;

export function startMockServer() {
  const server = spawn("node", ["scripts/mock-server.mjs"]);
  return new Promise<{ server: ServerProcess }>((resolve, reject) => {
    server.stdout.on("data", (data) => {
      const message = data.toString();
      const matches = message.match(/JSON Server is running/);
      if (!matches || !matches.length) return;
      resolve({ server });
    });
    server.stderr.on("data", (data) => {
      console.error("Mock server error", data.error);
      reject({ server, error: data.toString() });
    });

    // kill on process exit
    process.on("exit", () => server.kill());
  });
}

export function startServer(port: number | string) {
  const server = spawn("npm", [
    "run",
    "serve:web",
    "--",
    "-p",
    port.toString(),
  ]);
  return new Promise<{ server: ServerProcess; port: string }>(
    (resolve, reject) => {
      server.stdout.on("data", (data) => {
        const message = data.toString();
        const matches = message.match(/http:\/\/localhost:(\d+)/);
        if (!matches || matches.length < 2) return;
        console.log(" - web server is running on port", matches[1]);
        resolve({ server, port: matches[1] });
      });
      server.stderr.on("data", (data) => {
        if (!data.toString().match(/Checking for updates failed/))
          reject({ server, error: data.toString() });
      });
    }
  );
}
