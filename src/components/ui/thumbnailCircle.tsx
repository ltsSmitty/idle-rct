import { useMemo } from "react";
import { cn } from "~/lib/utils";
import { randomBackgroundColor } from "~/lib/utils";

// which character in the account ID to reference for the background color
const ID_LETTER_INDEX = 7;

export const ThumbnailCircle = (props: {
  account?: Account;
  character?: string;
}) => {
  const { account, character } = props;

  const charToDisplay = character ?? account?.name[0] ?? "?";

  const backgroundColor = useMemo(() => {
    const letterForColorIndex = account?.id[ID_LETTER_INDEX] ?? charToDisplay;
    return randomBackgroundColor(letterForColorIndex);
  }, [account?.id, charToDisplay]);

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-md border text-xl font-bold text-white ",
        backgroundColor,

      )}
    >
      {charToDisplay.toLocaleUpperCase() ?? "?"}
    </div>
  );
};
