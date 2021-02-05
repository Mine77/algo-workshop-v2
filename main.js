const algo = require("./algo");
const algosdk = require('algosdk');

// Alice Account: 2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA
const aliceMnemonic = "bench outdoor conduct easily pony normal memory boat tiger together catch toward submit web stomach insane other list clap grain photo excess crush absorb illness";
const aliceAccount = algosdk.mnemonicToSecretKey(aliceMnemonic);

// Bob Account: B7K3C7ZOG5JMVMDZRUZ6HWWZYCXYBPNZADAP3MLTZE5MUA56DK4SU762M4
const bobMnemonic = "road pigeon recipe process tube voyage syrup favorite near harvest upset survey baby maze all hamster peace define human foil hurdle sponsor panda absorb lamp";
const bobAccount = algosdk.mnemonicToSecretKey(bobMnemonic);

// // create an account
// var account = algosdk.generateAccount();
// console.log(account);

// send a payment transaction
algo.sendPaymentTransaction(aliceAccount, bobAccount.addr, 10).then(console.log).catch(console.log);


// let account = aliceAccount;
// let assetName = "Hackathon Token";
// let unitName = "HT";
// let decimals = 2;
// let totalIssuance = 100;
// let assetUrl = "https://algorand.foundation/";
// let assetMetadataHash = undefined;
// let manager = aliceAccount.addr;
// let reserve = aliceAccount.addr;
// let freeze = aliceAccount.addr;
// let clawback = aliceAccount.addr;
// let defaultFrozen = false;
// let amount = 10;

// algo.createAsset(account, assetName, unitName, decimals, totalIssuance, assetUrl, assetMetadataHash, manager, reserve, freeze, clawback, defaultFrozen)
//     .then((assetId)=>{
//         algo.sendAssetTransaction(bobAccount,bobAccount.addr,0,assetId).then((msg)=>{
//             console.log(msg);
//             algo.sendAssetTransaction(aliceAccount,bobAccount.addr,amount,assetId).then(console.log).catch(console.log);
//         }).catch(console.log);
//     }).catch(console.log);