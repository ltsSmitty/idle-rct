import { type NextPage } from "next";
import { useStore } from "~/stores/slices/allStateInOneWithoutActions";
import { GuestActivity } from "~/types/GuestActivity";
import actions from "~/stores/slices/allStoreActions";
import { GameController } from "~/stores/slices/gameController";
import { useRef } from "react";
import { type Upgrade } from "~/stores/slices/upgradeSlice";

const GuestStatBar = ({
  value,
  impact,
  text,
}: {
  value: number;
  impact: "positive" | "negative";
  text: string;
}) => {
  return (
    <div className=" my-1 block ">
      <div className="inline-flex w-full">
        <div className=" w-8">{text}</div>
        <div className="w-11/12 rounded-sm  border-2 border-b-stone-700 border-l-stone-900 border-r-stone-700 border-t-stone-900 bg-stone-300">
          <div
            className={` h-full ${
              value > 0
                ? impact === "negative"
                  ? "border-2 border-b-rose-700 border-l-rose-900 border-r-rose-700 border-t-rose-900 bg-rose-700"
                  : "border-2 border-b-green-400 border-l-green-600 border-r-green-400 border-t-green-600 bg-green-500"
                : ""
            }`}
            style={{ width: `${clamp(value * 10, 0, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const GuestStatDisplay = ({ guest }: { guest?: Guest }) => {
  return (
    <div>
      <GuestStatBar
        value={guest?.happiness ?? 10}
        impact="positive"
        text="😊"
      />
      <GuestStatBar value={guest?.energy ?? 10} impact="positive" text="🏃🏼‍♂️" />
      <GuestStatBar value={guest?.hunger ?? 3.9} impact="negative" text="🥗" />
      <GuestStatBar value={guest?.thirst ?? 4} impact="negative" text="🥤" />
      <GuestStatBar value={guest?.nausea ?? 4.1} impact="negative" text="🤢" />
      <GuestStatBar value={guest?.toilet ?? 4.3} impact="negative" text="🚽" />
    </div>
  );
};

const UpgradeDisplay = ({ upgrade }: { upgrade: Upgrade }) => {
  const money = useStore((state) => state.money);

  const acquireIfPossible = () => {
    if (upgrade.isAcquired) {
      console.log("already acquired");
      return;
    }
    // if (upgrade.cost > money) {
    //   console.log("not enough money");
    //   return;
    // }
    console.log(`acquiring ${upgrade.name}`);
    actions.acquireUpgrade(upgrade);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        upgrade.isAcquired ? "bg-stone-400" : "bg-stone-800"
      } m-2 cursor-pointer rounded-md p-2 ${
        upgrade.cost > money ? "opacity-50" : ""
      }`}
      onClick={() => acquireIfPossible()}
    >
      <div className="text-lg font-bold">{upgrade.name}</div>
      <div className="text-sm">Cost: {upgrade.cost}</div>
      <div className="text-sm"> {upgrade.description}</div>
    </div>
  );
};

const UpgradeDisplayColumns = ({ upgrades }: { upgrades: Upgrade[] }) => {
  return (
    <div className="flex flex-wrap">
      {upgrades.map((upgrade) => {
        return (
          <div key={upgrade.name} className="w-1/2 flex-none select-none">
            <UpgradeDisplay upgrade={upgrade} />
          </div>
        );
      })}
    </div>
  );
};

const GuestDisplayColumns = ({ guests }: { guests: Guest[] }) => {
  const renderRef = useRef(1);
  renderRef.current++;
  console.log(guests, JSON.stringify(guests));

  return (
    <div className="flex flex-wrap">
      {guests?.map((guest) => {
        return (
          <div
            key={guest.id}
            className="w-1/2 flex-none select-none"
            // onClick={() => updateGuestActivity(guest.id, getRandomActivity())}
          >
            <GuestDisplay guest={guest} />
            <div className="">{renderRef.current}</div>
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
  const guestsRef = useRef(guests);
  guestsRef.current = guests;

  const tick = useStore((state) => state.tick);
  const tickRef = useRef(tick);
  tickRef.current = tick;

  return (
    <div className="flex h-12 w-auto select-none items-center justify-center rounded-md bg-stone-800 align-middle hover:bg-stone-400">
      <div className="">
        <div className="">
          <span className="pr-1 text-lg">{guestsRef.current.length}</span>
          <span className="text-md ">👤</span>
        </div>
        <div>
          <span className="text-xs">Tick: {tickRef.current}</span>
        </div>
      </div>
    </div>
  );
};

const NextTickButton = () => {
  return (
    <button
      className="my-2 flex h-10 w-10 items-center justify-center rounded-md bg-stone-800 pr-1 align-middle text-lg hover:bg-stone-400"
      onClick={actions.doTick}
    >
      👉
    </button>
  );
};

const GuestGenerationRateDisplay = () => {
  const guestGenerationRate = useStore((state) => state.rate);
  return (
    <div className="flex h-12 w-auto select-none items-center justify-center rounded-md bg-stone-800 align-middle hover:bg-stone-400">
      <span className="pr-1 text-lg">{guestGenerationRate}</span>
      <span className="text-md ">% chance 👤/tick</span>
    </div>
  );
};

const PlayPage: NextPage = () => {
  const upgrades = useStore((state) => state.upgrades);
  const guests = useStore((state) => state.guests);
  const guestsRef = useRef(guests);
  guestsRef.current = guests;

  return (
    <div className="">
      <GameController />
      <div className="max max-w-[400px] bg-stone-600">
        <div className="h-screen justify-end p-2">
          <GuestDisplayThumbnail />
          <NextTickButton />
          <GuestGenerationRateDisplay />
          <GuestStatDisplay guest={guests[0]} />
          <UpgradeDisplayColumns upgrades={upgrades} />
          <GuestDisplayColumns guests={guestsRef.current} />
        </div>
      </div>
    </div>
  );
};

export default PlayPage;

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
