"use client"

import {Card} from "@/components/ui/card";
import dynamic from "next/dynamic";


export default function ActivityPage() {
    const Map = dynamic(() => import('../../components/activity/map'), {
        ssr: false,
    });

    return (
        <Card className="w-full h-full overflow-y-auto">
                <Map />
            </Card>
    )
}