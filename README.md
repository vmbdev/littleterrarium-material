# Little Terrarium Material UI

![Little Terrarium](https://littleterrarium.one/assets/oglt.png)

**Little Terrarium** allows you to manage your whole plant collection.

Little Terrarium Material UI is made with Angular and Capacitor, and is part of
the Little Terrarium project.

You can access the live app on
[https://littleterrarium.one](https://littleterrarium.one).

- [Little Terrarium Material UI](#little-terrarium-material-ui)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Setup](#setup)
  - [Deployment](#deployment)
    - [Build served as web through Backend](#build-served-as-web-through-backend)
    - [Build for Android/iOS](#build-for-androidios)
  - [Built with](#built-with)
  - [License](#license)

## Getting Started

You can get the latest code from
[here](https://github.com/vmbdev/littleterrarium-material/archive/refs/heads/main.zip)
or through Git:

```bash
git clone https://github.com/vmbdev/littleterrarium-material.git
```

### Prerequisites

Little Terrarium Material requires [Node.js](https://nodejs.org/) 18 or later
installed on your system.

LT Material also requires
[Little Terrarium Backend](https://github.com/vmbdev/littleterrarium-backend)
to make it work.

### Installation

First of all, we need to install its dependencies. Open a terminal and get to
the directory where it's installed and run the following command:

```bash
npm install
```

### Setup

In the **src** directory, edit **config.ts** if necessary. Available ptions
are:

- **bakckendUrlDevelopment**: The URL of the backend when running in a
development environment.
- **bakckendUrlProduction**: The URL of the backend when running in production.
- **frontendUrlDevelopment**: The URL of the frontend when running in
development.
- **frontendUrlDevelopment**: The URL of the frontend when running in
production.
- **endpoint**: In the backend URL, where to make the API calls.
- **theme**: Default theme when first accesed.
- **availableThemes**: List of available themes.
- **defaultLang**: Default language defined by id ('en', 'es', 'fr'...).
- **availableLangs**: List of available languages defined as LangDefinition[]
in Transloco, this is, an array of { id, label } where id is the locale and the
name of the translation file in /assets/i18n, and label is the name of the
language (i.e. "Español", "English", "British English"...).

## Deployment

To serve the UI locally, run:

```bash
npm run start
```

To build Little Terrarium Web with its translations, run:

```bash
npm run build
```

This will produce a **dist** folder with the static content.

### Build served as web through Backend

Place the **dist** folder in the LT backend root directory and when started, it
will detect the content and serve it in the base URL.

### Build for Android/iOS

To build the mobile version we'll use Capacitor and Xcode/Android Studio. First
we'll start by adding support for the platforms that we'll build to:

```bash
npx cap add android
```

```bash
npx cap add ios
```

Then we'll compile the assets (icons, splash screen) for our application:

```bash
npx capacitor-assets generate
```

After building our application, we have to sync the Angular build with the
Capacitor platforms:

```bash
npx cap sync
```

Then we can run it in our emulator (or devices, if configured) with:

```bash
npx cap run <platform>
```

Or build it with Xcode/Android Studio with:

```bash
npx cap open <platform>
```

## Built with

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [Angular](https://angular.io/) - Web Framework
- [Angular Material](https://material.angular.io/) - Material Design components
for Angular
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for
types
- [Capacitor](https://capacitorjs.com/) - Runtime for building Web Native apps
- [Luxon](https://moment.github.io/luxon/) - Date management library
- [interact.js](https://interactjs.io/) - Gestures
- [ngx-toastr](https://github.com/scttcper/ngx-toastr) - Toast for Angular
- [ng-mocks](https://ng-mocks.sudo.eu/) - Testing library for Angular
- [Compodoc](https://compodoc.app/) - Documentation tool for Angular
- [RxJS](https://rxjs.dev/) - Reactive Extensions Library for JavaScript

## License

Little Terrarium Material is licensed under the MIT License - see the
[LICENSE](https://github.com/vmbdev/littleterrarium-material/blob/main/LICENSE)
file for more details.
