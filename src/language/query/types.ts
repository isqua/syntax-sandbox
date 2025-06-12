export type QlValue = string;

export enum PropertyOperator {
    eq = '$eq',
    ne = '$ne',
}

type PropertyEquality = { [PropertyOperator.eq]: QlValue }
type PropertyInequality = { [PropertyOperator.ne]: QlValue }
type PropertyUnfinished = Record<string, never>;

export type QlPropertyDescriptor = PropertyUnfinished |
    PropertyEquality |
    PropertyInequality;

export type QlPredicate = {
    [property: string]: QlPropertyDescriptor;
};

export type QlNotExpression = {
    '$not': QlExpression;
};

export type QlAndExpression = {
    '$and': QlExpression[];
};

export type QlOrExpression = {
    '$or': QlExpression[];
};

export type QlExpression = QlNotExpression |
    QlAndExpression |
    QlOrExpression |
    QlPredicate;

export type Query = QlExpression;
