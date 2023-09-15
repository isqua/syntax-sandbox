import type { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';

import type { PropertiesConfig } from '../config';
import { Terms } from '../parser';

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

const isOperator = (node: SyntaxNode | null): node is SyntaxNode =>
    node?.parent?.type.id === Terms.Operator;

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

        if (currentNode?.type.id === Terms.Query) {
            return {
                options: suggest.getProperties(),
                from: context.pos,
            };
        }

        if (currentNode?.type.id === Terms.Property) {
            return {
                options: suggest.getProperties(),
                from: currentNode.from,
            };
        }

        if (currentNode?.type.id === Terms.Value) {
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

        if (currentNode?.type.id === Terms.Predicate) {
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
