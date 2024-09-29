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

            logger.info("Item | Purchase | Production | Imported | Sale | Consumed | Exported | Balance | Change")

            # Get the player's inventory
            for item in inventory:
                purchase = inventory[item].asset.purchase
                if purchase is None:
                    purchase = 0
                
                production = inventory[item].produced
                if production is None:
                    production = 0
                
                imported = inventory[item].imported
                if imported is None:
                    imported = 0
                
                sale = inventory[item].asset.sale
                if sale is None:
                    sale = 0
                
                comsumed = inventory[item].consumed
                if comsumed is None:
                    comsumed = 0
                
                exported = inventory[item].exported
                if exported is None:
                    exported = 0
                
                balance = inventory[item].balance
                if balance is None:
                    balance = 0

                change = purchase + production + imported - sale - comsumed - exported
                #logger.info("{}: {} - Changed by {}", item.value, inventory[item].balance, change)

                # print a inventory table
                logger.info("--------------------------------------------------------------------------------")
                logger.info("{} | {} | {} | {} | {} | {} | {} | {} | {}".format(item.value, purchase, production, imported, sale, comsumed, exported, balance, change))
                logger.info("--------------------------------------------------------------------------------")
            
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