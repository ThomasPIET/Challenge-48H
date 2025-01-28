"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, MessageCircle, Map, Drama, Menu, X, CloudSunRain } from "lucide-react";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("Accueil");

  const menuItems = [
    { name: "Accueil", icon: <Home className="h-12 w-12" /> },
    { name: "Forum", icon: <MessageCircle className="h-12 w-12" /> },
    { name: "Vue d’ensemble", icon: <Map className="h-12 w-12" /> },
    { name: "Activité", icon: <Drama className="h-12 w-12" /> },
  ];

  return (
    <div className="flex h-screen ">
      <aside
        className={cn(
          "bg-white shadow-md transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col items-center p-4">
          <div className="flex items-center justify-center w-full">
            <CloudSunRain className="h-24 w-24" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-4 p-2 rounded-lg"
          >
            {isCollapsed ? <Menu className="h-10 w-10" /> : <X className="h-10 w-10" />}
          </Button>
        </div>

        <nav
          className={cn(
            "flex-1 flex flex-col pt-40 space-y-4",
            isCollapsed ? "items-center" : "items-start pl-4"
          )}
        >
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={activeTab === item.name ? "secondary" : "ghost"}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "flex items-center space-x-4 rounded-lg",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="ml-3 text-left text-sm text-gray-700">
                  {item.name}
                </span>
              )}
            </Button>
          ))}
        </nav>
      </aside>
    </div>
  );
};

=======
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Home, MessageCircle, Map, Drama, Menu, X, CloudSunRain} from "lucide-react";

const Sidebar = ({children}: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("Accueil");
    const menuItems = [
        {name: "Accueil", icon: <Home className="h-12 w-12"/>},
        {name: "Forum", icon: <MessageCircle className="h-12 w-12"/>},
        {name: "Vue d’ensemble", icon: <Map className="h-12 w-12"/>},
        {name: "Activité", icon: <Drama className="h-12 w-12"/>},
    ];
    return (
        <div className="flex h-screen ">
            <aside
                className={cn(
                    "bg-white shadow-md transition-all duration-300 flex flex-col",
                    isCollapsed ? "w-16" : "w-64"
                )}
            >
                <div className="flex flex-col items-center p-4">
                    <div className="flex items-center justify-center w-full">
                        <CloudSunRain className="h-24 w-24"/>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="mt-4 p-2 rounded-lg"
                    >
                        {isCollapsed ? <Menu className="h-10 w-10"/> : <X className="h-10 w-10"/>}
                    </Button>
                </div>

                <nav
                    className={cn(
                        "flex-1 flex flex-col pt-40 space-y-4",
                        isCollapsed ? "items-center" : "items-start pl-4"
                    )}
                >
                    {menuItems.map((item) => (
                        <Button
                            key={item.name}
                            variant={activeTab === item.name ? "secondary" : "ghost"}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "flex items-center space-x-4 rounded-lg",
                                isCollapsed ? "justify-center" : "justify-start"
                            )}
                        >
                            {item.icon}
                            {!isCollapsed && (
                                <span className="ml-3 text-left text-sm text-gray-700">
                  {item.name}
                </span>
                            )}
                        </Button>
                    ))}
                </nav>
            </aside>
        </div>
    );
};

export default Sidebar;
