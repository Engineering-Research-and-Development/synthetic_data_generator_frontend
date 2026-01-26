import type {FeaturesCreated, FunctionParameter} from "./ambient";

export type FeatureFunctionParameters = {
    feature_name: string;
    associated_functions: FunctionParameter[]
};

export type AIModel = {
    selected_model_id: number;
    new_model: boolean;
    new_model_name?: string;
    model_version?: string;
}
export type UserFile = {
    input_type: string
    user_file: { number: { string: number }[] }[];
    ai_model: AIModel;
    functions?: FeatureFunctionParameters[];
}
export type FeatureConfig = Record<
    string,
    { type: FeatureType;}
>;

export type Features = {
    input_type: string;
    features_created: FeaturesCreated[];
    functions: FeatureFunctionParameters[];
}
export type UserData = UserFile | Features;

export type SdgOut = {
    additional_rows: number;
    data: UserData;
    feature_types?: FeatureConfig;
}
