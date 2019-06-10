import { GenericClient } from '../comm/GenericClient';

interface IsAdminParam {
    username?: string;
}

type IsAdminResult = boolean;

interface ExecAggrTableParam {
    begin?: number;
    end?: number;
}

interface ExecAggrTableResult {
    app: string;
    func: string;
    func_mod: string;
    n: number;
    user: string;
}

interface ExecAggrStatsParam {
    full_app_ids?: Array<string>;
    per_week?: boolean;
}

interface ExecAggrStatsResult {
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
        const [result] = await this.callFunc<[IsAdminResult]>('is_admin', [null]);
        return result;
    }

    async getExecAggrTable(param: ExecAggrTableParam): Promise<Array<ExecAggrTableResult>> {
        const [result] = await this.callFunc<[Array<ExecAggrTableResult>]>('get_exec_aggr_table', [param]);
        return result;
    }

    async getExecAggrStats(param: ExecAggrStatsParam): Promise<Array<ExecAggrStatsResult>> {
        const [result] = await this.callFunc<[Array<ExecAggrStatsResult>]>('get_exec_aggr_stats', [param]);
        return result;
    }
}
