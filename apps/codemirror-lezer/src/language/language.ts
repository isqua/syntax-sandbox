import { LRLanguage, LanguageSupport, syntaxHighlighting } from '@codemirror/language';
import { styleTags, tags } from '@lezer/highlight';

import type { PropertiesConfig } from '../config';
import { parser } from '../parser';
import { buildCompletion } from './autocomplete';
import { highlighter } from './highlighter';

export const queryLanguage = (properties: PropertiesConfig) => {
    const parserWithMetadata = parser.configure({
        props: [
            // Properties are Terms of the grammar
            styleTags({
                Property: tags.propertyName,
                Value: tags.string,
                'EqualOp NotEqualOp': tags.operator,
                'NotOperator LogicalAndOp LogicalOrOp': tags.logicOperator,
                'OpenParenthesis ClosingParenthesis': tags.paren,
            }),
        ],
    });

    const languageDefinition = LRLanguage.define({
        name: 'queryLanguage',
        parser: parserWithMetadata,
        languageData: {
            autocomplete: buildCompletion(properties),
        },
    });

    return new LanguageSupport(
        languageDefinition,
        [syntaxHighlighting(highlighter)]
    );
};
