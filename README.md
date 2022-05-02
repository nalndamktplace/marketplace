# Nalnda Marketplace

# Guide on React App
This is a very brief and precise guide aimed to get started with working on React Applications.

#### Table of Contents  
* [Live Preview](#live-preview)
* [Available Scripts](#available-scripts)
* [Firing Up](#firing-up)
* [Naming Branches](#naming-branches)
* [Assets](#assets)
* [Styling](#styling)
* [Project Directory Structure Decoded](#project-directory-structure-decoded)

# Live Preview

The live website can be checked out at [`mvp.nalnda.com`](https://mvp.nalnda.com)

# Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [`http://localhost:3000`](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# Firing Up
Steps to get the project running on Localhost

## React App
1. To start react app: `npm start`

## Blockchain
1. Navigate to `src/` directory: `cd src/`
2. To initiate blockhain: `npx hardhat node`
3. To deploy blockhain: `npx hardhat run scripts/deploy.js --network localhost`

# Naming Branches
Nomenclature of Github Branches

`<Task Nature>`-`<TID Number>`/`<Short Descrtiption>`

* Task Nature is a three letter sequence indicating the nature of the work in the branch
* TID Number is the tracking number
* Ideal Short Descirption should be very breif and precise (50 characters approx)

PS: Task nature and TID can be found [here](https://docs.google.com/spreadsheets/d/1Y_oYAoNZLxHe6wF1deY0Qdcax0xU3TSJTnSZMl5w_eM)

# Assets

All the assets (icons &amp; images) added to the project and can be found at 

Icons
`./src/assets/icons`

Images
`./src/assets/images`

# Styling

This project uses Sass framework for styling. Sass follows BEM structure while naming the classes and works very similaraly as CSS.

<b>PS:</b> Follow [`https://sass-lang.com/guide`](https://sass-lang.com/guide) for a comprehensive guide on SCSS.


## BEM Structure

Block Element Modifier

#### Block
Standalone entity that is meaningful on its own.

###### Examples
`header`, `container`, `menu`, `checkbox`, `input`

#### Element
A part of a block that has no standalone meaning and is semantically tied to its block.

###### Examples
`menu item`, `list item`, `checkbox caption`, `header title`

#### Modifier
A flag on a block or element. Use them to change appearance or behavior.

###### Examples
`disabled`, `highlighted`, `checked`, `fixed`, `size big`, `color yellow`

##### A graphical example
![BEM example](http://getbem.com/assets/github_captions.jpg)

<b>PS:</b> Refer [`http://getbem.com/naming/`](http://getbem.com/naming/) for further reading on naming classes in BEM structure.

#### Code Snippet

###### HTML
```html
<button class="button">Normal button</button>
<button class="button button--state-success">Success button</button>
<button class="button button--state-danger">Danger button</button>
```
###### SCSS
```scss
.button {
	display: inline-block;
	border-radius: 3px;
	padding: 7px 12px;
	border: 1px solid #D5D5D5;
	background-image: linear-gradient(#EEE, #DDD);
	font: 700 13px/18px Helvetica, arial;

	&--state-success {
		color: #FFF;
		background: #569E3D linear-gradient(#79D858, #569E3D) repeat-x;
		border-color: #4A993E;
	}

	&--state-danger {
		color: #900;
	}
}
```
</div>


# Project Directory Structure Decoded
The project has various directories as listed below with their reasons.

## `Blockhain`
We have four different files and folders related to Blockchain in the `src/`: 
* `contracts`- For smart contracts written in Solidity
* `scripts`- Various scripts related to Smart Contracts
* `test`- Test scripts for Smart Contracts
* `hardhat.config.js`- Config file for Smart Contracts

Another major component is the Smart Contracts Connector located at `src/connections/contracts.js`. This acts as a middleware between Smart Contracts and React.

## `assets`
Assets folder houses all the icons and images that will be used in this app.

## `components`
Components folder contains all the elements or collection of elements (or widgets as some may call them) which might be used more than once anywhere across the whole codebase.

File Extension: `.jsx`

<b>PS:</b> We use functional components <b>ONLY</b>. And always avoid using or referring to examples using class components.

These are divided into further folders:
* `hoc`- For components that have no meaning without their children like Backdrop
* `layouts`- For components with the ability to set children in a certain layout like Rows, Columns, Grid
* `nav`- For components helping in navigation like Header, Footer, Nav Drawer
* `routes`- For routing components like Protected Route
* `ui`- For basic UI elements like Buttons

## `data`
Files, generally in JSON format containing any static data that might be used in the app

## `pages`
Contains source code of all the pages housed in individual files.

File Extension: `.jsx`

## `sass`
Folder containing all the Sass files divided into various folders as:

* `abstract`- Files containing Functions, Variables &amp; Mixins
* `base`- Files containing base styling rules
* `components`- For files related to React components
* `layouts`- For files related to React layout components
* `pages`- For files related to React pages

## `store`
Store is the house of React Redux files divided into `actions` and `reducers`


## `app.js`
App.js is the main component of the app which acts as a container for all other components.

## `index.js`
Index.js is the entry point of React Apps and is the first page that is loaded and calls App Component.
