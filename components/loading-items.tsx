import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"


export function LoadingItems() {
    return (
        <Empty className="w-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Spinner />
                </EmptyMedia>
                <EmptyTitle>Getting SOS info</EmptyTitle>
                <EmptyDescription>
                    Please wait while we find SOS Data.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
