import type { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';

import type { PropertiesConfig } from '../../config';
import { Terms } from '../../parser';

class DataBasedSuggest {
    constructor(protected properties: PropertiesConfig) {}

    getProperties(): Completion[] {
        return Object.keys(this.properties).map(name => ({
            label: name,
            apply: `${name} `,
        }));
    }

    getPropertyOperators(): Completion[] {
        return [
            { label: '=', apply: '= ' },
            { label: '!=', apply: '!= ' },
        ];
    }

    getLogicalOperators(): Completion[] {
        return [
            { label: 'and', apply: 'and ' },
            { label: 'or', apply: 'or ' },
        ];
    }

    getPropertyValues(propertyName: string): Completion[] {
        const values = this.properties[propertyName]?.values ?? [];

        return values.map(value => ({
            label: value,
            apply: `${value} `,
        }));
    }
}

const closestKnownParent = (node: SyntaxNode | null): SyntaxNode | null => {
    if (node === null) {
        return null;
    }

    if (node.type.id !== 0) {
        return node;
    }

    return closestKnownParent(node.parent);
};

const latestKnownChild = (node: SyntaxNode): SyntaxNode | null => {
    let child: SyntaxNode | null | undefined = node.lastChild;

    while (child?.type.id === 0) {
        child = child?.prevSibling;
    }

    return child;
};

const isOperator = (node: SyntaxNode | null): node is SyntaxNode =>
    node?.parent?.type.id === Terms.Operator;

const isLogicalExpression = (node: SyntaxNode) => [
    Terms.NotExpression,
    Terms.AndExpression,
    Terms.OrExpression
].includes(node?.type.id ?? -1);

const getPropertyNameFromPredicate = (context: CompletionContext, predicate?: SyntaxNode | null): string => {
    const property = predicate?.getChild(Terms.Property);
    const propertyName = property ? context.state.sliceDoc(property.from, property.to) : '';

    return propertyName;
};

export const buildCompletion = (properties: PropertiesConfig) => {
    const suggest = new DataBasedSuggest(properties);

    return (context: CompletionContext): CompletionResult | null => {
        const tree = syntaxTree(context.state);
        const currentNode = closestKnownParent(tree.resolveInner(context.pos, -1));

        if (!currentNode) {
            return null;
        }

        if (currentNode.type.id === Terms.Query) {
            const lastChild = latestKnownChild(currentNode);

            if (!lastChild) {
                return {
                    options: suggest.getProperties(),
                    from: context.pos,
                };
            }

            return {
                options: suggest.getLogicalOperators(),
                from: lastChild.to + 1,
            };
        }

        if (isLogicalExpression(currentNode)) {
            const lastChild = latestKnownChild(currentNode);

            if (lastChild?.type.id === Terms.Expression) {
                const lastChild = currentNode?.lastChild;
                const isParen = lastChild?.type.id === Terms.ClosingParenthesis;
                const from = lastChild && !isParen ? lastChild.from : context.pos;

                return {
                    options: suggest.getLogicalOperators(),
                    from,
                };
            }

            return {
                options: suggest.getProperties(),
                from: context.pos,
            };
        }

        if (currentNode.type.id === Terms.Property) {
            return {
                options: suggest.getProperties(),
                from: currentNode.from,
            };
        }

        if (currentNode.type.id === Terms.Value) {
            const predicate = currentNode.parent;
            const propertyName = getPropertyNameFromPredicate(context, predicate);

            return {
                options: suggest.getPropertyValues(propertyName),
                from: currentNode.from,
            };
        }

        if (isOperator(currentNode)) {
            const predicate = currentNode.parent?.parent;
            const propertyName = getPropertyNameFromPredicate(context, predicate);

            if (propertyName) {
                return {
                    options: suggest.getPropertyValues(propertyName),
                    from: currentNode.to,
                };
            }
        }

        if (currentNode.type.id === Terms.Predicate) {
            const operator = currentNode.getChild(Terms.Operator);

            if (!operator) {
                return {
                    options: suggest.getPropertyOperators(),
                    from: context.pos,
                };
            }

            const propertyName = getPropertyNameFromPredicate(context, currentNode);

            if (propertyName) {
                return {
                    options: suggest.getPropertyValues(propertyName),
                    from: context.pos,
                };
            }
        }

        return null;
    };
};
