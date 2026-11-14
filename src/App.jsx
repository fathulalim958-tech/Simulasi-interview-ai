import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import FormInput from './components/FormInput';
import InterviewSession from './components/InterviewSession';
import ResultPage from './components/ResultPage';
import { getNextQuestion, evaluateEarlyInterview, stripLeadingNumbering } from './lib/ai';
import { saveInterviewSession } from './lib/storage';
import './App.css';

/**
 * Deteksi apakah input pengalaman kerja kandidat menandakan tidak ada pengalaman kerja
 * (misal: "tidak ada", "belum ada", "fresh graduate", "0", dll).
 */
const isZeroExperience = (exp) => {
  if (!exp) return true;
  const normalized = String(exp).trim().toLowerCase();
  return (
    normalized === 'tidak ada' ||
    normalized === 'belum ada' ||
    normalized === 'tidak' ||
    normalized === 'none' ||
    normalized === '0' ||
    normalized === '0 tahun' ||
    normalized === '0th' ||
    normalized.includes('fresh graduate') ||
    normalized.includes('freshgraduate') ||
    normalized.includes('fresh-grad') ||
    normalized.includes('belum memiliki') ||
    normalized.includes('belum pernah') ||
    normalized.includes('lulusan baru')
  );
};

function App() {
  const [page, setPage] = useState('dashboard'); // Alur awal: Dashboard
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('devinterview_theme') || 'dark';
  });
  const [userData, setUserData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [finalResult, setFinalResult] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const [isClosingSession, setIsClosingSession] = useState(false);
  const [pendingFinalResult, setPendingFinalResult] = useState(null);

  // Efek sinkronisasi tema Light / Dark di level HTML & Body
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('devinterview_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fungsi transisi akhir setelah kalimat penutup Elon selesai dibacakan
  const handleCompleteInterview = React.useCallback((resultToSave = null) => {
    const result = resultToSave || pendingFinalResult;
    if (!result) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsClosingSession(false);

    saveInterviewSession({
      userData,
      finalResult: result,
      durationSeconds: Math.max(180, chatHistory.length * 45)
    });
    setFinalResult(result);
    setPage('result');
  }, [pendingFinalResult, userData, chatHistory]);

  const fetchAIResponse = async (userAnswer = null, isInitial = false) => {
    setIsLoadingAI(true);
    setNetworkError(null);
    if (userAnswer) setPendingAnswer(userAnswer);

    const historyToPass = [...chatHistory];
    if (userAnswer) {
      historyToPass.push({ sender: 'user', message: userAnswer });
    }

    const response = await getNextQuestion(userData.position, userData.experience, historyToPass);

    if (response.error) {
      // Hentikan suara AI jika sedang aktif
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      // PENTING: Jangan ubah currentQuestion menjadi string error agar AI tidak looping bicara!
      setNetworkError({
        title: "Gangguan Koneksi Jaringan",
        message: response.error.includes("Failed to fetch") || response.error.includes("NetworkError") || response.error.includes("Gagal")
          ? "Gagal terhubung ke server AI. Mohon periksa koneksi internet Anda dan coba lagi."
          : response.error,
        canRetry: true
      });
    } else if (response.finalResult) {
      // HRD Elon Musk membacakan ucapan penutup realistis sebelum beralih ke halaman hasil
      const candidateName = userData?.name || 'Kandidat';
      const closings = [
        `Baik, terima kasih banyak atas waktu dan jawaban yang Anda berikan, ${candidateName}. Pertanyaan dari saya sudah cukup untuk menilai kompetensi teknis dan pemecahan masalah Anda. Sekarang saya sedang menyusun lembar evaluasi akhir Anda. Mari kita lihat hasilnya bersama.`,
        `Terima kasih ${candidateName}. Pemaparan Anda hari ini sangat lugas dan terstruktur. Semua aspek yang saya butuhkan sudah tercatat dengan lengkap. Saya akan mengompilasi hasil penilaian wawancara Anda sekarang. Mari kita tinjau evaluasinya.`,
        `Bagus sekali, ${candidateName}. Diskusi kita hari ini memberi saya gambaran yang sangat jelas mengenai keahlian dan cara berpikir Anda. Sesi wawancara telah selesai, dan laporan evaluasi performa Anda siap ditampilkan sekarang.`
      ];
      const chosenClosing = closings[Math.floor(Math.random() * closings.length)];

      setPendingFinalResult(response.finalResult);
      setIsClosingSession(true);
      setCurrentQuestion(chosenClosing);
      setChatHistory(prev => isInitial ?
        [{ sender: 'assistant', message: chosenClosing }] :
        [...prev, { sender: 'user', message: userAnswer }, { sender: 'assistant', message: chosenClosing }]
      );
    } else if (response.question) {
      // Pastikan pertanyaan bersih dari angka nomor urut (seperti "1. ", "Pertanyaan 2:")
      const cleanQuestion = stripLeadingNumbering(response.question);
      setCurrentQuestion(cleanQuestion);
      setChatHistory(prev => isInitial ? 
        [{ sender: 'assistant', message: cleanQuestion }] : 
        [...prev, { sender: 'user', message: userAnswer }, { sender: 'assistant', message: cleanQuestion }]
      );
    }
    setIsLoadingAI(false);
  };

  const handleRetryLastAnswer = () => {
    setNetworkError(null);
    if (pendingAnswer) {
      fetchAIResponse(pendingAnswer);
    }
  };

  const handleDismissNetworkError = () => {
    setNetworkError(null);
  };

  const handleStartInterview = (data) => {
    setIsSpeaking(false);
    setUserData(data);
    setPage('interview');
    setNetworkError(null);
    setPendingAnswer(null);

    const noExperience = isZeroExperience(data.experience);

    // Salam pembuka disesuaikan secara cerdas:
    // Jika TIDAK ADA pengalaman kerja / fresh graduate -> JANGAN tanya pengalaman kerja, fokus ke motivasi, pendidikan & proyek
    const freshGradGreetings = [
      `Halo ${data.name}, selamat datang. Saya Elon Musk. Mari kita mulai wawancara untuk posisi ${data.position}. Sebagai fresh graduate, ceritakan motivasi Anda dan proyek paling menantang yang pernah Anda kembangkan.`,
      `Selamat datang ${data.name}. Saya Elon Musk. Senang bertemu dengan Anda untuk posisi ${data.position}. Silakan perkenalkan diri Anda, latar belakang pendidikan, serta keahlian teknis utama yang Anda miliki.`,
      `Halo ${data.name}, terima kasih telah hadir untuk posisi ${data.position}. Silakan mulai dengan menceritakan bidang keahlian yang paling Anda minati serta alasan Anda tertarik berkarier di bidang ini.`
    ];

    // Jika MEMILIKI pengalaman kerja nyata -> Tanyakan masalah teknis & kontribusi nyata
    const experiencedGreetings = [
      `Halo ${data.name}, selamat datang. Saya Elon Musk. Mari kita bahas posisi ${data.position}. Ceritakan masalah teknis paling sulit yang pernah Anda hadapi dan bagaimana Anda memecahkannya.`,
      `Selamat datang ${data.name}. Saya senang bertemu dengan Anda hari ini untuk posisi ${data.position}. Bisakah Anda memperkenalkan latar belakang profesional dan keahlian utama Anda?`,
      `Halo ${data.name}, terima kasih telah meluangkan waktu untuk posisi ${data.position}. Silakan mulai dengan menceritakan pengalaman kerja Anda yang paling berdampak.`
    ];

    const greetingsPool = noExperience ? freshGradGreetings : experiencedGreetings;
    const greeting = greetingsPool[Math.floor(Math.random() * greetingsPool.length)];
    
    setCurrentQuestion(greeting);
    setChatHistory([{ sender: 'assistant', message: greeting }]);
  };

  const handleSendAnswer = (answer) => {
    fetchAIResponse(answer);
  };

  const handleRestartInterview = () => {
    setPage('form');
    setUserData(null);
    setChatHistory([]);
    setCurrentQuestion('');
    setFinalResult(null);
    setNetworkError(null);
    setPendingAnswer(null);
    setIsClosingSession(false);
    setPendingFinalResult(null);
  };

  const handleBackToDashboard = () => {
    setPage('dashboard');
    setUserData(null);
    setChatHistory([]);
    setCurrentQuestion('');
    setFinalResult(null);
    setNetworkError(null);
    setPendingAnswer(null);
    setIsClosingSession(false);
    setPendingFinalResult(null);
  };

  const handleEndInterviewEarly = async () => {
    // 1. Hentikan suara AI segera
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setNetworkError(null);

    // 2. Cek apakah ada jawaban dari kandidat
    const userMessages = chatHistory.filter(msg => msg.sender === 'user');

    // KASUS 1: Baru mulai / belum ada jawaban sama sekali dari kandidat -> Skor 0
    if (userMessages.length === 0) {
      const zeroResult = {
        score: 0,
        strengths: [
          "Kandidat telah berhasil mendaftar dan memulai simulasi wawancara."
        ],
        weaknesses: [
          "Wawancara diakhiri sebelum kandidat memberikan jawaban sama sekali.",
          "Tidak ada data kompetensi, pemecahan masalah, atau komunikasi yang dapat dinilai."
        ],
        recommendations: [
          "Ikuti sesi wawancara hingga selesai dan jawab setiap pertanyaan yang diajukan oleh HRD.",
          "Gunakan fitur rekaman suara atau ketik teks untuk menyampaikan pengalaman atau proyek Anda secara detail.",
          "Pelajari tips wawancara di dashboard untuk mempersiapkan diri menghadapi simulasi berikutnya."
        ]
      };

      saveInterviewSession({
        userData,
        finalResult: zeroResult,
        durationSeconds: 15
      });

      setFinalResult(zeroResult);
      setPage('result');
      return;
    }

    // KASUS 2: Diakhiri di tengah jalan dengan sebagian jawaban -> Evaluasi apa adanya
    setIsLoadingAI(true);
    const evaluation = await evaluateEarlyInterview(userData?.position || '', userData?.experience || '', chatHistory);
    setIsLoadingAI(false);

    if (evaluation.finalResult) {
      saveInterviewSession({
        userData,
        finalResult: evaluation.finalResult,
        durationSeconds: Math.max(30, chatHistory.length * 30)
      });
      setFinalResult(evaluation.finalResult);
      setPage('result');
    }
  };

  // Membuka detail hasil evaluasi sesi lama dari riwayat
  const handleViewHistoricalResult = (record) => {
    setUserData(record.userData || { name: record.candidateName, position: record.position });
    setFinalResult(record.finalResult);
    setPage('result');
  };

  return (
    <div className="App">
      {/* 1. Dashboard Utama */}
      {page === 'dashboard' && (
        <Dashboard 
          onStartInterview={() => setPage('form')}
          onViewResult={handleViewHistoricalResult}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* 2. Form Input Data Kandidat */}
      {page === 'form' && (
        <FormInput 
          onStart={handleStartInterview} 
          onBack={handleBackToDashboard}
        />
      )}

      {/* 3. Simulasi Wawancara Video Call Interaktif */}
      {page === 'interview' && (
        <InterviewSession
          currentQuestion={currentQuestion}
          onSendAnswer={handleSendAnswer}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          isLoadingAI={isLoadingAI}
          onEndInterview={handleEndInterviewEarly}
          userName={userData?.name}
          chatHistory={chatHistory}
          userData={userData}
          networkError={networkError}
          onRetryNetworkError={handleRetryLastAnswer}
          onDismissNetworkError={handleDismissNetworkError}
          isClosingSession={isClosingSession}
          onFinishClosing={handleCompleteInterview}
        />
      )}

      {/* 4. Halaman Hasil Evaluasi */}
      {page === 'result' && (
        <ResultPage 
          finalResult={finalResult} 
          onRestart={handleRestartInterview} 
          onBackToDashboard={handleBackToDashboard}
          userData={userData}
        />
      )}
    </div>
  );
}

export default App;
