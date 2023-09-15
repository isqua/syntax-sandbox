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

        return null;
    };
};
