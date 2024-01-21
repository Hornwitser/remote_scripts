import * as lib from "@clusterio/lib";

import { ListScriptsRequest, RunScriptRequest } from "./messages";

lib.definePermission({
	name: "remote_scripts.host.script.list",
	title: "List host scripts",
	description: "List scripts that can be executed on the host.",
});
lib.definePermission({
	name: "remote_scripts.host.script.run",
	title: "Run host scripts",
	description: "Run scripts on hosts.",
});

export const plugin: lib.PluginDeclaration = {
	name: "remote_scripts",
	title: "Remote Scripts",
	description: "Run scripts remotely on hosts.",
	hostEntrypoint: "dist/plugin/host",
	ctlEntrypoint: "dist/plugin/ctl",

	messages: [
		ListScriptsRequest,
		RunScriptRequest,
	],
};
