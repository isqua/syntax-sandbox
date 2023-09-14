import { LRLanguage, LanguageSupport, syntaxHighlighting } from '@codemirror/language';
import { styleTags, tags } from '@lezer/highlight';

import { parser } from '../parser';
import { highlighter } from './highlighter';

export const queryLanguage = () => {
    const parserWithMetadata = parser.configure({
        props: [
            // Properties are Terms of the grammar
            styleTags({
                Property: tags.propertyName,
                Value: tags.string,
                'EqualOp NotEqualOp': tags.operator,
                NotOperator: tags.logicOperator,
                'OpenParenthesis ClosingParenthesis': tags.paren,
            }),
        ],
    });

    const languageDefinition = LRLanguage.define({
        name: 'queryLanguage',
        parser: parserWithMetadata,
    });

    return new LanguageSupport(
        languageDefinition,
        [syntaxHighlighting(highlighter)]
    );
};
