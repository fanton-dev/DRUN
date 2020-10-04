"""Discord bot module.

This module provides communication and connection to a discord bot
"""

from __future__ import absolute_import

import discord
import firebase_admin
from firebase_admin import credentials, firestore

from discord.ext import commands
import asyncio
from threading import Thread


import os
from dotenv import load_dotenv
from pathlib import Path
from geopy.geocoders import Nominatim


bot = commands.Bot(command_prefix='!')

cred = credentials.Certificate("firebase.json")
firebase_app = firebase_admin.initialize_app(cred)
firestore_client = firestore.client(firebase_app)


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

    user_id = None
    users_ref = firestore_client.collection(u'users')
    docs = users_ref.stream()
    for doc in docs:
        print(doc.to_dict()["phone"], phone_number)
        if doc.to_dict()["phone"] == phone_number:
            user_id = doc.to_dict()["uid"]
            break

    while user_id == None:
        await ctx.send(f'We couldn\'t find a user registered with that phone, please try again')
        msg = await bot.wait_for('message')
        if msg.author == bot.user:
            msg = await bot.wait_for('message')
        address = msg.content
        users_ref = firestore_client.collection(u'users')
        docs = users_ref.stream()
        for doc in docs:
            if doc.to_dict()["phone"] == phone_number:
                user_id = doc.to_dict()["uid"]
        

    await ctx.send(f'Thank you! Now please tell us where do you want us to pickup your package from?')
    msg = await bot.wait_for('message')
    if msg.author == bot.user:
        msg = await bot.wait_for('message')
    location = None
    while location == None:
        await ctx.send(f'We couldn\'t find that address, please try again')
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
    doc_ref = firestore_client.collection(u'messages').document(u'gosho')
    doc_ref.set({
        u'message': u'Discord wants to send you a delivery',
        u'type': u'delivery',
        u'location': [location.latitude, location.longitude],
        u'price': price,
        u'userId': user_id
    })

