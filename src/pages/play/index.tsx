import { type NextPage } from "next";
import { useStore } from "~/stores/slices/allStateInOneWithoutActions";
import { GuestActivity } from "~/types/GuestActivity";
import doTick from "~/stores/slices/allStoreActions";

const GuestDisplayColumns = ({ guests }: { guests: Guest[] }) => {
  // const { updateGuestActivity } = useBoundGameState();

  const getRandomActivity = () => {
    const activities = Object.values(GuestActivity);
    return (
      activities[Math.floor(Math.random() * activities.length)] ??
      GuestActivity.GONE
    );
  };
  return (
    <div className="flex flex-wrap">
      {guests.map((guest) => {
        return (
          <div
            key={guest.id}
            className="w-1/2 flex-none select-none"
            // onClick={() => updateGuestActivity(guest.id, getRandomActivity())}
          >
            <GuestDisplay guest={guest} />
          </div>
        );
      })}
    </div>
  );
};

const GuestDisplay = ({ guest }: { guest: Guest }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="text-lg font-bold">{guest.name}</div>
    <div className="text-sm">🚶🏻‍♀️: {guest.currentActivity}</div>
    <div className="text-sm">🥤: {guest.thirst.toFixed(2)}</div>
    <div className="text-sm">
      📍: ({guest.location.x.toFixed()}, {guest.location.y.toFixed()},
      {guest.location.z.toFixed()})
    </div>
  </div>
);

const GuestDisplayThumbnail = () => {
  const guests = useStore((state) => state.guests);
  const tick = useStore((state) => state.tick);

  return (
    <div className="flex h-12 w-12 select-none items-center justify-center rounded-md bg-stone-800 align-middle hover:bg-stone-400">
      <div className="">
        <div className="">
          <span className="pr-1 text-lg">{guests.length}</span>
          <span className="text-md ">👤</span>
        </div>
        <div>
          <span className="text-xs">Tick: {tick}</span>
        </div>
      </div>
    </div>
  );
};

const NextTickButton = () => {
  return (
    <button
      className="my-2 flex h-10 w-10 items-center justify-center rounded-md bg-stone-800 pr-1 align-middle text-lg hover:bg-stone-400"
      onClick={doTick}
    >
      👉
    </button>
  );
};

const PlayPage: NextPage = () => {
  const guests = useStore((state) => state.guests);

  return (
    <div className="max max-w-[400px] bg-stone-600">
      <div className="h-screen justify-end p-2">
        <GuestDisplayThumbnail />
        <NextTickButton />
        <GuestDisplayColumns guests={guests} />
      </div>
    </div>
  );
};

export default PlayPage;
