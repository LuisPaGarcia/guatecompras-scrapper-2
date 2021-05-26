const json11 = require("./output/links/Compra Directa/2011.json");

console.log(json11.length);
function count() {
  array_elements = json11;

  array_elements.sort();

  var current = null;
  var cnt = 0;
  for (var i = 0; i < array_elements.length; i++) {
    if (array_elements[i] != current) {
      if (cnt > 0) {
        console.log(current + " comes --> " + cnt + " times<br>");
      }
      current = array_elements[i];
      cnt = 1;
    } else {
      cnt++;
    }
  }
  if (cnt > 0) {
    console.log(current + " comes --> " + cnt + " times");
  }
}

count();
