import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/api";
import type { Park } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
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

  const {
    mutate,
    isLoading: accountCreating,
    isSuccess,
  } = api.accounts.createAccount.useMutation({
    onSuccess: (data) => {
      updateAccountInfo({ account: data, index: props.index });
      setActiveAccount(props.index);
      setIsChoosingAccount(false);
      // force it to re-fetch
      // do i really need this?
      void ctx.accounts.invalidate();
      console.log("account created");
    },
  });

  const onSubmit = (data: { accountName: string }) => {
    const { accountName } = data;
    const newAccount = {
      name: accountName,
      accountIndex: props.index,
    };
    mutate(newAccount);
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
import { useEffect } from "react";

const AccountSelectionButton = (props: { index: number }) => {
  const { index } = props;
  const {
    accounts,
    setActiveAccount,
    setIsChoosingAccount,
    updateAccountInfo,
  } = useAccountStore();

  const thisAccountIndex = accounts.findIndex((a) => a?.accountIndex === index);
  const thisAccount = accounts[thisAccountIndex];
  const ctx = api.useContext();

  const {
    mutate,
    isLoading: accountDeleting,
    isSuccess: accountDeleted,
  } = api.accounts.deleteAccount.useMutation({
    onSuccess: (numAccountsDeletedFromDB) => {
      updateAccountInfo({ account: null, index: props.index });
      setActiveAccount(null);
      setIsChoosingAccount(true);
      // force it to re-fetch
      // do i really need this?
      void ctx.accounts.invalidate();
      console.log(`${numAccountsDeletedFromDB} rows deleted`);
    },
  });

  const handleDelete = () => {
    const accountID = thisAccount?.id;
    if (accountID && index) {
      console.log(`deleting account ${accountID}, index ${index}`);
      return mutate({ id: accountID, index });
    }
    console.log(`no account to delete`);
  };

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
          <div>
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
            <Button className="bg-stone-400" onClick={() => handleDelete()}>
              Delete Account
            </Button>
          </div>
        )}
      </div>
    );
  }
};

const USER_ACCOUNT_LIMIT = 5;

const AccountSelectionScreen = () => {
  const { user: userLoggedIn } = useUser();
  const { setAccounts, setActiveAccount, account } = useAccountStore();

  const { data: accountsFromDB } = api.accounts.getAccounts.useQuery();
  useEffect(
    () => setAccounts(accountsFromDB ?? []),
    [accountsFromDB, setAccounts, setActiveAccount, account]
  );
  // if (accountsFromDB && accountsFromDB.length > 0 && accounts.length == 0)
  if (!userLoggedIn || !userLoggedIn.id) return <LoginScreen />;

  // get the accounts for the user

  const { isLoading: userLoading } = api.users.getThisUser.useQuery();

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
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { account, isChoosingAccount, setIsChoosingAccount } =
    useAccountStore();

  if (!isSignedIn) {
    return (
      <div className="">
        <LoginScreen />
      </div>
    );
  }

  console.log(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `!!account: ${!!account} isChoosingAccount: ${isChoosingAccount}`
  );
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
            <div className="grid grid-cols-2 py-2">
              <div className="flex justify-center">
                <Button onClick={() => signOut()} className="w-1/2">
                  Sign out
                </Button>
              </div>
              <div className="flex  justify-center">
                <Button
                  className="w-1/2"
                  onClick={() => setIsChoosingAccount(true)}
                >
                  {account.name}
                </Button>
              </div>
            </div>
            <div className="flex justify-center border-b-2 p-2">
              <div>{account.name}&apos;s Parks</div>
            </div>
            <div className="m-4 grid grid-cols-2 gap-4">
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
      </main>
    </>
  );
};

export default Home;
