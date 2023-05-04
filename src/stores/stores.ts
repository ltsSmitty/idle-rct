import { create } from 'zustand';


interface AccountState {
    readonly account: Account | null,
    accounts: (Account | null)[],
    isChoosingAccount: boolean,
    setActiveAccount: (index: number | null) => void,
    updateAccountInfo: (props: { account: Account | null, index: number }) => void,
    setAccounts: (accounts: Account[]) => void,
    setIsChoosingAccount: (choosingAccount: boolean) => void,
}

export const useAccountStore = create<AccountState>()((set) => ({
    account: null,
    accounts: [],
    isChoosingAccount: true,
    setActiveAccount: (index) => {
        const { accounts } = useAccountStore.getState()
        if (index != null && accounts[index]) {
            set({ account: accounts[index] })
        }
    },
    updateAccountInfo: ({ account, index }) => {
        const { accounts } = useAccountStore.getState()
        if (index != null && accounts[index])
            set({ accounts: accounts.map((a, i) => i === index ? account : a) })
    },
    setAccounts: (accounts) => {
        console.log(`setting accounts in store: ${JSON.stringify(accounts)}`)
        set({ accounts })
    },
    setIsChoosingAccount: (isChoosingAccount) => set({ isChoosingAccount }),
}))

