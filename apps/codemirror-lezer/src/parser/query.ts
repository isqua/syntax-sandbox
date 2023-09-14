import type { SyntaxNode, Tree } from '@lezer/common';

import { Terms, parser } from './grammar';
import { QlExpression, QlNotExpression, QlPredicate, Query } from './types';

class QueryExtractor {
    constructor(protected doc: string) {}

    public traverseQuery(node: SyntaxNode): Query | null {
        const child = node.firstChild;

        if (child) {
            return this.traverseNode(child);
        }

        return null;
    }

    protected traverseNode(node: SyntaxNode): Query | null {
        switch (node.type.id) {
        case Terms.ParenthesesExpression:
            return this.traverseParenthesesExpression(node);
        case Terms.NotExpression:
            return this.traverseNotExpression(node);
        case Terms.Expression:
            return this.traverseExpression(node);
        case Terms.Predicate:
            return this.traversePredicate(node);
        }

        return null;
    }

    protected traverseExpression(node: SyntaxNode): QlExpression | null {
        const child = node.firstChild;

        if (child) {
            return this.traverseNode(child);
        }

        return null;
    }

    protected traverseParenthesesExpression(node: SyntaxNode): QlExpression | null {
        const child = node.getChild(Terms.Expression);

        if (child) {
            return this.traverseNode(child);
        }

        return null;
    }

    protected traverseNotExpression(node: SyntaxNode): QlNotExpression | null {
        const child = node.lastChild;

        let childExpression: QlExpression | null = null;

        if (child) {
            childExpression = this.traverseNode(child);
        }

        if (childExpression) {
            return { '!': childExpression };
        }

        return null;
    }

    protected traversePredicate(node: SyntaxNode): QlPredicate | null {
        const property = node.getChild(Terms.Property);
        const operator = node.getChild(Terms.Operator);
        const value = node.getChild(Terms.Value);

        const propertyText = property ? this.getNodeText(property) : '';
        const operatorText = operator ? this.getNodeText(operator) : '';
        const valueText = value ? this.getNodeText(value) : '';

        return {
            [propertyText]: {
                [operatorText]: valueText
            }
        };
    }

    protected getNodeText(node: SyntaxNode): string {
        return this.doc.slice(node.from, node.to);
    }
}

export const getQueryFromTree = (doc: string, editorTree?: Tree | null): Query => {
    const tree = editorTree || parser.parse(doc);
    const extractor = new QueryExtractor(doc);

    return extractor.traverseQuery(tree.topNode) ?? {};
};
