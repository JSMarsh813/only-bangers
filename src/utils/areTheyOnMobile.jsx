export default function areTheyOnMobile() {
  let areTheyOnMobile = false;
  if (typeof window !== "undefined") {
    const checkScreenSize = () => {
      areTheyOnMobile = window.matchMedia("(max-width: 900px)").matches;
    };

    checkScreenSize();

    // Cleanup event listener on component unmount to avoid memory leaks
    return () => mediaQuery.removeEventListener("change", checkScreenSize);
  }
  return areTheyOnMobile;
}
