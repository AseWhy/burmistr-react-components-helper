import {
    DocumentLinkProvider as vsDocumentLinkProvider,
    TextDocument,
    Position,
    ProviderResult,
    CancellationToken,
    DocumentLink,
    Range,
    Uri,
    TextLine
} from "vscode";
import { iLangData } from "../interfaces/iLangData";

import { getSourceData, Namespace } from "../store";
import { CONF_REGEXP, extractPositionFromContents, LANG_REGEXP } from '../support';

export class ExtendedDocumentLink extends DocumentLink {
    public data: iLangData;

    constructor(data: iLangData, range: Range) {
        super(range);

        this.data = data;
    }
}

export default class DocumentLinkProvider implements vsDocumentLinkProvider<ExtendedDocumentLink> {
    provideInternal(namespace: Namespace, matches: RegExpMatchArray | null, line: TextLine, links: Array<DocumentLink>) {
        if (matches !== null) {
            for (let propertyPath of matches) {
                let data = getSourceData(namespace, propertyPath);
                let start = new Position(line.lineNumber, line.text.indexOf(propertyPath));
                let end = start.translate(0, propertyPath.length);

                if (data !== null) {
                    links.push(new ExtendedDocumentLink(data, new Range(start, end)));
                } else {
                    links.push(new DocumentLink(new Range(start, end), Uri.parse("command:burmistr.add." + namespace + "?" + encodeURIComponent(JSON.stringify({
                        property: propertyPath
                    })))));
                }
            }
        }
    }

    resolveDocumentLink(link: ExtendedDocumentLink, token: CancellationToken): ProviderResult<ExtendedDocumentLink> {
        const data = link.data;
        const metadata = data.metadata;
        const position = metadata.toGetPathPos(data.key);
        const positions = extractPositionFromContents(data.file, position);
        const uri = Uri.parse("vscode://file/" + data.file + ":" + positions.line + ":" + positions.rest);

        link.target = uri;

        return link;
    }

    provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<ExtendedDocumentLink[]> {
        let links: ExtendedDocumentLink[] = [];
        let lineNumber = 0;

        while (lineNumber < document.lineCount) {
            let line = document.lineAt(lineNumber);

            this.provideInternal("LANG_NAMESPACE", line.text.match(LANG_REGEXP), line, links);
            this.provideInternal("CONF_NAMESPACE", line.text.match(CONF_REGEXP), line, links);

            lineNumber++;
        }

        return links;
    }
}