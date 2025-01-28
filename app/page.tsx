"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState("all-dates");
  const [selectedZone, setSelectedZone] = useState("all-zones");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/csv-data");
        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredNews = news.filter(
    (item) =>
      (selectedZone === "all-zones" || item.quartier === selectedZone) &&
      (selectedDate === "all-dates" || item.date === selectedDate)
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, "...", totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <div className="flex">
      <div className="fixed h-screen w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-16 overflow-auto">
        <div className="flex flex-col relative">
          <div className="bg-red-200 text-red-800 text-sm font-semibold px-4 py-6 overflow-hidden flex">
            <div className="whitespace-nowrap animate-marquee">
              Les rafales de vent causées par la tempête Herminia ont atteint plus de 190 km/h
              sur le Finistère et le Morbihan. La Mayenne, l’Orne et le Calvados sont également
              touchés.
            </div>
          </div>

          <div className="p-8">
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
                  {[...new Set(news.map((item) => item.date))].map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-around px-6 py-8 pb-20">
              {[
                { zone: "Zone 1", image: "/images/zone1.jpg" },
                { zone: "Zone 2", image: "/images/zone2.jpg" },
                { zone: "Zone 3", image: "/images/zone3.jpg" },
                { zone: "Zone 4", image: "/images/zone4.jpg" },
                { zone: "Zone 5", image: "/images/zone5.jpg" },
              ].map(({ zone, image }) => (
                <Card
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`relative cursor-pointer w-60 h-80 overflow-hidden rounded-md transition-all duration-300 ${selectedZone === zone ? "bg-white shadow-lg" : "bg-gray-100 bg-opacity-60"
                    }`}
                >
                  <CardContent className="p-0 h-full relative group">
                    <img
                      src={image}
                      alt={zone}
                      className={`w-full h-full object-cover transition-opacity duration-300  ${selectedZone === zone ? "opacity-30" : "opacity-100"
                        }`}
                    />

                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-opacity-10  transition-all duration-300`}
                    >
                      <div className="bg-white bg-opacity-80 w-full p-4">
                        <h3 className="text-xl font-semibold text-gray-800 justify-self-center">{zone}</h3>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>


            <div className="px-6 pb-6 flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-xl">Chargement des données...</p>
                </div>
              ) : currentItems.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((item) => (
                      <Card key={item.id} className="p-6">
                        <CardHeader className="items-center">
                          <CardTitle>{item.quartier}</CardTitle>
                          <CardDescription>Publié le {item.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm text-gray-600">
                                Température : {item.temperature}°C
                              </p>
                              <p className="text-sm text-gray-600">
                                Humidité : {item.humidite}%
                              </p>
                              <p className="text-sm text-gray-600">
                                Pluie totale : {item.pluie_totale} mm
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Sismicité : {item.sismicite}
                              </p>
                              <p className="text-sm text-gray-600">
                                Inondation : {item.inondation === "True" ? "Oui" : "Non"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      />
                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === "..." ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                      />
                    </PaginationContent>
                  </Pagination>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-xl">
                    Aucune actualité disponible pour cette sélection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
