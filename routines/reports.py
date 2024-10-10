import os
import json
import datetime
from pymerc.client import Client
from pymerc.api.models.player import Player

from loguru import logger

class ReportManager:
    def __init__(self, client: Client, player: Player, current_turn: int | str):
        self.client = client
        self.player = player
        self.turn = current_turn
        
    async def make_reports(self):
        self.inventory_report()
        await self.town_report()
    
    def inventory_report(self):
        player = self.player
        inventory = player.storehouse.items

        logger.info("Item | Purchase | Production | Imported | Sale | Consumed | Exported | Balance")
        logger.info("--------------------------------------------------------------------------------")

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

            logger.info(
                "{} | {} | {} | {} | {} | {} | {} | {}".format(
                    item.value,
                    purchase,
                    production,
                    imported,
                    sale,
                    comsumed,
                    exported,
                    balance
                )
            )
            logger.info("--------------------------------------------------------------------------------")
    
    async def town_report(self):
        player = self.player
        client = self.client

        # get towns form towns.json file
        with open("towns.json", "r") as f:
            towns = json.load(f)

        # if website/raw_reports folder doesnt exist, create it
        try:
            os.mkdir("raw_reports")
        except FileExistsError:
            pass

        # get time formatted as year_month_day
        daystr = datetime.datetime.now().strftime("%Y_%m_%d")

        data = {}

        # read from json file of the day, if it doesnt exist, create it
        try:
            with open(f"raw_reports/{daystr}_town_report.json", "r") as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {}
        
        if self.turn not in data:
            data[self.turn] = []

        for town_id in towns:
            town = await client.town(town_id)

            town_data = {
                "id": town.id,
                "name": town.name,
                "location": {
                    "x": town.data.location.x,
                    "y": town.data.location.y
                },
                "commoners": {
                    "account_id": town.data.commoners.account_id,
                    "count": town.data.commoners.count,
                    "migration": town.data.commoners.migration,
                    "sustenance": {},

                }
            }

            for category in town.data.commoners.sustenance:
                town_data["commoners"]["sustenance"][category.name] = {
                    "products": []
                }

                for demand in category.products:
                    town_data["commoners"]["sustenance"][category.name]["products"].append({
                        "product": demand.product.value,
                        "desire": demand.desire,
                        "request": demand.request,
                        "result": demand.result,
                        "bonus": demand.bonus
                    })


            data[self.turn].append(town_data)
        
        with open(f"raw_reports/{daystr}_town_report.json", "w") as f:
            json.dump(data, f, indent=2)
