import type {FeaturesCreated, FunctionParameter} from "./ambient";

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
    functions?: OutFunction[];
}
export type FeatureConfig = Record<
    string,
    { type: FeatureType;}
>;

export type Features = {
    input_type: string;
    features_created: FeaturesCreated[];
    functions: OutFunction[];
}
export type UserData = UserFile | Features;

export type SdgOut = {
    additional_rows: number;
    data: UserData;
    feature_types?: FeatureConfig;
}
export type FeatureFunctionParameters = {
    feature_name: string;
    associated_functions: FunctionParameter[]
};