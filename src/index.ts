export { WindowChannel } from './lib/windowChannel';
export {default as GenericClient} from './lib/comm/JSONRPC11/GenericClient';
export { ServiceClient } from './lib/comm/JSONRPC11/ServiceClient';
export { DynamicServiceClient, DynamicServiceClientParams } from './lib/comm/JSONRPC11/DynamicServiceClient';
// export { default as NarrativeJobServiceClient } from './lib/comm/coreServices/NarrativeJobService';
export { niceDuration, niceElapsed, niceRelativeTime, NiceRelativeTimeOptions } from './lib/time'
export { default as Auth, UserAuthorization, AuthState } from './lib/Auth';
export {default as Workspace} from './lib//comm/coreServices/Workspace';
export { default as Catalog } from './lib/comm/coreServices/Catalog';
export { default as UserProfile } from './lib/comm/coreServices/UserProfile';