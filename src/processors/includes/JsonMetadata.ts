import * as YAML from "yaml";
import { objectFlatten } from "../../support";
import { iMetadata } from "../../interfaces/iMetadata";


export class JsonMetadata implements iMetadata {
    private _document: any;

    constructor(document: any) {
        this._document = document;
    }

    public toFlatData(): Record<string, any> {
        return objectFlatten(this._document);
    }

    public toGetPathPos(path: string): number {
        return -1;
    }
}
