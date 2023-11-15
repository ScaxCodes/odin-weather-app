function selectGIF(text) {
  text = text.toLowerCase();

  if (
    text.includes("ice") ||
    text.includes("freez") ||
    text.includes("blizzard")
  )
    return "//media1.giphy.com/media/KFUx0Rtz7p0HTzbJ7x/giphy.gif";
  else if (text.includes("snow"))
    return "//media3.giphy.com/media/26tneSGWphvmFlUju/giphy.gif";
  else if (text.includes("sun"))
    return "//media0.giphy.com/media/98UMeH7pPiOpM5sHDw/giphy.gif";
  else if (text.includes("rain"))
    return "//media1.giphy.com/media/Mgq7EMQUrhcvC/giphy.gif";
  else if (
    text.includes("cloud") ||
    text.includes("overcast") ||
    text.includes("mist")
  )
    return "//media0.giphy.com/media/gk3s6G7AdUNkey0YpE/giphy.gif";
  else if (text.includes("fog"))
    return "//media3.giphy.com/media/ZWRCWdUymIGNW/giphy.gif";
  else return 0;
}

function displayGIF(text) {
  const elementGIF = document.querySelector(".gif");
  const url = selectGIF(text);
  if (url) elementGIF.innerHTML = `<img src="${url}">`;
}

export { displayGIF };
