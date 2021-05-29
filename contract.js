const algo = require("./algo");
const algosdk = require('algosdk');

// Alice account: 2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA
const aliceMnemonic = "bench outdoor conduct easily pony normal memory boat tiger together catch toward submit web stomach insane other list clap grain photo excess crush absorb illness";
const aliceAccount = algosdk.mnemonicToSecretKey(aliceMnemonic);

// Bob account: B7K3C7ZOG5JMVMDZRUZ6HWWZYCXYBPNZADAP3MLTZE5MUA56DK4SU762M4
const bobMnemonic = "road pigeon recipe process tube voyage syrup favorite near harvest upset survey baby maze all hamster peace define human foil hurdle sponsor panda absorb lamp";
const bobAccount = algosdk.mnemonicToSecretKey(bobMnemonic);

algo.compileContract('limit-order.teal').then((contract) => {
    const programBytes = Buffer.from(contract.result, 'base64');
    const lsig = new algosdk.makeLogicSig(programBytes,undefined);
    const contractAddress = lsig.address();
    console.log(contractAddress);
    // charge the contract 
    algo.sendPaymentTransaction(aliceAccount,contractAddress,10+200000).then(() => {
         algo.sendSwapTransaction(bobAccount,contractAddress,lsig).then(console.log).catch(console.log);
    }).catch(console.log);
}).catch(console.log);





