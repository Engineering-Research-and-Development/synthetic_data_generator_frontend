export type Version = {
    version_name: string;
    loss_function: string;
    train_loss: number;
    val_loss: number;
    train_samples: number;
    val_samples: number;
}
export type FeatureType = {
    feature_name: string;
    feature_position: number;
    is_categorical: boolean;
    type: string;
}
export type Model = {
    id: number;
    name: string;
    dataset_name: string;
    input_shape: string;
    algorithm: number;
    algorithm_name: string;
    size: string;
}
export type TrainedModel = {
    model: Model;
    versions: Version[];
    datatypes: FeatureType[];
};