import React, { useState } from 'react';
import { Code2, Play, AlertTriangle, CheckCircle, Shield, Sparkles } from 'lucide-react';

function App() {
  const [code, setCode] = useState(`def remove_even_numbers(numbers):
    for num in numbers:
        if num % 2 == 0:
            numbers.remove(num)
    return numbers`);
  const [language, setLanguage] = useState('python');
  const [fileName, setFileName] = useState('script.py');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleReview = async () => {
    setLoading(true);
    try {
      // Connecting directly to our running FastAPI backend endpoint
      const response = await fetch(`http://127.0.0.1:8000/api/v1/review?file_name=${encodeURIComponent(fileName)}&language=${encodeURIComponent(language)}&code_content=${encodeURIComponent(code)}`, {
        method: 'POST',
      });
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to the backend server. Make sure your FastAPI app is running on port 8000!");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-red-900/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Code2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              AI Code Reviewer <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">Senior Dev Edition</span>
            </h1>
            <p className="text-xs text-slate-400">Automated static analysis powered by advanced LLM core</p>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto">

        {/* Left Side: Code Input Workspace */}
        <div className="flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500 w-40"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <button
              onClick={handleReview}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </span>
              ) : (
                <>
                  <Play size={16} fill="currentColor" /> Run Review
                </>
              )}
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 min-h-[500px] bg-slate-950 p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none leading-relaxed"
            placeholder="Paste your source code here..."
          />
        </div>

        {/* Right Side: Professional Review Report Card */}
        <div className="flex flex-col gap-4">
          {!report && !loading ? (
            <div className="flex-1 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500 min-h-[500px]">
              <Sparkles size={40} className="text-slate-700 mb-3 animate-pulse" />
              <p className="font-medium text-slate-400">Your Senior Developer Review Awaits</p>
              <p className="text-xs text-slate-600 max-w-xs mt-1">Paste your code files on the left workspace and trigger 'Run Review' to generate structural telemetry.</p>
            </div>
          ) : loading ? (
            <div className="flex-1 border border-slate-800 bg-slate-900/30 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[500px]">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-slate-300">Evaluating codebase structure...</p>
              <p className="text-xs text-slate-500 mt-1">Scanning for edge cases, performance bottlenecks, and security hazards.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {/* Score Dashboard Header */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Code Quality Telemetry</h3>
                  <p className="text-xs text-slate-500 mt-1">{report.summary}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-3xl font-black w-16 h-16 rounded-full border-4 flex items-center justify-center ${report.score >= 80 ? 'border-green-500 text-green-400' : report.score >= 50 ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400'}`}>
                    {report.score}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Score</span>
                </div>
              </div>

              {/* Issues Flow Container */}
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-1">
                {report.issues?.length === 0 ? (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-xl flex items-center gap-3 text-emerald-400">
                    <CheckCircle size={20} />
                    <p className="text-sm font-medium">Excellent work! No systemic quality issues or safety hazards were detected.</p>
                  </div>
                ) : (
                  report.issues?.map((issue, idx) => (
                    <div key={idx} className={`border p-4 rounded-xl flex flex-col gap-2 transition-all ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
                        <div className="flex items-center gap-2">
                          {issue.category?.toLowerCase() === 'security' ? <Shield size={16} /> : <AlertTriangle size={16} />}
                          <span className="text-xs font-bold uppercase tracking-wide">{issue.category}</span>
                        </div>
                        <span className="text-xs font-mono bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800">
                          Line {issue.line_number}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 font-medium leading-relaxed">{issue.issue_description}</p>
                      <div className="mt-1 bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre">
                        <span className="text-slate-500 text-[10px] block mb-1 uppercase font-bold tracking-wider">Suggested Fix / Optimized Architecture:</span>
                        {issue.suggested_fix}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;