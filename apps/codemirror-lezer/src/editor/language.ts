import { LRLanguage, LanguageSupport, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { styleTags, tags } from '@lezer/highlight';

import { parser } from '../parser';

export const queryLanguage = () => {
    const parserWithMetadata = parser.configure({
        props: [
            // Properties are Terms of the grammar
            styleTags({
                Property: tags.labelName,
                Value: tags.string,
                Operator: tags.operator,
            }),
        ],
    });

    const languageDefinition = LRLanguage.define({
        name: 'queryLanguage',
        parser: parserWithMetadata,
    });

    return new LanguageSupport(
        languageDefinition,
        [syntaxHighlighting(defaultHighlightStyle)],
    );
};
