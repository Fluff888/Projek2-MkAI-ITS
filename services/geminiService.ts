import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";
import type { QuizQuestion } from '../types';

const API_KEY = process.env.API_KEY;

// Do not throw immediately at top-level to avoid White Screen of Death if key is missing.
// Instead, we check availability inside the functions.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const model = 'gemini-2.5-flash';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateContentWithRetry(
  params: any,
  retries = 3,
  initialDelay = 1000
): Promise<GenerateContentResponse> {
  if (!ai) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error) {
      const errorMessage = (error as Error).message || '';
      const isRetriable = errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE') || errorMessage.includes('overloaded');
      
      if (isRetriable && i < retries - 1) {
        console.warn(`Panggilan API gagal dengan kesalahan yang dapat dicoba lagi. Mencoba lagi dalam ${delay}ms... (Percobaan ${i + 1}/${retries})`);
        await sleep(delay);
        delay *= 2; // Exponential backoff
      } else {
        console.error(`Panggilan API gagal setelah ${i + 1} percobaan atau dengan kesalahan yang tidak dapat dicoba lagi.`);
        throw error; // Lemparkan kembali kesalahan setelah semua percobaan ulang habis atau jika tidak dapat dicoba lagi
      }
    }
  }
  throw new Error("Panggilan API gagal setelah semua percobaan ulang.");
}


export function createTutorChatSession(): Chat {
  if (!ai) {
    throw new Error("API Key is missing. Cannot start chat session.");
  }
  const systemInstruction = `Anda adalah seorang tutor kimia ahli yang berspesialisasi dalam tabel periodik. 
Nama Anda adalah Profesor Elemento. Tujuan Anda adalah mengajar pengguna dengan cara yang menarik, interaktif, dan memberi semangat. 
Setelah menjelaskan sebuah konsep atau elemen, ajukan pertanyaan tindak lanjut yang sederhana untuk memeriksa pemahaman. 
Jaga agar tanggapan Anda ringkas dan mudah dipahami untuk siswa sekolah menengah. 
Gunakan markdown untuk pemformatan jika sesuai, seperti menebalkan istilah-istilah kunci atau menggunakan daftar untuk properti. 
Jangan menyapa pengguna di pesan pertama Anda. Aplikasi akan memberikan sapaan statis.`;

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction,
    },
  });
  return chat;
}

export async function generateQuiz(topic: string, numQuestions: number): Promise<QuizQuestion[]> {
    if (!ai) {
        console.warn("API Key missing, returning fallback quiz.");
        return getFallbackQuiz();
    }

    const prompt = `Buat kuis pilihan ganda dengan ${numQuestions} pertanyaan tentang dasar-dasar tabel periodik, yang cocok untuk siswa sekolah menengah. Untuk setiap pertanyaan, berikan 4 pilihan dan identifikasi jawaban yang benar. Topiknya adalah ${topic}.`;

    try {
        const response = await generateContentWithRetry({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                            },
                            correctAnswer: { type: Type.STRING },
                        },
                        required: ["question", "options", "correctAnswer"],
                    },
                },
            },
        });
        
        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");

        const quizData = JSON.parse(jsonText);

        if (Array.isArray(quizData) && quizData.length > 0) {
             return quizData.map(q => ({
                ...q,
                // Ensure options are shuffled for variety in pre and post tests
                options: q.options.sort(() => Math.random() - 0.5)
            }));
        }
        throw new Error("Invalid quiz data format received from API.");

    } catch (error) {
        console.error("Failed to generate quiz:", error);
        return getFallbackQuiz();
    }
}

function getFallbackQuiz(): QuizQuestion[] {
     return [
        { question: "Apa simbol untuk Emas?", options: ["Au", "Ag", "G", "Go"], correctAnswer: "Au" },
        { question: "Elemen manakah yang merupakan gas mulia?", options: ["Neon", "Oksigen", "Nitrogen", "Karbon"], correctAnswer: "Neon" },
        { question: "Berapa nomor atom Karbon?", options: ["6", "12", "14", "8"], correctAnswer: "6" },
        { question: "Manakah di antara ini yang merupakan logam alkali?", options: ["Natrium", "Kalsium", "Besi", "Tembaga"], correctAnswer: "Natrium" },
        { question: "Apa yang diwakili oleh nomor golongan dalam tabel periodik?", options: ["Jumlah elektron valensi", "Jumlah kulit elektron", "Jumlah proton", "Massa atom"], correctAnswer: "Jumlah elektron valensi" },
    ];
}


export async function analyzeTestResults(incorrectAnswers: { question: string; userAnswer: string; correctAnswer: string }[]): Promise<string> {
    if (!ai) {
        return "Maaf, saya tidak dapat memberikan analisis terperinci karena kunci API belum dikonfigurasi. Namun, tinjauan manual atas jawaban Anda disarankan.";
    }

    if (incorrectAnswers.length === 0) {
        return "Kerja bagus! Tidak ada jawaban Anda yang salah. Silakan jelajahi tabel periodik atau ambil pasca-tes jika Anda sudah siap.";
    }

    const prompt = `Seorang siswa mengikuti pra-tes tentang tabel periodik dan salah menjawab pertanyaan-pertanyaan berikut:
    ${incorrectAnswers.map(ans => ` - Pertanyaan: "${ans.question}" (Jawaban mereka: "${ans.userAnswer}", Jawaban benar: "${ans.correctAnswer}")`).join('\n')}
    
    Berdasarkan kesalahan-kesalahan ini, harap identifikasi area kelemahan siswa dan buat rencana belajar yang ringkas, memberi semangat, dan dipersonalisasi. 
    Sarankan 3 topik atau elemen spesifik yang harus mereka fokuskan untuk dipelajari. 
    Format tanggapan Anda menggunakan markdown. Mulailah dengan kalimat yang positif dan memberi semangat.`;

    try {
        const response = await generateContentWithRetry({
            model: model,
            contents: prompt,
        });
        return response.text || "Tidak ada analisis yang tersedia.";
    } catch (error) {
        console.error("Failed to analyze test results:", error);
        return "Saya kesulitan menganalisis hasil Anda, tetapi kerja bagus telah menyelesaikan tes! Saya merekomendasikan untuk mempelajari **kategori elemen** dan sifat-sifat **logam alkali**.";
    }
}
