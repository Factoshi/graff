module.exports = async function(cli) {
    const tx = await cli.createEntryCreditPurchaseTransaction(
        'FA2jK2HcLnRdS94dEcU27rF3meoJfpUcZPSinpb7AwQvPRY6RL1Q',
        'EC3b6ph71PXiXorFnStNNPNP8mF4YkZMQwQxH4oNs52HvXiXgjar',
        10000
    );
    await cli.sendTransaction(tx);
};
