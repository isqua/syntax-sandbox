import type { Completion } from '@codemirror/autocomplete';
import type { PropertiesConfig } from './properties';

export interface ISuggest {
    getProperties(): Completion[];
    getPropertyOperators(): Completion[];
    getLogicalOperators(): Completion[];
    getPropertyValues(propertyName: string): Completion[];
}

export class Suggest implements ISuggest {
    constructor(protected properties: PropertiesConfig) { }

    getProperties(): Completion[] {
        return Object.keys(this.properties).map(name => ({
            label: name,
            apply: `${name} `,
        }));
    }

    getPropertyOperators(): Completion[] {
        return [
            { label: '=', apply: '= ', boost: 99 },
            { label: '!=', apply: '!= ' },
        ];
    }

    getLogicalOperators(): Completion[] {
        return [
            { label: 'and', apply: 'and ' },
            { label: 'or', apply: 'or ' },
        ];
    }

    getPropertyValues(propertyName: string): Completion[] {
        const propertyConfig = this.properties[propertyName];

        if (!propertyConfig) {
            return [];
        }

        if (propertyConfig.completions) {
            return propertyConfig.completions;
        }

        return propertyConfig.values.map(value => ({
            label: value,
            apply: `${value} `,
        }));
    }
}
