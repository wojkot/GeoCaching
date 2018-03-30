# GeoCaching
Geocaching portal allows you to create new safes and discover existing. Application alows also to edit end removeing existing safes by author.

All safes are described by title, author, localization description and map with its position.

##  **Preconditions**
### 1. Clone repository

`git clone https://github.com/wojkot/GeoCaching.git`

### 2. Install modules

`npm install`

### 3. Configure database

Application uses MongoDB and it is necessary first to [install](https://docs.mongodb.com/manual/installation/#mongodb-community-edition) it.

[Start mongod Processes](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/) using default settings,
by typing the following command at the system shell:

`mongod`


### 4. Run application

`npm start`

This will start server on localhost:3000.

## API

### Safes
| Method       | URL            | Description   |
| :---         |     :---       | :---          |
| GET          | /load          | Load all safes from database with name and description. For first safe read detailed data to display it.    |
| POST     | /safe/save       | Save data of created/edited safe.      |
| POST     | /safe/markdiscovered       | Mark safe as discovered by actually logged user.      |
| GET| /safe/edit       | Get data of edited safe from database.      |
| GET| /safe/select       | Get all data of actually selected safe.      |
| DELETE| /safe/remove| Remove selected safe.      |


### Users
| Method       | URL            | Description   |
| :---         |     :---       | :---          |
| POST| /login| Login user according do username and password  |
| GET| /login       | Redirect to login page.      |
| POST| /register| Register user   |
| GET| /register| Redirect to register page.      |
| GET| /logaout| Log off user.      |

## User manual

### Main page - safes list
Main page allows to browse all safes with its description and localization. Unlogged user has no permission to create new safes and mark existing as discovered. 
To log in, click button "Login" in top right corner, it redirect you to login page. If you have no account, go to registration page and then log in.
As logged user you can add new safes, editing and removing it (but these only created by you). You can also mark any safe as discovered, which will write you to the list of discovers (you can also remove yourself from this list, unchecking by 'Discovered' checkbox).

### Create your first safe
1. Log in
2. Click button **Add safe**
3. Fill all fields
4. Click button **Add**
5. If everything is ok, you should see message with information of result of operation. New safe should appear on list.


## Tests

To test some features mainly connected with situations when user must be logged in (adding, removing, editing safes), there is a special patch, which create test user with id and name. User phisically not exists in database. To test all feature please activate patch, by adding/uncommenting these lines in main app.js file:

`43.//Patches - uncomment only for testing purposes`

`44.const addTestUser = require('./patches/patch_add_user');`

`45.app.use(addTestUser.addUser)`

Run test using command:
`npm test`

After running tests, patch should be removed (patch file is localized in directory 'patches').

