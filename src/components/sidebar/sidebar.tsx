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
    <div className="flex w-16 flex-col ">
      <div className=" justify-center">
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
    <div className=" flex flex-col items-center ">
      {user?.profileImageUrl ? (
        <Image
          src={user?.profileImageUrl}
          alt="The thumbnail for the park"
          width={100}
          height={100}
          className=" h-10 w-10 flex-auto rounded-lg border border-stone-300"
        />
      ) : (
        <ThumbnailCircle
          character={user && user.username ? user.username[0] : "?"}
        />
      )}
    </div>
  );
};

const AccountThumbnails = () => {
  const { accounts } = useAccountStore();
  return (
    <div className=" flex flex-col items-center gap-y-2 ">
      {accounts.map((account, index) => {
        if (!account) return;
        return (
          <div key={index} className="  ">
            <ThumbnailCircle account={account} />
          </div>
        );
      })}
    </div>
  );
};
