"use client"
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { apiUrl } from '../api/api'
import styles from './page.module.css'
export default function Upload() {
    const [jsonInput, setJsonInput] = useState('')
    const [prettyJson, setPrettyJson] = useState('')
    const [loading, setLoading] = useState(false)

    const handleJsonChange = e => setJsonInput(e.target.value)

    const router = useRouter()
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(!jsonInput) {
            alert('데이터가 없음')
            return
        }
        try{
            const res = await fetch(`${apiUrl}/playlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: prettyJson
            })
            if(res.ok) {
                router.push('/')
                router.refresh()
            }else{
                throw new Error(res.json().message)
            }
        }catch(e){
            console.log('err', e)
        }finally{
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
    return(
        <div className={styles.uploadContainer}>
            <h4>영상 업로드</h4>
            <textarea 
                value={jsonInput} 
                onChange={handleJsonChange} 
                placeholder="JSON 입력" 
            />
            <br />
            <button onClick={formatJson}>정렬</button>
            <br />
            <textarea 
                value={prettyJson} 
                readOnly 
            />
            <button onClick={handleSubmit}>{
                loading ? '등록 중...' : '등록'
            }</button>
        </div>
    )
}