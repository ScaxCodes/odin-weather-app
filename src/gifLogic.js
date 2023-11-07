function selectGIF(text) {
  text = text.toLowerCase();

  if (
    text.includes("ice") ||
    text.includes("freez") ||
    text.includes("blizzard")
  )
    return "ice"; // //media1.giphy.com/media/KFUx0Rtz7p0HTzbJ7x/giphy.gif
  else if (text.includes("snow"))
    return "snow"; // //media3.giphy.com/media/26tneSGWphvmFlUju/giphy.gif
  else if (text.includes("sun"))
    return "sun"; // //media0.giphy.com/media/98UMeH7pPiOpM5sHDw/giphy.gif
  else if (text.includes("rain"))
    return "rain"; // //media1.giphy.com/media/Mgq7EMQUrhcvC/giphy.gif
  else if (text.includes("cloud"))
    return "cloud"; // //media0.giphy.com/media/gk3s6G7AdUNkey0YpE/giphy.gif
  else if (text.includes("fog")) return "fog";
  // //media3.giphy.com/media/ZWRCWdUymIGNW/giphy.gif
}

export { selectGIF };
