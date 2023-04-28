import { type NextPage } from "next";

const GuestDisplayThumbnail = () => {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-800 align-middle hover:bg-stone-400">
      <div className="">
        <div className="">
          <span className="pr-1 text-lg">2</span>
          <span className="text-md">👤</span>
        </div>
      </div>
    </div>
  );
};

const PlayPage: NextPage = () => {
  return (
    <div className="max max-w-[400px] bg-stone-600">
      <div className="flex h-screen justify-end p-2">
        <GuestDisplayThumbnail />
      </div>
    </div>
  );
};

export default PlayPage;
