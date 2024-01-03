"use client"
import React, { createContext, useState, useContext, useEffect } from "react";

const PageNumberContext = createContext({});
export const usePageNumber=()=>useContext(PageNumberContext)

export const PageNumberProvider=({children})=>{
    const [currentPage, setCurrentPage] = useState(() => {
        try {
            // localStorage에서 페이지 번호를 읽어와 초기 상태 설정
            const savedPageNumber = localStorage.getItem('currentPage');
            return savedPageNumber ? parseInt(savedPageNumber, 10) : 1;
        } catch (error) {
            // localStorage가 사용 불가능할 경우 무시하고 기본값 반환
            return 1;
        }
    });
    useEffect(() => {
        // currentPage가 변경될 때마다 sessionStorage에 저장
        sessionStorage.setItem('currentPage', currentPage);
        
    }, [currentPage]);

    //필터링된 플레이리스트 페이지네이션
    const [currentFilteredPage, setCurrentFilteredPage] = useState(() => {
        try{
            // sessionStorage에서 페이지 번호를 읽어와 초기 상태 설정
            const savedPageNumber = sessionStorage.getItem('currentFilteredPage');
            return savedPageNumber ? parseInt(savedPageNumber, 10) : 1;
        }catch(error){
            // sessionStorage가 사용 불가능할 경우 무시하고 기본값 반환
            return 1;
        }
    });
    useEffect(() => {
        // currentPage가 변경될 때마다 sessionStorage에 저장
        sessionStorage.setItem('currentFilteredPage', currentFilteredPage);
    }, [currentFilteredPage]);

    
    return(
        <PageNumberContext.Provider 
        value={{
            currentPage, 
            setCurrentPage, 
            currentFilteredPage, 
            setCurrentFilteredPage,
            }}>
            {children}
        </PageNumberContext.Provider>
    )
}