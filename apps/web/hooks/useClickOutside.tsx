import { RefObject, useEffect } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement | undefined>,
  callback: (event: MouseEvent) => void
) => {
  const handleClick = (event: MouseEvent) => {
    callback(event);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
