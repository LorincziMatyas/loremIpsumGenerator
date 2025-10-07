/** @format */

// --- Core Lorem Ipsum Data ---
const LOREM_IPSUM_WORDS = [
	"lorem",
	"ipsum",
	"dolor",
	"sit",
	"amet",
	"consectetur",
	"adipiscing",
	"elit",
	"sed",
	"do",
	"eiusmod",
	"tempor",
	"incididunt",
	"ut",
	"labore",
	"et",
	"dolore",
	"magna",
	"aliqua",
	"ut",
	"enim",
	"ad",
	"minim",
	"veniam",
	"quis",
	"nostrud",
	"exercitation",
	"ullamco",
	"laboris",
	"nisi",
	"ut",
	"aliquip",
	"ex",
	"ea",
	"commodo",
	"consequat",
	"duis",
	"aute",
	"irure",
	"dolor",
	"in",
	"reprehenderit",
	"in",
	"voluptate",
	"velit",
	"esse",
	"cillum",
	"dolore",
	"eu",
	"fugiat",
	"nulla",
	"pariatur",
	"excepteur",
	"sint",
	"occaecat",
	"cupidatat",
	"non",
	"proident",
	"sunt",
	"in",
	"culpa",
	"qui",
	"officia",
	"deserunt",
	"mollit",
	"anim",
	"id",
	"est",
	"laborum",
];

// Average words per sentence and sentences per paragraph for realistic generation
const AVG_WORDS_PER_SENTENCE = 12;
const AVG_SENTENCES_PER_PARAGRAPH = 5;

// --- DOM Element Selection ---
const countInput = document.getElementById("count");
const unitSelect = document.getElementById("unit");
const generateButton = document.getElementById("generate-btn");
const outputTextDiv = document.getElementById("output-text");
const copyButton = document.getElementById("copy-btn");
const themeSwitcher = document.getElementById("theme-switcher");
const classicFirstCheckbox = document.getElementById("classic-first");
const body = document.body;

// Classic first paragraph text
const CLASSIC_LOREM_IPSUM_PARAGRAPH =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

// --- Helper Functions ---

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a single sentence.
 * @returns {string} A full sentence.
 */
function generateSentence() {
	// Generate a random length based on the average
	const length = AVG_WORDS_PER_SENTENCE + Math.floor(Math.random() * 5 - 2); // 10-14 words

	// Pick words randomly, avoid immediate repeats
	let sentenceWords = [];
	let lastWord = null;
	for (let i = 0; i < length; i++) {
		let word;
		do {
			const randomIndex = Math.floor(Math.random() * LOREM_IPSUM_WORDS.length);
			word = LOREM_IPSUM_WORDS[randomIndex];
		} while (word === lastWord);
		sentenceWords.push(word);
		lastWord = word;
	}

	// Insert an occasional comma at a natural break
	if (sentenceWords.length > 8 && Math.random() < 0.45) {
		const commaPos = 3 + Math.floor(Math.random() * Math.max(1, sentenceWords.length - 6));
		sentenceWords[commaPos] = `${sentenceWords[commaPos]},`;
	}

	// Punctuation and capitalization
	let sentence = sentenceWords.join(" ");
	sentence = capitalize(sentence);
	sentence += Math.random() < 0.8 ? "." : Math.random() < 0.5 ? "?" : "!"; // Mostly periods

	return sentence;
}

/**
 * Generates a paragraph of sentences.
 * @returns {string} A paragraph.
 */
function generateParagraph() {
	const length = AVG_SENTENCES_PER_PARAGRAPH + Math.floor(Math.random() * 3 - 1); // 4-6 sentences
	let paragraphSentences = [];

	for (let i = 0; i < length; i++) {
		paragraphSentences.push(generateSentence());
	}

	return paragraphSentences.join(" ");
}

/**
 * Generates the Lorem Ipsum text based on user inputs.
 */
function generateText() {
	const count = parseInt(countInput.value) || 1;
	const unit = unitSelect.value;
	let result = [];

	// Ensure the count is within reasonable limits
	const safeCount = Math.min(count, 500); // Prevent crashing on huge numbers

	if (unit === "paragraphs") {
		for (let i = 0; i < safeCount; i++) {
			if (i === 0 && classicFirstCheckbox && classicFirstCheckbox.checked) {
				result.push(CLASSIC_LOREM_IPSUM_PARAGRAPH);
			} else {
				result.push(generateParagraph());
			}
		}
		// Output paragraphs as <p> tags for better HTML structure
		outputTextDiv.innerHTML = result.map((p) => `<p>${p}</p>`).join("\n");
	} else if (unit === "sentences") {
		for (let i = 0; i < safeCount; i++) {
			result.push(generateSentence());
		}
		outputTextDiv.innerHTML = result.join(" ");
	} else if (unit === "words") {
		// Generate words up to the safeCount limit
		for (let i = 0; i < safeCount; i++) {
			const randomIndex = Math.floor(Math.random() * LOREM_IPSUM_WORDS.length);
			result.push(LOREM_IPSUM_WORDS[randomIndex]);
		}
		// Capitalize the first word for a clean start
		result[0] = capitalize(result[0]);
		outputTextDiv.innerHTML = result.join(" ");
	}

	// Enable the copy button after generation
	copyButton.disabled = false;
}

/**
 * Copies the generated text to the clipboard.
 */
async function copyText() {
	// Get the raw text content, joining <p> with newlines
	const paragraphs = outputTextDiv.querySelectorAll("p");
	let textToCopy;

	if (paragraphs.length > 0) {
		textToCopy = Array.from(paragraphs)
			.map((p) => p.textContent)
			.join("\n\n");
	} else {
		textToCopy = outputTextDiv.textContent.trim();
	}

	try {
		await navigator.clipboard.writeText(textToCopy);
		copyButton.textContent = "✅ Copied!";
		setTimeout(() => {
			copyButton.textContent = "📋 Copy";
		}, 2000);
	} catch (err) {
		console.error("Failed to copy: ", err);
		copyButton.textContent = "❌ Error";
		setTimeout(() => {
			copyButton.textContent = "📋 Copy";
		}, 2000);
	}
}

/**
 * Toggles between dark and light themes.
 */
function toggleTheme() {
	const isDark = body.classList.contains("dark-theme");

	if (isDark) {
		body.classList.replace("dark-theme", "light-theme");
		themeSwitcher.textContent = "🌙"; // Moon icon for switching to dark
		localStorage.setItem("theme", "light");
	} else {
		body.classList.replace("light-theme", "dark-theme");
		themeSwitcher.textContent = "☀️"; // Sun icon for switching to light
		localStorage.setItem("theme", "dark");
	}
}

// --- Event Listeners ---
generateButton.addEventListener("click", generateText);
copyButton.addEventListener("click", copyText);
themeSwitcher.addEventListener("click", toggleTheme);

// --- Initialization ---
// Check for saved theme preference on load
(function init() {
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "light") {
		body.classList.replace("dark-theme", "light-theme");
		themeSwitcher.textContent = "🌙";
	}
})();
