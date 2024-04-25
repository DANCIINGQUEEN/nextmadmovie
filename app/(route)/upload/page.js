"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "../../api/api"
import styles from "./page.module.css"

export default function Upload() {
  const [jsonInput, setJsonInput] = useState("")
  const [prettyJson, setPrettyJson] = useState("")
  const [loading, setLoading] = useState(false)
  const [sameDateError, setSameDateError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleJsonChange = (e) => setJsonInput(e.target.value)

  const router = useRouter()

  //오늘 한국 날짜 반환 함수
  const getToday = (f) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()

    // 두 자리 수 형식으로 일자와 월을 변환하는 내부 함수
    const formatNumber = (num) => (num < 10 ? `0${num}` : num)

    // 연도 포맷 결정
    const formattedYear = f === 1 ? year : year.toString().slice(-2)

    // 날짜 포맷 결정
    return f === 1
      ? `${formattedYear}. ${month}. ${day}.`
      : `${formattedYear}-${formatNumber(month)}-${formatNumber(day)}`
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
    } catch (error) {
      console.error("Failed to copy URL to clipboard", error)
    }
  }
  const handleSameDateError = (message) => {
    console.error(message)
    setSameDateError(message)
    setTimeout(() => setSameDateError(""), 2000)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!jsonInput) {
      alert("데이터가 없음")
      return
    }
    try {
      const res = await fetch(`${apiUrl}/playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: prettyJson,
      })
      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        throw new Error(await res.json())
      }
    } catch (e) {
      // console.log('err', e)
      handleSameDateError("같은 날짜 존재")
    } finally {
      setLoading(false)
    }
  }

  const formatJson = () => {
    try {
      // 입력된 JSON을 파싱하고 다시 정렬하여 문자열로 변환
      const obj = JSON.parse(jsonInput)
      const formattedJson = JSON.stringify(obj, null, 1) // 4는 들여쓰기 수준
      setPrettyJson(formattedJson)
    } catch (error) {
      // JSON 파싱 오류 처리
      setPrettyJson("Invalid JSON: " + error.message)
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
