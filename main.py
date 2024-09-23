import asyncio
import asyncclick as click
from pymerc.client import Client
from dotenv import load_dotenv
from loguru import logger
from pymerc.api.models.common import Item

load_dotenv()

@click.command()
@click.option(
    "--merc-api-user",
    type=str,
    help="Mercatorio API user.",
    envvar="MERC_API_USER",
)
@click.option(
    "--merc-api-token", type=str, help="Mercatorio API token.", envvar="MERC_API_TOKEN"
)
async def main(
    merc_api_user: str,
    merc_api_token: str
    ):
    client = Client(merc_api_user, merc_api_token)

    player = await client.player()

    await player.load()

    while True:
        try:
            current_turn = await turn(client)
            logger.info("Current turn: {}", current_turn)

            inventory = player.storehouse.items

            # Get the player's inventory
            for item in inventory:
                logger.info("{}: {}", inventory[item].item.value, inventory[item].balance)
            
            # await 1h
            await asyncio.sleep(3600)

        except TurnInProgressException:
                logger.info("Turn still in progress.")
                await asyncio.sleep(60)
                continue

class TurnInProgressException(Exception):
    """Exception raised when a turn is in progress."""

    pass

async def turn(client: Client) -> int:
    """Get the current turn number.

    Args:
        client (Client): The Mercatorio API client.

    Returns:
        int: The current turn number.
    """
    response = await client.get("https://play.mercatorio.io/api/clock")

    if "preparing next game-turn, try again in a few seconds" in response.text:
        raise TurnInProgressException("A turn is in progress")

    return response.json()["turn"]


if __name__ == "__main__":
    main()