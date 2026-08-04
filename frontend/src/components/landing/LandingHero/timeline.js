// The single scroll timeline for the landing story.
// Every scene maps its motion onto these ranges so the film stays in sync
// from one place. Values are fractions of the ScrollController's progress.
//
// ACT 1 curiosity -> ACT 2 reveal -> ACT 3 understanding -> ACT 4 trust -> ACT 5 action
//
// Pacing rule: no beat may hold longer than it earns. At 560vh each 0.01 of
// progress is ~4.6vh of scrolling, so the longest hold (the device, 0.18) is
// under one viewport of travel — enough to admire, not enough to feel dead.
export const T = {
  HERO_TEXT_OUT: [0.08, 0.20],   // scene 1 copy recedes as the device wakes
  DEVICE_RISE: [0.06, 0.26],     // scene 2: flat (75deg) -> vertical
  DEVICE_BOOT: 0.085,            // scene 3: software boots while rising
  DEVICE_HOLD: [0.26, 0.44],     // scene 4: hold. admire. mouse tilt lives here
  DEVICE_OUT: [0.44, 0.52],      // scene 5: the device leaves
  CARDS_IN: [0.24, 0.32],
  CARDS_MERGE: [0.44, 0.54],     // cards detach and travel to centre
  SPHERE: [0.50, 0.62],          // they become one warm gold sphere
  QUOTE_A: [0.645, 0.71],        // scene 6: quote owns the screen, alone
  QUOTE_B: [0.735, 0.79],
  QUOTE_OUT: [0.83, 0.87],
  WORKFLOW: [0.86, 0.99],        // scene 7, holding full through the handoff
};

// Device is fully gone (opacity 0) at 0.52 and the quote does not begin
// until 0.645 — the two scenes can never share the screen.
export const SCROLL_LENGTH = 560; // vh
