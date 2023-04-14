import { create } from 'zustand';


interface AccountState {
    account: Account | null,
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
    setActiveAccount: (index) => {
        console.log(`setAccount: ${index ?? 0}`)
        const { accounts } = useAccountStore.getState()
        console.log(`accounts: ${JSON.stringify(accounts)}`)
        if (index != null && accounts[index - 1]) {
            console.log(`actually setting account to ${JSON.stringify(accounts[index])}`)
            set({ account: accounts[index - 1] })
        }
    },
    isChoosingAccount: true,
    // score: 0,
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