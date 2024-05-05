# Changelog

## [1.1.4] - 2024-05-05

### Fixes

- Fixed sorting by name incorrectly skipping plants.

## [1.1.3] - 2024-05-03

### Added

- New avatar and location picture selector.
- New photo viewer, much better and accurate than the previous one.
- Visual update to support Material 3.

### Changes

- Angular version 17.3.6 and Capacitor 6.
- Requires Little Terrarium backend 1.0.6.
- Better support for file selection on non-mobile devices.
- Replaced Hammer.JS in favor of a newer, better supported, nicer API
interact.js.
- User preferences are now stored server-side. When not signed in, it will fall
back to local storage.
- New navigation toolbar when not signed in. Routes for not signed users (sign
in, register, recover password, etc) will all follow the same layout now.

### Fixes

- Fixed the Picture Viewer not closing when not in Android.
- Fixed the File Uploader not resetting availability when files are deleted.

## [1.1.2] - 2024-03-19

### Changes

- Picture Viewer will now work in full screen on Android (Immersive mode).

### Fixes

- Fixed selected files not showing when uploading.
- Fixed a bug in which the Picture Viewer will be opened after changing route.
- Fixed some checkmarks appearing where they shouldn't.

## [1.1.1] - 2024-03-18

### Fixes

- Separated backend and frontend base addresses in the config file to fix the
terrarium URL incorrectly generated.

## [1.1.0] - 2024-03-18

### Added

- New Camera Service to capture photos and pick them from the gallery.
- New Filesystem Service to manage the files created by the Camera and Share
services.
- New Password Service to manage API calls related to the user password.
- New component to easily change own's password.
- WebP support detector: if the browser doesn't support WebP and the backend
is set up to also send traditional image formats, images will use the later.
- Ability to share your own terrarium.

### Changes

- Visual update, including a new logo.
- As per Material design guidelines, sidebar will only show in bigger screens
and bottom toolbar will only show in smaller screens.
- Toolbars will hide when scrolling down, and pop back up when scrolling up.
- Image viewer rewritten to use canvas.
- Updated tests.
- Updated Angular and Angular Material to 17.3.0.
- Updated ngx-toastr to 18.0.0.
- Remaining components migrated to OnPush.
- Greatly Improved visuals in bigger screens.
- Improved markup semantics.
- Improved methods and properties protection.
- Updated translations.
- Several components and services migrated to signals. Just for my own
amusement.
- Rewritten forms for a better, cleaner system.
- Reduced function calls from templates.
- Cleanup of theme related variables.
- Cleanup of many observables in services.
- Cleanup of many models and enums that were wrongly placed and defined.

### Fixes

- Fixed a bug in ThemeSwitcher in which Transloco prevented the initial
selection of the theme.
- Fixed a bug in LangSwitcher in which no default language was selected if it
wasn't stored previously.
- Fixed a bug in SigninComponent where any button would submit the form.
- Fixed a lost translation in PasswordRecoveryComponent.
- Fixed startup language selection on Transloco.
- Fixed several visual artifacts in some screen sizes.

## [1.0.3] - 2023-12-23

### Added

- README.md file.
- New ShareService that allows the user to share photos to another apps.
- Transloco support for unit testing.

## [1.0.2] - 2023-12-20

### Changes

- Migrated from NGX-Translate to Transloco.

## [1.0.1] - 2023-12-08

### Added

- Location and User pictures can now be removed rather than just replaced.

### Changes

- Updated translations.
- FileUploader now has an optional checkbox to mark if the previous photo
should be removed.
- NGX-Translate now uses HttpBackend as loader to avoid clashing with the
interceptors that need translations.

### Fixed

- Adjusted the EditPage and FileUploader components and the settings-card style
class to work properly with the dark theme.
- Improved detection of current values through inputs in form components,
to avoid sending bogus data (such as 'undefined').

## [1.0.0] - 2023-12-01

### Added

- Password recovery is now fully functional (requires Backend 1.0.1).
- Theme switcher and light (current)/dark themes.
- A LICENSE file describing the MIT License.

### Fixed

- Fixed a bug in which a user with no first nor lastname would be displayed
as "null".
- UserFormEmail doesn't suggest a default e-mail anymore.
- Location list gets an updated location when it's modified.

### Changes

- Fully transitioned to the new Angular control flow.
- Updated ApiService and AuthService to match web version.
- ViewerComponent is now displayed in an Overlay, created through
ViewerService.
- Code cleanup.

## [0.9.1] - 2023-11-16

### Changed

- Updated to Angular 17.
- Templates migrated to the new Angular control flow.
- Huge code cleanup.
- Migrated modules to standalone components, as of latest Angular
recommendations.
- Components prefixed by "ltm-" to avoid conflicts with external libraries.

## [0.9.0] - 2023-11-15

Fully working version, still to be polished.
