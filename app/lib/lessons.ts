export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  code: string; // Code with blanks marked as {blank}
  blanks: { id: number; answer: string; hint: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: number; // 1-Easy, 2-Medium, 3-Hard, 4-Expert
  content: string;
  codeExample: string;
  practice?: Practice;
  quiz: Quiz[];
  estimatedTime: number; // in minutes
}

export const LESSONS_BY_LANGUAGE: Record<string, Lesson[]> = {
  html: [
    {
      id: "0",
      title: "What is HTML?",
      description: "Learn the basics of HTML and web pages",
      language: "html",
      level: 1,
      content: `HTML (HyperText Markup Language) is the standard markup language used to create web pages. 
It provides the structure and content of websites. HTML works with CSS for styling and JavaScript for interactivity.`,
      codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
  </body>
</html>`,
      practice: {
        id: "practice-0",
        title: "Complete the HTML Structure",
        description: "Fill in the blanks to create a valid HTML document",
        code: `{blank}
<html>
  {blank}
    <title>My Page</title>
  </head>
  <body>
    {blank}Hello, World!{blank}
    <p>This is my page.</p>
  </body>
</html>`,
        blanks: [
          { id: 1, answer: "<!DOCTYPE html>", hint: "This declares the document type" },
          { id: 2, answer: "<head>", hint: "This section contains metadata" },
          { id: 3, answer: "<h1>", hint: "This is a heading tag" },
          { id: 4, answer: "</h1>", hint: "This closes the heading tag" }
        ]
      },
      quiz: [
        {
          id: "1",
          question: "What does HTML stand for?",
          options: ["Hyperlinks and Text Markup Language", "HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Tools Markup Language"],
          correct: 1,
          explanation: "HTML stands for HyperText Markup Language - the standard language for creating web pages."
        },
        {
          id: "2",
          question: "What tag is used for the main heading?",
          options: ["<heading>", "<h1>", "<header>", "<title>"],
          correct: 1,
          explanation: "The <h1> tag is used for the main heading on a page. h1-h6 represent headings from largest to smallest."
        }
      ],
      estimatedTime: 5
    },
    {
      id: "1",
      title: "HTML Tags and Elements",
      description: "Understanding HTML tags and how they work",
      language: "html",
      level: 1,
      content: `HTML tags are keywords surrounded by angle brackets. Most tags come in pairs - an opening tag and a closing tag.
The content between the tags is what the tag affects. Some tags are self-closing like <img> and <br>.`,
      codeExample: `<p>This is a paragraph tag</p>
<img src="image.jpg" alt="A description">
<br> <!-- This is a line break -->
<a href="https://google.com">Link to Google</a>`,
      quiz: [
        {
          id: "1",
          question: "Which of these is a self-closing tag?",
          options: ["<p></p>", "<img>", "<div></div>", "<a></a>"],
          correct: 1,
          explanation: "The <img> tag is self-closing (void element) and doesn't need a closing tag. It loads images on web pages."
        }
      ],
      estimatedTime: 8
    },
    {
      id: "2",
      title: "HTML Document Structure",
      description: "Learn the proper structure of an HTML document",
      language: "html",
      level: 1,
      content: `Every HTML document should follow a proper structure with DOCTYPE, html, head, and body tags.
The head contains metadata, and the body contains visible content.`,
      codeExample: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Page Title</title>
  </head>
  <body>
    <h1>Main Content</h1>
  </body>
</html>`,
      quiz: [
        {
          id: "1",
          question: "Where do you put the page title?",
          options: ["In the body", "In the <title> tag in head", "In an h1 tag", "In meta tags"],
          correct: 1,
          explanation: "The page title goes in the <title> tag inside the <head> section. This appears in the browser tab."
        }
      ],
      estimatedTime: 7
    },
    {
      id: "3",
      title: "Forms and Input Fields",
      description: "Create interactive forms with HTML",
      language: "html",
      level: 2,
      content: `HTML forms allow users to input data. The <form> tag contains various input types like text, email, password, and more.
The <label> tag helps users understand what each input is for.`,
      codeExample: `<form>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
  
  <button type="submit">Submit</button>
</form>`,
      quiz: [
        {
          id: "1",
          question: "What type of input is used for email?",
          options: ["<input type='mail'>", "<input type='email'>", "<input type='text'>", "<input type='e-mail'>"],
          correct: 1,
          explanation: "Use <input type='email'> for email inputs. This validates the email format automatically."
        }
      ],
      estimatedTime: 10
    }
  ],
  css: [
    {
      id: "0",
      title: "Introduction to CSS",
      description: "Learn how to style HTML with CSS",
      language: "css",
      level: 1,
      content: `CSS (Cascading Style Sheets) is used to style HTML elements. 
You can change colors, fonts, sizes, spacing, and layout of elements on a web page.`,
      codeExample: `/* Inline CSS */
<p style="color: blue;">This text is blue</p>

/* Internal CSS in head */
<style>
  p { color: red; }
</style>

/* External CSS - best practice */
<link rel="stylesheet" href="styles.css">`,
      practice: {
        id: "practice-css-0",
        title: "Style Your Elements",
        description: "Fill in the CSS code to style the elements",
        code: `<style>
  {blank} {
    color: {blank};
    font-size: {blank};
  }
</style>`,
        blanks: [
          { id: 1, answer: "p", hint: "This is a selector for paragraph tags" },
          { id: 2, answer: "blue", hint: "This is a color value" },
          { id: 3, answer: "16px", hint: "This is a font size value" }
        ]
      },
      quiz: [
        {
          id: "1",
          question: "What does CSS stand for?",
          options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Syntax", "Cascading Sheets Style"],
          correct: 1,
          explanation: "CSS stands for Cascading Style Sheets. It's used to style and layout web pages."
        }
      ],
      estimatedTime: 6
    },
    {
      id: "1",
      title: "Selectors and Properties",
      description: "Master CSS selectors and styling properties",
      language: "css",
      level: 1,
      content: `CSS selectors target HTML elements. Common selectors include:
- Element selectors (p, div, h1)
- Class selectors (.classname)
- ID selectors (#idname)
- Properties define how elements look.`,
      codeExample: `/* Element selector */
p { color: black; }

/* Class selector */
.highlight { background-color: yellow; }

/* ID selector */
#header { font-size: 24px; }

/* Property examples */
div { color: red; font-size: 16px; margin: 10px; }`,
      quiz: [
        {
          id: "1",
          question: "How do you select an element with class 'button'?",
          options: ["#button", ".button", "[button]", "button"],
          correct: 1,
          explanation: "Use .button to select elements with the class 'button'. The dot (.) indicates a class selector."
        }
      ],
      estimatedTime: 8
    },
    {
      id: "2",
      title: "Box Model and Layout",
      description: "Understand spacing, borders, and layout",
      language: "css",
      level: 2,
      content: `The CSS box model consists of: margin, border, padding, and content.
- Margin: Space outside the element
- Border: Edge of the element
- Padding: Space inside the element
- Content: The actual content`,
      codeExample: `.box {
  margin: 20px;      /* Space outside */
  border: 2px solid; /* Edge */
  padding: 10px;     /* Space inside */
  width: 200px;
  height: 100px;
}`,
      quiz: [
        {
          id: "1",
          question: "Which creates space inside an element?",
          options: ["margin", "border", "padding", "content"],
          correct: 2,
          explanation: "Padding creates space inside an element between the content and border."
        }
      ],
      estimatedTime: 10
    }
  ],
  javascript: [
    {
      id: "0",
      title: "JavaScript Basics",
      description: "Start your journey with JavaScript programming",
      language: "javascript",
      level: 1,
      content: `JavaScript is a programming language that makes web pages interactive.
It can respond to user actions, validate forms, create animations, and much more.
JavaScript runs in the browser on the client side.`,
      codeExample: `// Simple JavaScript
console.log("Hello, World!");

let name = "Alice";
let age = 25;

console.log(name + " is " + age + " years old");

// Basic function
function greet(person) {
  console.log("Hello, " + person);
}

greet("Bob");`,
      quiz: [
        {
          id: "1",
          question: "What does console.log() do?",
          options: ["Saves data", "Prints output to console", "Creates a function", "Ends the program"],
          correct: 1,
          explanation: "console.log() prints output to the browser console. It's useful for debugging."
        }
      ],
      estimatedTime: 8
    },
    {
      id: "1",
      title: "Variables and Data Types",
      description: "Learn about variables, let, const, and data types",
      language: "javascript",
      level: 1,
      content: `Variables store data. Use 'let' for variables that can change and 'const' for constants.
JavaScript has types: string, number, boolean, object, array, null, and undefined.`,
      codeExample: `// Variables
let count = 5;
const name = "Alice";
var old = "Don't use this";

// Data types
let str = "Hello";           // String
let num = 42;               // Number
let bool = true;            // Boolean
let arr = [1, 2, 3];        // Array
let obj = { name: "Bob" };  // Object

// Type checking
console.log(typeof str);     // "string"
console.log(typeof num);     // "number"`,
      quiz: [
        {
          id: "1",
          question: "What's the difference between let and const?",
          options: ["const can be changed", "let cannot be changed", "const cannot be changed", "No difference"],
          correct: 2,
          explanation: "const creates a constant that cannot be changed after assignment. let can be changed."
        }
      ],
      estimatedTime: 10
    },
    {
      id: "2",
      title: "Functions and Events",
      description: "Create functions and handle user interactions",
      language: "javascript",
      level: 2,
      content: `Functions are reusable blocks of code. Events like clicks and input changes let you respond to user actions.
Arrow functions are a modern way to write functions.`,
      codeExample: `// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;

// Function with event
document.getElementById("btn").addEventListener("click", () => {
  console.log("Button clicked!");
});

// Using functions
let result = add(5, 3);
console.log(result);  // 8`,
      quiz: [
        {
          id: "1",
          question: "What does addEventListener do?",
          options: ["Creates elements", "Listens for events", "Removes elements", "Adds CSS"],
          correct: 1,
          explanation: "addEventListener attaches an event listener to an element to respond to events like clicks."
        }
      ],
      estimatedTime: 12
    }
  ]
};

export function getLessonsByLanguage(language: string): Lesson[] {
  return LESSONS_BY_LANGUAGE[language.toLowerCase()] || [];
}

export function getLesson(language: string, lessonId: string): Lesson | undefined {
  const lessons = getLessonsByLanguage(language);
  return lessons.find(l => l.id === lessonId);
}

export const AVAILABLE_LANGUAGES = ["html", "css", "javascript"];
