type Endpoint = {
    id: string;
    url: string;
    name: string;
    description: string;
}

export const Endpoints: Endpoint[] = [
    { id: "create", url: '/create', name: "Dataset from scratch", description: "Create a new dataset from scratch" },
    { id: "featureTypes", url: '/featureTypes', name: "Feature Types", description: "Select the feature types" },
    { id: "feature", url: '/feature', name: "Features", description: "Define the features to enhance" },
    { id: "functionPage", url: '/function', name: "Functions", description: "Define the functions to apply to the features" },
    { id: "parametersPage", url: '/parameters', name: "Parameters", description: "Define the functions' parameters" },
    { id: "modelPage", url: '/model', name: "Model selection", description: "Select the AI moldes to enhance the dataset" },
    { id: "previewPage", url: '/preview', name: "Preview", description: "Preview the data before commit the data generation" },
    { id: "sendPage", url: '/send', name: "Send", description: "Send the data to the server" },
    { id: "resultPage", url: '/results', name: "Results", description: "Retrieve the results from the server" },
];

export const EnhanceEndpoints: Endpoint[] = [
    "featureTypes",
    "feature",
    "functionPage",
    "parametersPage",
    "modelPage",
    "previewPage"
]
    .map(id => Endpoints.find(endpoint => endpoint.id === id))
    .filter((endpoint): endpoint is Endpoint => endpoint !== undefined);

export const CreateEndpoints: Endpoint[] = [
    "create",
    "functionPage",
    "parametersPage",
    "previewPage"
]
    .map(id => Endpoints.find(endpoint => endpoint.id === id))
    .filter((endpoint): endpoint is Endpoint => endpoint !== undefined);