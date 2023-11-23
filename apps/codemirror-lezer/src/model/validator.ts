import type { Diagnostic } from '@codemirror/lint';

import type { PropertiesConfig } from './types';
import type { PropertyToken, ValueToken } from './tokens';

export class Validator {
    constructor(protected properties: PropertiesConfig) { }

    getPropertyDiagnostics(token: PropertyToken): Diagnostic[] {
        if (!this.hasProperty(token.name)) {
            return [{
                from: token.node.from,
                to: token.node.to,
                severity: 'error',
                message: `Property ‘${token.name}’ does not exists`,
            }];
        }

        return [];
    }

    getValueDiagnostics(token: ValueToken): Diagnostic[] {
        if (!this.isValueAllowed(token.value, token.property)) {
            return [{
                from: token.node.from,
                to: token.node.to,
                severity: 'error',
                message: `Value ‘${token.value}’ is not allowed for property ‘${token.property}’`,
            }];
        }

        return [];
    }

    protected hasProperty(propertyName: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.properties, propertyName);
    }

    protected isValueAllowed(value: string, propertyName: string): boolean {
        if (!this.hasProperty(propertyName)) {
            return true;
        }

        const values = this.getPropertyValues(propertyName);

        return values.includes(value);
    }

    protected getPropertyValues(propertyName: string) {
        const values = this.properties[propertyName]?.values ?? [];

        return values;
    }
}
