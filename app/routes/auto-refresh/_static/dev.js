function startAutoRefresh(refreshNow = false, restartDelay = 0) {
  const evtSource = new EventSource("./auto-refresh/feed");

  evtSource.addEventListener("refresh", () => {
    if (refreshNow) {
      console.log("%cREFRESH", "color: orange");
      location.reload();
    }
    refreshNow = true;
  });

  evtSource.addEventListener("open", () => {
    console.log("%cAUTO REFRESH ENABLED", "color: green");
    restartDelay = 0;
  });

  evtSource.addEventListener("error", () => {
    evtSource.close();
    if (restartDelay < 30) {
      setTimeout(
        () => startAutoRefresh(true, restartDelay + 1),
        restartDelay * 100,
      );
    } else {
      console.log(
        "%cAUTO REFRESH DISABLED%c - you'll need manually refresh",
        "color: red",
        "color: unset",
      );
    }
  });
}

startAutoRefresh();
