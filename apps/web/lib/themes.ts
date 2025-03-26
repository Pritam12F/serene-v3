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
      background: "lightgray",
    },
    selected: {
      text: "white",
      background: "black",
    },
    disabled: {
      text: "black",
      background: "lightgray",
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
      background: "bg-editorbackgrounddark",
    },
    menu: {
      text: "#ffffff",
      background: "black",
    },
    tooltip: {
      text: "#ffffff",
      background: "black",
    },
    hovered: {
      text: "#ffffff",
      background: "#323232",
    },
    sideMenu: "#ffffff",
    highlights: darkDefaultTheme.colors!.highlights,
  },
} satisfies Theme;

export const blueTheme = {
  light: lightBlueTheme,
  dark: darkBlueTheme,
};
