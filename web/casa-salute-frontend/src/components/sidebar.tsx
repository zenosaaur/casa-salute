import { Button } from "./ui/button";
import React from "react";


interface SidebarOption {
  label: string;
  icon: React.ReactNode;
  page: string;
}

interface SidebarProps {
  setPage: (page: string) => void;
  currentPage: string;
  options: SidebarOption[];
}

export const Sidebar: React.FC<SidebarProps> = ({ setPage, currentPage, options }) => {

  const getBgButton = (page: string) => {
    return currentPage === page ? 'bg-[#f1f5f9]' : 'bg-white';
  };

  return (
    <div className="flex flex-col items-center gap-y-5 px-4 mt-4 fixed top-0 left-0">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Casa salute
      </h2>
      {options.map(option => (
        <Button key={option.page} className={`text-black w-full flex justify-start items-baseline mt-5 hover:bg-[#f1f5f9] ${getBgButton(option.page)}`} onClick={() => setPage(option.page)}>
          {option.icon && <div className="mr-4 h-4 w-4">{option.icon}</div>}
          {option.label}
        </Button>
      ))}
    </div>
  )
};
