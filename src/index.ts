export { WindowChannel } from './windowChannel';
export { default as GenericClient } from './comm/JSONRPC11/GenericClient';
export { ServiceClient } from './comm/JSONRPC11/ServiceClient';
export { DynamicServiceClient, DynamicServiceClientParams } from './comm/JSONRPC11/DynamicServiceClient';
// export { default as NarrativeJobServiceClient } from './comm/coreServices/NarrativeJobService';
export { niceDuration, niceElapsed, niceRelativeTime, NiceRelativeTimeOptions } from './time'
export { default as Auth, UserAuthentication, AuthenticationStatus } from './Auth';
export { default as Workspace } from './comm/coreServices/Workspace';
export { default as Catalog } from './comm/coreServices/Catalog';
export { default as UserProfile } from './comm/coreServices/UserProfile';
