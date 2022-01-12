# notes, errata, etc

## general

- players online not limited to pictionary. should it be?
- game states might be better encapsulated as classes
- state should be moved more to the backend
- transitions between game states still rough

## componetization

- componetization still a draft
  - intent was for home to contain all extra-game logic (create, join, etc) and board (or subcomponents) to contain all in-game logic
- guesses and round word components could be shared
- possibly canvas too

## socket

- disconnection bug fix needs to be applied here as well (or preferrably globally)
- need better detection of and response to disconnects

## wordlists

- moved much of this to a shared service, but didn't rework it here to use that shared service

## canvas

- sizing not responsive
- implement more immediate drawing https://codepen.io/moshfeu/pen/ZEGQEBO?editors=0010

## narrow window widths

- player board can move under side menu, especially when choosing words
- canvas sizing problematic here

## spinner

- never quite got where I wanted with this
- could be tweaked further and used in more places

## events

- not all events in events.js are currently used (Sorry Matt)
- unused event could be removed or used for transitions which was my intent

## backend

- left some logging-like console.logs, could remove or change to logger

## project at large

- use more shared components and services
- use Angular, no need to rewrite click events when we have (click) for example
- if server-side state were standardized, much of the create, join, leave, etc. logic could be shared
- consider moving the BE game folders inside a parent folder like plugins
  - could even bundle the FE inside plugin folder, so all code for a game is in one spot, but this would be a larger rework
