"use client"

import {Card} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";


export default function ActivityPage() {
    const Map = dynamic(() => import('../../components/activity/map'), {
        ssr: false,
    });

    return (
            <div className="flex">
                <ScrollArea className=" flex-1  rounded-md border p-4 ">
                    Jokester began sneaking into the castle in the middle of the night and leaving
                    jokes all over the place: under the king's pillow, in his soup, even in the
                    royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                    then, one day, the people of the kingdom discovered that the jokes left by
                    Jokester were so funny that they couldn't help but laugh. And once they
                    started laughing, they couldn't stop.
                </ScrollArea>

                <Card className="flex-1 ">
                    <Map />

                </Card>
            </div>
    )
}