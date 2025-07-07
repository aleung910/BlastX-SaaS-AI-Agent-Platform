import { DEFAULT_PAGE } from "@/contants";
import {parseAsInteger, parseAsString, useQueryStates, parseAsStringEnum} from "nuqs";

import { MeetingStatus } from "../types";
import { Agent } from "http";
export const useMeetingsFilters = () =>{
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({clearOnDefault:true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentID: parseAsString.withDefault("").withOptions({clearOnDefault:true}),
});
};