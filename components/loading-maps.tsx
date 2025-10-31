import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export function LoadingMaps() {
    return (
        <Empty className="w-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Spinner />
                </EmptyMedia>
                <EmptyTitle>Loading Map</EmptyTitle>
                <EmptyDescription>
                    Please wait while the map loads.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
