import { useUser } from "@clerk/nextjs";
import { useAccountStore } from "~/stores/stores";
import { HorizontalBar } from "../ui/sidebarHorizontalDivider";
import { ThumbnailCircle } from "../ui/thumbnailCircle";
import Image from "next/image";

export const UserSidebar = () => {
  // return a vertical bar sticky to the left side of the screen with a round button for the user's avatar and buttons below which are for the user's accounts, also in round buttons

  const { accounts, setActiveAccount, setIsChoosingAccount } =
    useAccountStore();

  const handleAccountClick = (index: number) => {
    setActiveAccount(index);
    setIsChoosingAccount(false);
  };

  return (
    <div className="flex h-full w-16 flex-col bg-stone-800">
      <div className=" h-full justify-center">
        <ProfileThumbnail />
        <div className="">
          <HorizontalBar />
        </div>
        <AccountThumbnails />
        <div className="">
          <HorizontalBar />
        </div>
        <div className="flex flex-col items-center">
          <ThumbnailCircle character="+" />
        </div>
      </div>
    </div>
  );
};

const ProfileThumbnail = () => {
  const { user } = useUser();
  return (
    <div className=" relative flex flex-col items-center ">
      <div className="h-10 w-10 flex-auto">
        {user?.profileImageUrl ? (
          <div className="z-0 h-10 w-10 flex-auto">
            <Image
              src={user?.profileImageUrl}
              alt="User profile image"
              width={100}
              height={100}
              className=" rounded-lg hover:border hover:border-stone-300"
            />
            <div className="inset-left-0 absolute inset-y-0 z-10 h-10  w-10 rounded-md bg-slate-300 opacity-0 hover:border hover:border-stone-300  hover:opacity-30"></div>
          </div>
        ) : (
          <ThumbnailCircle
            character={user && user.username ? user.username[0] : "?"}
          />
        )}
      </div>
    </div>
  );
};

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const AccountThumbnails = () => {
  const { accounts } = useAccountStore();
  return (
    <div className=" flex flex-col items-center gap-y-4 ">
      {accounts.map((account, index) => {
        if (!account) return;
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThumbnailCircle account={account} />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>
                <p>Select this account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
