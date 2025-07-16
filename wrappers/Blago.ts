import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type BlagoConfig = {};

export function blagoConfigToCell(config: BlagoConfig): Cell {
    return beginCell().endCell();
}

export class Blago implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Blago(address);
    }

    static createFromConfig(config: BlagoConfig, code: Cell, workchain = 0) {
        const data = blagoConfigToCell(config);
        const init = { code, data };
        return new Blago(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
