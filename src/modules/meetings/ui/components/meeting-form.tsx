import { MeetingGetOne } from "@/modules/meetings/types";
import { meetingsInsertSchema } from "../../schemas";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/server/ui/components/new-agents-dialog";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
};

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");

    const agents= useQuery(trpc.agents.getMany.queryOptions({
        pageSize:100,
        search:agentSearch,
    }),
    );
    const createMeeting= useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async(data) => { 
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                await queryClient.invalidateQueries(
                                trpc.premium.getFreeUsage.queryOptions(),
                            );

             onSuccess?.(data.id);
             },
            onError: (error) => { toast.error(error.message);
            if(error.data?.code === "FORBIDDEN"){
                router.push("/upgrade");
            }

            }
        }),
    );

      const updateMeeting= useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async() => { 
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                if(initialValues?.id){
                    await queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({id: initialValues.id}),
                );
             }
             onSuccess?.();
             },
            onError: (error) => { toast.error(error.message);
            }
        }),
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentID: initialValues?.agentID ?? "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;
    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({...values, id:initialValues.id});
        }
        else {
            createMeeting.mutate(values);
        }
    };
    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Health Consultations" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="agentID"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent</FormLabel>
                            <FormControl>
                            <CommandSelect 
                            options={(agents.data?.items?? []).map((agent) => ({
                                    id:agent.id,
                                    value: agent.id,
                                    children:(
                                        <div> 
                                            <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="border size-6" />
                                         <span>
                                            {agent.name}
                                        </span> 
                                        </div>
                                    )                         
                            }))}
                            onSelect={field.onChange}
                            onSearch={setAgentSearch}
                            value={field.value}
                            placeholder="Select an agent"
                            />
                            </FormControl>
                            <FormDescription>
                                Not found what you&apos;re looking for?{" "}
                                <button type="button" className="text-primary hover:underline"
                                onClick={()=> setOpenNewAgentDialog(true)}>
                                    Create new agent
                                </button>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button variant="ghost" disabled={isPending} onClick={onCancel} type="button">
                            Cancel
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    </>
    );
};