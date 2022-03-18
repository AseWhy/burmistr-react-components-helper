import { Namespace } from "../store";
import { iMetadata } from "./iMetadata";

export interface iFileInfo {
    namespace: Namespace;
    content: string;
    path: string;
    metadata: iMetadata;
}