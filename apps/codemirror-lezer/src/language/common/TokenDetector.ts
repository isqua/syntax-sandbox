import type { SyntaxNodeRef } from '@lezer/common';

import { Terms } from '../grammar';
import type { PropertyToken, ValueToken } from './tokens';

interface AbstractState {
    sliceDoc(from?: number, to?: number): string;
}

export class TokenDetector {
    isProperty(node: SyntaxNodeRef) {
        return node.type.id === Terms.Property;
    }

    isValue(node: SyntaxNodeRef) {
        return node.type.id === Terms.Value;
    }

    getPropertyToken(node: SyntaxNodeRef, state: AbstractState): PropertyToken {
        const name = state.sliceDoc(node.from, node.to);

        return {
            tokenType: 'property',
            name,
            node,
        };
    }

    getValueToken(node: SyntaxNodeRef, state: AbstractState): ValueToken {
        const value = state.sliceDoc(node.from, node.to);
        const propertyNode = node.node?.parent?.getChild(Terms.Property);
        const property = propertyNode ? state.sliceDoc(propertyNode.from, propertyNode.to) : '';

        return {
            tokenType: 'value',
            property,
            value,
            node,
        };
    }
}
