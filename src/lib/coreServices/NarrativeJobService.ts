import { GenericClient, JSONRPCError } from '../comm/GenericClient';

type Job_ID = string;

interface CancelJobParam {
    job_id: Job_ID;
}

interface GetJobLogsParam {
    job_id: Job_ID;
    skip_lines: number;
}

interface LogLine {
    line: string;
    is_error: number;
}

interface GetJobLogsResult {
    lines: Array<LogLine>;
    last_line_number: number;
}


type CheckJobParam = Job_ID;

interface CheckJobResult {
    job_id: Job_ID;
    finished: boolean;
    ujs_url: string;
    status: any;
    result: any;
    error: JSONRPCError;
    job_state: string;
    position: number;
    creation_time: number;
    exec_start_time: number;
    finish_time: number;
    cancelled: boolean;
    canceled: boolean;
}

export default class NarrativeJobServiceClient extends GenericClient {
    static module: string = 'NarrativeJobService';

    async cancelJob(param: CancelJobParam): Promise<void> {
        await this.callFunc<[CancelJobParam], [void]>('cancel_job', [param]);
    }

    async getJobLogs(param: GetJobLogsParam): Promise<[GetJobLogsResult]> {
        return await this.callFunc<[GetJobLogsParam], [GetJobLogsResult]>('get_job_logs', [param]);
    }

    async checkJob(param: CheckJobParam): Promise<[CheckJobResult]> {
        return await this.callFunc<[CheckJobParam], [CheckJobResult]>('check_job', [param]);
    }
}
