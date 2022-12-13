
import { ITag } from './ITag';
import { IParameter } from './IParameter';
import { ITrigger } from './ITrigger';
export interface IModule {
    _id?: string
    name: string,
    description?: string,
    bg_color?: string,
    detail_url?: string,
    tags?: ITag[],
    parameters?: IParameter[],
    triggers?: ITrigger[],
    database_relation?: string[],
    sub_items?: IModule[],
    is_top_level?: boolean,
    is_opened?: boolean,
    createdAt?: string,
    updatedAt?: string,
}