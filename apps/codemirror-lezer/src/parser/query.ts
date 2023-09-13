import type { SyntaxNode, Tree } from '@lezer/common';

import { Terms, parser } from './grammar';
import { QlPredicate, Query } from './types';

const getNodeText = (doc: string, node: SyntaxNode): string => {
    return doc.slice(node.from, node.to);
};

const getPredicateQuery = (doc: string, predicate: SyntaxNode): QlPredicate => {
    const property = predicate.getChild(Terms.Property);
    const operator = predicate.getChild(Terms.Operator);
    const value = predicate.getChild(Terms.Value);

    const propertyText = property ? getNodeText(doc, property) : '';
    const operatorText = operator ? getNodeText(doc, operator) : '';
    const valueText = value ? getNodeText(doc, value) : '';

    return {
        [propertyText]: {
            [operatorText]: valueText
        }
    };
};

export const getQueryFromTree = (doc: string, editorTree?: Tree | null): Query => {
    const tree = editorTree || parser.parse(doc);
    const topNode = tree.topNode;

    if (topNode.type.id !== Terms.Query) {
        return {};
    }

    const predicate = topNode.getChild(Terms.Predicate);

    if (!predicate) {
        return {};
    }

    return getPredicateQuery(doc, predicate);
};
