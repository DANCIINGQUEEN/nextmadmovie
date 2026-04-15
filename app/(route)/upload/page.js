"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadPlaylistAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Copy, Check, Upload } from "lucide-react";

export default function UploadPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [prettyJson, setPrettyJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const errorTimerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); };
  }, []);

  const getToday = (f) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const pad = (n) => (n < 10 ? `0${n}` : n);
    return f === 1
      ? `${year}. ${month}. ${day}.`
      : `${year.toString().slice(-2)}-${pad(month)}-${pad(day)}`;
  };

  const defaultJson = `{\n  "date": "${getToday(0)}",\n  "video":[\n\n  ]\n}`;

  const codeString = `const q = d => {
  let results = [];
  let videoRows = document.querySelectorAll('ytcp-video-row');
  videoRows.forEach(row => {
    let date = row.querySelector('.tablecell-date').innerText.trim().split('\\n')[0];
    if (date === d) {
      let titleElement = row.querySelector('#video-title');
      let title = titleElement ? titleElement.innerText.trim() : "No title";
      let link = titleElement ? titleElement.href.split('/')[4] : "No link";
      link = \`https://www.youtube.com/watch?v=\${link}\`;
      results.push({ title, link });
    }
  });
  console.log("플레이리스트 개수 : ", results.length);
  let resultString = JSON.stringify(results);
  resultString = resultString.slice(1, resultString.length - 1);
  navigator.clipboard.writeText(resultString).then(() => console.log('Copied!'));
};
q('${getToday(1)}');`;

  const handleError = (msg) => {
    setError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setError(""), 2000);
  };

  const formatJson = () => {
    try {
      setPrettyJson(JSON.stringify(JSON.parse(jsonInput), null, 1));
    } catch (e) {
      setPrettyJson("Invalid JSON: " + e.message);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prettyJson) { alert("정렬 버튼을 먼저 눌러주세요."); return; }
    setLoading(true);
    try {
      const result = await uploadPlaylistAction(prettyJson);
      if (result.error) handleError(result.error);
      else { router.push("/"); router.refresh(); }
    } catch {
      handleError("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold text-[var(--color-gold)]">영상 업로드</h1>

      <div className="flex flex-col gap-4">
        {/* Input */}
        <div>
          <label className="mb-1.5 block text-xs text-[var(--color-text-muted)]">JSON 입력</label>
          <textarea
            onChange={(e) => setJsonInput(e.target.value)}
            defaultValue={defaultJson}
            rows={8}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 font-mono text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] resize-y"
          />
        </div>

        <Button variant="secondary" onClick={formatJson} className="self-start">
          정렬
        </Button>

        {/* Formatted output */}
        {prettyJson && (
          <div>
            <label className="mb-1.5 block text-xs text-[var(--color-text-muted)]">정렬된 JSON</label>
            <textarea
              value={prettyJson}
              readOnly
              rows={8}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 font-mono text-sm text-[var(--color-text-muted)] outline-none resize-y"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-[var(--color-penta)]">{error}</p>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading} className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            {loading ? "등록 중..." : "등록"}
          </Button>
          <Button variant="outline" onClick={copyCode} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-teal)]" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "코드 복사"}
          </Button>
        </div>
      </div>
    </div>
  );
}
