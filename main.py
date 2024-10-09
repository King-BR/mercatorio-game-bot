import asyncio
import asyncclick as click
from pymerc.client import Client
from dotenv import load_dotenv
from loguru import logger
from routines.reports import ReportManager

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
            current_turn = await turn(client, True)
            logger.info("Current turn: {}", current_turn)

            report_manager = ReportManager(client, player, current_turn)

            await report_manager.make_reports()
            
            # await 1h
            await asyncio.sleep(3600)

        except TurnInProgressException:
                logger.info("Turn still in progress.")
                await asyncio.sleep(120)
                continue

class TurnInProgressException(Exception):
    """Exception raised when a turn is in progress."""

    pass

async def turn(client: Client, format: bool) -> int | str:
    """Get the current turn number.

    Args:
        client (Client): The Mercatorio API client.

    Returns:
        int: The current turn number.
    """
    response = await client.get("https://play.mercatorio.io/api/clock")

    if "preparing next game-turn, try again in a few seconds" in response.text:
        raise TurnInProgressException("A turn is in progress")
    
    turnNumber = response.json()["turn"]

    if format:
        # divide turnNumber by 12 to and round down to get the year
        year = turnNumber // 12

        # get the month by getting the remainder of turnNumber divided by 12
        month = turnNumber % 12
        
        MONTH_STR = {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        }

        return f"{MONTH_STR[month]} {year}"
    else:
        return turnNumber



if __name__ == "__main__":
    main()