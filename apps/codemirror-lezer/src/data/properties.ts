import { PropertiesConfig } from '../config';
import { persons } from './persons';

export const properties: PropertiesConfig = {
    status: {
        values: [
            'open',
            'in_progress',
            'done',
        ]
    },
    priority: {
        values: [
            'high',
            'medium',
            'low',
        ]
    },
    resolution: {
        values: [
            'done',
            'wontfix',
            'duplicate',
        ]
    },
    author: {
        values: persons.map(person => `@${person.username}`),
        completions: persons.map(person => ({
            apply: `@${person.username}`,
            label: `${person.name} ${person.surname}`,
            detail: `(@${person.username})`,
            info: `${person.job}`
        }))
    }
};
