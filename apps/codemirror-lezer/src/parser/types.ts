export type QlValue = string;

export type QlPropertyDescriptor = {
    [operator: string]: QlValue;
};

export type QlPredicate = {
    [property: string]: QlPropertyDescriptor;
};

export type Query = QlPredicate;
