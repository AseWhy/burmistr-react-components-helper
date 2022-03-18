import { BaseProcessor } from "./BaseProcessor";
import * as YAML from "yaml";
import { iMetadata } from "../interfaces/iMetadata";
import { YamlMetadata } from "./includes/YamlMetadata";
import { JsonMetadata } from "./includes/JsonMetadata";

export default class RawDataProcessor extends BaseProcessor {
    canProcess(path: string): boolean {
        return path.endsWith(".yaml") || path.endsWith(".yml") || path.endsWith(".json");
    }

    process(source: string, path: string): iMetadata {
        if(path.endsWith(".yml") || path.endsWith(".yaml")) {
            return new YamlMetadata(path, YAML.parseDocument(source));
        } else {
            return new JsonMetadata(path, JSON.parse(source));
        }
    }
}