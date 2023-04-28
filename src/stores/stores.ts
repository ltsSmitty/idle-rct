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

const ids = [...Array<number>(150)].map((_, i) => i);

const calcXY = (): [number, number] => [Math.random() * window.innerWidth, Math.random() * window.innerHeight]

interface ItemProps {
    items: [number, number][]
}

const useStore = create((set) => ({
    items: ids,
    ...(Object.fromEntries(ids.map((id) => [id, calcXY()])) as Record<number, [number, number]>),
    advance() {
        // Set all coordinates randomly
        set((state) => {
            const coords = {}
            for (let i = 0; i < state.items.length; i++) coords[state.items[i]] = calcXY()
            return coords
        })
    }
}))
