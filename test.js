const pt = require("path");
function count() {
  const YEAR = process.argv[2];
  const path = pt.join(
    __dirname,
    "output",
    "Compra Directa",
    "links",
    `${YEAR}.json`
  );

  const json11 = require(path);

  array_elements = json11;

  array_elements.sort();

  var current = null;
  var cnt = 0;
  for (var i = 0; i < array_elements.length; i++) {
    if (array_elements[i] != current) {
      if (cnt > 0) {
        console.log(current + " comes --> " + cnt + " times");
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
  console.log(json11.length);
}

count();
