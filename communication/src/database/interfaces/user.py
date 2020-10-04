"Module containing Order class for drone deliveries."

from __future__ import absolute_import

from ...database import Database
from ...ethereum import EthereumClient


class User():
    """Class containing all the user information.
    Args:
        firebase_user_id (str): Firebase UUID.
        discord_api_key (str, optional): Discord OAuth2 key. Defaults to None.
    """

    def __init__(
            self,
            firebase_user_id: str,
            discord_api_key: str = None
    ) -> None:
        self.firebase_user_id = firebase_user_id

        ethereum_client = EthereumClient("http://127.0.0.1:7545")
        ethereum_account = ethereum_client.make_account()
        self.ethereum_public_key = ethereum_account.address
        self.ethereum_private_key = ethereum_account.privateKey.hex()

        self.discord_api_key = discord_api_key

    def database_add(self) -> None:
        """Stores order entry in the database."""

        with Database() as database:
            database.execute(
                """
                INSERT INTO users
                VALUES (?, ?, ?, ?)
                """, (
                    self.firebase_user_id,
                    self.ethereum_public_key,
                    self.ethereum_private_key,
                    self.discord_api_key))

    @staticmethod
    def database_update_discord(firebase_user_id, new_discord_id):
        """Updates the discord_id of a given user"""

        query = "UPDATE users SET discord_api_key = '{}' WHERE firebase_user_id = '{}'".format(
            new_discord_id, firebase_user_id)
        with Database() as database:
            rows = database.execute(query)

    @staticmethod
    def get_balance(firebase_user_id):
        user_public_key = ""
        query = "SELECT * FROM users WHERE firebase_user_id = '{}'".format(
            firebase_user_id)
        with Database() as database:
            rows = database.execute(query).fetchall()
            if rows == []:
                raise ValueError("No such sender")
            user_public_key = rows[0][1]

        transaction_client = EthereumClient("http://127.0.0.1:7545")

        balance = transaction_client.get_balance(user_public_key)
        return balance

    @staticmethod
    def topup_account(firebase_user_id, amount):
        user_public_key = ""
        query = "SELECT * FROM users WHERE firebase_user_id = '{}'".format(
            firebase_user_id)
        with Database() as database:
            rows = database.execute(query).fetchall()
            if rows == []:
                raise ValueError("No such sender")
            user_public_key = rows[0][1]

        transaction_client = EthereumClient("http://127.0.0.1:7545")

        topup_tx = transaction_client.topup_account(user_public_key, amount)
        return topup_tx

    @staticmethod
    def get_firebase_id(discord_id):
        firebase_id = None
        query = "SELECT * FROM users WHERE discord_api_key = '{}'".format(
            discord_id)
        with Database() as database:
            rows = database.execute(query).fetchall()
            if rows == []:
                raise ValueError("No such sender")
            firebase_id = rows[0][0]

        return firebase_id
