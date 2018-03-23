# BookEnds

A search app for book discovery, exploration, and collecting.


## Concept

[BookEnds](https://xandromus.github.io/bookends/public/)

![BookEnds](https://xandromus.github.io/responsive-portfolio/assets/images/bookends.png)

BookEnds uses the Google Books and eBay Finding APIs to take a user's book title search and return a single description from Google Books and up to 12 items for sale on eBay. Google results contain information pertinent to the selection, including an expandable description and a link to the page on Google Books. eBay results provide a title, an image, a price and a link to the item's selling page on eBay.

The user also has the option to sign in to the app (using Firebase Google authentication). Once logged in, any searches are maintained via Firebase's realtime database and can be accessed by clicking on the user account in the nav bar.

From the account page, the user can initiate another search with the term (launched in a separate tab and requiring a click once the window has opened). The user can also delete saved searches from the search history, which will update the database and remove the search term from it as well.

Finally, the jQuery UI library was used to allow users to sort their searches while in the search history. This sort, however, does not persist in the database (see below for future developments).


## Application

Book discovery and search generally takes place over a wide range of websites (eBay, Google Books, Amazon, GoodReads, etc.). We bring some of these discovery sites together to provide the user a launching point for book exploration. One search on BookEnds may lead to hours in a book discovery rabbit hole.


## Motivation

Reading is a fundamental aspect of many people's lives. With the massive amount of niche literature and countless platforms vying for a foothold in consumers' lives, bibliophiles are often overwhelmed by the sheer number of options spread across the interet. The aim of BookEnds is to simplify the search for reading materials.


## Design Process

BookEnds is designed primarily as a desktop search tool, although it is completely responsive. Given the sheer number of results being returned to the user, searching becomes an immersive experience on a larger screen. We recognize, however, that more and more consumers are making purchases from mobile and tablet, so we designed the app to fit any user's needs.

The color scheme was chosen to impart a modern feel, as more and more readers, espcially younger ones, are only finding reading materials online.


## Technologies Used

- BootStrap
- jQuery
- jQueryUI
- jQuery UI Touch Punch
- Firebase Realtime Database
- Firebase Google Authentication
- Local Storage
- Sublime Text - Text Editor
- Visual Studio - Text Editor
- Git Terminal/Bash


## Future Developments

Here are some of the features to be included in any future development for this project:

1. Add specific search elements such as subject, title, author and items returned so that the user has a wider range of search term choices
2. Give the user the ability to select from a variety of online bookstores and save the selections pulled in from the APIs
3. Add a language selection
4. Enroll BookEnds in affiliate programs with the bookellers to help funding
5. Regarding saved searches for the logged-in user, it would be beneficial to add two additional features:
	- Prevent duplicate searches from being entered into FireBase
	- Re-order the saved searches in FireBase to match the order that the user has made using the jQuery UI sorting function


## Authors

The BookEnds Team:

- **Paul Chenoweth** - [Paul Chenoweth](https://github.com/pcheno)
- **Thomas Granado** - [Thomas Granado](https://github.com/tjgranado)
- **Destiny Miller** - [Destiny Miller](https://github.com/Destininja)
- **Xander Rapstine** - [Xander Rapstine](https://github.com/Xandromus)