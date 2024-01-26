import { checkFilename, LineSplitter, RequestError } from "@clusterio/lib";
import child_process from "child_process";
import path from "path";
import * as fs from "fs-extra";
import { BaseHostPlugin } from "@clusterio/host";
import { ListScriptsRequest, RunScriptRequest } from "./messages";

export class HostPlugin extends BaseHostPlugin {
	async init() {
		this.host.handle(ListScriptsRequest, this.handleListScriptsRequest.bind(this));
		this.host.handle(RunScriptRequest, this.handleRunScriptRequest.bind(this));
	}

	async handleListScriptsRequest() {
		if (!await fs.pathExists("scripts")) {
			throw new RequestError(`scripts directory is missing on this host`);
		}
		return await fs.readdir("scripts")
	}

	async execFile(script: string, args: string[]) {
		this.logger.info(`executing ${script} ${args.join(" ")}`);
		return new Promise<{ stdout: string, stderr: string, code?: number }>((resolve, reject) => {
			let child = child_process.execFile(
				path.resolve("scripts", script),
				args,
				{
					cwd: "scripts",
					shell: false,
				},
				(err, stdout, stderr) => {
					if (err && typeof err.code !== "number" && err instanceof Error) {
						reject(err);
					}
					const code = typeof err?.code === "number" ? err.code : undefined;
					resolve({ stdout, stderr, code });
				}
			);
			let stdout = new LineSplitter({ readableObjectMode: true });
			stdout.on("data", line => { this.logger.verbose(`${script}: ${line.toString()}`); });
			child.stdout!.pipe(stdout);
			let stderr = new LineSplitter({ readableObjectMode: true });
			stderr.on("data", line => { this.logger.verbose(`${script} err: ${line.toString()}`); });
			child.stderr!.pipe(stderr);
		});
	}

	async handleRunScriptRequest(request: RunScriptRequest) {
		const script = request.scriptName;
		try {
			checkFilename(script);
		} catch (err: any) {
			throw new RequestError(`Script name ${err.message}`);
		}
		if (!await fs.pathExists(path.join("scripts", script))) {
			throw new RequestError(`Script ${script} does not exist on this host`);
		}
		try {
			return await this.execFile(script, request.args);
		} catch (err: any) {
			// Workaround due to err.code number not being allowed.
			if (typeof err.code === "number") {
				throw new RequestError(`Script ${script} retuned status code ${err.code}`);
			}
			if (err.code === "EACCES") {
				throw new RequestError(`Permission denied executing ${script}`);
			}
			throw err;
		}
	}
}
