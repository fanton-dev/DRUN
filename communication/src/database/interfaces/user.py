"Module containing Order class for drone deliveries."

from __future__ import absolute_import


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
        pass

    def database_add(self) -> None:
        """Stores order entry in the database."""
