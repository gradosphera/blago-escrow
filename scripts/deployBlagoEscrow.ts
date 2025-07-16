import { Address, toNano } from '@ton/core';
import { BlagoEscrow, createDefaultBlagoEscrowConfig } from '../wrappers/BlagoEscrow';
import { compile, NetworkProvider } from '@ton/blueprint';
import { OpenedContract } from '@ton/core/dist/contract/openContract';
import { JettonMaster } from '@ton/ton';

// Authorized jetton master addresses
export const JETTON_MASTERS = {
    USDT: Address.parse('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'),
    BLG: Address.parse('EQBlaryI1HCY6hIlW9giBoqKGtuMHfxlULZOhD6UyzpqLcll'),
};

export async function run(provider: NetworkProvider) {
    // Use the deployer address as the sudoer
    const sudoerAddress = provider.sender().address;
    if (!sudoerAddress) {
        throw new Error('Deployer address is required');
    }

    const blagoEscrow = provider.open(
        BlagoEscrow.createFromConfig(createDefaultBlagoEscrowConfig(sudoerAddress), await compile('BlagoEscrow')),
    );

    await blagoEscrow.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(blagoEscrow.address);

    await setAcl(provider, blagoEscrow, sudoerAddress);
}

async function setAcl(provider: NetworkProvider, blagoEscrow: OpenedContract<BlagoEscrow>, sudoerAddress: Address) {
    const usdtMaster = provider.open(JettonMaster.create(JETTON_MASTERS.USDT));
    const usdtJettonWalletAddress = await usdtMaster.getWalletAddress(blagoEscrow.address);

    const blgMaster = provider.open(JettonMaster.create(JETTON_MASTERS.BLG));
    const blgJettonWalletAddress = await blgMaster.getWalletAddress(blagoEscrow.address);

    console.log('USDT Wallet Address', usdtJettonWalletAddress);
    console.log('BLG Wallet Address', blgJettonWalletAddress);

    // Send the set ACL message
    const result = await blagoEscrow.sendSetAcl(provider.sender(), {
        sudoer: sudoerAddress,
        usdtJettonWallet: usdtJettonWalletAddress,
        myJettonWallet: blgJettonWalletAddress,
        value: toNano('0.01'), // Gas for the internal message
    });

    console.log(result);
}
