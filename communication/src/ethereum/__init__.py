"""Ethereum client module.

This module provides all the basic functionalities need for communicating with
a ethereum server like Geth, Ganachi, etc.
"""

from __future__ import absolute_import

from pathlib import Path
import os

from eth_account import Account

from web3 import Web3
from dotenv import load_dotenv

class EthereumClient:
    """Class providing controls for the ethereum server.

    Args:
        ethereum_server_ip (str): Address of the ethereum server.
    """

    def __init__(self, ethereum_server_ip: str) -> None:
        self.ethereum_server_ip = ethereum_server_ip
        self.web3 = Web3(Web3.HTTPProvider(ethereum_server_ip))

        load_dotenv(dotenv_path=Path('...') / '.env')
        self.bank_private_key = os.getenv("ETHEREUM_BANK_PRIVATE_KEY")

    def make_account(self) -> Account:
        """Creates a new ethereum account.

        Returns:
            Account: New account object.
        """
        account = self.web3.eth.account.create()
        return account

    def make_transaction(
            self,
            address_sender: str,
            address_receiver: str,
            private_key_sender: str,
            value: float
    ) -> str:
        """Processes a transaction from 1 wallet to another.

        Args:
            address_sender (str): Public wallet key of the sender.
            address_receiver (str): Public wallet key of the receiver.
            private_key (str): Private key of the sender.
            value (float): Amount of "ehrer" funds to be transferred.

        Raises:
            ValueError: Insufficient funds error.

        Returns:
            str: Transaction hash.
        """

        # Verifing the sender has enough crypto
        balance_sender = self.web3.fromWei(
            self.web3.eth.getBalance(address_sender), "ether")

        if balance_sender < value:
            raise ValueError(
                "Sender doesn't have enough funds to make the transaction!")

        # Defining nonce - Amount of previous transactions made from sender.
        # Used for preventing for multiple sendings of a single transaction.
        nonce = self.web3.eth.getTransactionCount(address_sender)

        # Transaction details:
        #   nounce - Amount of previous transactions made from sender.
        #   to - Address of crypto reciever.
        #   value - Transaction amount.
        #   gas - Units of gas miners to be payed.
        #   gasPrice - The price of a gas unit.
        transaction_details = {
            "nonce": nonce,
            "to": address_receiver,
            "value": self.web3.toWei(value, "ether"),
            "gas": 2000000,
            "gasPrice": self.web3.toWei("8", "gwei")
        }

        # Signing the transaction using the private key
        signed_transaction = self.web3.eth.account.signTransaction(
            transaction_details, private_key_sender)

        # Proceeding with the transaction
        transaction_hash = self.web3.eth.sendRawTransaction(
            signed_transaction.rawTransaction)
        return self.web3.toHex(transaction_hash)

    def topup_account(self, account_address: str, value: float) -> str:
        """Topups an addresse's balance from the bank funds.

        Args:
            account_address (str): Account address the funds will be given.
            value (float): Amount of "ehrer" funds to be transferred.

        Returns:
            str: Transaction hash.
        """

        bank_address = self.web3.eth.accounts[0]
        return self.make_transaction(
            bank_address,
            account_address,
            self.bank_private_key,
            value
        )

    def get_balance(self, account_address: str) -> float:
        """Returns the balance of an account.
        Args:
            account_address (str): Address of the account.
        Returns:
            float: Account balance.
        """

        balance = self.web3.eth.getBalance(account_address)
        balance = self.web3.fromWei(balance, "ether")
        return float(balance)

    def get_bank_address(self) -> str:
        """Returns the public bank address.

        Returns:
            str: Address of the bank wallet.
        """
        return self.web3.eth.accounts[0]
