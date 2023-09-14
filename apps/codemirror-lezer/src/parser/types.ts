export type QlValue = string;

export type QlPropertyDescriptor = {
    [operator: string]: QlValue;
};

export type QlPredicate = {
    [property: string]: QlPropertyDescriptor;
};

export type QlNotExpression = {
    '!': QlExpression;
};

export type QlExpression = QlNotExpression | QlPredicate;

export type Query = QlExpression;
