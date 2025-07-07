"use client";
import { Button } from "@/components/ui/button"
import{PlusIcon} from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilter } from "./meetings-search-filter";


export const MeetingsListHeader = () =>{
    const [isDialogOpen, setisDialogOpen] = useState(false);

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
            <div className="flex items-center gap-x-2 p-1">
                <MeetingsSearchFilter/>
            </div>
        </div>
    </>
    )
}