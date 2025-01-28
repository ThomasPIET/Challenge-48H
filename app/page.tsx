

"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState("all-dates"); 
  const [selectedZone, setSelectedZone] = useState("all-zones"); 
  const [news, setNews] = useState([
    {
      id: 1,
      title: "Un titre d'actualité",
      description:
        "Une description ou un résumé de l'actualité. Vous pouvez ajouter ici un contenu plus détaillé.",
      date: "27/01/2025",
      zone: "zone-1",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,  
      title: "Un autre titre",
      description:
        "Une autre description pour une nouvelle actualité. Ajoutez plus de détails ici.",
      date: "26/01/2025",
      zone: "zone-2",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title: "Encore un autre titre",
      description:
        "Une actualité pour compléter la section. Ajoutez autant de cartes que nécessaire.",
      date: "25/01/2025",
      zone: "zone-3",
      image: "https://via.placeholder.com/300x200",
    },
  ]);

  const filteredNews = news.filter(
    (item) =>
      (selectedZone === "all-zones" || item.zone === selectedZone) &&
      (selectedDate === "all-dates" || item.date === selectedDate)
  );

  return (
    <div className="flex  ">
      <div className="fixed h-screen w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-16 overflow-auto">
        <div className="flex flex-col relative">
          <div className="bg-red-200 text-red-800 text-sm font-semibold px-4 py-6 overflow-hidden flex">
            <div className="whitespace-nowrap animate-marquee">
              Les rafales de vent causées par la tempête Herminia ont atteint plus de 190
              km/h sur le Finistère et le Morbihan. La Mayenne, l’Orne et le Calvados sont
              également touchés.
            </div>
          </div>

          <div className="p-8 ">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-800">Actualité</h1>
            <Select
              onValueChange={(value) => setSelectedDate(value)}
              value={selectedDate}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Toutes les dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-dates">Toutes les dates</SelectItem>
                <SelectItem value="27/01/2025">27/01/2025</SelectItem>
                <SelectItem value="26/01/2025">26/01/2025</SelectItem>
                <SelectItem value="25/01/2025">25/01/2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-around px-6 py-8 pb-20">
            {["zone-1", "zone-2", "zone-3", "zone-4", "zone-5"].map((zone, index) => (
              <Card
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`cursor-pointer p-8 w-60  h-80 content-center  ${
                  selectedZone === zone ? "bg-blue-100 border-blue-500" : ""
                }`}
              >
                <CardContent className="text-center !p-0">
                  <h3 className="text-lg font-semibold">Zone {index + 1}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-center items-center px-6 pb-6">
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredNews.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>Publié le {item.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-xl">
                Aucune actualité disponible pour cette sélection.
              </p>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
