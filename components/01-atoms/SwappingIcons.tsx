import { useScreenSize } from "@/lib/client/hooks/useScreenSize";
import {
  SwappingIcon,
  OffersIcon,
  ChatIcon,
  NotificationsIcon,
} from "@/components/01-atoms/icons";
import { Tooltip } from "@/components/01-atoms";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState } from "react";
import cc from "classcat";

export interface IconSwap {
  id: number;
  name: string;
  href: string;
  icon: React.ReactNode;
}

export enum SwappingIconsID {
  "SWAPLACE_STATION",
  "OFFERS",
  "CHAT",
  "NOTIFICATIONS",
}

export const SwappingIcons = () => {
  const { theme } = useTheme();
  const [isActiveTab, setIsActiveTab] = useState(
    SwappingIconsID.SWAPLACE_STATION,
  );
  const { isWideScreen } = useScreenSize();

  const swappingTabs: Array<IconSwap> = [
    {
      id: SwappingIconsID.SWAPLACE_STATION,
      name: "Swaplace Station",
      href: "/",
      icon: (
        <SwappingIcon
          className="w-5 h-5 "
          fill={cc([theme == "dark" ? "#DDF23D" : "#4F4F4F"])}
        />
      ),
    },
    {
      id: SwappingIconsID.OFFERS,
      name: "Offers",
      href: "/offers",
      icon: (
        <OffersIcon
          className="w-5 h-5 "
          fill={cc([theme == "dark" ? "#DDF23D" : "#4F4F4F"])}
        />
      ),
    },
    {
      id: SwappingIconsID.CHAT,
      name: "Chat",
      href: "/",
      icon: (
        <ChatIcon
          className="w-5 h-5 disabled cursor-not-allowed"
          fill={cc([theme == "dark" ? "#DDF23D" : "#4F4F4F"])}
        />
      ),
    },
    {
      id: SwappingIconsID.NOTIFICATIONS,
      name: "Notifications",
      href: "/",
      icon: (
        <NotificationsIcon
          className="w-5 h-5  disabled cursor-not-allowed"
          fill={cc([theme == "dark" ? "#DDF23D" : "#4F4F4F"])}
        />
      ),
    },
  ];

  const router = useRouter();
  const handleClick = (e: IconSwap) => {
    setIsActiveTab(e.id);
    router.push(e.href);
  };

  return (
    <>
      {swappingTabs.map((swapIcon) => {
        return (
          <div key={swapIcon.id}>
            {isWideScreen ? (
              <Tooltip position={"right"} content={swapIcon.name}>
                <div
                  key={swapIcon.id}
                  className={cc([
                    isActiveTab == swapIcon.id
                      ? "dark:p-medium-bold-dark p-medium-bold border-l dark:border-[#DDF23D] border-black hover:dark:bg-[#333534]"
                      : "dark:p-medium-bold p-medium-bold opacity-50 border-l dark:border-[#313131]",
                    "flex-1 md:p-4 cursor-pointer hover:dark:bg-[#343635] hover:bg-[#eff3cf]",
                  ])}
                  onClick={() => {
                    handleClick(swapIcon);
                  }}
                >
                  <div className="flex items-center justify-center w-full">
                    {swapIcon.icon}
                  </div>
                </div>
              </Tooltip>
            ) : (
              <Tooltip position={"bottom"} content={swapIcon.name}>
                <div
                  key={swapIcon.id}
                  className={cc([
                    isActiveTab == swapIcon.id
                      ? "dark:p-medium-bold-dark p-medium-bold border-l dark:border-[#DDF23D] border-black hover:dark:bg-[#333534]"
                      : "dark:p-medium-bold p-medium-bold opacity-50 border-l dark:border-[#313131]",
                    "flex-1 md:p-4 cursor-pointer hover:dark:bg-[#343635] hover:bg-[#eff3cf]",
                  ])}
                  onClick={() => {
                    handleClick(swapIcon);
                  }}
                >
                  <div className="flex items-center justify-center w-full">
                    {swapIcon.icon}
                  </div>
                </div>
              </Tooltip>
            )}
          </ div>
        );
      })}
    </>
  );
};
