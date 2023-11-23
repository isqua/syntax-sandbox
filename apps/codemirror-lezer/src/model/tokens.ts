import type { SyntaxNodeRef } from '@lezer/common';

interface AbstractToken {
    tokenType: 'property' | 'value';
    node: SyntaxNodeRef;
}

export interface PropertyToken extends AbstractToken {
    tokenType: 'property';
    name: string;
}

export interface ValueToken extends AbstractToken {
    tokenType: 'value';
    property: string;
    value: string;
}
