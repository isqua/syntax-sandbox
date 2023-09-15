import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';

import type { PropertiesConfig } from '../config';

class DataBasedSuggest {
    constructor(protected properties: PropertiesConfig) {}

    getProperties(): Completion[] {
        return Object.keys(this.properties).map(name => ({
            label: name,
            apply: `${name} `,
        }));
    }
}

export const buildCompletion = (properties: PropertiesConfig) => {
    const suggest = new DataBasedSuggest(properties);

    return (context: CompletionContext): CompletionResult | null => {
        if (context.pos === 0) {
            return {
                options: suggest.getProperties(),
                from: context.pos,
            };
        }

        return null;
    };
};
