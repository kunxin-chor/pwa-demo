
let pageOneBtn = document.querySelector('#page1-btn');
let pageTwoBtn = document.querySelector("#page2-btn");
let pageThreeBtn = document.querySelector("#page3-btn");
// eqv. pageOneBtn = document.getElementById("page1-btn")

let page1 = document.querySelector("#page-one");
let page2 = document.querySelector("#page-two");
let page3 = document.querySelector("#page-three");

page1.addEventListener('transitionend', function(){
    console.log(this.classList);
    if (this.classList.contains('hidden')) {
        this.style.display="none";
    }
});

page2.addEventListener('transitionend', function(){
    console.log(this.classList);
    if (this.classList.contains('hidden')) {
        this.style.display="none";
    }
});

page3.addEventListener('transitionend', function(){
    console.log(this.classList);
    if (this.classList.contains('hidden')) {
        this.style.display="none";
    }
});

showPageOne();

function hideAllPages() {
 
  page1.classList.add('hidden');
  page2.classList.add('hidden');
  page3.classList.add('hidden')

  page1.classList.remove('show');
  page2.classList.remove('show');
  page3.classList.remove('show');

}

async function showPageOne()
{
  hideAllPages();
  let response = await axios.get('page-one.html');
  page1.innerHTML = response.data;
  page1.style.display="block";
  setTimeout(function(){
      page1.classList.add('show');
      page1.classList.remove('hidden');
  });

}

pageOneBtn.addEventListener('click', async function(){
    showPageOne();
})

pageTwoBtn.addEventListener('click', async function(){

  // string literal
  let template = `
  <h1></h1>
  <img src="" class="responsive-img"/>`;

  hideAllPages();

  let response = await axios.get('data.json');
  let contentDiv = document.querySelector('#content');
  contentDiv.innerHTML = "";
  // loop : to go through each of the artwork
  for (let d of response.data) {

    // create a new <div> element for the data
    let entryElement = document.createElement('div');

    // set its children to be whatever html is in the template variable
    entryElement.innerHTML = template;

    // fill in the placeholders
    entryElement.querySelector('h1').innerText = d.title;
    entryElement.querySelector('img').setAttribute('src', d.photo);

    // append to the <div> inside the page
    contentDiv.appendChild(entryElement);

  }
  page2.style.display="block";
  setTimeout(function(){
    page2.classList.add('show');
    page2.classList.remove('hidden');
  })

})

pageThreeBtn.addEventListener('click', async function(){

  hideAllPages();
  let template = `<blockquote></blockquote>
    <p></p>
  `;
  let response = await axios.get('https://programming-quotes-api.herokuapp.com/quotes/random');
  console.log(response.data);

  page3.innerHTML = template;
  page3.querySelector('blockquote').innerText = response.data.en;
  page3.querySelector('p').innerText = response.data.author;

  page3.style.display="block";
     setTimeout(function(){

      page3.classList.add('show');
        page3.classList.remove('hidden');
   }, 100)
})

// register the srvice worker
window.onload = async () => {
  'use strict';


  if ('serviceWorker' in navigator) {
    console.log("registering the service worker");
    let registeredWorker = await navigator.serviceWorker.register('./sw.js');
    registeredWorker.addEventListener('updatefound', ()=>{
            // An updated service worker has appeared in reg.installing!
        let newWorker = registeredWorker.installing;

        newWorker.addEventListener('statechange', () => {
          // Has service worker state changed?
          switch (newWorker.state) {
            case 'installed':

            // There is a new service worker available, show the notification
              if (navigator.serviceWorker.controller) {
                  console.log("Update detected");
                let notification = document.getElementById('notification');
                    notification.className = 'show';
              }
              break;
          }
        });

        document.getElementById('reload').addEventListener('click', function(){
            newWorker.postMessage({ action: 'skipWaiting' });
        });
    })

     let refreshing;
   // The event listener that is fired when the service worker updates
   // Here we reload the page
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });

  }
}