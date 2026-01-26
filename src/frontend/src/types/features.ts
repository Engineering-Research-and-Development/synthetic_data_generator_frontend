export let types = [
    {value: 'str', name: 'String'},
    {value: 'int32', name: 'Integer'},
    {value: 'float32', name: 'Float'},
    {value: 'bool', name: 'Boolean'},
];

export let featureTypes = [
    {value: 'continuous', name: "Continuous"},
    {value: 'categorical', name: "Categorical"},
    {value: 'group_index', name: "GroupIndex"},
    {value: 'primary_key', name: "Primary Key"}
];

export type FeatureType = "continuous" | "categorical" | "group_index" | "primary_key";