import { CommandTree, Command, resolveHost } from "@clusterio/lib";
//import type { Control } from "@clusterio/ctl";
type Control = any;
import { BaseCtlPlugin } from "@clusterio/ctl";
import { ListScriptsRequest, RunScriptRequest } from "./messages";

const remoteScriptsCommands = new CommandTree({
	name: "remote-scripts", description: "Remote Scripts plugin commands",
});
remoteScriptsCommands.add(new Command({
	definition: ["host-list <host>", "List available scripts on host", (yargs) => {
		yargs.positional("host", { describe: "host to list scripts on", type: "string" });
	}],
	handler: async function(args: { host: string }, control: Control) {
		let hostId = await resolveHost(control, args.host);
		let commands = await control.sendTo({ hostId }, new ListScriptsRequest());
		console.log(commands.join("\n"));
	},
}));

remoteScriptsCommands.add(new Command({
	definition: ["host-run <host> <script> [args...]", "Run script on a host", (yargs) => {
		yargs.positional("host", { describe: "host to run on", type: "string" });
		yargs.positional("script", { describe: "script to run", type: "string" });
		yargs.positional("args", { describe: "arguments to pass to script", array: true, type: "string" });
	}],
	handler: async function(args: { _: any, host: string, script: string, args: string[] }, control: Control) {
		let hostId = await resolveHost(control, args.host);
		await control.setLogSubscriptions({ hostIds: [hostId] });
		const scriptArgs = args.args.concat(args._.slice(2));
		const result = await control.sendTo({ hostId }, new RunScriptRequest(args.script, scriptArgs));
		if (result.stdout) {
			process.stdout.write(result.stdout);
		}
		if (result.stderr) {
			process.stderr.write(result.stderr);
		}
		if (result.code !== undefined) {
			process.exitCode = result.code;
		}
	},
}));

export class CtlPlugin extends BaseCtlPlugin {
	async addCommands(rootCommand: CommandTree) {
		rootCommand.add(remoteScriptsCommands);
	}
}
