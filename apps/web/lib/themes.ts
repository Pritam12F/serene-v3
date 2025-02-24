import { darkDefaultTheme, lightDefaultTheme, Theme } from "@blocknote/mantine";

const lightBlueTheme = {
  colors: {
    editor: {
      text: "#222222",
      background: "white",
    },
    menu: {
      text: "black",
      background: "white",
    },
    tooltip: {
      text: "#ffffff",
      background: "black",
    },
    hovered: {
      text: "black",
      background: "#ebeeff",
    },
    selected: {
      text: "white",
      background: "black",
    },
    disabled: {
      text: "black",
      background: "#ebeeff",
    },
    shadow: "#0d1c2f",
    border: "#1c3a5f",
    sideMenu: "#bababa",
    highlights: lightDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;

const darkBlueTheme = {
  ...lightBlueTheme,
  colors: {
    ...lightBlueTheme.colors,
    editor: {
      text: "#ffffff",
      background: "#282b32",
    },
    menu: {
      text: "#ffffff",
      background: "#454653",
    },
    tooltip: {
      text: "#ffffff",
      background: "#00c6c1",
    },
    hovered: {
      text: "#ffffff",
      background: "#757684",
    },
    sideMenu: "#ffffff",
    highlights: darkDefaultTheme.colors!.highlights,
  },
} satisfies Theme;

export const blueTheme = {
  light: lightBlueTheme,
  dark: darkBlueTheme,
};
