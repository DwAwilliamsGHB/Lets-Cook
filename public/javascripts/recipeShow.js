function updateIngredientQuantities() {
  const displayMode = document.getElementById('display-mode');
  if (!displayMode) return;

  const originalServings = parseInt(
    document
      .getElementById('servings-input')
      ?.getAttribute('data-original-servings')
  );
  const currentServings = parseInt(
    document.getElementById('servings-input')?.value
  );
  const scalingFactor = currentServings / originalServings;

  const ingredientQuantities = document.querySelectorAll(
    '.ingredient-li .ingredient-quantity'
  );
  ingredientQuantities.forEach((element) => {
    const originalQuantity = element.getAttribute('data-original-quantity');
    const parsedQuantity = parseQuantity(originalQuantity);
    const scaledQuantity = parsedQuantity * scalingFactor;

    let newQuantity;
    switch (displayMode.value) {
      case 'fraction':
        newQuantity = convertToFraction(scaledQuantity);
        break;
      case 'decimal':
        newQuantity = parseFloat(scaledQuantity.toFixed(2)).toString();
        break;
      default:
        // Calculate the scaled value in its original format (either as a decimal or as a fraction/mixed number)
        if (originalQuantity.includes('/') || originalQuantity.includes(' ')) {
          // If the original was a fraction or mixed number, convert the scaled quantity back to its original format
          newQuantity = convertToFraction(scaledQuantity);
        } else {
          // Otherwise, show as a decimal rounded to two places if necessary
          newQuantity = parseFloat(scaledQuantity.toFixed(2)).toString();
        }
    }
    element.innerHTML = newQuantity;
  });
}

function saveDisplayMode() {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  const displayModeSelect = document.getElementById('display-mode');
  if (displayModeSelect && recipeId) {
    localStorage.setItem(`displayMode_${recipeId}`, displayModeSelect.value);
  }
}

function setDisplayMode() {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  const savedDisplayMode = localStorage.getItem(`displayMode_${recipeId}`);
  const displayModeSelect = document.getElementById('display-mode');
  if (savedDisplayMode && displayModeSelect) {
    displayModeSelect.value = savedDisplayMode;
    updateIngredientQuantities(); // Update quantities based on the saved display mode
  }
}

function parseQuantity(input) {
  if (!input || isNaN(input)) {
    if (input.includes(' ')) {
      // Handle mixed numbers
      const [whole, fraction] = input.split(' ');
      const [numerator, denominator] = fraction.split('/');
      return parseInt(whole) + parseInt(numerator) / parseInt(denominator);
    } else if (input.includes('/')) {
      // Handle pure fractions
      const [numerator, denominator] = input.split('/');
      return parseInt(numerator) / parseInt(denominator);
    }
  }
  input = input
    .replace(/\.33(?![\d])/g, '.333')
    .replace(/\.66(?![\d])/g, '.667')
    .replace(/\.67(?![\d])/g, '.667');
  return parseFloat(input); // Handle decimal and whole numbers
}

function convertToFraction(decimal) {
  if (decimal === 0) return '0';
  if (decimal > 0 && decimal < 0.035)
    return "<span class='numerator'>1</span><span class='solidus'>/</span><span class='denominator'>16</span>";

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  let bestDiff = Math.abs(decimal);
  let bestNumerator = 1;
  let bestDenominator = 1;

  for (let denominator = 1; denominator <= 16; denominator++) {
    let numerator = Math.round(decimal * denominator);
    let diff = Math.abs(decimal - numerator / denominator);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestNumerator = numerator;
      bestDenominator = denominator;
    }
  }

  let reducedNumerator = bestNumerator;
  let reducedDenominator = bestDenominator;

  const divisor = gcd(reducedNumerator, reducedDenominator);
  reducedNumerator /= divisor;
  reducedDenominator /= divisor;

  if (reducedNumerator === 0) return '0';

  if (decimal < 0) reducedNumerator = -reducedNumerator;

  if (reducedNumerator % reducedDenominator === 0) {
    return (reducedNumerator / reducedDenominator).toString();
  } else if (Math.abs(reducedNumerator) < reducedDenominator) {
    // Pure fraction
    return `<span class="numerator">${Math.abs(reducedNumerator)}</span><span class="solidus">/</span><span class="denominator">${reducedDenominator}</span>`;
  } else {
    // Mixed number
    const whole = Math.floor(reducedNumerator / reducedDenominator);
    reducedNumerator %= reducedDenominator;
    return `${whole} <span class="numerator">${Math.abs(reducedNumerator)}</span><span class="solidus">/</span><span class="denominator">${reducedDenominator}</span>`;
  }
}

function adjustServings(change) {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  const servingsInput = document.getElementById('servings-input');
  let newServings = parseInt(servingsInput?.value) + change;
  if (newServings < 1) newServings = 1; // Prevent servings from going below 1
  if (servingsInput) {
    servingsInput.value = newServings;
    localStorage.setItem(`currentServings_${recipeId}`, newServings);
    updateIngredientQuantities(); // Update quantities with the new servings
  }
}

function initializeServingsInput() {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  const servingsInput = document.getElementById('servings-input');
  const savedServings = localStorage.getItem(`currentServings_${recipeId}`); // Retrieve saved servings from local storage

  if (savedServings && servingsInput) {
    servingsInput.value = savedServings; // Set the value of the input to the saved servings
    updateIngredientQuantities(); // Update the ingredient quantities based on the saved servings
  }

  servingsInput?.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the form from being submitted if it's part of a form
      adjustServings(0); // Adjust servings without change, essentially updating the display
    }
  });
}

function resetServingsToOriginal() {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  const servingsInput = document.getElementById('servings-input');
  const originalServings = servingsInput?.getAttribute(
    'data-original-servings'
  );
  if (servingsInput && originalServings) {
    servingsInput.value = originalServings; // Reset to original servings
    updateIngredientQuantities(); // Recalculate the ingredient quantities based on the new serving size
    localStorage.setItem(`currentServings_${recipeId}`, originalServings); // Update local storage to the original servings
  }
}

const formElements = document.querySelectorAll('form');
formElements.forEach((form) => {
  form.addEventListener('submit', (event) => {
    const submitButton = form.querySelector("[type='submit']");

    // Dynamically get the validation function based on the form's context
    const validationFunction = getValidationFunction(form);

    if (validationFunction && !validationFunction()) {
      event.preventDefault(); // Prevent the form from being submitted again
    } else {
      submitButton.setAttribute('data-processing', 'true'); // Disable the submit button
      submitButton.disabled = true; // Disable the button visually
    }
  });
});

// Function to get the appropriate validation function based on the form's context
function getValidationFunction(form) {
  // Identify the form context based on its elements, IDs, or other attributes
  if (form.id === 'add-ingredient-form') {
    return validateIngredientForm;
  } else if (form.id.startsWith('add-group-ingredient-form-')) {
    // Extract the ingredientGroupId from the form's ID
    const ingredientGroupId = form.id.split('-').pop();
    return () => validateGroupIngredientForm(ingredientGroupId);
  } else if (form.id.startsWith('add-group-step-form-')) {
    // Extract the stepGroupId from the form's ID
    const stepGroupId = form.id.split('-').pop();
    return () => validateGroupStepForm(stepGroupId);
  } else if (form.id === 'add-ingredient-group-form') {
    return validateIngredientGroupForm;
  } else if (form.id === 'add-step-group-form') {
    return validateStepGroupForm;
  } else if (form.id === 'add-step-form') {
    return validateStepForm;
  } else if (form.id === 'add-storage-form') {
    return validateStorageForm;
  } else if (form.id === 'add-equipment-form') {
    return validateEquipmentForm;
  } else if (form.id === 'add-note-form') {
    return validateNoteForm;
  } else if (form.id === 'add-freezer-form') {
    return validateFreezerForm;
  }

  // Return a default function if the form context is not recognized
  return () => true;
}

function validateIngredientForm() {
  const quantityField = document.getElementById('quantity-form-ingredient');
  const contentField = document.getElementById('content-form-ingredient');
  const quantityError = document.getElementById('quantity-error-ingredient');
  const contentError = document.getElementById('content-error-ingredient');

  quantityError.textContent = '';
  contentError.textContent = '';

  const quantityValue = quantityField.value.trim();
  const contentValue = contentField.value.trim();

  let isValid = true;

  if (
    quantityValue === '' ||
    !/^(\d+\s\d+\/\d+|\d+\/\d+|\d*\.\d+|\.\d+|\d+)$/.test(quantityValue)
  ) {
    quantityError.textContent =
      'Please enter a valid quantity (whole number, fraction, mixed number, or decimal).';
    isValid = false;
  }

  if (contentValue === '') {
    contentError.textContent = 'Please enter an ingredient name.';
    isValid = false;
  }

  return isValid;
}

function validateGroupIngredientForm(ingredientGroupId) {
  const quantityField = document.getElementById(
    `quantity-form-group-ingredient-${ingredientGroupId}`
  );
  const contentField = document.getElementById(
    `content-form-group-ingredient-${ingredientGroupId}`
  );
  const quantityError = document.getElementById(
    `quantity-error-group-ingredient-${ingredientGroupId}`
  );
  const contentError = document.getElementById(
    `content-error-group-ingredient-${ingredientGroupId}`
  );

  // Reset error messages
  quantityError.textContent = '';
  contentError.textContent = '';

  let isValid = true;

  // Extend the quantity validation to include whole numbers, fractions, and mixed numbers
  const quantityValue = quantityField.value.trim();
  if (
    quantityValue === '' ||
    !/^(\d+\s\d+\/\d+|\d+\/\d+|\d*\.\d+|\.\d+|\d+)$/.test(quantityValue)
  ) {
    quantityError.textContent =
      'Please enter a valid quantity (whole number, fraction, mixed number, or decimal).';
    isValid = false;
  }

  // Validate content (must not be empty)
  const contentValue = contentField.value.trim();
  if (contentValue === '') {
    contentError.textContent = 'Please enter an ingredient name.';
    isValid = false;
  }

  return isValid;
}

function validateIngredientGroupForm() {
  const ingredientGroupNameField = document.getElementById(
    'name-form-ingredient-group'
  );
  const ingredientGroupNameError = document.getElementById(
    'name-error-ingredient-group'
  );

  // Reset error message
  ingredientGroupNameError.textContent = '';

  let isValid = true;

  // Validate ingredientGroup name (must not be empty)
  const ingredientGroupNameValue = ingredientGroupNameField.value.trim();
  if (ingredientGroupNameValue === '') {
    ingredientGroupNameError.textContent = 'Please enter a group name.';
    isValid = false;
  }

  return isValid;
}

function validateGroupStepForm(stepGroupId) {
  const contentField = document.getElementById(
    `content-form-group-step-${stepGroupId}`
  );
  const contentError = document.getElementById(
    `content-error-group-step-${stepGroupId}`
  );

  // Reset error messages
  contentError.textContent = '';

  let isValid = true;

  // Validate content (must not be empty)
  const contentValue = contentField.value.trim();
  if (contentValue === '') {
    contentError.textContent = 'Please enter step content.';
    isValid = false;
  }

  return isValid;
}

function validateStepGroupForm() {
  const stepGroupNameField = document.getElementById('name-form-step-group');
  const stepGroupNameError = document.getElementById('name-error-step-group');

  // Reset error message
  stepGroupNameError.textContent = '';

  let isValid = true;

  // Validate stepGroup name (must not be empty)
  const stepGroupNameValue = stepGroupNameField.value.trim();
  if (stepGroupNameValue === '') {
    stepGroupNameError.textContent = 'Please enter a group name.';
    isValid = false;
  }

  return isValid;
}

function validateStepForm() {
  const stepContentField = document.getElementById('content-form-step');
  const stepContentError = document.getElementById('content-error-step');

  // Reset error message
  stepContentError.textContent = '';

  let isValid = true;

  // Validate step content (must not be empty)
  const stepContentValue = stepContentField.value.trim();
  if (stepContentValue === '') {
    stepContentError.textContent = 'Please enter step content.';
    isValid = false;
  }

  return isValid;
}

function validateStorageForm() {
  const storageContentField = document.getElementById('content-form-storage');
  const storageContentError = document.getElementById('content-error-storage');

  // Reset error message
  storageContentError.textContent = '';

  let isValid = true;

  // Validate storage info content (must not be empty)
  const storageContentValue = storageContentField.value.trim();
  if (storageContentValue === '') {
    storageContentError.textContent = 'Please enter storage info content.';
    isValid = false;
  }

  return isValid;
}

function validateEquipmentForm() {
  const equipmentContentField = document.getElementById(
    'content-form-equipment'
  );
  const equipmentContentError = document.getElementById(
    'content-error-equipment'
  );

  // Reset error message
  equipmentContentError.textContent = '';

  let isValid = true;

  // Validate equipment content (must not be empty)
  const equipmentContentValue = equipmentContentField.value.trim();
  if (equipmentContentValue === '') {
    equipmentContentError.textContent = 'Please enter an equipment item name.';
    isValid = false;
  }

  return isValid;
}

function validateNoteForm() {
  const noteContentField = document.getElementById('content-form-note');
  const noteContentError = document.getElementById('content-error-note');

  // Reset error message
  noteContentError.textContent = '';

  let isValid = true;

  // Validate note content (must not be empty)
  const noteContentValue = noteContentField.value.trim();
  if (noteContentValue === '') {
    noteContentError.textContent = 'Please enter note content.';
    isValid = false;
  }

  return isValid;
}

function validateFreezerForm() {
  const freezerContentField = document.getElementById('content-form-freezer');
  const freezerContentError = document.getElementById('content-error-freezer');

  // Reset error message
  freezerContentError.textContent = '';

  let isValid = true;

  // Validate freezing info content (must not be empty)
  const freezerContentValue = freezerContentField.value.trim();
  if (freezerContentValue === '') {
    freezerContentError.textContent = 'Please enter freezing info content.';
    isValid = false;
  }

  return isValid;
}

function replaceEditButtons() {
  var originalButton = document.getElementById('editOriginalButton');
  var newButtons = document.getElementById('editNewButtons');

  originalButton.classList.add('hidden');
  newButtons.classList.remove('hidden');
}

function restoreEditButton() {
  var originalButton = document.getElementById('editOriginalButton');
  var newButtons = document.getElementById('editNewButtons');

  originalButton.classList.remove('hidden');
  newButtons.classList.add('hidden');
}

function replaceDeleteButtons() {
  var originalButton = document.getElementById('deleteOriginalButton');
  var newButtons = document.getElementById('deleteNewButtons');

  originalButton.classList.add('hidden');
  newButtons.classList.remove('hidden');
}

function restoreDeleteButton() {
  var originalButton = document.getElementById('deleteOriginalButton');
  var newButtons = document.getElementById('deleteNewButtons');

  originalButton.classList.remove('hidden');
  newButtons.classList.add('hidden');
}

function replaceAndToggleEditButtons() {
  replaceEditButtons();
  toggleEditState();
}

function restoreAndToggleEditButton() {
  restoreEditButton();
  toggleEditState();
}

function setEditState(editState) {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  localStorage.setItem(`editState_${recipeId}`, editState);
}

function getEditState() {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  return localStorage.getItem(`editState_${recipeId}`) === 'true';
}

function toggleEditState() {
  const currentEditState = getEditState();
  setEditState(!currentEditState);

  const editButtons = document.querySelectorAll(
    '.list-edit-button, .x-form, .input-div'
  );
  if (currentEditState) {
    editButtons.forEach((button) => (button.style.display = 'none'));
  } else {
    editButtons.forEach((button) => (button.style.display = 'block'));
  }
}

function initializeEditState() {
  const recipeId = document
    .getElementById('recipe-div')
    .getAttribute('data-recipe-id'); // Get the recipe ID
  const editState = localStorage.getItem(`editState_${recipeId}`) === 'true';

  const editButtons = document.querySelectorAll(
    '.list-edit-button, .x-form, .input-div'
  );
  if (editState) {
    editButtons.forEach((button) => (button.style.display = 'block'));
  } else {
    editButtons.forEach((button) => (button.style.display = 'none'));
  }

  // Set the correct visibility of the edit and delete button groups
  const editOriginalButton = document.getElementById('editOriginalButton');
  const editNewButtons = document.getElementById('editNewButtons');

  if (editState) {
    editOriginalButton.classList.add('hidden');
    editNewButtons.classList.remove('hidden');
  } else {
    editOriginalButton.classList.remove('hidden');
    editNewButtons.classList.add('hidden');
  }
}

// Function to save the scroll position for the current recipe page
function saveScrollPosition(recipeId) {
  const scrollPosition = window.scrollY;
  sessionStorage.setItem(`recipeScrollPosition_${recipeId}`, scrollPosition);
}

// Function to retrieve and set the saved scroll position
function setScrollPosition(recipeId) {
  const scrollPosition = sessionStorage.getItem(
    `recipeScrollPosition_${recipeId}`
  );
  if (scrollPosition) {
    window.scrollTo(0, scrollPosition);
  }
}

// Get the current recipe's ID from your template (replace 'recipeId' with the actual variable)
const currentRecipeId = '<%= recipe._id %>';

// Save the scroll position when the page unloads
window.addEventListener('beforeunload', () =>
  saveScrollPosition(currentRecipeId)
);

// Set the scroll position when the page loads
window.addEventListener('load', () => setScrollPosition(currentRecipeId));

window.addEventListener('load', function () {
  setDisplayMode();
  initializeEditState();
  initializeServingsInput();
});

document.addEventListener('DOMContentLoaded', function () {
  updateIngredientQuantities(); // Initial call to set quantities
});

const displayModeElement = document.getElementById('display-mode');
if (displayModeElement) {
  displayModeElement.addEventListener('change', function () {
    updateIngredientQuantities();
    saveDisplayMode(); // Save the display mode whenever it changes
  });
}