"use client";
import { Button } from "@/components/ui/button"
import{PlusIcon, XCircleIcon} from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status-filters";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/contants";


export const MeetingsListHeader = () =>{
    const [filters, setFilters] = useMeetingsFilters();
    const [isDialogOpen, setisDialogOpen] = useState(false);

    const isAnyFilterModified = 
    !!filters.status || !!filters.search || !!filters.agentID;

    const onClearFIlters = () =>{
        setFilters({
            status: null,
            agentID: "",
            search:"",
            page: DEFAULT_PAGE,
        })
    }
    return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setisDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Meetings</h5>
                <Button onClick={()=> setisDialogOpen(true)}>
                    <PlusIcon/>
                    New Meeting
                 </Button>
            </div>
            <ScrollArea>

      
            <div className="flex items-center gap-x-2 p-1">
                <MeetingsSearchFilter/>
                <StatusFilter/>
                <AgentIdFilter/>
                {
                    isAnyFilterModified && (
                        <Button variant="outline" onClick={onClearFIlters}>
                            <XCircleIcon className="size-4"/>
                            Clear
                        </Button>
                    )
                }
            </div>
            <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
    </>
    )
}