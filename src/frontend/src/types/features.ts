export let types = [
    {value: 'string', name: 'String'},
    {value: 'integer', name: 'Integer'},
    {value: 'double', name: 'Double'},
];

export let featureTypes = [
    {value: 'continuous', name: "Continuous"},
    {value: 'categorical', name: "Categorical"},
    {value: 'group_index', name: "GroupIndex"},
    {value: 'primary_key', name: "Primary Key"}
];

export type FeatureType = "continuous" | "categorical" | "group_index" | "primary_key";