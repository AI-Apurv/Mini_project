export interface ElasticsearchResponse<T> {
    body: {
        _index: string;
        _type: string;
        _id: string;
        _version: number;
        result: string;
        _shards: {
            total: number;
            successful: number;
            failed: number;
        };
        _seq_no: number;
        _primary_term: number;
        status: number;
    };
}