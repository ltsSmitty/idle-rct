import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/api";
import type { Park, Account } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { scenarios } from "~/scenarios/backyard";

import { api } from "~/utils/api";

const PLACEHOLDER_THUMBNAIL_URL = "https://source.unsplash.com/random";

const ScenarioCard = (props: {
  scenario: Scenario;
  width: number;
  height: number;
}) => {
  const { scenario, width, height } = props;
  return (
    <div className="flex justify-center border-2">
      <div className="">
        <Image
          src={scenario.imagePath}
          alt="The thumbnail for the park"
          width={width}
          height={height}
        />
        <div className="flex justify-center">{scenario.name}</div>
      </div>
    </div>
  );
};

const ParkMenuSelection = (props: {
  park: Park;
  width: number;
  height: number;
}) => {
  const { park, width, height } = props;
  const thumbnailURL = park.thumbnailUrl ?? PLACEHOLDER_THUMBNAIL_URL;
  return (
    <div className="flex justify-center border-2">
      <div className="">
        <Image
          unoptimized
          src={thumbnailURL}
          alt="The thumbnail for the park"
          width={width}
          height={height}
        />
        <div className="flex justify-center">{park.name}</div>
      </div>
    </div>
  );
};

const LoginScreen = () => {
  return (
    <div className="flex h-screen justify-center ">
      <div className="  w-full border-x-2 md:max-w-4xl">
        <div className="">
          <div className="flex justify-center border-b-2 p-2">
            <SignInButton />
          </div>
          <div className="m-4 grid grid-cols-2 gap-4"></div>
        </div>
      </div>
    </div>
  );
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const AccountSelectionButton = (props: {
  account?: Account;
  index: number;
}) => {
  const { account, index } = props;

  if (!account) {
    return (
      <div className=" static m-2 flex h-32 flex-col rounded-lg border-2 border-slate-400 bg-stone-600">
        <div className=" left-0 p-2">Account {index}</div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex-grow text-lg">Create New Account</button>
          </DialogTrigger>
          <DialogContent className="bg-emerald-700">
            <DialogHeader>
              <div className="text-emerald-500">
                <DialogTitle className=" underline">New Account</DialogTitle>
              </div>
              <DialogDescription className="text-stone-700">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <div>Account {index}</div>
      <div>
        <div>{account?.accountName}</div>
      </div>
    </div>
  );
};

const USER_ACCOUNT_LIMIT = 5;

const AccountSelectionScreen = () => {
  const { user: userLoggedIn } = useUser();

  if (!userLoggedIn || !userLoggedIn.id) return <LoginScreen />;

  // get the accounts for the user

  const thisUser = api.users.getThisUser.useQuery();
  console.log(`this user: ${JSON.stringify(thisUser)}`);
  const { data: accounts } = api.users.getAccounts.useQuery();
  console.log(`accounts: ${JSON.stringify(accounts)}`);

  return (
    <div className="flex h-screen justify-center ">
      <div className="  w-full border-x-2 border-stone-400 md:max-w-4xl">
        <div className="">
          <div className="flex justify-center border-b-2  p-2">
            <div>Account Selection</div>
          </div>
          <div className="grid grid-cols-1">
            {Array.from({ length: USER_ACCOUNT_LIMIT }, (_, i) => i + 1).map(
              (idx) => (
                <AccountSelectionButton
                  account={accounts?.[idx]}
                  key={idx}
                  index={idx}
                />
              )
            )}
          </div>
          <div className="m-4 grid grid-cols-2 gap-4"></div>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { user, isSignedIn } = useUser();
  console.log(JSON.stringify(`client side user: ${JSON.stringify(user)}`));
  const [account, setAccount] = useState<Account | null>(null);

  if (!isSignedIn) {
    return (
      <div className="">
        <LoginScreen />
      </div>
    );
  }

  if (!account || true) {
    console.log(`No account selected`);
    return (
      <div className="">
        <AccountSelectionScreen />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen justify-center ">
          <div className="  w-full border-x-2 md:max-w-4xl">
            <div className="">
              <SignOutButton />
              <div className="flex justify-center border-b-2 p-2">
                <div>Your Parks</div>
              </div>
              <div className="m-4 grid grid-cols-2 gap-4">
                {/* {parkData?.map((park) => (
                  <ParkMenuSelection
                    park={park}
                    width={200}
                    height={200}
                    key={park.id}
                  />
                ))} */}
                {scenarios.map((scenario, idx) => (
                  <ScenarioCard
                    scenario={scenario}
                    key={idx}
                    width={320}
                    height={320}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
