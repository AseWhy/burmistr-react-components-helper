import { CompletionItem, MarkdownString } from "vscode";
import { iLangData } from "./interfaces/iLangData";
import * as namespaces from "./members/namespace";
import { iMetadata } from "./interfaces/iMetadata";
import { convertToCompletion, makeDocumentation } from "./utils/langData";
import { iFileInfo } from "./interfaces/iFileInfo";

export type Namespace = keyof typeof namespaces;

export const store = {
    contents: {

    } as Record<string, iFileInfo>,

    completion: {
        [namespaces.LANG_NAMESPACE]: [
            
        ] as iLangData[],
        [namespaces.CONF_NAMESPACE]: [
            
        ] as iLangData[]
    }
};

export function getCompletion(namespace: Namespace, pattern: string, strip = pattern.length): CompletionItem[] {
    return store.completion[namespace]
        ?.filter(e => e.key.startsWith(pattern))
    .map(e => convertToCompletion(e, strip)) ?? [];
}

export function getDocumentationSingle(namespace: Namespace, name: string): null | MarkdownString {
    const found = store.completion[namespace]?.find(e => e.key === name);
    
    if(found !== void 0 && found !== null) {
        return makeDocumentation(found, 0);
    }

    return null;
}

export function getSourceData(namespace: Namespace, name: string): null | iLangData {
    const found = store.completion[namespace]?.find(e => e.key === name);
    
    if(found !== void 0 && found !== null) {
        return found;
    }

    return null;
}

export function putFileContents(namespace: Namespace, path: string, metadata: iMetadata, content: string) {
    store.contents[path] = {
        namespace,
        path,
        metadata,
        content
    };
}

export function getFileInfo(path: string): iFileInfo {
    return store.contents[path];
}

export function getFilesByNamespace(namespace: Namespace): iFileInfo[] {
    return Object.values(store.contents).filter(e => e.namespace === namespace);
}

export function flushNamespace(namespace: Namespace, file: string) {
    let exists = store.completion[namespace];
    let i = exists.length;

    while (i--) {
        if (exists[i].file === file) {
            exists.splice(i, 1);
        }
    }
}

export function syncNamespace(namespace: Namespace, file: string, data: iMetadata) {
    const flatData = data.toFlatData();
    const completions = Object.keys(flatData);

    flushNamespace(namespace, file);

    store.completion[namespace] = completions.map(completion => {
        return {
            key: completion,
            file: file,
            metadata: data,
            locale: flatData[completion]
        };
    });
}