import { basename } from "path";
import { commands, ExtensionContext, QuickPickOptions, window } from "vscode";
import { Namespace, getFilesByNamespace } from "../store";
import { scanFiles } from "../support";

export const INPUT_PROPS = {
    title: "Значение свойства"
};

export const QUICK_PICK_PROPS = {
    title: "Файл свойств"
} as QuickPickOptions;

export function registerScopedAddEntryCommandHandler(namespace: Namespace, context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand("burmistr.add." + namespace, async ({ property }: { property: string }) => {
        const files = getFilesByNamespace(namespace);
        const file = await window.showQuickPick(files.map(e => basename(e.path)), QUICK_PICK_PROPS);
        
        if(file === null || file === void 0) {
            return;
        }

        const selected = files.find(current => current.path.endsWith(file));
        
        if(selected === null || selected === void 0) {
            return;
        }

        const value = await window.showInputBox(INPUT_PROPS);

        await selected.metadata.update(property, value);
        await scanFiles(namespace, [ selected.path ]);
    }));
}

export function registerAddEntryCommandHandler(context: ExtensionContext) {
    registerScopedAddEntryCommandHandler("CONF_NAMESPACE", context);
    registerScopedAddEntryCommandHandler("LANG_NAMESPACE", context);
}