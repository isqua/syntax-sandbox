interface NodeRef {
    from: number;
    to: number;
}

interface AbstractToken {
    tokenType: 'property' | 'value';
    node: NodeRef;
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
