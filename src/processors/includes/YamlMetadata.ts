import * as YAML from "yaml";
import { objectFlatten } from "../../support";
import { iMetadata } from "../../interfaces/iMetadata";


export class YamlMetadata implements iMetadata {
    private _document: YAML.Document;

    constructor(document: YAML.Document) {
        this._document = document;
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
}
