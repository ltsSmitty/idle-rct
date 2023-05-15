import { type NextPage } from "next";
import { useStore } from "~/stores/slices/allStateInOneWithoutActions";
import { doTick, acquireUpgrade } from "~/stores/actions";
import { GameController } from "~/stores/slices/gameController";
import { useRef } from "react";
import { type Upgrade } from "~/stores/slices/upgradeSlice";
import { setActivityEffectValue } from "~/stores/actions";
import { Slider } from "~/components/ui/slider";
import {
  GuestActivity,
  GuestActivityKey,
} from "~/stores/slices/activityEffectSlice";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ActivityKeys } from "~/stores/slices/activityEffectSlice";

const ModifierSlider = (props: {
  activity: GuestActivityKey;
  keyString: keyof ActivityKeys;
}) => {
  const { activity, keyString: key } = props;

  const onSliderChange = (value: number[]) => {
    setActivityEffectValue({
      activity,
      value: {
        ...activityEffectStats[activity],
        [key]: value[0],
      },
    });
  };

  const activityEffectStats = useStore((state) => state.activityEffectStats);

  const activityKeys = activityEffectStats[activity];
  return (
    <div className="flex flex-row">
      <div className="w-20 text-sm ">{key}</div>
      <Slider
        className="w-1/2 rounded-md "
        defaultValue={[activityKeys[key]]}
        max={10}
        min={-10}
        step={1}
        onValueChange={onSliderChange}
      />
      <div className="ml-1"> {activityKeys[key]} </div>
    </div>
  );
};

const ActivityStatModifierCard = (props: { activity: GuestActivityKey }) => {
  const { activity } = props;

  return (
    <div className="">
      <div className="text-lg font-bold">{activity}</div>
      <ModifierSlider activity={activity} keyString="happiness" />
      <ModifierSlider activity={activity} keyString="energy" />
      <ModifierSlider activity={activity} keyString="hunger" />
      <ModifierSlider activity={activity} keyString="thirst" />
      <ModifierSlider activity={activity} keyString="nausea" />
      <ModifierSlider activity={activity} keyString="toilet" />
    </div>
  );
};

const ActivityStatModifierDisplay = () => {
  const activities = (Object.keys(GuestActivity) as GuestActivityKey[]).filter(
    (a) => a !== "GONE"
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {activities.map((activity) => {
        return (
          <div className="w-48" key={activity}>
            <ActivityStatModifierCard activity={activity} />
          </div>
        );
      })}
    </div>
  );
};

const GuestStatBar = ({
  value,
  impact,
  text,
  alt,
}: {
  value: number;
  impact: "positive" | "negative";
  text: string;
  alt: string;
}) => {
  return (
    <div className=" my-4 block ">
      <TooltipProvider delayDuration={50} disableHoverableContent={true}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex w-full ">
              <div className=" w-8">{text}</div>
              <div className="w-11/12 rounded-md  bg-stone-300">
                <div
                  className={` h-full rounded-sm ${
                    value > 0
                      ? impact === "negative"
                        ? "bg-red-700"
                        : "bg-green-500"
                      : ""
                  }`}
                  style={{ width: `${clamp(value, 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className=" absolute left-0  my-0.5 h-10 border-2 border-transparent">
            <p className="whitespace-nowrap">
              {alt}: {value.toFixed(1)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const GuestNauseaToleranceBar = ({ guest }: { guest: Guest | undefined }) => {
  const nauseaPreference = guest?.nauseaToleranceRange.lowerBound;
  if (!nauseaPreference) {
    return <div></div>;
  }
  return (
    <div>
      Nausea tolerance:{" "}
      {nauseaPreference < 1
        ? "Low"
          ? nauseaPreference < 3
          : "Average"
        : "High"}
    </div>
  );
};

const PreferredIntensityBar = ({ guest }: { guest: Guest | undefined }) => {
  const preferredIntensity = guest?.intensityPreferenceRange.lowerBound;
  if (!preferredIntensity) {
    return <div></div>;
  }
  return (
    <div>
      Preferred intensity:{" "}
      {preferredIntensity < 1
        ? "Low"
          ? preferredIntensity < 3
          : "Average"
        : "High"}
    </div>
  );
};

const GuestStatDisplay = ({ guest }: { guest?: Guest }) => {
  return (
    <div className="">
      <GuestStatBar
        value={guest?.happiness ?? 100}
        impact="positive"
        text="😊"
        alt="Happiness"
      />
      <GuestStatBar
        value={guest?.energy ?? 100}
        impact="positive"
        text="⚡️"
        alt="Energy"
      />
      <GuestStatBar
        value={guest?.hunger ?? 39}
        impact="negative"
        text="🍕"
        alt="Hunger"
      />
      <GuestStatBar
        value={guest?.thirst ?? 40}
        impact="negative"
        text="🥤"
        alt="Thirst"
      />
      <GuestStatBar
        value={guest?.nausea ?? 41}
        impact="negative"
        text="🤢"
        alt="Nausea"
      />
      <GuestStatBar
        value={guest?.toilet ?? 43}
        impact="negative"
        text="🚽"
        alt="Toilet"
      />
      <PreferredIntensityBar guest={guest} />
      <GuestNauseaToleranceBar guest={guest} />
      <div className="">⏱️ {guest?.ticksTilActivityChange}</div>
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

    acquireUpgrade(upgrade);
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
      onClick={doTick}
    >
      👉
    </button>
  );
};

const GuestGenerationRateDisplay = () => {
  const guestGenerationRate = useStore((state) => state.rate);
  return (
    <div className="flex h-12 w-auto select-none items-center justify-center rounded-md bg-stone-800 align-middle hover:bg-stone-400">
      <span className="pr-1 text-lg">{guestGenerationRate.toFixed(2)}</span>
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
      <div className="flex">
        <div className=" max max-w-[400px] flex-none bg-stone-600">
          <div className="h-screen justify-end p-2">
            <GuestDisplayThumbnail />
            <NextTickButton />
            <GuestGenerationRateDisplay />
            <GuestStatDisplay guest={guests[0]} />
            <UpgradeDisplayColumns upgrades={upgrades} />
            <GuestDisplayColumns guests={guestsRef.current} />
          </div>
        </div>
        <div className="max-w-[400]">
          {/* <ActivityStatModifierDisplay /> */}
        </div>
      </div>
    </div>
  );
};

export default PlayPage;

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
