const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    const script = globalThis.URLPattern ? "/sw.js" : "/sw_compat.js";
    try {
      const registration = await navigator.serviceWorker.register(script, {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with`, error);
    }
  }
};

registerServiceWorker();
