import { JSONArrayOf, JSONObject } from '../../json';
import { ServiceClient } from '../JSONRPC11/ServiceClient';

export interface User extends JSONObject {
    username: string;
    realname: string;
}

export interface UserProfile extends JSONObject {
    user: User,
    profile: {
        synced: {
            gravatarHash: string;
        };
        userdata: {
            jobTitle: string,
            jobTitleOther: string,
            organization: string;
            city: string;
            state: string;
            country: string;
            avatarOption: string;
            gravatarDefault: string;
        };
        metadata: {
            createdBy: string;
            created: string;
        };
        // plugins: {
        //     organizations?: OrganizationsSettings;
        // };
    };
}

export type GetUserProfileParams = Array<string>;

export type GetUserProfileResult = Array<UserProfile>;

export default class UserProfileClient extends ServiceClient {
    module: string = 'UserProfile';

    async get_user_profile(params: GetUserProfileParams): Promise<GetUserProfileResult> {
        const [result] = await this.callFunc<JSONArrayOf<GetUserProfileParams>, JSONArrayOf<GetUserProfileResult>>('get_user_profile', [params]);
        return result;
    }
}