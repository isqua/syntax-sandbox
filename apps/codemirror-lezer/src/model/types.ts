import type { Completion } from '@codemirror/autocomplete';

export type PropertyName = string;

export type PropertyConfig = {
    values: string[];
    completions?: Completion[];
}

export type PropertiesConfig = Record<PropertyName, PropertyConfig>;
