function getBG() {
  const num = Math.floor(Math.random() * 6) + 1;
  if (num === 1) {
    return `background-image: linear-gradient(to right top, #ffc900, #ffa454, #ff8c94, #ff8dcb, #d99beb, #b1a8fb, #86b4ff, #5dbcf8, #2ccafd, #00d8fa, #00e4f0, #00efe0);`;
  }

  if (num === 2) {
    return `background-image: linear-gradient(to right top, #6707fc, #5346ff, #4964ff, #507cfe, #6390f6, #56a0fa, #53affa, #5dbcf8, #2ccafd, #00d8fa, #00e4f0, #00efe0);`;
  }
  if (num === 3) {
    return `background-image: linear-gradient(to right top, #6707fc, #5346ff, #4964ff, #507cfe, #6390f6, #828ef1, #9a8ceb, #ae8ae4, #d669c9, #f53b99, #ff0059, #ef0000);`;
  }

  if (num === 4) {
    return `background-image: linear-gradient(to right top, #fcf107, #ffc435, #ff986c, #ff7da0, #ff7ac9, #ef76d6, #da75e2, #bf76ee, #c868f1, #d256f2, #de3df1, #ea00ef);`;
  }
  if (num === 5) {
    return `background-image: linear-gradient(to right top, #f005ff, #8882ff, #00aeff, #00c9ff, #00dafd, #00d4f5, #00ceed, #00c8e5, #00acfa, #008bff, #0061ff, #1400ef);`;
  }

  return `background-image: linear-gradient(
      to right top,
      #d16ba5,
      #c777b9,
      #ba83ca,
      #aa8fd8,
      #9a9ae1,
      #8aa7ec,
      #79b3f4,
      #69bff8,
      #52cffe,
      #41dfff,
      #46eefa,
      #5ffbf1
    );`;
}

export default getBG;
