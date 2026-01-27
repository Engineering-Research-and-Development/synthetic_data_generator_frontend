import type {FeatureFunctionParameters} from "../../../types/middlewarePost";

export function convertParamsToString(functionData: FeatureFunctionParameters[]): FeatureFunctionParameters[] {
    return functionData.map(feature => ({
        ...feature,
        associated_functions: feature.associated_functions.map(func => ({
            ...func,
            parameters: func.parameters.map(param => ({
                ...param,
                value: String(param.value)
            }))
        }))
    }));
}
