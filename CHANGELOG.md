# Changelog

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
