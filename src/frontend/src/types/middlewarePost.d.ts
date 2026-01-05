import type {FeaturesCreated} from "./ambient";

export type OutParameter = {
    param_id: number;
    value: number;
}
export type OutFunction = {
    feature: string;
    function_id: number;
    parameters: OutParameter[];
}
export type AIModel = {
    selected_model_id: number;
    new_model: boolean;
    new_model_name?: string;
    model_version?: string;
}
export type SdgOut = {
    additional_rows: number;
    functions?: OutFunction[];
    ai_model: AIModel;
    user_file?: { number: { string: number }[] }[];
    features_created?: FeaturesCreated[];
}