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

export type QlAndExpression = {
    'and': QlExpression[];
};

export type QlOrExpression = {
    'or': QlExpression[];
};

export type QlExpression = QlNotExpression |
    QlAndExpression |
    QlOrExpression |
    QlPredicate;

export type Query = QlExpression;
