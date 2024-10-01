// importando SDKs di fures base
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js"; //itens relacionado a base de dados firestone
// adicione aqui o que foi copiado em seu bloco de notas
const firebaseConfig = {
    apiKey: "AIzaSyA9rvKh5ktUxHX66yDAr8pnMKZt8VUh8d4",
    authDomain: "dadospessoais-57e4d.firebaseapp.com",
    projectId: "dadospessoais-57e4d",
    storageBucket: "dadospessoais-57e4d.appspot.com",
    messagingSenderId: "1074317000492",
    appId: "1:1074317000492:web:caf2947564a3ff280e7689",
  };
// inicialze firebase
const app = initializeApp(firebaseConfig);
//pegando base de dados firestore do firebase
const db = getFirestore(app);
const notify = document.querySelector(".notify");
// adicionando dados na base de dados firebase
async function addData() {
  const name = document.querySelector("#nome").value;
  const email = document.querySelector("#email").value;
  const rg = document.querySelector("#rg").value;
  const profissao = document.querySelector("#profissao").value;
  try {
    const DocRef = await addDoc(collection(db, "users"), {
      name: name,
      email: email,
      rg: rg,
      profissao: profissao,
    });
    notify.innerHTML = `Data Added `;
    document.querySelector("#nome").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#rg").value = "",
    document.querySelector("#profissao").value = "",
    setTimeout(() => {
      notify.innerHTML = "";
    }, 3000); //atualizar a pagina a cada 3 segundos
    GetData();
  } catch (eror) {
    console.log(eror);
  }
}
// constante de estado do botão cadastar
const addBtn = document.querySelector("#add_Data");
// evento de click no botão cadastar
addBtn.addEventListener("click", addData);
// buscar dados no firestore e concatene o conteúdo na tablea do html
async function GetData() {
  try {
    const getDataQuery = await getDocs(collection(db, "users"));
    let html = "";
    getDataQuery.forEach((doc) => {
      const data = doc.data();
      html += `
<tr>
<td>${data.rg}</td>
<td>${data.name}</td>
<td>${data.profissao}</td>
<td>${data.email}</td>
<td><button class="del_btn"
onclick="deleteData('${doc.id}')">Excluir</button></td>
<td><button class="up_btn"
onclick="updateData('${doc.id}')">Atualizar</button></td>
</tr>
`;
    });
    document.querySelector("tbody").innerHTML = html;
  } catch (err) {
    console.log(err);
  }
}
GetData();
// evento de excluir usuário da base de dados
window.deleteData = async function (id) {
  try {
    if (confirm() == false) {
        alert("Didn't confirm.");
        return;
    }
    await deleteDoc(doc(db, "users", id));
    notify.innerHTML = "data Deleted";
    setTimeout(() => {
      notify.innerHTML = "";
    }, 3000);
    getDocs();
  } catch (err) {
    console.log(err);
  }
};
// atualizar dados
window.updateData = async function (id) {
  try {
    const docSnapShot = await getDoc(doc(db, "users", id));
    const currentUser = docSnapShot.data();
    document.querySelector("#nome").value = currentUser.name;
    document.querySelector("#email").value = currentUser.email;
    document.querySelector("#rg").value = currentUser.rg;
    document.querySelector("#profissao").value = currentUser.profissao;
    const updateDataBtn = document.querySelector("#update_data");
    updateDataBtn.classList.add("show");
    addBtn.classList.add("hide");
    updateDataBtn.addEventListener("click", async function () {
      const newName = document.querySelector("#nome").value;
      const newEmail = document.querySelector("#email").value;
      const newRG = document.querySelector("#rg").value;
      const newProfissao = document.querySelector("#profissao").value;
      if (newName !== null && newEmail !== null && newRG !== null && newProfissao !== null) {
        await updateDoc(doc(db, "users", id), {
          name: newName,
          email: newEmail,
          rg: newRG,
          profissao: newProfissao,
        });
        notify.innerHTML = "Data Updated";
        GetData();
        updateDataBtn.classList.remove("show");
        addBtn.classList.remove("hide");
        document.querySelector("#nome").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#rg").value = "";
        document.querySelector("#profissao").value = "";
        setTimeout(() => {
          notify.innerHTML = "";
        }, 3000);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
