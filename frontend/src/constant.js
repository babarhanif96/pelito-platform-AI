import newsFeed from './assets/newsFeed.png'
import services from './assets/services.png'
import appointment from './assets/appointment.png'
import advisory from './assets/advisory.png'
import stem from './assets/stem.png'
import PhotoIcon from '@mui/icons-material/Photo';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WalletIcon from '@mui/icons-material/Wallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import Person2Icon from '@mui/icons-material/Person2';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RedeemIcon from '@mui/icons-material/Redeem';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HelpIcon from '@mui/icons-material/Help';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';       // Trend line with points (modern analytics look)
import QueryStatsIcon from '@mui/icons-material/QueryStats';   // Graph with dots (very data-focused)
import AnalyticsIcon from '@mui/icons-material/Analytics';     // Pie chart style with a spark line
import LeaderboardIcon from '@mui/icons-material/Leaderboard'; 
import PsychologyIcon from '@mui/icons-material/Psychology';

import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';


// export const stripePromise = 'pk_live_51 OIbv9FwNIScBXu60nzQQOTpEAlcPLwnH9WpazLjlodlac5euwODFOuh2pACFby1MgnZGc3AujFklOLBXV4KRgb800dNqqbrV3'
export const stripePromise = 'pk_test_51OIbv9FwNIScBXu6XxW1gAYR3hkFJYUore3sf8XyX1AytalmEvMLpieB9yteDjIXmuezsGxc8SW7yFP4eGE2KD1100EBpD8pdu'

// export const stripePromise = 'pk_test_51QmFk0Dadppy5omFaEICT1MgKF3che88r8lQlqqwjJqdUUvCT3njcNsl69HQDvtEhSzc2SK6Ysb0qo5Dc1P4hgi500ucnx7G0v'

// export const TOKEN_ADDRESS = '0x66A4980F182835e1B92917d1b95c0dbfBC55772b'
export const TOKEN_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'

export const TOKEN_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

export const ADMIN_ADDRESS = '0xf980b8271dabe810eb636ffca9f1a91235826d7d'
// export const ADMIN_ADDRESS = '0x1b377c8aE5E6A6253c8d455320cbd5A63F0e5E0f'

export const FRONTEND_URL = "https://pelito.net"

export const BACKEND_URL = "http://localhost:8000"
// export const BACKEND_URL = "https://server.pelito.net"

export const RPC_URL = 'https://polygon-rpc.com'
// export const RPC_URL = 'https://polygon-mainnet.infura.io/v3/2O5Wir4dxBijQYRqg0GIv0oSS4S'

export const AIRDROP_ADDRESS = '0x3091A63cc1F392a525Fd82697232978bB2f6fAd6'
export const AIRDROP_ABI = [{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimAirdrop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setAirdropAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawExtraTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export const PRESALE_ADDRESS = '0xc319b72871b8724aed892Bf7502570537eB10CfB'
export const PRESALE_ABI = [{"inputs":[{"internalType":"address","name":"_PelitoTokenAddress","type":"address"},{"internalType":"address","name":"_usdtTokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalPrice","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[],"name":"PelitoToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"addStruckTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"buyTokensWithUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"purchasedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenPrice","type":"uint256"}],"name":"setTokenPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawExtraToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFundsUSD","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export const USDT_TOKEN_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'

export const PROFESSIONAL_NAV_DATA = [
    {
        title: 'News Feed',
        route: '/professional/news-feed',
        img: newsFeed,

    },
    {
        title: 'Appointments',
        route: '/professional/appointments',
        img: appointment,
    },
    {
        title: 'Services',
        route: '/professionals',
        img: services,
    },
    {
        title: 'Virtual Profile',
        icon: Person2Icon,
    },
    {
        title: 'Stem Program',
        route: '/professional/stem-program',
        img: stem,
    },
    {
        title: 'Airdrop',
        route: '/professional/airdrop',
        icon: RedeemIcon,
    },
    {
        title: 'Advisory',
        route: '/professional/advisory',
        img: advisory,
    },
    {
        title: 'Crypto Wallet',
        route: '/professional/wallet',
        icon: WalletIcon,
    },
    {
        title: 'Gift Cards',
        route: '/professional/gift-card',
        icon: MonetizationOnIcon,
    },
    {
        title: 'User Guide',
        route: '/professional/user-guide',
        icon: HelpIcon,
    },
    {
        title: 'Business analytics',
        route: '/professional/analytics',
        icon: QueryStatsIcon
    },
    {
        title: 'AI Insights',
        route: '/professional/ai-insights',
        icon: PsychologyIcon
    },
    {
        title: 'Settings',
        route: '/professional/settings',
        icon: SettingsIcon,
    },

]

export const CUSTOMER_NAV_DATA = [
    {
        title: 'News Feed',
        route: '/dashboard',
        img: newsFeed,

    },
    {
        title: 'My Bookings',
        route: '/bookings',
        icon: CalendarMonthIcon,

    },
    {
        title: 'My Products',
        route: '/products',
        icon: InventoryIcon,

    },

    {
        title: 'Services / Stylist',
        route: '/professionals',
        img: services,
    },
    {
        title: 'Stem Program',
        route: '/stem-program',
        img: stem,
    },
    {
        title: 'Airdrop',
        route: '/airdrop',
        icon: RedeemIcon,
    },
    {
        title: 'Settings',
        route: '/settings',
        icon: SettingsIcon,
    },

]

export const ADMIN_NAV_DATA = [
    {
        title: 'News Feed',
        route: '/admin/news-feed',
        img: newsFeed,
    },
    {
        title: 'Users',
        route: '/admin/users',
        icon: PhotoIcon,
    },
    {
        title: 'Transactions',
        route: '/admin/tx',
        icon: CreditCardIcon,
    },
    {
        title: 'Team & Shop Analysis',
        route: '/admin/team-shop-analysis',
        icon: GroupsIcon,
    },

]

