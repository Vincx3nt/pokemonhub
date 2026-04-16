document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const message = document.getElementById("message");
  const newsCards = document.querySelectorAll(".news-card");
  const readButtons = document.querySelectorAll(".read-btn");
  const subscribeBtn = document.getElementById("subscribeBtn");
  const emailInput = document.getElementById("emailInput");
  const subscribeMessage = document.getElementById("subscribeMessage");
  const eventRows = document.querySelectorAll(".event-row");
  const backToTopBtn = document.getElementById("backToTopBtn");

  const savedEmail = localStorage.getItem("subscriberEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    subscribeMessage.textContent = "Saved subscriber email loaded.";
  }

  searchInput.addEventListener("keyup", function () {
    const input = searchInput.value.toLowerCase().trim();
    let foundCount = 0;

    newsCards.forEach(function (card) {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const text = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(input) || text.includes(input)) {
        card.style.display = "block";
        foundCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (foundCount === 0) {
      message.textContent = "No news found.";
    } else if (input === "") {
      message.textContent = "";
    } else {
      message.textContent = foundCount + " news item(s) found.";
    }
  });

  readButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const url = this.dataset.url;
      if (url) {
        window.open(url, "_blank");
      }
    });
  });

  subscribeBtn.addEventListener("click", function () {
    const email = emailInput.value.trim();

    if (email === "" || !email.includes("@") || !email.includes(".")) {
      subscribeMessage.textContent = "Please enter a valid email address.";
      return;
    }

    localStorage.setItem("subscriberEmail", email);
    subscribeMessage.textContent = "Thank you for subscribing, " + email + "!";
    emailInput.value = "";
  });

  eventRows.forEach(function (row) {
    row.addEventListener("click", function () {
      const eventName = this.cells[0].textContent;
      const url = this.dataset.url;

      alert("Opening details for: " + eventName);
      if (url) {
        window.open(url, "_blank");
      }
    });
  });

  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 200) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});