class StringUtils {

  static capitalizeFirstLetterFromWord(str) {
    if (str && typeof str === "string" && str[0] === str[0].toLowerCase()) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
  }

  static capitalizeEachFirstLetterFromSentence(str) {
    if (str && typeof str === 'string') {
      return str.split(' ').map(word => {
        if (word.length > 0 && word[0] === word[0].toLowerCase()) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      }).join(' ');
    }
    return str;
  }
}

module.exports = StringUtils;