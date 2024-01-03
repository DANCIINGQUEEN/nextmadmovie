"use client"
import React, { createContext, useState, useContext, useEffect } from "react";
import { usePageNumber } from "./PageNumberContext";

const SearchTermContext = createContext({});
export const useSearchTerm=()=>useContext(SearchTermContext)

export const SearchTermProvider=({children})=>{
    const {setCurrentFilteredPage} = usePageNumber();
    //검색어 유지
    const [searchTerm, setSearchTerm] = useState(() => {
        try{
            // localStorage에서 검색어를 읽어와 초기 상태 설정
            const savedSearchTerm = localStorage.getItem('searchTerm');
            return savedSearchTerm ? savedSearchTerm : "";
        }catch(error){
            // localStorage가 사용 불가능할 경우 무시하고 기본값 반환
            return "";
        }
    });
    useEffect(() => {
        // currentPage가 변경될 때마다 localStorage에 저장
        localStorage.setItem('searchTerm', searchTerm);
        if(searchTerm===""){
            setCurrentFilteredPage(1);
        }
    }, [searchTerm]);

    return(
        <SearchTermContext.Provider 
        value={{
            searchTerm,
            setSearchTerm
            }}>
            {children}
        </SearchTermContext.Provider>
    )
}