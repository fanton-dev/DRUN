"""Discord bot module.

This module provides communication and connection to a discord bot
"""

from __future__ import absolute_import

import discord
from discord.ext import commands
import asyncio
from threading import Thread





# bot = discord.Client()
bot = commands.Bot(command_prefix = '!')



def init() -> None:
    #super(Discord, self).__init__()
    loop = asyncio.get_event_loop()
    loop.create_task(bot.start("NzYxOTAyNjUxNzI1NzA5MzUy.X3hXIw.74wHASY4lRQettEU549L6xcTZtE"))
    t = Thread(target=loop.run_forever())
    t.start()

# @bot.event
# async def on_message(message):
#     if message.author == bot.user:
#         return
#     channel = message.channel
#     await channel.send("hi")

@bot.command(pass_context=True)
async def delivery(ctx):
    await ctx.send(f'Hello {ctx.author}, please tell us the phone number of the person, you want to deliver to')
    channel = ctx.channel
    msg = await bot.wait_for('message')
    phone_number = msg.content
    await ctx.send(f'Thank you! Now please tell us where do you want us to pickup your package from?')
    msg = await bot.wait_for('message')
    address = msg.content
    await ctx.send(f'And finally, how much do you want to charge the reciever?')
    msg = await bot.wait_for('message')
    charge = msg.content
    await ctx.send(f'Affirmative! Your request has been made!')
    print(phone_number)
    print(address)
    print(charge)



    
    # user = bot.get_user(416531445398634496)
    # print(bot)
    # await user.send("Hi")