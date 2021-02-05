// import algosdk
const algosdk = require('algosdk');

// API server address and API token
const server = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const token = {
    'X-API-Key': 'q6SxddUqMjGfyRwofxRp69DS98gsfmf2bCv8H9qd'
}

// instantiate the algorand client
const algodclient = new algosdk.Algodv2(token, server, port);

// Utility function to wait for tx confirmaiton
function waitForConfirmation(algodclient, txId) {
    var p = new Promise(function (resolve, reject) {
        console.log("Waiting transaction: " + txId + " to be confirmed...");
        var counter = 1000;
        let interval = setInterval(() => {
            if (--counter === 0) reject("Confirmation Timeout");
            algodclient.pendingTransactionInformation(txId).do().then((pendingInfo) => {
                if (pendingInfo != undefined) {
                    confirmedRound = pendingInfo["confirmed-round"];
                    if (confirmedRound !== null && confirmedRound > 0) {
                        clearInterval(interval);
                        resolve("Transaction confirmed in round " + confirmedRound);
                    }
                }
            }).catch(reject);
        }, 2000);

    });
    return p;
}

// Function for sending payment transaction
function sendPaymentTransaction(account, to, amount) {
    var p = new Promise(function (resolve) {
        // use closeRemainderTo paramerter when you want to close an account
        let closeRemainderTo = undefined;
        // use note parameter when you want to attach a string to the transaction
        let note = undefined;
        algodclient.getTransactionParams().do().then((params) => {
            let txn = algosdk.makePaymentTxnWithSuggestedParams(account.addr, to, amount, closeRemainderTo, note, params);
            // sign the transaction
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
                waitForConfirmation(algodclient, tx.txId)
                    .then(resolve)
                    .catch(console.log);
            }).catch(console.log);
        }).catch(console.log);
    })
    return p;
}


// Function for sending an asset creation transaction
function createAsset(account, assetName, unitName, decimals, totalIssuance, assetUrl, assetMetadataHash, manager, reserve, freeze, clawback, defaultFrozen) {
    var p = new Promise(function (resolve, reject) {
        // get chain parameters for sending transactions
        algodclient.getTransactionParams().do().then((params) => {
            // use note parameter when you want to attach a string to the transaction
            let note = undefined;
            // construct the asset creation transaction 
            let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(account.addr, note, totalIssuance, decimals, defaultFrozen,
                manager, reserve, freeze, clawback, unitName, assetName, assetUrl, assetMetadataHash, params);
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
                waitForConfirmation(algodclient, tx.txId).then((msg) => {
                    console.log(msg);
                    algodclient.pendingTransactionInformation(tx.txId).do().then((ptx) => {
                        // get the asset ID
                        let assetId = ptx["asset-index"];
                        resolve(assetId);
                    }).catch(reject);
                }).catch(console.log);
        }).catch(console.log);
    }).catch(reject);
})
return p;
}

// Function for sending asset transaction
function sendAssetTransaction(account, to, amount, assetId) {
    var p = new Promise(function (resolve) {
        // use closeRemainderTo paramerter when you want to close an account
        let closeRemainderTo = undefined;
        // use note parameter when you want to attach a string to the transaction
        let note = undefined;
        // use revocationTarget when you want to clawback assets
        let revocationTarget = undefined;
        algodclient.getTransactionParams().do().then((params) => {
            let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(account.addr, to, closeRemainderTo, revocationTarget,
                amount, note, assetId, params);       
            // sign the transaction
            var signedTxn = algosdk.signTransaction(txn, account.sk);
            algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
                waitForConfirmation(algodclient, tx.txId)
                    .then(resolve)
                    .catch(console.log);
            }).catch(console.log);
        }).catch(console.log);
    })
    return p;
}

module.exports = {
    sendPaymentTransaction,
    createAsset,
    sendAssetTransaction
}