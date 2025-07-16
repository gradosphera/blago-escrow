import { toNano } from '@ton/core';
import { Blago } from '../wrappers/Blago';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const blago = provider.open(Blago.createFromConfig({}, await compile('Blago')));

    await blago.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(blago.address);

    // run methods on `blago`
}
