"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"
import { uploadPlaylistAction } from "./actions"

export default function Upload() {
  const [jsonInput, setJsonInput] = useState("")
  const [prettyJson, setPrettyJson] = useState("")
  const [loading, setLoading] = useState(false)
  const [sameDateError, setSameDateError] = useState("")
  const [copied, setCopied] = useState(false)
  const errorTimerRef = useRef(null)

  const router = useRouter()

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const getToday = (f) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const pad = (num) => (num < 10 ? `0${num}` : num)
    const formattedYear = f === 1 ? year : year.toString().slice(-2)
    return f === 1
      ? `${formattedYear}. ${month}. ${day}.`
      : `${formattedYear}-${pad(month)}-${pad(day)}`
  }

  const defaultJson = `{
        "date": "${getToday(0)}",
        "video":[

        ]
    }`

  const codeString = `
      const q = d => {
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
        console.log("플레이리스트 개수 : ",results.length)
        let resultString = JSON.stringify(results)
        resultString=resultString.slice(1,resultString.length-1)

        let textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.left = '0';
        textArea.style.top = '0';
        textArea.style.opacity = '0';
        textArea.value = resultString;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'Successful copy' : 'Copy failed';
            console.log(msg);
        } catch (err) {
            console.error('Error copying text: ', err);
        }
        document.body.removeChild(textArea);
    };

    q('${getToday(1)}');
      `

  const handleJsonChange = (e) => setJsonInput(e.target.value)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
    } catch (error) {
      console.error("Failed to copy URL to clipboard", error)
    }
  }

  const handleSameDateError = (message) => {
    setSameDateError(message)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    errorTimerRef.current = setTimeout(() => setSameDateError(""), 2000)
  }

  const formatJson = () => {
    try {
      const obj = JSON.parse(jsonInput)
      setPrettyJson(JSON.stringify(obj, null, 1))
    } catch (error) {
      setPrettyJson("Invalid JSON: " + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prettyJson) {
      alert("정렬 버튼을 먼저 눌러주세요.")
      return
    }
    setLoading(true)
    try {
      const result = await uploadPlaylistAction(prettyJson)
      if (result.error) {
        handleSameDateError(result.error)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      handleSameDateError("오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <h4>영상 업로드</h4>
      <textarea onChange={handleJsonChange} defaultValue={defaultJson} />
      <br />
      <button onClick={formatJson}>정렬</button>
      <br />
      <textarea value={prettyJson} readOnly />
      {sameDateError && <p>{sameDateError}</p>}
      <button onClick={handleSubmit}>{loading ? "등록 중..." : "등록"}</button>
      <button onClick={copyToClipboard}>
        {copied ? "copied!" : "code copy"}
      </button>
    </div>
  )
}
