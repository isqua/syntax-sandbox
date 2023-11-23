import type { Completion } from '@codemirror/autocomplete';
import type { PropertiesConfig } from './types';

export class Suggest {
    constructor(protected properties: PropertiesConfig) { }

    getProperties(): Completion[] {
        return Object.keys(this.properties).map(name => ({
            label: name,
            apply: `${name} `,
        }));
    }

    getPropertyOperators(): Completion[] {
        return [
            { label: '=', apply: '= ' },
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
