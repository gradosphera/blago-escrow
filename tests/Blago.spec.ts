import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Blago } from '../wrappers/Blago';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Blago', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Blago');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let blago: SandboxContract<Blago>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        blago = blockchain.openContract(Blago.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await blago.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: blago.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and blago are ready to use
    });
});
