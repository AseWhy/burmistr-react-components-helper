import * as YAML from "yaml";
import { objectFlatten } from "../../support";
import { iMetadata } from "../../interfaces/iMetadata";
import * as fs from "fs/promises";
import { Pair, Scalar, YAMLMap } from "yaml/types";
import { findInYamlMap, putInYamlMap } from "./support";

export class YamlMetadata implements iMetadata {
    private _document: YAML.Document;
    private _path: string;

    constructor(path: string, document: YAML.Document) {
        this._document = document;
        this._path = path;
    }

    public toFlatData(): Record<string, any> {
        return objectFlatten(this._document.toJSON());
    }

    public toGetPathPos(path: string): number {
        let points = path.split(".");
        let flow = this._document.contents.items ?? [];

        for (let i = 0, length = points.length; i < length; i++) {
            const current = points[i];

            if (flow === null || flow === void 0) {
                return -1;
            }

            for (const entry of flow) {
                const key = entry.key;

                if (key?.value === current) {
                    if (i + 1 === length) {
                        return key.range?.[0];
                    } else {
                        const value = entry.value;

                        if (value.type !== "MAP") {
                            return -1;
                        }

                        flow = value.items;
                    }

                    continue;
                }
            }
        }

        return -1;
    }

    public update(path: string, value: any): Promise<void> {
        let points = path.split(".");
        let buffer = this._document.contents ?? new YAMLMap();

        for (let i = 0, length = points.length; i < length; i++) {
            const current = points[i];

            if(i === length - 1) {
                putInYamlMap(buffer, current, new Scalar(value));
            } else {
                buffer = findInYamlMap(buffer, current)?.value;
            }

            if(buffer === null || buffer === void 0) {
                const map = new YAMLMap();

                putInYamlMap(buffer, current, map);

                buffer = map;
            }
        }

        return fs.writeFile(this._path, this._document.toString());
    }
}
