import { GenericClient } from '../comm/GenericClient';

// interface IsAdminParam {
//     username?: string;
// }

type IsAdminParam = null;

type IsAdminResult = boolean;

interface GetExecAggrTableParam {
    begin?: number;
    end?: number;
}

interface GetExecAggrTableResult {
    app: string;
    func: string;
    func_mod: string;
    n: number;
    user: string;
}

interface GetExecAggrStatsParam {
    full_app_ids?: Array<string>;
    per_week?: boolean;
}

interface GetExecAggrStatsResult {
    full_app_id: string;
    time_range: string;
    type: string;
    number_of_calls: number;
    number_of_errors: number;
    module_name: string;
    total_queue_time: number;
    total_exec_time: number;
}

export default class CatalogClient extends GenericClient {
    static module: string = 'Catalog';

    async isAdmin(): Promise<IsAdminResult> {
        try {
            const [result] = await this.callFunc<[IsAdminParam], [IsAdminResult]>('is_admin', [null]);
            return result;
        } catch (ex) {
            console.error('ERROR', ex);
            throw ex;
        }
    }

    async getExecAggrTable(param: GetExecAggrTableParam): Promise<Array<GetExecAggrTableResult>> {
        const [result] = await this.callFunc<[GetExecAggrTableParam], [Array<GetExecAggrTableResult>]>('get_exec_aggr_table', [param]);
        return result;
    }

    async getExecAggrStats(param: GetExecAggrStatsParam): Promise<Array<GetExecAggrStatsResult>> {
        const [result] = await this.callFunc<[GetExecAggrStatsParam], [Array<GetExecAggrStatsResult>]>('get_exec_aggr_stats', [param]);
        return result;
    }
}
