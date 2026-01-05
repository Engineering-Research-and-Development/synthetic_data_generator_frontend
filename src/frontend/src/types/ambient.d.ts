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
    parameter_type: "float" | "int";
};

export type FunctionParameter = {
    function: AIFunction;
    parameters: Parameter[];
};

export type FeatureFunction = {
    [feature: string]: string[]
};

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



type SavedFunctionParameter = {
    id: number;
    value: Parameter['value'];
};

type SavedFunction = {
    functionId: number;
    functionName: string;
    parameters: SavedFunctionParameter[];
};

type SavedFunctionData = Record<string, SavedFunction[]>;