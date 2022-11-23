//SYNCRONOUS WAY OF READING AND WRITING FROM THE FILE

const fs = require('fs');
const http = require('http');
const { parse } = require('path');
const { default: slugify } = require('slugify');
// const { dirname } = require("path");
const url = require('url');
// console.log(slugify("Avacado Fresh", { lower: true }));

// // const helo = "hello world";
// // console.log(helo);
// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// // sync stand fr synchronous
// console.log(textIn);

// const textOut = `hi ganddu ${textIn}\n created on now`;
// fs.writeFileSync("./starter/txt/input.txt", textOut);
// console.log("File written");

//ASYNCRONOUS WAY OF READING AND WRITING FROM THE FILE

// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
// });
// console.log("file reading");

//another crazy of

// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./starter/txt/${data1}.txt `, "utf-8", (err, data2) => {
//     console.log(data1);
//   });
// });
// console.log(data2);
// console.log("file reading");

// fs.readFile("./starter/txt/read-this.txt", "utf-8", (err, data3) => {
//   console.log(data3);
// });

// //write
// fs.write("./starter/txt/start.txt", `${data3}`, "utf-8", (err) => {
//   console.log("data written");
// });

///////////////////////////////////////////////////////

//server

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);

const tempOverview = fs.readFileSync(
  './starter/templates/template-overview.html',
  'utf-8'
);

const tempCrad = fs.readFileSync(
  './starter/templates/template-card.html',
  'utf-8'
);

const tempProduct = fs.readFileSync(
  './starter/templates/template-product.html',
  'utf-8'
);

const dataObj = JSON.parse(data);
const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCrad, el))
      .join('');
    res.writeHead(200, { 'Content-type': 'text/html' });
    // res.end(tempOverview);
    // console.log(dataObj);
    // console.log(tempOverview);
    //in cardhtml we have array of all these elements but we need one big string
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //Not found
  else {
    res.writeHead(404, {
      'conntent-type': 'text/html',
    });
    res.end('<h1>page not found !</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening the request from the server!!');
});
