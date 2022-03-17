import { basename } from "path";
import { CompletionItem, CompletionItemKind, MarkdownString } from "vscode";
import { iLangData } from "../interfaces/iLangData";

export const RAW_SUPPORT_TYPES = new Set(["string", "number", "boolean"]);

export function getLastActivePart(name: string, strip = 0) {
    let points = name.split('.');
    let total = 0;

    for(let i = 0, length = points.length; i < length; i++) {
        total += points[i].length;

        if(total >= strip) {
            return points.slice(i, length).join(".");
        }
    }

    return points[points.length - 1];
}

export function makeDocumentation(data: iLangData, strip = 0): MarkdownString {
    return new MarkdownString(
        "### Ключ " + (strip === 0 ? "" : "...") + data.key.substring(strip) + "\n" +
        "Ключ: **" + data.key + "**\n\n" +
        "Файл: **" + basename(data.file) + "**\n\n\n" +
        "```\n" + (
            RAW_SUPPORT_TYPES.has(typeof data.locale) ?
                data.locale :
                JSON.stringify(data.locale)
        ) + "```"
    , false);
}

export function convertToCompletion(data: iLangData, strip = 0): CompletionItem {
    const stripped = getLastActivePart(data.key, strip);
    const item = new CompletionItem({ label: stripped, description: basename(data.file) }, CompletionItemKind.Constant);

    item.insertText = stripped;
    item.documentation = makeDocumentation(data, strip);

    return item;
}
