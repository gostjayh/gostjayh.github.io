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

  alert("복사되었습니다.");
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
    const name = document.getElementById("name");
    const password = document.getElementById("password");
    const message = document.getElementById("message");
    const today = new Date();
    const result = await collection.insertOne({
      name: name.value,
      password: password.value,
      message: message.value,
      regdate: today.toLocaleString(),
    });
    name.value = "";
    password.value = "";
    message.value = "";
  }
  
  const form = document.getElementById("boardForm");
  form.addEventListener("submit", addMessage);

  const appendData = (val) => {
    let nameCell = document.createElement("td");
    nameCell.textContent = val.name;
    let dateCell = document.createElement("td");
    dateCell.classList.add("text-end");
    dateCell.textContent = val.regdate.slice(2).slice(0, val.regdate.length-5);
    //let deleteCell = document.createElement("td");
    //deleteCell.innerHTML = `<button type="button" class="btn btn-danger btn-sm delBtn"><i class="xi-close"></i></button>`;
    let row = document.createElement("tr");
    row.setAttribute("data-id", val._id);
    row.appendChild(nameCell);
    row.appendChild(dateCell);
    //row.appendChild(deleteCell);
    let messageCell = document.createElement("td");
    messageCell.colSpan = 2;
    messageCell.innerHTML = val.message.replaceAll('\n', '<br>');
    let row1 = document.createElement("tr");
    row1.setAttribute("data-id", val._id);
    row1.appendChild(messageCell);
    let tableBody = document.getElementById("boardTable");
    tableBody.appendChild(row);
    tableBody.appendChild(row1);
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

const diffDay = () => {
  const masTime = new Date("2023-05-20");
  const todayTime = new Date();
  
  const diff = masTime - todayTime;
  
  const diffDay = Math.floor(diff / (1000*60*60*24));
  
  let ddayLable = document.getElementById("dday");
  ddayLable.textContent = diffDay;

  setTimeout(diffDay, 1000);
}

//맵 길안내
const map = (type) => {
  const name = "파티엘하우스 가산";
  const lat = "37.47790530949328";
  const lng = "126.88607034192312";
  
  switch (type) {
    case "T": {
      location.href = "https://apis.openapi.sk.com/tmap/app/routes?appKey=qLDK0YvYMsmNtEB6yUud5POJLTjumml6Ay825Jt0&name="+name+"&lon="+lng+"&lat="+lat;
      break;
    }
    case "K": {
      location.href = "https://map.kakao.com/link/to/"+name+","+lat+","+lng;
      break;
    }
    case "N": {
      location.href = "http://app.map.naver.com/launchApp/?version=11&menu=navigation&elat="+lat+"&elng="+lng+"&etitle="+name;
      break;
    }
  }
}

diffDay();
main();