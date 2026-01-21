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
export type UserFile = {
    input_type: string
    user_file: { number: { string: number }[] }[];
}
export type FeatureConfig = Record<
    string,
    { type: FeatureType; primaryKey: boolean }
>;

export type Features = {
    input_type: string;
    features_created: FeaturesCreated[];
}
export type UserData = UserFile | Features;
export type SdgOut = {
    additional_rows: number;
    functions?: OutFunction[];
    ai_model: AIModel;
    data: UserData;
    feature_types?: FeatureConfig;
}