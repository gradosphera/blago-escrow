# Эскроу контракт Благо

Адрес (контракта)[https://tonviewer.com/EQChQhurvpWiOeoX2YQOIyNQdqvBgalSQR6z9zD8sgRXr03b?section=code]

Контракт реализует безопасную систему эскроу-платежей, позволяющую осуществлять переводы между пользователями Telegram.

Последовательность:

1. Отправитель создаёт чек с уникальным параметром `chat_instance` или `username` и пополняет его с помощью TON или Благо. Чек хранится в хранилище контракта и доступен получателю.
2. Получатель должен обналичить чек, предоставив то же значение `chat_instance` или `username`, подписанное сервером Telegram для подтверждения своей личности.
3. После успешной проверки контракт переводит средства получателю. Чек удаляется из хранилища контракта.
4. В случае ошибки контракт возвращает средства отправителю. Чек также удаляется из хранилища контракта.

Создание чека платное, обналичивание доступно любому пользователю с действительной подписью.

1. op::create_check — доступно только через внутренние сообщения (требуется TON для оплаты комиссий).
2. op::cash_check — доступно только через внешние сообщения (позволяет получателям, у которых нет TON, получить свои средства).

Безопасность:

- Чеки привязываются к определённым чатам Telegram через параметр `chat_instance` или к определённым именам пользователей через `username`.
- Для авторизации выплат требуется криптографическое подтверждение (подпись) от Telegram.
- Подпись включает в себя как `chat_instance`/`username`, так и полезную нагрузку (первые 72 бита адреса получателя).

Это гарантирует, что подпись относится как к чату/имени пользователя, так и к кошельку получателя.

- Предотвращает двойную трату, немедленно удаляя чек из хранилища контракта.

Структура хранилища:

- sudoer:MsgAddress
- usdt_jetton_wallet:MsgAddress
- blago_jetton_wallet:MsgAddress
- checks_dict:HashmapE(32, CheckData)

CheckData:

- amount:int124
- is_jetton:int1
- jetton_wallet_address:^Cell
- is_tiny_jetton:int1
- with_username:int1
- chat_instance:int64 (когда with_username = 0)
- username:^Cell (когда with_username = -1)
- comment:^Cell
- status:int8
- created_at:int32
- sender_address:^Cell

## Project structure

- `contracts` - source code of all the smart contracts of the project and their dependencies.
- `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
- `tests` - tests for the contracts.
- `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
