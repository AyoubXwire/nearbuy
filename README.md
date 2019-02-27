# nearbuy
A website that displays all the shops nearby, hosted on heroku [here](https://nearbuy-shops.herokuapp.com).

# Dependencies
* **express:** For handling and routing HTTP requests.
* **express-session:** For handling sessions.
* **ejs:** For generating dynamic web pages.
* **mongoose:** For modeling and mapping MongoDB data to javascript.
* **cookie-parser:** For using cookies to store user's location.
* **connect-flash:** For displaying messages to user.
* **geolib:** For calculating distances in order to sort shops.
* **passport, passport-local-mongoose, connect-mongodb-session:** For handling user authentication.

# Using the website
## Register
* As a visitor, you can register using a unique **username** and your **email** and **password**.
* A weak **password** will not be accepted (passwords should be at least 8 characters long and contains uppercase, lowercase, number and a symbol).

## Log in
* When registered, you can only use your **username** and **password** to log in.

## Shops
* You need to be **logged in** to be able to see the shops.
* Sort
    * The shops will not be sorted by distance unless you choose to use your **location**.
    * Your location will be saved in the **cookies** so you only need to provide your location once.
* Like & dislike
    * You can like a shop, so it can be added to your **preferred shops** and won't be displayed on the main page.
    * All your **preferred shops** will be displayed in “preferred Shops”.
    * If you change your mind, you can always remove a shop from your **preferred shops**.
    * You can dislike a shop, so it won’t be displayed anywhere during the next **2 hours**.