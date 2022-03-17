import {
    HoverProvider as vsHoverProvider,
    TextDocument,
    Position,
    ProviderResult,
    CancellationToken,
    Hover,
    Range
} from "vscode";

import { getDocumentationSingle, Namespace } from "../store";
import { CONF_REGEXP, extractNotNull, LANG_REGEXP } from '../support';

export default class HoverProvider implements vsHoverProvider {
    provideInternals(namespace: Namespace, linkRange: undefined | Range, document: TextDocument) {
        if (!linkRange) {
            return null;
        }
        
        const text = document.getText(linkRange);
        const completion = getDocumentationSingle(namespace, text);

        if(completion !== null) {
            return new Hover(completion, linkRange);
        } else {
            return null;
        }
    }

    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
        return extractNotNull(
            this.provideInternals("LANG_NAMESPACE", document.getWordRangeAtPosition(position, LANG_REGEXP), document),
            this.provideInternals("CONF_NAMESPACE", document.getWordRangeAtPosition(position, CONF_REGEXP), document)
        );
    }
}