import type { PropertiesConfig } from './properties';
import { Suggest, type ISuggest } from './suggest';
import { Validator, type IValidator } from './validator';

export class Model {
    protected suggest?: ISuggest;
    protected validator?: IValidator;

    constructor(protected properties: PropertiesConfig) {}

    getSuggest(): ISuggest {
        if (!this.suggest) {
            this.suggest = new Suggest(this.properties);
        }

        return this.suggest;
    }

    getValidator(): IValidator {
        if (!this.validator) {
            this.validator = new Validator(this.properties);
        }

        return this.validator;
    }
}
