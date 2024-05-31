<p align="center">
  <img src="public/img/logo-green-round.png" alt="Logo">
  <center><h2>Natours</h2></center>
</p>

---

#### An awesome tour booking site built on top of NodeJS and ExpressJS.

- [Natours](#natours) - [An awesome tour booking site built on top of NodeJS and ExpressJS.](#an-awesome-tour-booking-site-built-on-top-of-nodejs-and-expressjs)
  - [Key Features 📋](#key-features-)
  - [How To Use 🤔](#how-to-use-)
    - [Book a tour](#book-a-tour)
    - [Manage your booking](#manage-your-booking)
    - [Update your profile](#update-your-profile)
  - [API Usage](#api-usage)
  - [Deployment 🌍](#deployment-)
  - [Build With 🏗️](#build-with-️)
  - [To-do 🗒️](#to-do-️)
  - [Setting Up Your Local Environment ⚙️](#setting-up-your-local-environment-️)
  - [Installation 🛠️](#installation-️)
  - [Contributing 💡](#contributing-)
  - [Known Bugs 🚨](#known-bugs-)
  - [Future Updates 🪴](#future-updates-)
  - [License 📄](#license-)
  - [Deployed Version 🚀](#deployed-version-)
  - [Acknowledgement 🙏🏻](#acknowledgement-)

---

## Key Features 📋

- **Authentication and Authorization**
  - Sign up, Log in, Logout, Update, and reset password.
- **User profile**
  - Update username, photo, email, password, and other information
  - A user can be either a regular user or an admin or a lead guide or a guide.
  - When a user signs up, that user by default regular user.
- **Tour**
  - Manage booking, check tour map, check users' reviews and rating
  - Tours can be created by an admin user or a lead-guide.
  - Tours can be seen by every user.
  - Tours can be updated by an admin user or a lead guide.
    Tours can be deleted by an admin user or a lead-guide.
- **Bookings**
  - Only regular users can book tours (make a payment).
  - Regular users can see all the tours they have booked.
  - An admin user or a lead guide can see every booking on the app.
  - An admin user or a lead guide can delete any booking.
  - An admin user or a lead guide can create a booking (manually, without payment).
  - An admin user or a lead guide can not create a booking for the same user twice.
- **Reviews**
  - Only regular users can write reviews for tours that they have booked.
  - All users can see the reviews of each tour.
  - Regular users can edit and delete their own reviews.
  - Regular users can not review the same tour twice.
  - An admin can delete any review.
- **Credit card Payment**
  - Users can pay with their credit card.
  - Payment generation is automatic.

## How To Use 🤔

### Book a tour

- Login to the site
- Search for tours that you want to book
- Book a tour
- Proceed to the payment checkout page
- Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 02 / 26
  - CVV: 222
  - Card Holder Name: Any name you want
  ```
- Finished!

### Manage your booking

- Check the tour you have booked on the "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

- You can update your own username, profile photo, email, and password.

## API Usage

Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:

```
- {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
- {{password}} with your user password as value.
```

## Deployment 🌍

The website is deployed with git into _Render_. Below are the steps taken:

```
git init
git add -A
git commit -m "Commit message"
render login
create new web service
build and deploy from a Git repository
select Git repository
Now on settings
  - Root Directory 👉🏻 .
  - Build Command 👉🏻 rm -rf node_modules;rm package-lock.json; npm install
  - Start Command 👉🏻 npm run production
Click on deploy and you are good to go
```

## Build With 🏗️

- [NodeJS](https://nodejs.org/en/) - JS runtime environment
- [Express](http://expressjs.com/) - The web framework used
- [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
- [Pug](https://pugjs.org/api/getting-started.html) - High performance template engine
- [JSON Web Token](https://jwt.io/) - Security token
- [Stripe](https://stripe.com/) - Online payment API and Making payments on the app.
- [Postman](https://www.getpostman.com/) - API testing
- [Mailtrap](https://mailtrap.io/) & [GMail](mail.google.com) - Email delivery platform
- [Render](https://www.render.com/) - Cloud platform
- [Mapbox](https://www.mapbox.com/) - Displaying the different locations of each tour.

## To-do 🗒️

- Review and rating
  - Allow users to add a review directly at the website after they have taken a tour
- Booking
  - Prevent duplicate bookings after a user has booked that exact tour, implement favorite tours
- Advanced authentication features
  - Signup, confirm user email, log in with refresh token, two-factor authentication
- And More! There's always room for improvement!

## Setting Up Your Local Environment ⚙️

If you wish to play around with the code base in your local environment, do the following

```
* Clone this repo to your local machine.
* Using the terminal, navigate to the cloned repo.
* Install all the necessary dependencies, as stipulated in the package.json file.
* If you don't already have one, set up accounts with: MONGODB, MAPBOX, STRIPE, SENDGRID, and MAILTRAP. Please ensure to have at least basic knowledge of how these services work.
* Copy the .env.example file contents in your .env file and give values


* Start the server by running command `npm run dev` for development purpose or `npm run prod` for production purpose.
* Your app should be running just fine.
```

## Installation 🛠️

You can fork the app or you can git-clone the app into your local machine. Once done, please install all the
dependencies by running

```
$ npm i
Set your env variables
$ npm run watch:js
$ npm run build:js
$ npm run dev (for development)
$ npm run start:prod (for production)
$ npm run debug (for debug)
$ npm start
Setting up ESLint and Prettier in VS Code 👇🏻
$ npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node
eslint-plugin-import eslint-plugin-jsx-a11y  eslint-plugin-react --save-dev
```

## Contributing 💡

Pull requests are welcome but please open an issue and discuss what you will do before 😊

## Known Bugs 🚨

Feel free to email me at efat1531@gmail.com if you run into any issues or have questions, ideas or concerns.
Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

## Future Updates 🪴

- Enable PWA
- Improve overall UX/UI and fix bugs
- Featured Tours
- Recently Viewed Tours
- And More! There's always room for improvement!

## License 📄

This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).

## Deployed Version 🚀

Live demo (Feel free to visit) 👉🏻 : https://tourist-website.onrender.com/

## Acknowledgement 🙏🏻

- This project is part of the online course I've taken at Udemy. Thanks to Jonas Schmedtmann for creating this awesome course! Link to the course: [Node.js, Express, MongoDB & More: The Complete Bootcamp 2024](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)
