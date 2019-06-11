import { Channel } from './windowChannel';
import { IFrameParams } from './IFrameSupport';
declare class IFrameSimulator {
    params: IFrameParams | null;
    channel: Channel;
    constructor();
    getParamsFromIFrame(): IFrameParams;
}
export default IFrameSimulator;
