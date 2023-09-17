import { LRLanguage, LanguageSupport, syntaxHighlighting } from '@codemirror/language';
import { linter } from '@codemirror/lint';
import { styleTags, tags } from '@lezer/highlight';

import type { PropertiesConfig } from '../config';
import { parser } from '../parser';
import { buildCompletion } from './autocomplete';
import { highlighter } from './highlighter';
import { buildQueryLinter } from './linter';

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

    const lint = buildQueryLinter(properties);

    const support = [
        syntaxHighlighting(highlighter),
        linter(view => lint(view.state)),
    ];

    return new LanguageSupport(languageDefinition, support);
};
