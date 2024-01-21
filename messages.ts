import { jsonArray, plainJson, JsonString } from "@clusterio/lib";
import { Type, Static } from "@sinclair/typebox";

export class ListScriptsRequest {
	declare ["constructor"]: typeof ListScriptsRequest;
	static type = "request" as const;
	static src = ["control"] as const;
	static dst = "host" as const;
	static plugin = "remote_scripts" as const;
	static permission = "remote_scripts.host.script.list";
	static Response = jsonArray(JsonString)
}

export class RunScriptRequest {
	declare ["constructor"]: typeof RunScriptRequest;
	static type = "request" as const;
	static src = ["control"] as const;
	static dst = "host" as const;
	static plugin = "remote_scripts" as const;
	static permission = "remote_scripts.host.script.run";

	constructor(
		public scriptName: string,
		public args: string[],
	) {
	}

	static jsonSchema = Type.Object({
		"scriptName": Type.String(),
		"args": Type.Array(Type.String({ maxLength: 1000 }), { maxItems: 10 }),
	});

	static fromJSON(json: Static<typeof RunScriptRequest.jsonSchema>) {
		return new this(json.scriptName, json.args);
	}

	static Response = plainJson(Type.Object({
		stdout: Type.String(),
		stderr: Type.String(),
		code: Type.Optional(Type.Number()),
	}));
}
