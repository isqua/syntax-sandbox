import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

import colors from './highlighter.module.css';

export const highlighter = HighlightStyle.define([
    { tag: tags.propertyName, class: colors.property },
    { tag: tags.string, class: colors.string },
    { tag: tags.operator, class: colors.operator },
    { tag: tags.logicOperator, class: colors.logicOperator },
    { tag: tags.paren, class: colors.parentheses },
]);
