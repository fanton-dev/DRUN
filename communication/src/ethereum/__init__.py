"""Ethereum client module.

This module provides all the basic functionalities need for communicating with
a ethereum surver like Geth, Ganachi, etc.
"""

from __future__ import absolute_import


class EthereumClient:
    """Class providing controls for the ethereum server.

    Args:
        ethereum_server_ip (str): Address of the ethereum server.
    """

    def __init__(self, ethereum_server_ip: str) -> None:
        pass

    def make_transaction(
            self,
            address_sender: str,
            address_reciever: str,
            private_key_sender: str,
            value: float
    ) -> str:
        """Processes a transaction from 1 wallet to another.

        Args:
            address_sender (str): Public wallet key of the sender.
            address_reciever (str): Public wallet key of the reciever.
            private_key (str): Private key of the sender.
            value (float): Amount of "ehrer" funds to be transfered.

        Raises:
            ValueError: Inssuficient funds error.

        Returns:
            str: Transaction hash.
        """

    def topup_account(self, account_address: str, value: float) -> str:
        """Topups an addresse's balance from the bank funds.

        Args:
            account_address (str): Account address the funds will be given.
            value (float): Amount of "ehrer" funds to be transfered.

        Returns:
            str: Transaction hash.
        """

    def get_balance(self, account_address: str) -> float:
        """Returns the balance of an account.
        Args:
            account_address (str): Address of the account.
        Returns:
            float: Account balance.
        """
