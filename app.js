document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      populateFormGroups(data.form_groups);
      setupEventListeners();
    })
    .catch((error) => console.error("Error fetching data:", error));

  function populateFormGroups(formGroups) {
    const formGroupSelect = document.getElementById("form-group");
    formGroupSelect.innerHTML = formGroups
      .map((group) => `<option value="${group.id}">${group.name}</option>`)
      .join("");
    populateCourtForms(formGroups[0].forms);
  }

  function populateCourtForms(forms) {
    const courtFormSelect = document.getElementById("court-form");
    courtFormSelect.innerHTML = forms
      .map((form) => `<option value="${form.id}">${form.name}</option>`)
      .join("");
    displayFormData(forms[0]);
  }

  function displayFormData(formData) {
    document.getElementById("form-render").innerHTML = formData.html_content;
    document.getElementById("explanatory-text").innerHTML = formData.explanatory_text;
    document.getElementById("related-rule").innerHTML = `<h3>${formData.related_rule.title}</h3>${formData.related_rule.content}`;
    document.getElementById("secondary-source").innerHTML = `<a href="${formData.secondary_source.url}" id="further-text-link">${formData.secondary_source.title}</a>`;
    document.getElementById("download-word").setAttribute("onclick", `location.href='${formData.downloads.word}'`);
    document.getElementById("download-pdf").setAttribute("onclick", `location.href='${formData.downloads.pdf}'`);
  }

  function setupEventListeners() {
    const formGroupSelect = document.getElementById("form-group");
    const courtFormSelect = document.getElementById("court-form");
    const getFormButton = document.getElementById("get-form");

    formGroupSelect.addEventListener("change", function (event) {
      const selectedGroupId = event.target.value;
      fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
          const selectedGroup = data.form_groups.find((group) => group.id === selectedGroupId);
          populateCourtForms(selectedGroup.forms);
        })
        .catch((error) => console.error("Error fetching data:", error));
    });

    getFormButton.addEventListener("click", function () {
      const selectedFormId = courtFormSelect.value;
      fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
          const selectedGroup = data.form_groups.find((group) => group.forms.some((form) => form.id === selectedFormId));
          const selectedForm = selectedGroup.forms.find((form) => form.id === selectedFormId);
          displayFormData(selectedForm);
        })
        .catch((error) => console.error("Error fetching data:", error));
    });
  }
});
