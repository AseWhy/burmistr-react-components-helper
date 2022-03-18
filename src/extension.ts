import { basename, extname } from "path";
import { languages, workspace, ExtensionContext, TextDocument, ConfigurationChangeEvent } from 'vscode';
import { registerAddEntryCommandHandler } from "./commands";
import CompletionItemProvider from './providers/CompletionItemProvider';
import DocumentLinkProvider from "./providers/DocumentLinkProvider";
import HoverProvider from "./providers/HoverProvider";
import { getFileInfo } from "./store";
import { scanFiles } from "./support";

const WATCHIN_EXTS = new Set([
    ".yml",
    ".yaml",
    ".json"
]);

export function activate(context: ExtensionContext) {
    context.subscriptions.push(languages.registerCompletionItemProvider(['typescript', 'typescriptreact'], new CompletionItemProvider()));
    context.subscriptions.push(languages.registerHoverProvider(['typescript', 'typescriptreact'], new HoverProvider()));
    context.subscriptions.push(languages.registerDocumentLinkProvider(['typescript', 'typescriptreact'], new DocumentLinkProvider()));

    registerAddEntryCommandHandler(context);

    context.subscriptions.push(
        workspace.onDidSaveTextDocument((document: TextDocument) => {
            if (document.uri.scheme === "file" && WATCHIN_EXTS.has(extname(document.fileName))) {
                const info = getFileInfo(document.uri.path);

                if(info !== null) {
                    switch(info.namespace) {
                        case "LANG_NAMESPACE": scanFiles("LANG_NAMESPACE", [ document.uri.path ]); break;
                        case "CONF_NAMESPACE": scanFiles("CONF_NAMESPACE", [ document.uri.path ]); break;
                    }
                }
            }
        }),

        workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
            scanFiles("LANG_NAMESPACE");
            scanFiles("CONF_NAMESPACE");
        })
    );

	scanFiles("LANG_NAMESPACE");
    scanFiles("CONF_NAMESPACE");
}

// this method is called when your extension is deactivated
export function deactivate() {}
