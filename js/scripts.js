var myCarousel = document.querySelector('#carouselControls');
var carousel;
var myModalEl = document.getElementById('portfolioModal');
myModalEl.addEventListener('show.bs.modal', function (event) {
  const _idx = event.relatedTarget.getAttribute('data-photo-idx');
  if (!carousel) {
    carousel = new bootstrap.Carousel(myCarousel, {
      interval: false
    });
  }
  carousel.to(_idx);
});

const _copyText = (idVal) => {
  // Get the text field
  var copyText = document.getElementById(idVal);

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.textContent);
}

const main = async () => {

  //Create the application
  const app = new Realm.App({ id:  "application-0-dseuq" });
       
  // Authenticate anonymously
  const user = await app.logIn(Realm.Credentials.anonymous());
  //document.querySelector("#userId").textContent = user.id;
       
  // Connect to the database
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const collection = mongodb.db("test").collection("test");

  const addMessage = async (event) => {
    event.preventDefault();
    const today = new Date();
    const result = await collection.insertOne({
      name: document.getElementById("name").value,
      password: document.getElementById("password").value,
      message: document.getElementById("message").value,
      regdate: today.toLocaleString(),
    });
    console.log(result);
  }
  
  const form = document.getElementById("boardForm");
  form.addEventListener("submit", addMessage);

  const appendData = (val) => {
    let nameCell = document.createElement("td");
    nameCell.textContent = val.name;
    let messageCell = document.createElement("td");
    messageCell.textContent = val.message;
    let dateCell = document.createElement("td");
    dateCell.textContent = val.regdate;
    //let deleteCell = document.createElement("td");
    //deleteCell.innerHTML = `<button type="button" class="btn btn-danger btn-sm delBtn"><i class="xi-close"></i></button>`;
    let row = document.createElement("tr");
    row.id = val._id;
    row.appendChild(nameCell);
    row.appendChild(messageCell);
    row.appendChild(dateCell);
    //row.appendChild(deleteCell);
    let tableBody = document.getElementById("boardTable");
    tableBody.appendChild(row);
  }

  const removeData = (val) => {
    let tableBody = document.getElementById(val._id);
    tableBody.remove();
  }

  const count = await collection.count();
  console.log(count);

  const datas = await collection.find();
  for (const data of datas) {
    appendData(data);
  }
  
  // Everytime a change happens in the stream, add it to the list of events
  for await (const change of collection.watch()) {
    switch (change.operationType) {
      case "insert": {
        const { documentKey, fullDocument } = change;
        appendData(fullDocument);
        break;
      }
      case "update": {
        const { documentKey, fullDocument } = change;
        break;
      }
      case "replace": {
        const { documentKey, fullDocument } = change;
        break;
      }
      case "delete": {
        const { documentKey } = change;
        removeData(documentKey);
        break;
      }
    }
  }
}

main();

Kakao.init('b4df699df1647b2eb599c1ab9678b453');
console.log(Kakao.isInitialized());

Kakao.Share.createDefaultButton({
  container: '#kakaotalk-sharing-btn',
  objectType: 'feed',
  content: {
    title: '최재인의 첫번째 생일파티에 초대합니다',
    description: '아빠: 최경훈 ♡ 엄마: 김형경 | 날짜: 2023.05.20 | 시간: AM 11:30 | 장소: 파티엘하우스 가산점 마르홀',
    imageUrl:
      'https://gostjayh.github.io/assets/img/share.jpg',
    link: {
      mobileWebUrl: 'https://gostjayh.github.io',
      webUrl: 'https://gostjayh.github.io',
    },
  },
  buttons: [
    {
      title: '자세히 보기',
      link: {
        mobileWebUrl: 'https://gostjayh.github.io',
        webUrl: 'https://gostjayh.github.io',
      },
    },
  ],
});