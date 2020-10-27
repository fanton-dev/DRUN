# DRUN
> DRUN is an open-source autonomous drone delivery system. A drone connects to a server using the local cellular network, which drives it to pick-up and deliver orders. Orders can be submitted via the server API, the mobile app or a Discord bot. Payments are processed using a private ethereum client.

<p align="center">
<img src="docs/promotional/Project Banner.png" alt="Project Banner">
</p>

<p align="center">
<a href="https://github.com/braind3d/DRUN">
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fgjbae1212%2Fhit-counter&count_bg=%23011043&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=true" alt="Hits">
</a>

<a href="https://github.com/braind3d/DRUN/issues?q=is%3Aissue+is%3Aopen">
<img src="https://img.shields.io/github/issues-raw/braind3d/DRUN?color=011043&style=flat-square" alt="Open issues status badge">
</a>

<a href="https://github.com/braind3d/DRUN/issues?q=is%3Aissue+is%3Aclosed">
<img src="https://img.shields.io/github/issues-closed-raw/braind3d/DRUN?color=011043&style=flat-square" alt="Closed issues status badge">
</a>

<a href="https://github.com/braind3d/DRUN/fork">
<img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?color=011043&style=flat-square" alt="Contributions welcome badge">
</a>

<a href="LICENSE">
<img src="https://img.shields.io/github/license/braind3d/DRUN?color=011043&style=flat-square" alt="License badge">
</a>
</p>


## Get started
<p align="center">
<img src="docs/promotional/Project Structure.png" alt="Project Structure">
</p>


The project consists of 4 main components:
- **Deep Q-learning network** for autonomous drone control (located in "[/ai](/ai)")
- **Server** controlling communication between drone and server, handling external API requests, Ethereum payments and Discord messages (located in "[/communication](/communication)")
- **Drone utilities** for getting started with the Parrot.AR drone (located in "[/embedded](/embedded)")
- **Mobile app** for communication between users, including placing orders and exchanging ethereum payments (located in "[/app](/app)")

For each of the components' directories there is a corresponding `README.md` with instructions on how to get started.

## Authors
- **Angel Penchev** ([@angel-penchev](https://github.com/angel-penchev)) - Project manager, Drone AI
- **Simeon Georgiev** ([@simo1209](https://github.com/simo1209)) - Embedded, Drone/Server communication
- **Boyan Ivanov** ([@bobig6](https://github.com/bobig6)) - Server API, Etherium payments, Discord Bot, Database
- **Bogdan Mironov** ([@bogdanmironov](https://github.com/bogdanmironov)) - Mobile app development
- **Miroslav Mirchev** ([@Miro-02](https://github.com/Miro-02)) - Mobile app development

## Drone IRL
<p align="center">
<img src="docs/promotional/Drone IRL.jpg" alt="Drone IRL">
</p>

## Contributions
1. Fork it (<https://github.com/braind3d/DRUN/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -a`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
6. Upon review it will be merged.

## License
Distributed under the MIT license. See [LICENSE](LICENSE) for more information.
