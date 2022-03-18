import * as fs from "fs/promises";
import { join, isAbsolute } from "path";
import { workspace } from "vscode";
import { iLineData } from "./interfaces/iLineData";
import processors from "./processors";
import { getFileInfo, Namespace, putFileContents, syncNamespace } from "./store";

export const LANG_REGEXP = /(?<=Lang\.get\(['"]|Lang\.getDefault\(['"])([^'"]*)/g;
export const CONF_REGEXP = /(?<=Config\.get\(['"]|Config\.getDefault\(['"])([^'"]*)/g;

export function getPathsToNamespace(namespace: Namespace) {
    const configuration = workspace.getConfiguration('burmistr_react_components_helper');

    switch(namespace) {
        case "LANG_NAMESPACE": return configuration.fileLangsPaths;
        case "CONF_NAMESPACE": return configuration.fileConfigsPaths;
    }
}

export async function exists(path: string) {
    let e = false;

    try {
        e = await fs.stat(path) !== null;
    } catch (e) {
        e = false;
    }

    return e;
}

export function objectFlatten(input: any, stack: Array<any> = [], commonPrefix: string = '') {
    const entries: Array<[string, any]> = [];
    const from = Object.entries(input);

    stack.push(input);

    for(let entry of from) {
        const currentPrefix = (commonPrefix.length !== 0 ? commonPrefix + '.' : '') + entry[0];

        if(!stack.includes(entry[1])) {
            if(typeof entry[1] === 'object' && entry[1] !== null && entry[1] !== void 0) {
                from.push(
                    ...Object
                        .entries<any>(entry[1])
                    .map(
                        (arr: [string, any]) => {
                            arr[0] = currentPrefix + '.' + arr[0];
                            return arr;
                        }
                    ) as Array<[string, any]>
                );
            } else {
                entries.push([ currentPrefix, entry[1] ]);
            }
        }
    }

    return Object.fromEntries(entries);
}

export async function scanFiles(namespace: Namespace, flies: string[] = []) {
    const finalFiles = flies.length === 0 ? getPathsToNamespace(namespace) : flies;

    for(const processor of processors) {
        for(const file of finalFiles) {
            if(isAbsolute(file)) {
                if(await exists(file) && processor.canProcess(file)) {
                    const readed = await fs.readFile(file);
                    const contents = readed.toLocaleString();
                    const metadata = processor.process(contents, file);
                    
                    putFileContents(namespace, file, metadata, contents);
                    syncNamespace(namespace, file, metadata);
                }
            } else {
                for(const folder of workspace.workspaceFolders ?? []) {
                    const normalized = join(folder.uri.fsPath, file);

                    if(await exists(normalized) && processor.canProcess(normalized)) {
                        const readed = await fs.readFile(normalized);
                        const contents = readed.toLocaleString();
                        const metadata = processor.process(contents, normalized);

                        putFileContents(namespace, normalized, metadata, contents);
                        syncNamespace(namespace, normalized, metadata);
                    }
                }
            }
        }
    }
}

export function extractNotNull<T>(...items: T[]): T | null {
    return items.find(e => e !== null) ?? null;
}

export function extractPositionFromContents(file: string, position: number): iLineData {
    let line = 1;
    let last = 0;
    let current = 0;
    let source = getFileInfo(file).content;

    if(source !== null) {
        while((current = source.indexOf("\n", last + 1)) !== -1) {
            if(current > position) {
                return {
                    line: line,
                    rest: position - last
                };
            }

            line++;

            last = current;
        }
    }

    return {
        line: 1,
        rest: position
    };
}