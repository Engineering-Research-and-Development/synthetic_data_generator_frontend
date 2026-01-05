export type ColumnResult = {
    column_data: number[];
    column_name: string;
    column_type: string;
    column_datatype: string;
}
export type Metric = {
    title: string;
    value: number | { string: number };
    unit_measure: string;
}
export type MetricReport = {
    statistical_metrics: Metric[];
    adherence_metrics: Metric[];
    novelty_metrics: Metric[];
}
export type CouchJson = {
    _id: string;
    _rev: string;
    results: ColumnResult[];
    metrics?: MetricReport
}