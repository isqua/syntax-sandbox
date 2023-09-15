import { PropertiesConfig } from './types';

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
};
