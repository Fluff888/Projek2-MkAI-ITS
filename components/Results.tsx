import React from 'react';

interface ResultsProps {
  preTestScore: number;
  postTestScore: number;
  totalQuestions: number;
  onRetake: () => void;
}

const ScoreDisplay: React.FC<{ label: string; score: number; total: number }> = ({ label, score, total }) => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  return (
    <div className="bg-gray-700 p-6 rounded-xl text-center shadow-lg">
      <p className="text-lg font-semibold text-gray-300">{label}</p>
      <p className="text-5xl font-bold text-cyan-400 my-2">{score}<span className="text-2xl text-gray-400">/{total}</span></p>
      <div className="w-full bg-gray-600 rounded-full h-4">
        <div className="bg-cyan-500 h-4 rounded-full" style={{ width: `${percentage}%`, transition: 'width 1s ease-out' }}></div>
      </div>
      <p className="mt-2 text-xl font-medium text-white">{percentage.toFixed(0)}%</p>
    </div>
  );
};

const Results: React.FC<ResultsProps> = ({ preTestScore, postTestScore, totalQuestions, onRetake }) => {
  const improvement = postTestScore - preTestScore;

  const getFeedbackMessage = () => {
    if (improvement > 2) {
      return "Peningkatan Fantastis! Kerja keras Anda benar-benar terbayar. Pertahankan momentum hebat ini!";
    }
    if (improvement > 0) {
      return "Kemajuan Hebat! Anda telah menunjukkan peningkatan yang solid. Sedikit belajar lagi dan Anda akan menjadi ahli!";
    }
    if (postTestScore > preTestScore) {
       return "Kerja bagus! Setiap langkah maju adalah kemenangan. Teruslah belajar!";
    }
    if (postTestScore === totalQuestions) {
       return "Skor Sempurna! Anda adalah superstar kimia. Pekerjaan yang luar biasa!";
    }
    return "Usaha yang bagus! Meninjau materi lagi dapat membuat perbedaan besar. Jangan menyerah!";
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl text-center transform transition-all duration-300 ease-out scale-95 animate-scale-in">
        <h1 className="text-4xl font-bold text-white">Penilaian Selesai!</h1>
        <p className="text-xl text-cyan-300">{getFeedbackMessage()}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <ScoreDisplay label="Skor Pra-Tes" score={preTestScore} total={totalQuestions} />
            <ScoreDisplay label="Skor Pasca-Tes" score={postTestScore} total={totalQuestions} />
        </div>

        {improvement > 0 && (
            <div className="mt-6">
                <p className="text-2xl font-bold text-green-400">
                    +{improvement} Jawaban Benar
                </p>
                <p className="text-gray-400">Peningkatan</p>
            </div>
        )}

        <div className="pt-6">
          <button
            onClick={onRetake}
            className="px-10 py-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors shadow-lg"
          >
            Mulai Sesi Baru
          </button>
        </div>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Results;