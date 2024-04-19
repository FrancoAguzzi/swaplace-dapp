import { useState, useContext } from "react";
import { SwapContext } from "@/components/01-atoms";

import cc from "classcat";

interface ITab {
  setActiveSwappingShelfID: (_: SwappingShelfID) => void;
}

interface TokensShelfTab {
  id: number;
  name: string;
}

export enum SwappingShelfID {
  "THEIR_ITEMS",
  "YOUR_ITEMS",
}

export const swappingTabs: Array<TokensShelfTab> = [
  {
    id: SwappingShelfID.THEIR_ITEMS,
    name: "Their items",
  },
  {
    id: SwappingShelfID.YOUR_ITEMS,
    name: "Your items",
  },
];

export const TokensShelfTab = ({ setActiveSwappingShelfID }: ITab) => {
  const { isActiveTab, setActiveTab } = useContext(SwapContext);

  return (
    <div className="w-full font-light flex-auto flex items-center justify-between overflow-hidden">
      {swappingTabs.map((tab) => {
        return (
          <div
            key={tab.id}
            className={cc([
              isActiveTab === tab.id
                ? "dark:p-medium-bold-dark p-medium-bold border-b border-[#AABE13] "
                : "dark:p-medium-bold p-medium-bold opacity-50",
              "flex cursor-pointer py-4 px-5",
            ])}
            role="tab"
            onClick={() => {
              setActiveSwappingShelfID(tab.id);
              setActiveTab(tab.id);
            }}
          >
            <div className="flex items-center justify-center contrast-50">
              {tab.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
