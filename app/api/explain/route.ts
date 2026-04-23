import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Level = "toddler" | "student" | "expert";

const levelInstructions: Record<Level, string> = {
  toddler: "Explain like the person is 5 years old. Use very simple words, fun comparisons, and short sentences. Avoid all jargon.",
  student: "Explain like the person is a curious high school student. Use clear language, introduce proper terms, and give a real-world example.",
  expert: "Explain like the person has a university-level background. Use precise technical language, formal definitions, and reference underlying theory.",
};

const simulationMap: Record<string, string> = {
  gravity: "gravity",
  "black hole": "blackhole",
  orbit: "gravity",
  dna: "dna",
  gene: "dna",
  helix: "dna",
  photosynthesis: "wave",
  light: "wave",
  sound: "wave",
  wave: "wave",
  "machine learning": "neural",
  "neural network": "neural",
  "deep learning": "neural",
  ai: "neural",
  "quantum entanglement": "quantum",
  quantum: "quantum",
  atom: "atom",
  electron: "atom",
  molecule: "atom",
};

function detectSimulation(concept: string): string {
  const lower = concept.toLowerCase();
  for (const [key, sim] of Object.entries(simulationMap)) {
    if (lower.includes(key)) return sim;
  }
  return "atom"; // default
}

async function askGemini(concept: string, level: Level) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are EduStream, an ELI5 educational AI. The user wants to understand: "${concept}".
${levelInstructions[level]}

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{
  "explanation": "2-3 sentence explanation at the right level",
  "analogy": "one vivid real-life analogy that makes the concept click",
  "key_terms": ["term1", "term2", "term3", "term4", "term5"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip markdown code fences if present
    const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

// Fallback local knowledge for when no API key is set
type ConceptData = {
  explanation: Record<Level, string>;
  analogy: Record<Level, string>;
  key_terms: Record<Level, string[]>;
};

const knowledge: Record<string, ConceptData> = {
  gravity: {
    explanation: {
      toddler: "Gravity is an invisible hug from the Earth that holds you down so you don't float away like a balloon!",
      student: "Gravity is a force of attraction between masses. Earth's gravity accelerates objects at 9.8 m/s², keeping us grounded and planets in orbit.",
      expert: "Gravity is described by Einstein's General Relativity as spacetime curvature caused by mass-energy. Newton's F=Gm₁m₂/r² is a weak-field approximation; GR corrections dominate near massive bodies.",
    },
    analogy: {
      toddler: "Earth is like a giant magnet and you're a little metal toy — it always pulls you close!",
      student: "A bowling ball on a rubber sheet creates a dip — nearby marbles roll toward it. That's how mass curves space and pulls things in.",
      expert: "Spacetime is a 4D elastic manifold. Mass-energy deforms the metric tensor gμν, and free-falling objects follow geodesics — extremal paths through curved spacetime.",
    },
    key_terms: {
      toddler: ["Pull", "Fall", "Earth", "Weight"],
      student: ["Force", "Mass", "Acceleration", "9.8 m/s²", "Newton's Law"],
      expert: ["General Relativity", "Spacetime Curvature", "Geodesic", "Metric Tensor", "Gravitational Potential"],
    },
  },
  "black hole": {
    explanation: {
      toddler: "A black hole is a super powerful space vacuum that sucks in everything — even light can't escape!",
      student: "A black hole forms when a massive star collapses. Its gravity is so strong nothing escapes past the event horizon. The center is a singularity of infinite density.",
      expert: "A black hole is a spacetime region where escape velocity exceeds c. The Schwarzschild metric gives event horizon r=2GM/c². Kerr solutions describe rotating holes; Hawking radiation predicts quantum evaporation.",
    },
    analogy: {
      toddler: "Like a bathtub drain — everything swirls in and nothing comes back out!",
      student: "A whirlpool in the ocean — ships too close get pulled in and can't escape. The edge is the event horizon.",
      expert: "The event horizon is a causal one-way membrane. The information paradox arises from tension between GR's determinism and quantum unitarity — central to the firewall debate.",
    },
    key_terms: {
      toddler: ["Suck", "Space", "Dark", "Escape"],
      student: ["Event Horizon", "Singularity", "Escape Velocity", "Stellar Collapse"],
      expert: ["Schwarzschild Radius", "Kerr Metric", "Hawking Radiation", "Information Paradox"],
    },
  },
  dna: {
    explanation: {
      toddler: "DNA is a tiny instruction book inside every cell that tells your body how to make YOU — your eyes, hair, everything!",
      student: "DNA is a double-helix molecule storing genetic info using four bases (A, T, G, C). Genes are DNA segments that code for proteins.",
      expert: "DNA is a double-stranded antiparallel nucleotide polymer. A-T/G-C base complementarity enables semiconservative replication. Gene expression: transcription → mRNA → translation → protein. Epigenetic marks modulate expression.",
    },
    analogy: {
      toddler: "DNA is like a LEGO instruction booklet — it tells your body exactly which pieces to use to build YOU!",
      student: "DNA is a twisted ladder — the rungs are chemical letter pairs (A-T, G-C) that spell out instructions for building proteins.",
      expert: "DNA is source code in a version-controlled repo. Transcription compiles to mRNA (intermediate); translation executes at ribosomes. Epigenetic marks are feature flags toggling expression without altering sequence.",
    },
    key_terms: {
      toddler: ["Instructions", "Cells", "Body", "Genes"],
      student: ["Double Helix", "Base Pairs", "Nucleotides", "Genes", "Proteins"],
      expert: ["Semiconservative Replication", "Transcription", "Translation", "Epigenetics", "Chromatin"],
    },
  },
  "quantum entanglement": {
    explanation: {
      toddler: "Two tiny particles become magic best friends — tickle one and the other instantly knows, no matter how far away!",
      student: "Entangled particles share a quantum state — measuring one instantly determines the other's state regardless of distance. Einstein called it 'spooky action at a distance.'",
      expert: "Entanglement is a non-separable quantum correlation: joint state |ψ⟩ ≠ |ψ₁⟩⊗|ψ₂⟩. Bell inequality violations rule out local hidden variables. It enables quantum teleportation, superdense coding, and QKD.",
    },
    analogy: {
      toddler: "Two magic gloves — one left, one right — in separate boxes. Open yours and instantly know what's in the other box on the moon!",
      student: "Magic dice that always show opposite numbers — roll one in New York, one in Tokyo, and they're always correlated.",
      expert: "Entanglement exceeds classical correlations (CHSH S≤2 classically, S≤2√2 quantum). Unlike shared keys, correlations aren't predetermined — they're genuinely non-local, confirmed by loophole-free Bell tests.",
    },
    key_terms: {
      toddler: ["Magic", "Friends", "Particles", "Instant"],
      student: ["Entanglement", "Superposition", "Measurement", "Non-locality"],
      expert: ["Bell Inequality", "CHSH Test", "Non-separable State", "Quantum Teleportation", "EPR Paradox"],
    },
  },
  photosynthesis: {
    explanation: {
      toddler: "Plants eat sunlight! They take sunshine, water, and air and cook it into food for themselves.",
      student: "Photosynthesis converts light energy to glucose: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Chlorophyll in leaves captures the light.",
      expert: "Photosynthesis: light reactions in thylakoid membranes (PS I & II, ETC, ATP synthase → ATP/NADPH) + Calvin cycle in stroma (RuBisCO-mediated carbon fixation → G3P). Z-scheme describes electron flow from H₂O oxidation to NADP⁺ reduction.",
    },
    analogy: {
      toddler: "A plant is a tiny solar-powered kitchen — sun is the stove, water and air are ingredients, sugar is the meal!",
      student: "A plant is a solar panel + factory: chlorophyll captures energy, the Calvin cycle assembles CO₂ into sugar.",
      expert: "Light reactions ≈ photovoltaic cell charging a battery (ATP/NADPH). Calvin cycle ≈ autocatalytic assembly line — RuBisCO is the intake valve, RuBP regeneration closes the loop.",
    },
    key_terms: {
      toddler: ["Sunlight", "Water", "Food", "Leaves"],
      student: ["Chlorophyll", "Glucose", "CO₂", "Oxygen", "Calvin Cycle"],
      expert: ["Thylakoid", "Photosystem I/II", "Z-scheme", "RuBisCO", "ATP Synthase", "NADPH"],
    },
  },
  "machine learning": {
    explanation: {
      toddler: "Machine learning is teaching a computer by showing it lots of examples — like how you learned what a dog looks like by seeing many dogs!",
      student: "ML lets computers learn patterns from data without explicit programming. Feed it training data, it finds patterns, then predicts on new data. Types: supervised, unsupervised, reinforcement.",
      expert: "ML optimizes parameterized models by minimizing a loss function via gradient-based methods (SGD, Adam). Core challenges: bias-variance tradeoff, overfitting (regularization, dropout), and train/test distribution shift.",
    },
    analogy: {
      toddler: "Teaching ML is like training a puppy — show it the trick many times, reward it when right, and it learns!",
      student: "ML is like sports training — practice (train), get feedback on mistakes (loss), adjust technique (update weights), repeat until game-ready.",
      expert: "Training ≈ navigating a high-dimensional loss landscape. SGD finds local minima; landscape geometry (saddle points, flat regions) governs convergence. Overparameterized models generalize via implicit SGD regularization.",
    },
    key_terms: {
      toddler: ["Learn", "Examples", "Computer", "Smart"],
      student: ["Training Data", "Model", "Prediction", "Neural Network", "Overfitting"],
      expert: ["Loss Function", "Gradient Descent", "Backpropagation", "Regularization", "Bias-Variance Tradeoff"],
    },
  },
};

function localFallback(concept: string, level: Level) {
  const lower = concept.toLowerCase().trim();
  let data: ConceptData | null = null;
  if (knowledge[lower]) {
    data = knowledge[lower];
  } else {
    for (const key of Object.keys(knowledge)) {
      if (lower.includes(key) || key.includes(lower)) { data = knowledge[key]; break; }
    }
  }
  if (data) {
    return { explanation: data.explanation[level], analogy: data.analogy[level], key_terms: data.key_terms[level] };
  }
  return {
    explanation: `${concept} is a fascinating concept! It's a big idea that connects to how the world works in surprising ways.`,
    analogy: `Understanding ${concept} is like assembling a puzzle — each piece of knowledge clicks into place to reveal the full picture.`,
    key_terms: level === "toddler" ? ["Idea", "Learn", "Explore"] : level === "student" ? ["Concept", "Principles", "Theory", "Application"] : ["Framework", "First Principles", "Formal Model", "Empirical Validation"],
  };
}

export async function POST(req: NextRequest) {
  const { concept, level }: { concept: string; level: Level } = await req.json();
  const activeLevel: Level = (["toddler", "student", "expert"].includes(level) ? level : "student") as Level;

  const aiResult = await askGemini(concept, activeLevel);
  const fallback = localFallback(concept, activeLevel);

  const explanation = aiResult?.explanation ?? fallback.explanation;
  const analogy = aiResult?.analogy ?? fallback.analogy;
  const key_terms = aiResult?.key_terms ?? fallback.key_terms;

  return NextResponse.json({
    concept,
    level: activeLevel,
    explanation,
    analogy,
    key_terms,
    simulation: detectSimulation(concept),
    powered_by: aiResult ? "gemini" : "local",
  });
}
