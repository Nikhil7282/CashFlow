(async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  let dashboardToast = new bootstrap.Toast(document.querySelector(".toast"));
  let message = document.querySelector(".toastContent");

  // Get the button element
  const dropdownButton = document.querySelector(".dropdown-toggle");

  // Get the dropdown menu element
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // Toggle the dropdown when the button is clicked
  dropdownButton.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
  });

  if (!accessToken) {
    window.location.href =
      "http://127.0.0.1:5500/Nikhil/CashFlow/pages/login.html";
  }
  let currency = "₹";
  let dashboardData = await getBudgetsData();
  const addCategoryModal = new bootstrap.Toast(
    document.querySelector(".addCategoryModal")
  );

  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const logoutResponse = await fetch("http://localhost:5000/users/logout", {
        method: "GET",
        credentials: "include",
      });
      if (logoutResponse.status === 200 || logoutResponse.status === 204) {
        sessionStorage.clear();
        window.location.href =
          "http://127.0.0.1:5500/Nikhil/CashFlow/pages/login.html";
      } else {
        message.textContent = "Trouble Logging Out Try Again";
        dashboardToast.show();
      }
    } catch (error) {
      console.log(error);
    }
  });
  // let dashboardData = [
  //   {
  //     id: "1",
  //     name: "Entertainment",
  //     total: 1000,
  //     spent: 500,
  //     percentage: 50,
  //     spentDetails: [
  //       { amount: 200, spentOn: "Movie" },
  //       { amount: 200, spentOn: "Netflix" },
  //       { amount: 100, spentOn: "HotStar" },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "Myself",
  //     total: 1000,
  //     spent: 600,
  //     percentage: 60,
  //     spentDetails: [
  //       { amount: 200, spentOn: "Movie" },
  //       { amount: 200, spentOn: "Netflix" },
  //       { amount: 100, spentOn: "HotStar" },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     name: "Food",
  //     total: 1000,
  //     spent: 400,
  //     percentage: 40,
  //     spentDetails: [
  //       { amount: 200, spentOn: "Movie" },
  //       { amount: 200, spentOn: "Netflix" },
  //       { amount: 100, spentOn: "HotStar" },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     name: "Cloths",
  //     total: 5000,
  //     spent: 3000,
  //     percentage: 60,
  //     spentDetails: [
  //       { amount: 1000, spentOn: "T-Shirts" },
  //       { amount: 1000, spentOn: "Sweat Shirt" },
  //       { amount: 1000, spentOn: "Shirt" },
  //     ],
  //   },
  // ];
  async function getBudgetsData() {
    try {
      let users = await fetch(`http://localhost:5000/budgets`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      if (users.status === 403) {
        sessionStorage.clear();
        window.location.href =
          "http://127.0.0.1:5500/Nikhil/CashFlow/pages/login.html";
      }
      let data = await users.json();
      // console.log(data);
      return data.catagories;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  let cardContainer = document.querySelector("#card-container");

  async function renderCards() {
    cardContainer.innerHTML = "";
    if (dashboardData.length == 0) {
      cardContainer.innerHTML = `<div class="text-white">
      <h1>No Budgets Yet</h1>
      </div>`;
    }
    dashboardData.map((data) => {
      let card = `<div
    id="card-${data.id}"
                class="cardItem mx-lg-2 mt-2 py-3 col-lg-5 text-white border border-2 border-altPrimary rounded-2"
                data-id="${data.id}"  
              >
                <h3 class="heading">${data.categoryName}</h3>
                <section id="progress-bar">
                  <div class="progress">
                    <div
                    style="width:${(data.spent / data.total) * 100}%"
                      class="progress-bar"
                      role="progressbar"
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </section>
                <footer
                  class="mt-4 d-flex justify-content-between gap-3 align-items-center"
                >
                  <div id="amount" class="font-monospace h6">${data.spent}/${
        data.total
      }</div>
                  <div>
                    <button class="btn btn-altgrey  addExpenseBtn" data-id="${
                      data.id
                    }">Add Expense</button>
                    <button
                    id="deleteCard-btn"
                      class="btn bg-altDanger btn-rounded text-white delete-card"
                      data-id="${data.id}"
                      data-mdb-ripple-init
                    >
                      Delete
                    </button>
                  </div>
                </footer>
              </div>`;
      cardContainer.insertAdjacentHTML("beforeend", card);
    });
  }
  renderCards();

  async function addModel(cardId) {
    const existingModel = document.querySelector(".addExpense-modal");
    if (existingModel) {
      // console.log(existingModel);
      existingModel.remove();
    }
    // console.log(cardId);
    cardId = cardId || null;
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("addExpense-modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("addExpense-modal-content", "bg-altSuccess");

    const closeButton = document.createElement("span");
    closeButton.classList.add("addExpense-close-button");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", (e) => {
      toggleAddExpenseModel();
    });

    const heading = document.createElement("h1");
    heading.classList.add("text-white");
    heading.textContent = cardId
      ? dashboardData.filter((obj) => obj.id == cardId)[0].categoryName
      : "Category";

    const formGroupAmount = document.createElement("div");
    formGroupAmount.classList.add("form-group", "pt-3");

    const formFloatingAmount = document.createElement("div");
    formFloatingAmount.classList.add("form-floating", "mb-3");

    const formGroupSpent = document.createElement("div");
    formGroupSpent.classList.add("form-group", "pt-3");

    const formFloatingSpent = document.createElement("div");
    formFloatingSpent.classList.add("form-floating", "mb-3");

    const amountInput = document.createElement("input");
    amountInput.type = "text";
    amountInput.id = "amountSpent";
    amountInput.classList.add("form-control");
    amountInput.placeholder = "";
    const amountLabel = document.createElement("label");
    amountLabel.htmlFor = "amountSpent";
    amountLabel.textContent = "Amount";

    const spentOnInput = document.createElement("input");
    spentOnInput.type = "text";
    spentOnInput.id = "spentOn";
    spentOnInput.classList.add("form-control");
    spentOnInput.placeholder = "";
    const spentOnLabel = document.createElement("label");
    spentOnLabel.htmlFor = "spentOn";
    spentOnLabel.textContent = "Spent On";

    const addButton = document.createElement("button");
    addButton.classList.add("btn", "btn-altDanger", "text-white", "h6");
    addButton.textContent = "Add";

    addButton.addEventListener("click", async (e) => {
      try {
        let amount = amountInput.value;
        let spentOn = spentOnInput.value;
        if (amount == "" || spentOn == "") {
          message.textContent = "Please Fill all fields.";
          dashboardToast.show();
          return;
        }
        const addSpentDetailsResponse = await fetch(
          `http://localhost:5000/budgets/add/spentDetails/${cardId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: amount,
              spentOn: spentOn,
            }),
          }
        );
        const addSpentDetailsResult = await addSpentDetailsResponse.json();
        if (addSpentDetailsResponse.status === 200) {
          message.textContent = addSpentDetailsResult.message;
          dashboardToast.show();
          dashboardData = await getBudgetsData();
          renderCards();
          toggleAddExpenseModel();
        }
      } catch (error) {
        message.textContent = error.message;
        dashboardToast.show();
        console.log(error);
        return;
      }
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(heading);
    formFloatingAmount.appendChild(amountInput);
    formFloatingAmount.appendChild(amountLabel);
    formFloatingSpent.appendChild(spentOnInput);
    formFloatingSpent.appendChild(spentOnLabel);
    formGroupAmount.appendChild(formFloatingAmount);
    formGroupSpent.appendChild(formFloatingSpent);
    modalContent.appendChild(formGroupAmount);
    modalContent.appendChild(formGroupSpent);
    modalContent.appendChild(addButton);

    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);
  }

  document.addEventListener("click", async (e) => {
    try {
      let target = e.target.classList.contains("delete-card")
        ? e.target
        : e.target.parentElement;
      if (target.classList.contains("delete-card")) {
        let cardId = target.dataset.id;
        const deleteCardResponse = await fetch(
          `http://localhost:5000/budgets/deleteBudget?id=${cardId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
        const deleteCardResult = await deleteCardResponse.json();
        // console.log(deleteCardResult);
        if (deleteCardResponse.status === 200) {
          message.textContent = deleteCardResult.message;
          dashboardToast.show();
          let card = document.querySelector(`#card-${cardId}`);
          cardContainer.removeChild(card);
          return;
        } else {
          message.textContent = deleteCardResult.message;
          dashboardToast.show();
          return;
        }
      }
    } catch (error) {
      console.log(error);
      message.textContent = "Error Occurred while deleting card";
    }
  });

  function toggleAddExpenseModel() {
    let addExpenseModal = document.querySelector(".addExpense-modal");
    addExpenseModal.classList.toggle("show-addExpense-modal");
  }

  async function CategoryDetailsModel(cardId) {
    let modelTitle = document.querySelector(".details-title");
    let modelTableBody = document.querySelector("#details-table-body");
    modelTableBody.innerHTML = "";

    let spentDetailData = await fetch(
      `http://localhost:5000/budgets/spentDetails/${cardId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    let spentDetailsResult = await spentDetailData.json();
    // console.log(spentDetailsResult);

    modelTitle.innerHTML =
      dashboardData.find((data) => cardId == data.id).categoryName ||
      "Category";

    spentDetailsResult.spentDetails &&
      spentDetailsResult.spentDetails.map((spentDetail) => {
        let row = document.createElement("tr");
        let nameElement = document.createElement("td");
        nameElement.textContent = spentDetail.spentOn;
        let amountElement = document.createElement("td");
        amountElement.textContent = spentDetail.amount + " " + currency;
        let deleteButtonElement = document.createElement("td");
        let deleteButton = document.createElement("Remove");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>`;
        deleteButton.classList.add("btn", "btn-altDanger", "text-white");
        deleteButton.addEventListener("click", async () => {
          try {
            const deleteSpentDetails = await fetch(
              `http://localhost:5000/budgets/deleteSpentDetails?id=${spentDetail.id}`,
              {
                method: "DELETE",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            const deleteSpentDetailsResult = await deleteSpentDetails.json();
            if (deleteSpentDetails.status === 200) {
              message.textContent = deleteSpentDetailsResult.message;
              dashboardToast.show();
              row.remove();
              dashboardData = await getBudgetsData();
              renderCards();
              return;
            }
          } catch (error) {
            console.log(error);
            message.textContent = "Error Occurred while deleting spent details";
            dashboardToast.show();
          }
        });
        deleteButtonElement.appendChild(deleteButton);
        row.appendChild(nameElement);
        row.appendChild(amountElement);
        row.appendChild(deleteButtonElement);
        modelTableBody.appendChild(row);
        return;
      });
    return;
  }

  window.addEventListener("click", windowOnClick);

  async function windowOnClick(event) {
    let myModal = new bootstrap.Modal(
      document.querySelector("#addExpenseModel")
    );
    let deleteCardBtn = document.querySelector("#deleteCard-btn");
    let addExpenseModal = document.querySelector(".addExpense-modal");
    let modelCloseBtn = document.querySelector("#addExpenseModel-close");
    modelCloseBtn.addEventListener("click", () => {
      myModal.hide();
    });
    if (event.target.classList.contains("cardItem")) {
      event.target.addEventListener("click", async () => {
        let cardId = event.target.dataset.id;
        await CategoryDetailsModel(cardId);
        myModal.show();
      });
      return;
    }
    if (
      event.target !== deleteCardBtn &&
      event.target !== addExpenseModal &&
      event.target.parentElement.classList.contains("cardItem")
    ) {
      let cardId = event.target.parentElement.dataset.id;
      await CategoryDetailsModel(cardId);
      myModal.show();
      return;
    }
    if (
      event.target.parentElement.parentElement.classList.contains("cardItem")
    ) {
      let cardId = event.target.parentElement.parentElement.dataset.id;
      await CategoryDetailsModel(cardId);
      myModal.show();
      return;
    }
    if (event.target === addExpenseModal) {
      toggleAddExpenseModel();
    }
  }

  document.addEventListener("click", async (e) => {
    let cardId = e.target.dataset.id;
    if (e.target.classList.contains("addExpenseBtn")) {
      await addModel(cardId);
      toggleAddExpenseModel();
    }
  });

  let addCategory = document.querySelector("#addCategoryBtn");
  addCategory.addEventListener("click", async (e) => {
    e.preventDefault();

    let name = document.querySelector("#Category").value;
    let total = document.querySelector("#Total").value;
    let spent = 0;
    if (name == "" || total == "") {
      message.textContent = "Please fill all the fields";
      dashboardToast.show();
      return;
    }
    try {
      let addCategoryResponse = await fetch(
        "http://localhost:5000/budgets/add",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryName: name, total, spent }),
        }
      );
      let addCategoryResult = await addCategoryResponse.json();
      dashboardData = await getBudgetsData();
      // console.log(addCategoryResult);
    } catch (error) {
      console.log(error);
    }
    renderCards();
    document.querySelector("#Category").value = "";
    document.querySelector("#Total").value = "";
    addCategoryModal.hide();
  });
})();
