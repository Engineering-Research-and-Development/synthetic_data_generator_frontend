export type AIFunction = {
    id: number;
    name: string;
    description: string;
    function_reference: string;
};

export type Parameter = {
    id: number;
    name: string;
    value: string;
    parameter_type: "float" | "int" | "bool" | "string";
};

export type FunctionParameter = {
    function: AIFunction;
    parameters: Parameter[];
};

export type FeatureFunction = {
    featureName: string;
    functionId: number[];
}

export type FeaturesCreated = {
    id: number,
    feature: string,
    type: string,
    category: string
};

export type SelectedModel = {
    id: number;
    name: string;
    version?: string;
};