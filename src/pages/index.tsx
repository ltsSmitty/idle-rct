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

import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
const NewAccountForm = (props: { index: number }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountName: "accountName",
    },
  });

  const { setActiveAccount, setIsChoosingAccount, updateAccountInfo } =
    useAccountStore();

  const ctx = api.useContext();

  const { mutate, isLoading: accountCreating } =
    api.users.createAccount.useMutation({
      onSuccess: (data) => {
        // force it to re-fetch
        // do i really need this?
        console.log(`mutation success. data: ${JSON.stringify(data)}`);
        updateAccountInfo({ account: data, index: props.index });
        setActiveAccount(props.index);
        setIsChoosingAccount(false);
        void ctx.users.invalidate();
      },
      onError: (error) => {
        console.log(`mutation error. error: ${JSON.stringify(error)}`);
      },
    });

  const onSubmit = (data: { accountName: string }) => {
    const { accountName } = data;
    const newAccount = {
      name: accountName,
      accountIndex: props.index,
    };
    const res = mutate(newAccount);
  };

  return (
    <div>
      {!accountCreating && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <div className="flex flex-col">
            <div className="flex flex-row">
              <input
                defaultValue="account name"
                {...register("accountName", {
                  required: "An account name is required",
                  maxLength: {
                    value: 150,
                    message: "Your account name is too long",
                  },
                })}
                className=" w-1/2 rounded-sm border-2 text-stone-500"
              />
              <div className="pl-4">
                <Button type="submit" className=" rounded-sm bg-stone-400 px-4">
                  Submit
                </Button>
              </div>
            </div>
            {/* errors will return when field validation fails  */}
            {errors.accountName && <p>{errors.accountName?.message}</p>}
          </div>
        </form>
      )}
      <div>Creating account...</div>
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
import { useAccountStore } from "~/stores/stores";

const AccountSelectionButton = (props: {
  account?: Account;
  index: number;
}) => {
  const { index } = props;
  const { accounts, setActiveAccount, setIsChoosingAccount } =
    useAccountStore();

  const thisAccountIndex = accounts.findIndex((a) => a.accountIndex === index);
  const thisAccount = accounts[thisAccountIndex];

  console.log(
    `in account selection button ${index}: ${JSON.stringify(thisAccount)}}`
  );

  {
    return (
      <div className=" static m-2 flex h-32 flex-col rounded-lg border-2 border-slate-400 bg-stone-600">
        {!thisAccount && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex-grow text-lg">
                <div className="p-2">Account {index}</div>
                Create New Account
              </button>
            </DialogTrigger>
            <DialogContent className="h-40">
              <DialogHeader>
                <DialogTitle className=" underline">
                  New Account in slot {index}
                </DialogTitle>
                <DialogDescription>
                  Choose a name for your new account. This can be changed later.
                </DialogDescription>
                <NewAccountForm index={index} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
        {thisAccount && (
          <button
            className="flex-grow text-lg"
            onClick={() => {
              setActiveAccount(thisAccountIndex);
              setIsChoosingAccount(false);
            }}
          >
            {/* <div className="flex-grow place-content-center text-center text-lg"> */}
            <div className=" p-2 align-middle text-lg">
              Select account:
              <span className="p-4 text-xl">{thisAccount.name}</span>
            </div>
          </button>
        )}
      </div>
    );
  }
};

const USER_ACCOUNT_LIMIT = 5;

const AccountSelectionScreen = () => {
  const { user: userLoggedIn } = useUser();

  if (!userLoggedIn || !userLoggedIn.id) return <LoginScreen />;

  // get the accounts for the user

  const { data: thisUser, isLoading: userLoading } =
    api.users.getThisUser.useQuery();
  console.log(`this user: ${JSON.stringify(thisUser)}`);

  if (userLoading) return <div> user loading</div>;

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
                <AccountSelectionButton key={idx} index={idx} />
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
  const {
    account,
    isChoosingAccount,
    setIsChoosingAccount,
    setAccounts,
    accounts,
  } = useAccountStore();
  const accountsFromDB = api.users.getAccounts.useQuery().data;
  console.log(`accounts from db: ${JSON.stringify(accountsFromDB)}`);
  console.log(`accounts in state: ${JSON.stringify(accounts)}`);

  if (accountsFromDB && accountsFromDB.length > 0 && accounts.length == 0)
    setAccounts(accountsFromDB);

  if (!isSignedIn) {
    return (
      <div className="">
        <LoginScreen />
      </div>
    );
  }

  if (!account || isChoosingAccount) {
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
              <div>
                <Button onClick={() => setIsChoosingAccount(true)}>
                  {" "}
                  Choose a different account
                </Button>
              </div>
              <div className="flex justify-center border-b-2 p-2">
                <div>{account.name}&apos;s Parks</div>
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
