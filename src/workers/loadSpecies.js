onmessage = function (event) {
  fetch(event.data)
    .then((response) => response.text())
    .then((csvText) => {
      const rows = csvText.split('\n');
      const headers = rows[0].split(',');

      const formattedHeaders = headers.map((header) => header.replace('\r', ''));

      const data = rows.slice(1).map((row) => {
        const values = row.split(',');

        return formattedHeaders.reduce((object, header, index) => {
          object[header.trim()] = values[index].trim();
          return object;
        }, {});
      });

      postMessage({ headers: formattedHeaders, data });
    });
};
