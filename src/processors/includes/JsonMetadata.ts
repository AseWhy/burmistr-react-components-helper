import * as YAML from "yaml";
import { objectFlatten } from "../../support";
import { iMetadata } from "../../interfaces/iMetadata";
import * as fs from "fs/promises";

export class JsonMetadata implements iMetadata {
    private _document: any;
    private _path: string;

    constructor(path: string, document: any) {
        this._document = document;
        this._path = path;
    }

    public update(path: string, value: any): Promise<void> {
        let points = path.split(".");
        let data = this._document;
        let buffer = data;

        if(typeof data !== 'object') {
            data = {};
        }

        for (let i = 0, length = points.length; i < length; i++) {
            const current = points[i];

            if(i === length - 1) {
                buffer[current] = value;
            } else {
                buffer = buffer[current];
            }

            if(buffer === null || buffer === void 0) {
                buffer = data[current] = {};
            }
        }

        return fs.writeFile(this._path, YAML.stringify(buffer));
    }

    public toFlatData(): Record<string, any> {
        return objectFlatten(this._document);
    }

    public toGetPathPos(path: string): number {
        return -1;
    }
}
