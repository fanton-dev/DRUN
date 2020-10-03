"""Discord bot module.

This module provides communication and connection to a discord bot
"""

from __future__ import absolute_import

import discord
from discord.ext import commands
import asyncio
from threading import Thread


import os
from dotenv import load_dotenv
from pathlib import Path
from geopy.geocoders import Nominatim


bot = commands.Bot(command_prefix='!')


def init() -> None:
    load_dotenv(dotenv_path='.env')
    token = os.getenv("DISCORD_BOT_TOKEN")
    loop = asyncio.get_event_loop()
    loop.create_task(bot.start(token))
    t = Thread(target=loop.run_forever())
    t.start()


@bot.command(pass_context=True)
async def delivery(ctx):
    await ctx.send(f'Hello {ctx.author}, please tell us the phone number of the person, you want to deliver to')
    channel = ctx.channel
    msg = await bot.wait_for('message')
    if msg.author == bot.user:
        msg = await bot.wait_for('message')
    phone_number = msg.content
    await ctx.send(f'Thank you! Now please tell us where do you want us to pickup your package from?')
    msg = await bot.wait_for('message')
    if msg.author == bot.user:
        msg = await bot.wait_for('message')
    location = None
    while location == None:
        await ctx.send(f'We couldn\'t find that address please try again')
        msg = await bot.wait_for('message')
        if msg.author == bot.user:
            msg = await bot.wait_for('message')
        address = msg.content
        geolocator = Nominatim(user_agent="drun")
        location = geolocator.geocode(address)
    await ctx.send(f'And finally, how much do you want to charge the reciever?')
    msg = await bot.wait_for('message')
    if msg.author == bot.user:
        msg = await bot.wait_for('message')
    price = msg.content
    await ctx.send(f'Affirmative! Your request has been made!')
    print(phone_number)
    print(location.address)
    print((location.latitude, location.longitude))
    print(price)
