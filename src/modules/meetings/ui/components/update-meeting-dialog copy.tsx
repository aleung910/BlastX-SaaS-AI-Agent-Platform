import { ResponsiveDialog } from "@/components/responsive-dialogue";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";
interface NewMeetingDialogProps{
    open:boolean;
    onOpenChange:(open:boolean) => void;
    initialValues: MeetingGetOne;
};

export const UpdateMeetingDialog = ({
    open,
    onOpenChange,
    initialValues,
}:NewMeetingDialogProps) =>{
    return(
<ResponsiveDialog
title="Edit Meeting"
    description="Edit the meeting details"
    open={open}
    onOpenChange={onOpenChange}
    >
       <MeetingForm
        onSuccess={(id)=>onOpenChange(false)}
        onCancel={()=> onOpenChange(false)}
        initialValues={initialValues}
       />
</ResponsiveDialog>
    );
};