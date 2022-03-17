import {
    CompletionItemProvider as vsCompletionItemProvider,
    TextDocument,
    Position,
    ProviderResult,
    CompletionItemKind,
    CompletionItem,
    CancellationToken,
    CompletionContext,
    CompletionList,
    Range
} from "vscode";

import { getCompletion, Namespace } from "../store";
import { CONF_REGEXP, extractNotNull, LANG_REGEXP } from '../support';

export default class CompletionItemProvider implements vsCompletionItemProvider {    
    provideInternals(namespace: Namespace, linkRange: undefined | Range, document: TextDocument) {
        if (!linkRange) {
            return null;
        }
        
        const text = document.getText(linkRange);
        const completions = getCompletion(namespace, text);

        return new CompletionList(completions, false);
    }
    
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        return extractNotNull(
            this.provideInternals("LANG_NAMESPACE", document.getWordRangeAtPosition(position, LANG_REGEXP), document),
            this.provideInternals("CONF_NAMESPACE", document.getWordRangeAtPosition(position, CONF_REGEXP), document)
        );
    }
}