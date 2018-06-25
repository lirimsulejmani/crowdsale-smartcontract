const AlfaToken = artifacts.require("./AlfaToken.sol");
const AlfaTokenOffering = artifacts.require("./AlfaTokenOffering.sol");
const AlfaPayments = artifacts.require("./AlfaPayments.sol");

module.exports = function (deployer, network, accounts) {
    console.log(`Accounts: ${accounts}`);

    let alfaToken = null;
    let alfaOffering = null;
    let alfaPayments = null;

    const owner = accounts[0];
    const admin = accounts[1];

    return deployer.deploy(
        AlfaToken, admin, { from: owner }
    ).then(() => {
        return AlfaToken.deployed().then(instance => {
            alfaToken = instance;
            console.log(`AlfaToken deployed at \x1b[36m${instance.address}\x1b[0m`)
        });
    }).then(() => {
        const rate = 5000;
        const beneficiary = accounts[1];
        const baseCap = 10**17;

        return deployer.deploy(
            AlfaTokenOffering, rate, beneficiary, baseCap, alfaToken.address, { from: owner }
        ).then(() => {
            return AlfaTokenOffering.deployed().then(instance => {
                alfaOffering = instance;
                console.log(`AlfaTokenOffering deployed at \x1b[36m${instance.address}\x1b[0m`)

                alfaToken.setTokenOffering(instance.address, 0);
            });
        })
    }).then(() => {
        const arbitrationAddress = accounts[1];
        const arbitrationFee = 10;
        return deployer.deploy(
            AlfaPayments, arbitrationAddress, arbitrationFee, { from: owner }
        ).then(() => {
            return AlfaPayments.deployed().then(instance => {
                alfaPayments = instance;
                console.log(`AlfaPayments deployed at \x1b[36m${instance.address}\x1b[0m`)
            })
        })
    });
};