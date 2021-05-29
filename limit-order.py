# This example is provided for informational purposes only and has not been audited for security.

from pyteal import *

def limit_order(owner_addr, algo_amount, asset_amount):
    
    is_payment = Txn.type_enum() == TxnType.Payment
    is_first_tx = Txn.group_index() == Int(0)
    acceptable_fee = Txn.fee() <= Int(20000)
    acceptable_amount = Txn.amount() == Int(algo_amount)
    no_close_out_addr = Txn.close_remainder_to() == Global.zero_address()
    is_two_tx = Global.group_size() == Int(2)
    
    is_asset_transfer = Gtxn[1].type_enum() == TxnType.AssetTransfer
    receiver_is_owner = Gtxn[1].receiver() == Addr(owner_addr)
    no_asset_sender = Gtxn[1].asset_sender() == Global.zero_address()
    acceptable_asset_amount = Gtxn[1].asset_amount() == Int(asset_amount)

    return And(
        And(
            is_payment,
            is_first_tx,
            acceptable_fee,
            acceptable_amount,
            no_close_out_addr,
            is_two_tx
        )
        ,And(
            is_asset_transfer,
            receiver_is_owner,
            no_asset_sender,
            acceptable_asset_amount
        )
    )

if __name__ == "__main__":
    program = limit_order("2YI264DKCDYQX5XMVFAQYXBV3PRJATRBNUN2UKPYJGK6KWNRF6XYUVPHQA",10,10)
    teal_file = compileTeal(program, mode=Mode.Signature, version=3)
    f = open("limit-order-py.teal", "w")
    f.write(teal_file)
    f.close()
    print()