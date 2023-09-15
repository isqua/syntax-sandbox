export type PropertyName = string;

export type PropertyConfig = {
    values: string[];
}

export type PropertiesConfig = Record<PropertyName, PropertyConfig>;
