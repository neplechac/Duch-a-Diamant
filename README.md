# DUCH A DIAMANT

Duch a diamant (Ghost and a Diamond) is a simple browser-based game in which your task is to help the ghost catch the diamond while avoiding flame demons flying all over the room. You get score points for keeping contact with the diamond and the goal is to score as many points as possible. Game ends when player has no lives left.

![Screenshot](https://i.ibb.co/hfKGXVs/duch.png)

### Gameplay and controls
Game's goal is to catch a diamond and keep with it for as long as possible. The ghost automatically follows the diamond while touching it and the diamond also changes color when points are being scored.

Player controls the ghost using:
-   `arrow` keys for movement;
-   `SPACE` to (re)start the game when prompted;
-   `ENTER` to submit highscore when prompted.

At the start of the game there are two enemies. Collision with those enemies results in a life loss. After a hit, ghost position is reset but the ghost is safe from any harm until moving again.

When time elapsed hits `xx:30` mark, enemies get slightly faster; every minute (`xx:00`) a new enemy appears. Enemies also can also throw the diamond around, meaning that every time an enemy collides with the diamond, diamond's direction changes.

When the ghost loses all his lives, the game is over. Player can then enter his or her name and submit the final result to the high score table.

### About
This game was created as a final project for [CS50x course](https://cs50.harvard.edu/x/2020/).

Thanks to *Pixel_Poem*, *Kyrise* and *Finalbossblues* for amazing free sprites and tile sets available for download on [itch.io](http://itch.io/).

### Requirements
Required Python packages are listed in `requirements.txt` file.
