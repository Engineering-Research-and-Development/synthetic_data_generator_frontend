export type Datatype = {
    id: number
    type: string
    is_categorical: boolean
}

export type NewAlgorithm = {
    id: number;
    name: string;
    description: string;
    default_loss_function: string;
    datatypes: Datatype[]
};