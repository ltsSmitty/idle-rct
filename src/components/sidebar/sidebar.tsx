import { useUser } from "@clerk/nextjs";
import { useAccountStore } from "~/stores/stores";
import { HorizontalBar } from "../ui/sidebarHorizontalDivider";
import { ThumbnailCircle } from "../ui/thumbnailCircle";
import Image from "next/image";

export const UserSidebar = () => {
  // return a vertical bar sticky to the left side of the screen with a round button for the user's avatar and buttons below which are for the user's accounts, also in round buttons

  return (
    <div className="flex h-full w-16 flex-col bg-stone-800">
      <div className=" mt-10 flex h-full flex-col gap-6">
        <div className="">
          <ProfileThumbnail />
        </div>
        <div className="">
          <HorizontalBar />
        </div>
        <div className="">
          <AccountThumbnails />
        </div>
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

import login from "~/assets/images/login.svg";

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
          <Image
            src={login as string}
            alt="User profile image"
            width={100}
            height={100}
            className=" rounded-lg hover:border hover:border-stone-300"
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
  const {
    account: thisAccount,
    accounts,
    setActiveAccount,
    setIsChoosingAccount,
  } = useAccountStore();

  const handleAccountClick = (props: { accountID: string }) => {
    if (thisAccount?.id != props.accountID) {
      const accountIndex = accounts.findIndex(
        (account) => account?.id === props.accountID
      );
      setActiveAccount(accountIndex);
      setIsChoosingAccount(false);
    }
  };

  return (
    <div className=" flex flex-col items-center gap-y-6 ">
      {accounts.map((account, index) => {
        if (!account) return null;
        return (
          <TooltipProvider
            key={index}
            delayDuration={50}
            disableHoverableContent={true}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    handleAccountClick({
                      accountID: account.id,
                    })
                  }
                  className={
                    account.id === thisAccount?.id
                      ? " rounded-lg border-2 border-stone-300"
                      : "border-2 border-transparent"
                  }
                >
                  <ThumbnailCircle account={account} />
                </button>
              </TooltipTrigger>
              <TooltipContent className=" absolute left-10  my-0.5 h-10 border-2 border-transparent">
                <p className="whitespace-nowrap">{account.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
